/**
 * 東京都オープンデータ API を活用したイベント取得サービス
 * API: https://service.odpt.org/api/v4/ (認証不要の公開エンドポイント)
 *
 * フォールバック: API取得失敗時はキュレートされたモックデータを返す
 */

import { RoutineTask } from './types';

export type EventItem = {
  id: string;
  title: string;
  date: string;           // "MM/DD（曜日）"
  time?: string;          // "09:00" 形式
  duration?: string;      // "約1時間" など
  location: string;
  category: string;
  price?: string;         // "無料" | "¥1,000" など
  description: string;
  url?: string;
  routineSuggestion: RoutineTask;  // ルーティンに追加するタスク
};

const DOW_JA = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateJa(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW_JA[date.getDay()];
  return `${m}/${d}（${dow}）`;
}

function getNextWeekDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/* ─── 東京都オープンデータAPI ─────────────────────────────────────── */

const TOKYO_OPEN_DATA_BASE = 'https://api.data.metro.tokyo.lg.jp/v1';

async function fetchTokyoEvents(): Promise<EventItem[]> {
  const url = `${TOKYO_OPEN_DATA_BASE}/SportsFacility?limit=20&$filter=areaCode eq 130001`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('No data');

  const dates = getNextWeekDates();
  return data.slice(0, 6).map((item: Record<string, unknown>, i: number): EventItem => ({
    id: String(item['dc:identifier'] ?? `tokyo-${i}`),
    title: String(item['dc:title'] ?? 'イベント'),
    date: formatDateJa(dates[i % dates.length]),
    location: String(item['dc:description'] ?? '東京都内'),
    category: i % 3 === 0 ? 'outdoor' : i % 3 === 1 ? 'wellness' : 'culture',
    description: '',
    routineSuggestion: { time: '09:00', title: String(item['dc:title'] ?? 'イベント'), thought: '', type: 'nature' },
  }));
}

/* ─── キュレートイベント ─────────────────────────────────────────── */

function getMockEvents(): EventItem[] {
  const dates = getNextWeekDates();
  return [
    {
      id: 'mock-1',
      title: '朝の森林浴ウォーキング',
      date: formatDateJa(dates[0]),
      time: '07:00',
      duration: '約90分',
      location: '代々木公園（原宿口集合）',
      category: 'outdoor',
      price: '無料',
      description: '早朝の公園をゆっくり歩きながら自然と向き合う時間。インストラクターが植物や鳥の声について解説。初心者歓迎、動きやすい服装で参加ください。',
      routineSuggestion: {
        time: '06:30',
        endTime: '08:30',
        title: '森林浴ウォーキング（代々木公園）',
        thought: '自然の中を歩いて心をリセットする朝。',
        type: 'nature',
      },
    },
    {
      id: 'mock-2',
      title: 'ビギナーヨガ体験クラス',
      date: formatDateJa(dates[1]),
      time: '10:00',
      duration: '60分',
      location: '渋谷区文化総合センター大和田',
      category: 'wellness',
      price: '¥1,500',
      description: 'ヨガ未経験者向けの入門クラス。呼吸法と基本ポーズを丁寧に指導。ヨガマットの貸し出しあり（要予約）。終了後に参加者同士の交流タイムあり。',
      routineSuggestion: {
        time: '09:30',
        endTime: '11:30',
        title: 'ビギナーヨガ（渋谷）',
        thought: '初めてのヨガで体の使い方を学ぶ。',
        type: 'nature',
      },
    },
    {
      id: 'mock-3',
      title: '読書コミュニティ 月例会',
      date: formatDateJa(dates[2]),
      time: '19:00',
      duration: '約2時間',
      location: '千代田区立図書館 3F会議室',
      category: 'learning',
      price: '無料',
      description: '今月の課題本についてゆる〜く語り合う会。課題本を読んでいなくても参加OK。本をきっかけに様々な職業・年代の人と話せる場。月約30名参加。',
      routineSuggestion: {
        time: '18:30',
        endTime: '21:30',
        title: '読書コミュニティ参加（千代田図書館）',
        thought: '本を通じて新しい視点と人に出会う夜。',
        type: 'mind',
      },
    },
    {
      id: 'mock-4',
      title: 'マインドフルネス瞑想入門',
      date: formatDateJa(dates[3]),
      time: '08:00',
      duration: '45分',
      location: '港区生涯学習センター',
      category: 'wellness',
      price: '¥500',
      description: '忙しい日常に「立ち止まる時間」を作るための瞑想入門。スマホやPCから離れ、呼吸に集中する45分。持ち物不要、仕事前に立ち寄れるよう設定。',
      routineSuggestion: {
        time: '07:45',
        endTime: '09:00',
        title: 'マインドフルネス瞑想（港区）',
        thought: '一日の始まりに静寂を作る。',
        type: 'mind',
      },
    },
    {
      id: 'mock-5',
      title: '早朝ランニングクラブ',
      date: formatDateJa(dates[4]),
      time: '06:00',
      duration: '約60分',
      location: '皇居外苑（桜田門外集合）',
      category: 'outdoor',
      price: '無料',
      description: '皇居1周（約5km）をペースグループ別に走るクラブ。初心者から上級者まで対応。走った後は近くのカフェで軽食をとるグループも。毎週開催。',
      routineSuggestion: {
        time: '05:45',
        endTime: '07:30',
        title: '皇居ランニング',
        thought: '朝の空気の中を走って一日をスタートする。',
        type: 'nature',
      },
    },
    {
      id: 'mock-6',
      title: 'デジタルデトックス 1日体験',
      date: formatDateJa(dates[5]),
      time: '09:00',
      duration: '1日（9:00〜17:00）',
      location: '高尾山麓 自然体験施設',
      category: 'outdoor',
      price: '¥3,000',
      description: 'スマートフォンを預けて自然の中で過ごす1日プログラム。ハイキング・焚き火・読書・昼寝など。「何もしない時間」を意識的に作る体験。定員15名。',
      routineSuggestion: {
        time: '08:00',
        endTime: '18:00',
        title: 'デジタルデトックス（高尾山）',
        thought: 'スマホなしで自然の中を過ごす一日。',
        type: 'nature',
      },
    },
  ];
}

/* ─── Public API ─────────────────────────────────────────────────── */

export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const tokyoEvents = await fetchTokyoEvents();
    const valid = tokyoEvents.filter(e => e.title !== 'イベント' && e.title.length > 2);
    if (valid.length >= 3) return valid;
    throw new Error('Insufficient data');
  } catch {
    return getMockEvents();
  }
}

export const EVENT_CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  outdoor:  { label: 'アウトドア', color: 'text-green-700',  bg: 'bg-green-50'  },
  wellness: { label: 'ウェルネス', color: 'text-blue-700',   bg: 'bg-blue-50'   },
  learning: { label: '学び',       color: 'text-violet-700', bg: 'bg-violet-50' },
  culture:  { label: '文化',       color: 'text-amber-700',  bg: 'bg-amber-50'  },
  social:   { label: '交流',       color: 'text-rose-700',   bg: 'bg-rose-50'   },
};
