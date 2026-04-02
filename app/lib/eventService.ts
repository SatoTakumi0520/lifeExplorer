/**
 * 全国イベント提案サービス
 *
 * - 主要都市（東京・大阪・名古屋・福岡・札幌・仙台・京都・神戸）のキュレートイベント
 * - オンライン開催イベント（全国どこからでも参加可能）
 * - ユーザーの都道府県設定に応じてフィルタリング・優先表示
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

/* ─── 全国キュレートイベントデータ ─────────────────────────────── */

function getAllEvents(): EventItem[] {
  return [
    // ── オンライン（全国共通）
    {
      id: 'online-1',
      title: 'オンライン朝活 モーニングルーティン会',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '45分',
      location: 'Zoom（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'wellness',
      price: '無料',
      description: '全国から参加できる朝活コミュニティ。自分のモーニングルーティンをシェアし、仲間と一緒に朝をスタート。毎朝開催、途中入退出OK。',
      routineSuggestion: { time: '06:45', endTime: '08:00', title: 'オンライン朝活参加', thought: '全国の仲間と朝をスタートする。', type: 'mind' },
    },
    {
      id: 'online-2',
      title: 'マインドフルネス瞑想 ライブセッション',
      date: formatDateJa(getDateOffset(1)),
      time: '22:00',
      duration: '30分',
      location: 'YouTube Live（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'wellness',
      price: '無料',
      description: '夜の就寝前に心を落ち着かせる瞑想セッション。インストラクターが誘導するガイド瞑想。アーカイブ視聴も可能。',
      routineSuggestion: { time: '21:45', endTime: '22:30', title: 'オンライン瞑想セッション', thought: '一日の終わりに心を静める。', type: 'mind' },
    },
    {
      id: 'online-3',
      title: '読書感想シェア会（オンライン）',
      date: formatDateJa(getDateOffset(3)),
      time: '20:00',
      duration: '90分',
      location: 'Discord（オンライン）',
      prefecture: 'オンライン',
      isOnline: true,
      category: 'learning',
      price: '無料',
      description: '今月の課題本について語り合うオンライン読書会。事前に課題本を読んでいなくても参加OK。全国各地から毎回50名以上が参加。',
      routineSuggestion: { time: '19:30', endTime: '22:00', title: 'オンライン読書会', thought: '本を通じて全国の仲間と繋がる夜。', type: 'mind' },
    },
    // ── 東京都
    {
      id: 'tokyo-1',
      title: '朝の森林浴ウォーキング',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '約90分',
      location: '代々木公園（原宿口集合）',
      prefecture: '東京都',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '早朝の公園をゆっくり歩きながら自然と向き合う時間。インストラクターが植物や鳥の声について解説。初心者歓迎、動きやすい服装で参加ください。',
      routineSuggestion: { time: '06:30', endTime: '08:30', title: '森林浴ウォーキング（代々木公園）', thought: '自然の中を歩いて心をリセットする朝。', type: 'nature' },
    },
    {
      id: 'tokyo-2',
      title: '早朝ランニングクラブ',
      date: formatDateJa(getDateOffset(4)),
      time: '06:00',
      duration: '約60分',
      location: '皇居外苑（桜田門外集合）',
      prefecture: '東京都',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '皇居1周（約5km）をペースグループ別に走るクラブ。初心者から上級者まで対応。走った後は近くのカフェで軽食をとるグループも。毎週開催。',
      routineSuggestion: { time: '05:45', endTime: '07:30', title: '皇居ランニング', thought: '朝の空気の中を走って一日をスタートする。', type: 'nature' },
    },
    {
      id: 'tokyo-3',
      title: 'ビギナーヨガ体験クラス',
      date: formatDateJa(getDateOffset(1)),
      time: '10:00',
      duration: '60分',
      location: '渋谷区文化総合センター大和田',
      prefecture: '東京都',
      isOnline: false,
      category: 'wellness',
      price: '¥1,500',
      description: 'ヨガ未経験者向けの入門クラス。呼吸法と基本ポーズを丁寧に指導。ヨガマットの貸し出しあり（要予約）。',
      routineSuggestion: { time: '09:30', endTime: '11:30', title: 'ビギナーヨガ（渋谷）', thought: '初めてのヨガで体の使い方を学ぶ。', type: 'nature' },
    },
    {
      id: 'tokyo-4',
      title: 'デジタルデトックス 1日体験',
      date: formatDateJa(getDateOffset(5)),
      time: '09:00',
      duration: '1日（9:00〜17:00）',
      location: '高尾山麓 自然体験施設',
      prefecture: '東京都',
      isOnline: false,
      category: 'outdoor',
      price: '¥3,000',
      description: 'スマートフォンを預けて自然の中で過ごす1日プログラム。ハイキング・焚き火・読書・昼寝など。定員15名。',
      routineSuggestion: { time: '08:00', endTime: '18:00', title: 'デジタルデトックス（高尾山）', thought: 'スマホなしで自然の中を過ごす一日。', type: 'nature' },
    },
    // ── 大阪府
    {
      id: 'osaka-1',
      title: '大阪城公園 早朝ヨガ',
      date: formatDateJa(getDateOffset(0)),
      time: '07:00',
      duration: '60分',
      location: '大阪城公園（太陽の広場）',
      prefecture: '大阪府',
      isOnline: false,
      category: 'wellness',
      price: '無料',
      description: '大阪城を望みながら行う屋外ヨガクラス。初心者歓迎。ヨガマット持参推奨（レンタルあり）。雨天中止。',
      routineSuggestion: { time: '06:30', endTime: '08:30', title: '大阪城公園ヨガ', thought: '城を見ながら心と体を整える朝。', type: 'nature' },
    },
    {
      id: 'osaka-2',
      title: '読書コミュニティ 梅田月例会',
      date: formatDateJa(getDateOffset(2)),
      time: '19:00',
      duration: '約2時間',
      location: '大阪市立中央図書館',
      prefecture: '大阪府',
      isOnline: false,
      category: 'learning',
      price: '無料',
      description: '毎月テーマを決めて本について語り合う読書会。本を読んでいなくても参加OK。毎回20〜40名が参加。',
      routineSuggestion: { time: '18:30', endTime: '21:30', title: '読書会（梅田）', thought: '本を通じて新しい視点と出会う夜。', type: 'mind' },
    },
    {
      id: 'osaka-3',
      title: 'マインドフルネス入門ワークショップ',
      date: formatDateJa(getDateOffset(3)),
      time: '14:00',
      duration: '2時間',
      location: 'なんばコワーキングスペース',
      prefecture: '大阪府',
      isOnline: false,
      category: 'wellness',
      price: '¥2,000',
      description: '日常に取り入れやすいマインドフルネスの基礎を学ぶワークショップ。グループワークあり。定員20名。',
      routineSuggestion: { time: '13:30', endTime: '16:30', title: 'マインドフルネスWS（なんば）', thought: '意識的に「今ここ」に集中する練習。', type: 'mind' },
    },
    // ── 愛知県（名古屋）
    {
      id: 'aichi-1',
      title: '名城公園 朝ランニング',
      date: formatDateJa(getDateOffset(1)),
      time: '06:30',
      duration: '約60分',
      location: '名城公園（北園 芝生広場集合）',
      prefecture: '愛知県',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '名古屋市内の緑あふれる公園でのランニングクラブ。5km・10km・ウォーキングのコース別。初参加歓迎。',
      routineSuggestion: { time: '06:00', endTime: '08:00', title: '名城公園ランニング', thought: '緑の中を走って名古屋の朝を楽しむ。', type: 'nature' },
    },
    {
      id: 'aichi-2',
      title: 'ヨガ＆瞑想 体験会',
      date: formatDateJa(getDateOffset(4)),
      time: '10:00',
      duration: '90分',
      location: '名古屋市女性会館',
      prefecture: '愛知県',
      isOnline: false,
      category: 'wellness',
      price: '¥1,000',
      description: 'ハタヨガと瞑想を組み合わせた体験クラス。心身のリラクゼーションを目的とし、全くの初心者でも安心して参加できます。',
      routineSuggestion: { time: '09:30', endTime: '12:00', title: 'ヨガ＆瞑想（名古屋）', thought: '心と体をリセットする週末の朝。', type: 'nature' },
    },
    // ── 福岡県
    {
      id: 'fukuoka-1',
      title: '大濠公園 サンライズラン',
      date: formatDateJa(getDateOffset(0)),
      time: '06:00',
      duration: '約60分',
      location: '大濠公園（正門集合）',
      prefecture: '福岡県',
      isOnline: false,
      category: 'outdoor',
      price: '無料',
      description: '大濠公園の池を眺めながら走る早朝ランニングクラブ。公園1周（約2km）×3〜5周を目安に。走力不問、途中離脱OK。',
      routineSuggestion: { time: '05:45', endTime: '07:30', title: '大濠公園ラン', thought: '池の朝靄の中を走る爽快な朝。', type: 'nature' },
    },
    {
      id: 'fukuoka-2',
      title: '九州読書クラブ 月例会',
      date: formatDateJa(getDateOffset(3)),
      time: '19:00',
      duration: '約2時間',
      location: '福岡市総合図書館',
      prefecture: '福岡県',
      isOnline: false,
      category: 'learning',
      price: '無料',
      description: '月に一度、課題本をもとに語り合う読書コミュニティ。IT・ビジネス・文学・哲学など幅広いジャンルを取り上げる。',
      routineSuggestion: { time: '18:30', endTime: '21:30', title: '読書クラブ（福岡）', thought: '本を介して九州の仲間とつながる夜。', type: 'mind' },
    },
    // ── 北海道（札幌）
    {
      id: 'hokkaido-1',
      title: '円山公園 ノルディックウォーキング',
      date: formatDateJa(getDateOffset(2)),
      time: '08:00',
      duration: '約90分',
      location: '円山公園（正門集合）',
      prefecture: '北海道',
      isOnline: false,
      category: 'outdoor',
      price: '¥500',
      description: '2本のポールを使って全身運動するノルディックウォーキング体験。円山公園の自然を楽しみながら健康づくり。ポール貸し出しあり。',
      routineSuggestion: { time: '07:30', endTime: '10:00', title: 'ノルディックウォーキング（円山）', thought: '北海道の空気の中で全身を動かす朝。', type: 'nature' },
    },
    // ── 宮城県（仙台）
    {
      id: 'miyagi-1',
      title: '定禅寺通り 朝の瞑想ウォーク',
      date: formatDateJa(getDateOffset(1)),
      time: '07:00',
      duration: '60分',
      location: '定禅寺通り（東一番丁交差点集合）',
      prefecture: '宮城県',
      isOnline: false,
      category: 'wellness',
      price: '無料',
      description: '並木道をゆっくり歩きながらマインドフルネスを実践するウォーキング瞑想。ガイドが呼吸法と歩行瞑想を指導。',
      routineSuggestion: { time: '06:45', endTime: '08:30', title: '瞑想ウォーク（定禅寺通り）', thought: '緑のトンネルを歩きながら心を落ち着かせる朝。', type: 'mind' },
    },
    // ── 京都府
    {
      id: 'kyoto-1',
      title: '早朝の嵐山 禅ウォーキング',
      date: formatDateJa(getDateOffset(2)),
      time: '06:30',
      duration: '約2時間',
      location: '嵐山（渡月橋東詰集合）',
      prefecture: '京都府',
      isOnline: false,
      category: 'spiritual',
      price: '¥1,000',
      description: '観光客がいない早朝の嵐山を禅の視点で歩くツアー。竹林・天龍寺・大堰川を巡りながら「今ここ」の意識を養う。',
      routineSuggestion: { time: '06:00', endTime: '09:00', title: '嵐山 禅ウォーキング', thought: '観光客のいない京都で内面と向き合う朝。', type: 'mind' },
    },
    // ── 神奈川県
    {
      id: 'kanagawa-1',
      title: '鎌倉 朝の坐禅体験',
      date: formatDateJa(getDateOffset(5)),
      time: '06:00',
      duration: '45分',
      location: '円覚寺（鎌倉）',
      prefecture: '神奈川県',
      isOnline: false,
      category: 'spiritual',
      price: '¥500',
      description: '鎌倉の古刹で行われる坐禅体験。作務衣の貸し出しあり。参加者全員で座禅を組み、住職の指導のもと静かな朝を体験する。',
      routineSuggestion: { time: '05:30', endTime: '07:30', title: '円覚寺 坐禅体験', thought: '鎌倉の古刹で無心になる早朝。', type: 'mind' },
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
    const local = events.filter(e => !e.isOnline).sort(() => Math.random() - 0.5).slice(0, 4);
    return [...online, ...local];
  }

  const myPrefEvents = events.filter(e => e.prefecture === prefecture);
  const onlineEvents = events.filter(e => e.isOnline);
  const othersEvents = events.filter(e => !e.isOnline && e.prefecture !== prefecture);

  return [...myPrefEvents, ...onlineEvents, ...othersEvents.slice(0, 2)];
}

/* ─── Public API ─────────────────────────────────────────────── */

export async function fetchEvents(prefecture: string | null = null): Promise<EventItem[]> {
  const all = getAllEvents();
  return filterEventsByPrefecture(all, prefecture);
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
