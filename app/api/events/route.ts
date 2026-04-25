/**
 * /api/events — Connpass APIプロキシ + キャッシュ
 *
 * クエリパラメータ:
 *   ?prefecture=東京都  (省略時は全国)
 *
 * Connpass v1 APIからリアルタイムイベントを取得し、
 * アプリのテーマに合ったキーワードでフィルタリングする。
 * API失敗時はキュレートデータにフォールバック。
 */

import { NextRequest, NextResponse } from 'next/server';

/* ─── 型 ─────────────────────────────────────────────── */

type ConnpassEvent = {
  event_id: number;
  title: string;
  catch: string;
  description: string;
  event_url: string;
  started_at: string;   // ISO 8601
  ended_at: string;
  place: string;
  address: string;
  lat: string | null;
  lon: string | null;
  limit: number | null;
  accepted: number;
  waiting: number;
  event_type: string;
};

type ConnpassResponse = {
  results_returned: number;
  results_available: number;
  results_start: number;
  events: ConnpassEvent[];
};

type TransformedEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  prefecture: string;
  isOnline: boolean;
  category: string;
  price: string;
  description: string;
  routineSuggestion: {
    time: string;
    endTime: string;
    title: string;
    thought: string;
    type: 'nature' | 'mind' | 'work';
  };
  url: string;
  source: 'connpass';
};

/* ─── キャッシュ ──────────────────────────────────────── */

