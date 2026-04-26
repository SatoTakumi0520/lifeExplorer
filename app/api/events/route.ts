/**
 * /api/events — Doorkeeper APIプロキシ + キャッシュ
 *
 * クエリパラメータ:
 *   ?prefecture=東京都  (省略時は全国)
 *
 * Doorkeeper APIからリアルタイムイベントを取得し、
 * アプリのテーマに合ったキーワードでフィルタリングする。
 */

import { NextRequest, NextResponse } from 'next/server';

/* ─── 型 ─────────────────────────────────────────────── */

type DoorkeeperEvent = {
  title: string;
  id: number;
  starts_at: string;   // ISO 8601
  ends_at: string;
  venue_name: string | null;
  address: string | null;
  description: string;
  public_url: string;
  participants: number;
  waitlisted: number;
  ticket_limit: number | null;
  lat: string | null;
  long: string | null;
};

type DoorkeeperResponse = {
  event: DoorkeeperEvent;
}[];

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
    url?: string;
  };
  url: string;
  source: 'doorkeeper';
};

/* ─── キャッシュ ──────────────────────────────────────── */

const cache = new Map<string, { events: TransformedEvent[]; fetchedAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1時間

/* ─── 検索キーワード ─────────────────────────────────── */

const SEARCH_KEYWORDS: { keyword: string; category: string }[] = [
  { keyword: 'ヨガ',         category: 'wellness' },
  { keyword: '瞑想',         category: 'wellness' },
  { keyword: '朝活',         category: 'social' },
  { keyword: '読書会',       category: 'learning' },
  { keyword: '勉強会',       category: 'learning' },
  { keyword: 'ワークショップ', category: 'learning' },
  { keyword: 'ランニング',   category: 'outdoor' },
  { keyword: '交流会',       category: 'social' },
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
  if (minutes <= 0) return '未定';
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

function padTime(h: number, m: number): string {
  return `${String(Math.max(0, Math.min(23, h))).padStart(2, '0')}:${String(Math.max(0, Math.min(59, m))).padStart(2, '0')}`;
}

function isOnlineEvent(venueName: string, address: string): boolean {
  const combined = `${venueName} ${address}`.toLowerCase();
  return combined.includes('オンライン') || combined.includes('zoom') || combined.includes('online')
    || combined.includes('discord') || combined.includes('youtube') || combined.includes('teams')
    || (!venueName && !address); // 場所未設定はオンラインとみなす
}

function extractPrefecture(address: string): string {
  if (!address) return 'オンライン';
  const match = address.match(/(北海道|東京都|大阪府|京都府|.{2,3}県)/);
  return match ? match[1] : '不明';
}

function matchesPrefecture(address: string, prefecture: string): boolean {
  if (!address) return false;
  if (address.includes(prefecture)) return true;
  const short = prefecture.replace(/[都府県]$/, '');
  if (short.length >= 2 && address.includes(short)) return true;
  return false;
}

/** HTMLタグを除去してプレーンテキスト化 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
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
  url?: string;
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
    url: event.url,
  };
}

/* ─── Doorkeeper → TransformedEvent 変換 ────────────── */

function transformDoorkeeperEvent(ev: DoorkeeperEvent, category: string): TransformedEvent {
  const venue = ev.venue_name || '';
  const address = ev.address || '';
  const online = isOnlineEvent(venue, address);
  const pref = online ? 'オンライン' : extractPrefecture(address);

  // descriptionからHTMLタグを除去して先頭200文字
  const plainDesc = stripHtml(ev.description || '').slice(0, 200) || ev.title;

  return {
    id: `doorkeeper-${ev.id}`,
    title: ev.title,
    date: formatDateJa(new Date(ev.starts_at)),
    time: formatTime(ev.starts_at),
    duration: calcDuration(ev.starts_at, ev.ends_at),
    location: venue || address || (online ? 'オンライン' : '未定'),
    prefecture: pref,
    isOnline: online,
    category,
    price: '詳細はリンク参照',
    description: plainDesc,
    routineSuggestion: buildRoutineSuggestion({
      title: ev.title,
      started_at: ev.starts_at,
      ended_at: ev.ends_at,
      category,
      url: ev.public_url,
    }),
    url: ev.public_url,
    source: 'doorkeeper',
  };
}

/* ─── Doorkeeper API呼び出し ──────────────────────────── */

async function fetchDoorkeeperEvents(prefecture: string | null): Promise<TransformedEvent[]> {
  const now = new Date();
  const since = now.toISOString();
  const until = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 2週間先まで

  const allEvents: TransformedEvent[] = [];
  const seenIds = new Set<number>();

  for (const { keyword, category } of SEARCH_KEYWORDS) {
    try {
      const params = new URLSearchParams({
        q: keyword,
        sort: 'starts_at',
        since,
        until,
      });
      // 都道府県フィルタ: Doorkeeper APIは場所でのフィルタ非対応のため、取得後にフィルタ
      const url = `https://api.doorkeeper.jp/events?${params.toString()}`;

      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) continue;

      const data: DoorkeeperResponse = await res.json();

      for (const item of data) {
        const ev = item.event;
        if (seenIds.has(ev.id)) continue;
        seenIds.add(ev.id);

        const online = isOnlineEvent(ev.venue_name || '', ev.address || '');

        // 都道府県フィルタ: オンラインか、指定都道府県に一致するもの
        if (prefecture && !online && !matchesPrefecture(ev.address || '', prefecture)) {
          continue;
        }

        allEvents.push(transformDoorkeeperEvent(ev, category));
      }

      // レートリミット対策: 300req/5min → リクエスト間に100ms待つ
      await new Promise(r => setTimeout(r, 100));
    } catch {
      // 個別のキーワードが失敗しても続行
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
    const events = await fetchDoorkeeperEvents(prefecture);

    // キャッシュ保存
    cache.set(cacheKey, { events, fetchedAt: Date.now() });

    return NextResponse.json({
      events,
      source: 'doorkeeper',
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
