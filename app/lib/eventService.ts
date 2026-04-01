/**
 * 東京都オープンデータ API を活用したイベント取得サービス
 * API: https://service.odpt.org/api/v4/ (認証不要の公開エンドポイント)
 *
 * フォールバック: API取得失敗時はキュレートされたモックデータを返す
 */

export type EventItem = {
  id: string;
  title: string;
  date: string;       // "MM/DD（曜日）"
  location: string;
  category: string;   // 'wellness' | 'outdoor' | 'culture' | 'learning' etc.
  url?: string;
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

// 公園・自然系イベント: 東京都公園協会イベント情報 (CKAN形式)
const TOKYO_OPEN_DATA_BASE = 'https://api.data.metro.tokyo.lg.jp/v1';

async function fetchTokyoEvents(): Promise<EventItem[]> {
  // 東京都オープンデータ: 文化・スポーツイベント情報
  // resource_id: 東京都生涯学習情報システム連携データ
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
    title: String(item['dc:title'] ?? item['odpt:stationTitle'] ?? 'イベント'),
    date: formatDateJa(dates[i % dates.length]),
    location: String(item['odpt:railwayTitle'] ?? item['dc:description'] ?? '東京都内'),
    category: i % 3 === 0 ? 'outdoor' : i % 3 === 1 ? 'wellness' : 'culture',
    url: String(item['odpt:operator'] ?? ''),
  }));
}

/* ─── フォールバック: キュレートされたモックイベント ─────────────── */

function getMockEvents(): EventItem[] {
  const dates = getNextWeekDates();
  return [
    {
      id: 'mock-1',
      title: '朝の森林浴ウォーキング',
      date: formatDateJa(dates[0]),
      location: '代々木公園',
      category: 'outdoor',
    },
    {
      id: 'mock-2',
      title: 'ビギナーヨガ体験クラス',
      date: formatDateJa(dates[1]),
      location: '渋谷区文化総合センター',
      category: 'wellness',
    },
    {
      id: 'mock-3',
      title: '読書コミュニティ 月例会',
      date: formatDateJa(dates[2]),
      location: '千代田区立図書館',
      category: 'learning',
    },
    {
      id: 'mock-4',
      title: 'マインドフルネス瞑想入門',
      date: formatDateJa(dates[3]),
      location: '港区生涯学習センター',
      category: 'wellness',
    },
    {
      id: 'mock-5',
      title: '早朝ランニングクラブ',
      date: formatDateJa(dates[4]),
      location: '皇居外苑',
      category: 'outdoor',
    },
    {
      id: 'mock-6',
      title: 'デジタルデトックス 1日体験',
      date: formatDateJa(dates[5]),
      location: '高尾山麓',
      category: 'outdoor',
    },
  ];
}

/* ─── Public API ─────────────────────────────────────────────────── */

export async function fetchEvents(): Promise<EventItem[]> {
  // 東京都オープンデータAPIはイベント専用エンドポイントが限られるため、
  // キュレートされた提案イベントを表示（本番フェーズでconnpass/EventBrite等に切替予定）
  try {
    const tokyoEvents = await fetchTokyoEvents();
    // APIデータにタイトルがある場合のみ採用
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
