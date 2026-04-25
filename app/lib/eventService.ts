/**
 * イベントサービス
 *
 * - Connpass APIからリアルタイムイベントを取得（/api/events経由）
 * - キュレート済みイベントをフォールバックとして保持
 * - ユーザーの都道府県に応じてフィルタリング・優先表示
 */

import { RoutineTask } from './types';

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration?: string;
  location: string;
  prefecture: string;   // '東京都' | '大阪府' | 'オンライン' など
  isOnline: boolean;
  category: string;
  price?: string;
  description: string;
  routineSuggestion: RoutineTask;
  url?: string;
  source?: 'connpass' | 'curated';
};

const DOW_JA = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateJa(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = DOW_JA[date.getDay()];
  return `${m}/${d}（${dow}）`;
}

function getDateOffset(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/* ─── キュレート済みイベント（フォールバック用） ─────────────── */

function getCuratedEvents(): EventItem[] {
  return [
    // ── オンライン（全国共通）
    {
      id: 'curated-online-1',
      title: 'オンライン朝活 モーニングルーティン会',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '45分',
      location: 'Zoom（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'wellness',
      price: '無料',
      description: '全国から参加できる朝活コミュニティ。自分のモーニングルーティンをシェアし、仲間と一緒に朝をスタート。',
      routineSuggestion: { time: '06:45', endTime: '08:00', title: 'オンライン朝活参加', thought: '全国の仲間と朝をスタートする。', type: 'mind' },
      source: 'curated',
    },
    {
      id: 'curated-online-2',
      title: 'マインドフルネス瞑想 ライブセッション',
      date: formatDateJa(getDateOffset(1)),
      time: '22:00',
      duration: '30分',
      location: 'YouTube Live（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'wellness',
      price: '無料',
      description: '夜の就寝前に心を落ち着かせる瞑想セッション。インストラクターが誘導するガイド瞑想。',
      routineSuggestion: { time: '21:45', endTime: '22:30', title: 'オンライン瞑想セッション', thought: '一日の終わりに心を静める。', type: 'mind' },
      source: 'curated',
    },
    {
      id: 'curated-online-3',
      title: '読書感想シェア会（オンライン）',
      date: formatDateJa(getDateOffset(3)),
      time: '20:00',
      duration: '90分',
      location: 'Discord（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'learning',
      price: '無料',
      description: '今月の課題本について語り合うオンライン読書会。事前に課題本を読んでいなくても参加OK。',
      routineSuggestion: { time: '19:30', endTime: '22:00', title: 'オンライン読書会', thought: '本を通じて全国の仲間と繋がる夜。', type: 'mind' },
      source: 'curated',
    },
    // ── 東京都
    {
      id: 'curated-tokyo-1',
      title: '朝の森林浴ウォーキング',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '約90分',
      location: '代々木公園（原宿口集合）',
      prefecture: '東京都',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '早朝の公園をゆっくり歩きながら自然と向き合う時間。初心者歓迎。',
      routineSuggestion: { time: '06:30', endTime: '08:30', title: '森林浴ウォーキング（代々木公園）', thought: '自然の中を歩いて心をリセットする朝。', type: 'nature' },
      source: 'curated',
    },
    {
      id: 'curated-tokyo-2',
      title: '早朝ランニングクラブ',
      date: formatDateJa(getDateOffset(4)),
      time: '06:00',
      duration: '約60分',
      location: '皇居外苑（桜田門外集合）',
      prefecture: '東京都',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '皇居1周（約5km）をペースグループ別に走るクラブ。初心者から上級者まで対応。',
      routineSuggestion: { time: '05:45', endTime: '07:30', title: '皇居ランニング', thought: '朝の空気の中を走って一日をスタートする。', type: 'nature' },
      source: 'curated',
    },
    // ── 大阪府
    {
      id: 'curated-osaka-1',
      title: '大阪城公園 早朝ヨガ',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '60分',
      location: '大阪城公園（太陽の広場）',
      prefecture: '大阪府',
      isOnline: false,
      category: 'wellness',
      price: '無料',
      description: '大阪城を望みながら行う屋外ヨガクラス。初心者歓迎。',
      routineSuggestion: { time: '06:30', endTime: '08:30', title: '大阪城公園ヨガ', thought: '城を見ながら心と体を整える朝。', type: 'nature' },
      source: 'curated',
    },
    // ── 愛知県
    {
      id: 'curated-aichi-1',
      title: '名城公園 朝ランニング',
      date: formatDateJa(getDateOffset(1)),
      time: '06:30',
      duration: '約60分',
      location: '名城公園（北園 芝生広場集合）',
      prefecture: '愛知県',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '名古屋市内の緑あふれる公園でのランニングクラブ。初参加歓迎。',
      routineSuggestion: { time: '06:00', endTime: '08:00', title: '名城公園ランニング', thought: '緑の中を走って名古屋の朝を楽しむ。', type: 'nature' },
      source: 'curated',
    },
    // ── 福岡県
    {
      id: 'curated-fukuoka-1',
      title: '大濠公園 サンライズラン',
      date: formatDateJa(getDateOffset(0)),
      time: '06:00',
      duration: '約60分',
      location: '大濠公園（正門集合）',
      prefecture: '福岡県',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '大濠公園の池を眺めながら走る早朝ランニングクラブ。',
      routineSuggestion: { time: '05:45', endTime: '07:30', title: '大濠公園ラン', thought: '池の朝靄の中を走る爽快な朝。', type: 'nature' },
      source: 'curated',
    },
    // ── 京都府
    {
      id: 'curated-kyoto-1',
      title: '早朝の嵐山 禅ウォーキング',
      date: formatDateJa(getDateOffset(2)),
      time: '06:30',
      duration: '約2時間',
      location: '嵐山（渡月橋東詰集合）',
      prefecture: '京都府',
      isOnline: false,
      category: 'spiritual',
      price: '¥1,000',
      description: '観光客がいない早朝の嵐山を禅の視点で歩くツアー。',
      routineSuggestion: { time: '06:00', endTime: '09:00', title: '嵐山 禅ウォーキング', thought: '観光客のいない京都で内面と向き合う朝。', type: 'mind' },
      source: 'curated',
    },
    // ── 神奈川県
    {
      id: 'curated-kanagawa-1',
      title: '鎌倉 朝の坐禅体験',
      date: formatDateJa(getDateOffset(5)),
      time: '06:00',
      duration: '45分',
      location: '円覚寺（鎌倉）',
      prefecture: '神奈川県',
      isOnline: false,
      category: 'spiritual',
      price: '¥500',
      description: '鎌倉の古刹で行われる坐禅体験。',
      routineSuggestion: { time: '05:30', endTime: '07:30', title: '円覚寺 坐禅体験', thought: '鎌倉の古刹で無心になる早朝。', type: 'mind' },
      source: 'curated',
    },
  ];
}

/* ─── フィルタリングロジック ─────────────────────────────────── */

/**
 * ユーザーの都道府県に基づいてイベントをフィルタリング・ソート
 * - 未設定: オンライン + 全地域（ランダム順）
 * - 設定済み: 自地域 → オンライン → 他地域
 */
export function filterEventsByPrefecture(events: EventItem[], prefecture: string | null): EventItem[] {
  if (!prefecture) {
    // 未設定: オンラインを先頭に、地域イベントからランダムに追加
    const online = events.filter(e => e.isOnline);
    const local = events.filter(e => !e.isOnline).sort(() => Math.random() - 0.5).slice(0, 6);
    return [...online, ...local];
  }

  const myPrefEvents = events.filter(e => e.prefecture === prefecture);
  const onlineEvents = events.filter(e => e.isOnline);
  const othersEvents = events.filter(e => !e.isOnline && e.prefecture !== prefecture);

  return [...myPrefEvents, ...onlineEvents, ...othersEvents.slice(0, 3)];
}

/* ─── Public API ─────────────────────────────────────────────── */

export async function fetchEvents(prefecture: string | null = null): Promise<EventItem[]> {
  // デモモード: キュレートデータのみ
  if (IS_DEMO) {
    const curated = getCuratedEvents();
    return filterEventsByPrefecture(curated, prefecture);
  }

  try {
    // APIルートからリアルタイムイベントを取得
    const params = prefecture ? `?prefecture=${encodeURIComponent(prefecture)}` : '';
    const res = await fetch(`/api/events${params}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const apiEvents: EventItem[] = data.events || [];

    // キュレートイベントとマージ
    const curated = getCuratedEvents();
    const allEvents = [...apiEvents, ...curated];

    // 重複排除（IDベース）
    const seen = new Set<string>();
    const unique = allEvents.filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    return filterEventsByPrefecture(unique, prefecture);
  } catch {
    // API失敗時はキュレートデータにフォールバック
    console.warn('Event API failed, falling back to curated events');
    const curated = getCuratedEvents();
    return filterEventsByPrefecture(curated, prefecture);
  }
}

export const EVENT_CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  outdoor:   { label: 'アウトドア', color: 'text-green-700',  bg: 'bg-green-50'  },
  wellness:  { label: 'ウェルネス', color: 'text-blue-700',   bg: 'bg-blue-50'   },
  learning:  { label: '学び',       color: 'text-violet-700', bg: 'bg-violet-50' },
  culture:   { label: '文化',       color: 'text-amber-700',  bg: 'bg-amber-50'  },
  social:    { label: '交流',       color: 'text-rose-700',   bg: 'bg-rose-50'   },
  spiritual: { label: '精神・禅',   color: 'text-stone-600',  bg: 'bg-stone-100' },
};

export const JAPAN_PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];