const cache = new Map<string, { events: TransformedEvent[]; fetchedAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1時間

/* ─── 検索キーワード ─────────────────────────────────── */

const SEARCH_GROUPS: { keywords: string[]; category: string }[] = [
  { keywords: ['ヨガ', '瞑想', 'マインドフルネス', 'ウェルネス'], category: 'wellness' },
  { keywords: ['ランニング', 'ウォーキング', 'ハイキング', 'アウトドア'], category: 'outdoor' },
  { keywords: ['読書会', '勉強会', 'もくもく会', 'ワークショップ'], category: 'learning' },
  { keywords: ['朝活', 'コミュニティ', '交流会', 'ミートアップ'], category: 'social' },
];

/* ─── ユーティリティ ──────────────────────────────────── */

const DOW_JA = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateJa(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW_JA[date.getDay()];
  return `${m}/${d}（${dow}）`;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function calcDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

function padTime(h: number, m: number): string {
  return `${String(Math.max(0, Math.min(23, h))).padStart(2, '0')}:${String(Math.max(0, Math.min(59, m))).padStart(2, '0')}`;
}

function isOnlineEvent(place: string, address: string): boolean {
  const combined = `${place} ${address}`.toLowerCase();
  return combined.includes('オンライン') || combined.includes('zoom') || combined.includes('online')
    || combined.includes('discord') || combined.includes('youtube') || combined.includes('teams');
}

function extractPrefecture(address: string): string {
  if (!address) return '不明';
  // 都道府県を抽出
  const match = address.match(/(北海道|東京都|大阪府|京都府|.{2,3}県)/);
  return match ? match[1] : '不明';
}

function matchesPrefecture(address: string, prefecture: string): boolean {
  if (!address) return false;
  if (address.includes(prefecture)) return true;
  // 「東京」で「東京都」にマッチ
  const short = prefecture.replace(/[都府県]$/, '');
  if (short.length >= 2 && address.includes(short)) return true;
  return false;
}

/* ─── routineSuggestion 生成 ─────────────────────────── */

const thoughtMap: Record<string, string> = {
  wellness: '心と体を整える時間。',
  outdoor: '自然の中で体を動かす。',
  spiritual: '静かに内面と向き合う。',
  learning: '新しい知識と視点に出会う。',
  social: '人とのつながりを楽しむ。',
  culture: '文化に触れて感性を磨く。',
};

const typeMap: Record<string, 'nature' | 'mind' | 'work'> = {
  wellness: 'nature',
  outdoor: 'nature',
  spiritual: 'mind',
  learning: 'mind',
  social: 'mind',
  culture: 'mind',
};

function buildRoutineSuggestion(event: {
  title: string;
  started_at: string;
  ended_at: string;
  category: string;
}) {
  const start = new Date(event.started_at);
  const end = new Date(event.ended_at);

  // 15分前から準備
  const prepH = start.getHours();
  const prepM = start.getMinutes() - 15;
  const time = padTime(prepM < 0 ? prepH - 1 : prepH, prepM < 0 ? prepM + 60 : prepM);

  // 15分後に終了
  const endH = end.getHours();
  const endM = end.getMinutes() + 15;
  const endTime = padTime(endM >= 60 ? endH + 1 : endH, endM >= 60 ? endM - 60 : endM);

  const title = event.title.length > 20
    ? event.title.slice(0, 18) + '…'
    : event.title;

  return {
    time,
    endTime,
    title,
    thought: thoughtMap[event.category] ?? 'イベントに参加して新しい体験を。',
    type: typeMap[event.category] ?? ('mind' as const),
  };
}

/* ─── Connpass → TransformedEvent 変換 ───────────────── */

function transformConnpassEvent(ev: ConnpassEvent, category: string): TransformedEvent {
  const online = isOnlineEvent(ev.place || '', ev.address || '');
  const pref = online ? 'オンライン' : extractPrefecture(ev.address || '');

  return {
    id: `connpass-${ev.event_id}`,
    title: ev.title,
    date: formatDateJa(new Date(ev.started_at)),
    time: formatTime(ev.started_at),
    duration: calcDuration(ev.started_at, ev.ended_at),
    location: ev.place || ev.address || (online ? 'オンライン' : '未定'),
    prefecture: pref,
    isOnline: online,
    category,
    price: '詳細はリンク参照',
    description: (ev.catch || '').slice(0, 200) || ev.title,
    routineSuggestion: buildRoutineSuggestion({
      title: ev.title,
      started_at: ev.started_at,
      ended_at: ev.ended_at,
      category,
    }),
    url: ev.event_url,
    source: 'connpass',
  };
}

/* ─── Connpass API呼び出し ───────────────────────────── */

async function fetchConnpassEvents(prefecture: string | null): Promise<TransformedEvent[]> {
  const now = new Date();
  // 今日〜7日後の日付範囲
  const ymdList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    ymdList.push(
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    );
  }
  const ymd = ymdList.join(',');

  const allEvents: TransformedEvent[] = [];
  const seenIds = new Set<number>();

  for (const group of SEARCH_GROUPS) {
    try {
      const keyword = group.keywords.join(',');
      const url = `https://connpass.com/api/v1/event/?keyword_or=${encodeURIComponent(keyword)}&ymd=${ymd}&count=10&order=2`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'LifeExplorer/1.0' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) continue;

      const data: ConnpassResponse = await res.json();

      for (const ev of data.events) {
        if (seenIds.has(ev.event_id)) continue;
        seenIds.add(ev.event_id);

        const online = isOnlineEvent(ev.place || '', ev.address || '');

        // 都道府県フィルタ: オンラインか、指定都道府県に一致するもの
        if (prefecture && !online && !matchesPrefecture(ev.address || '', prefecture)) {
          continue;
        }

        allEvents.push(transformConnpassEvent(ev, group.category));
      }

      // レートリミット対策: リクエスト間に200ms待つ
      await new Promise(r => setTimeout(r, 200));
    } catch {
      // 個別のグループが失敗しても続行
      continue;
    }
  }

  // 開始時刻順にソート
  allEvents.sort((a, b) => a.time.localeCompare(b.time));

  return allEvents;
}

/* ─── APIハンドラ ─────────────────────────────────────── */

export async function GET(request: NextRequest) {
  const prefecture = request.nextUrl.searchParams.get('prefecture');
  const cacheKey = prefecture || 'all';

  // キャッシュチェック
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json({
      events: cached.events,
      source: 'cache',
      count: cached.events.length,
    });
  }

  try {
    const events = await fetchConnpassEvents(prefecture);

    // キャッシュ保存
    cache.set(cacheKey, { events, fetchedAt: Date.now() });

    return NextResponse.json({
      events,
      source: 'connpass',
      count: events.length,
    });
  } catch {
    // API完全失敗時は空配列を返す（フロント側でキュレートデータにフォールバック）
    return NextResponse.json({
      events: [],
      source: 'fallback',
      count: 0,
    });
  }
}
