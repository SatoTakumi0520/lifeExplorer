"use client";

import React from 'react';

type ScreenTopProps = {
  onSignIn: () => void;
  onSignUp: () => void;
};

/* ─── Feature list icons ──────────────────────────────────────────── */

const RoutineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="4" y1="2" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="4" cy="4.5" r="1.75" fill="currentColor" />
    <circle cx="4" cy="9" r="1.75" fill="currentColor" fillOpacity="0.5" />
    <circle cx="4" cy="13.5" r="1.75" fill="currentColor" fillOpacity="0.25" />
    <rect x="7.5" y="3.25" width="8" height="2.5" rx="1.25" fill="currentColor" />
    <rect x="7.5" y="7.75" width="5.5" height="2.5" rx="1.25" fill="currentColor" fillOpacity="0.5" />
    <rect x="7.5" y="12.25" width="7" height="2.5" rx="1.25" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

const BorrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="6" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M2 14.5c0-2.21 1.79-4 4-4h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 14.5c0-2.21-1.79-4-4-4h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
    <path d="M10 12.5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 11l1.5 1.5L9.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CatalogIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1.5" y="1.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" />
    <rect x="10" y="1.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" fillOpacity="0.5" />
    <rect x="1.5" y="10" width="6.5" height="6.5" rx="1.5" fill="currentColor" fillOpacity="0.25" />
    <rect x="10" y="10" width="6.5" height="6.5" rx="1.5" fill="currentColor" fillOpacity="0.7" />
  </svg>
);

/* ─── Background illustration ─────────────────────────────────────── */

/**
 * コンセプト:「他者の一日を借りて、新しい自分を試す」
 *
 * 2枚のスケジュールカード（人物Aの一日＝amber / 借りた一日＝green）が
 * 右方向に重なりながら浮かび、カード間を流れる破線アークが
 * 「borrow」の動作を暗示する。
 * タスクバーはアプリ内のカラー（amber / violet / blue）と統一。
 */
const BackgroundIllustration = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 375 812"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      {/* カード内タスクバーのフェードアウト用マスク */}
      <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="60%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <mask id="cardFadeA">
        <rect x="205" y="50" width="150" height="400" rx="20" fill="url(#fadeBottom)" />
      </mask>
      <mask id="cardFadeB">
        <rect x="225" y="130" width="150" height="380" rx="20" fill="url(#fadeBottom)" />
      </mask>
    </defs>

    {/* ── Ambient color washes ── */}
    <circle cx="315" cy="210" r="175" fill="#DCFCE7" opacity="0.50" />
    <circle cx="350" cy="580" r="120" fill="#FEF9C3" opacity="0.38" />
    <circle cx="45"  cy="650" r="100" fill="#EDE9FE" opacity="0.28" />

    {/* ── Card A — 他者の一日（amber トーン） ── */}
    <g transform="rotate(-8 280 250)" opacity="0.13">
      {/* カード本体 */}
      <rect x="205" y="50" width="150" height="400" rx="20"
            fill="#FFFBEB" stroke="#D97706" strokeWidth="0.8" />
      {/* ヘッダーバー */}
      <rect x="220" y="70" width="28" height="6" rx="3" fill="#92400E" opacity="0.35" />
      <rect x="254" y="70" width="18" height="6" rx="3" fill="#92400E" opacity="0.2" />
      {/* 朝 — amber */}
      <rect x="220" y="96"  width="110" height="12" rx="6" fill="#F59E0B" mask="url(#cardFadeA)" />
      <rect x="220" y="116" width="80"  height="12" rx="6" fill="#F59E0B" opacity="0.65" mask="url(#cardFadeA)" />
      <rect x="220" y="136" width="94"  height="12" rx="6" fill="#F59E0B" opacity="0.40" mask="url(#cardFadeA)" />
      {/* 昼 — violet */}
      <rect x="220" y="170" width="100" height="12" rx="6" fill="#8B5CF6" mask="url(#cardFadeA)" />
      <rect x="220" y="190" width="66"  height="12" rx="6" fill="#8B5CF6" opacity="0.60" mask="url(#cardFadeA)" />
      {/* 午後 — blue */}
      <rect x="220" y="228" width="88"  height="12" rx="6" fill="#60A5FA" mask="url(#cardFadeA)" />
      <rect x="220" y="248" width="110" height="12" rx="6" fill="#60A5FA" opacity="0.65" mask="url(#cardFadeA)" />
      <rect x="220" y="268" width="60"  height="12" rx="6" fill="#60A5FA" opacity="0.40" mask="url(#cardFadeA)" />
      {/* 夕方 */}
      <rect x="220" y="308" width="84"  height="12" rx="6" fill="#F59E0B" opacity="0.80" mask="url(#cardFadeA)" />
      <rect x="220" y="328" width="102" height="12" rx="6" fill="#8B5CF6" opacity="0.65" mask="url(#cardFadeA)" />
      <rect x="220" y="368" width="70"  height="12" rx="6" fill="#60A5FA" opacity="0.55" mask="url(#cardFadeA)" />
      <rect x="220" y="388" width="88"  height="12" rx="6" fill="#F59E0B" opacity="0.45" mask="url(#cardFadeA)" />
      <rect x="220" y="408" width="50"  height="12" rx="6" fill="#8B5CF6" opacity="0.35" mask="url(#cardFadeA)" />
    </g>

    {/* ── Card B — 借りた一日（green トーン） ── */}
    <g transform="rotate(6 305 320)" opacity="0.10">
      <rect x="225" y="130" width="150" height="380" rx="20"
            fill="#F0FDF4" stroke="#16A34A" strokeWidth="0.8" />
      <rect x="240" y="150" width="28" height="6" rx="3" fill="#15803D" opacity="0.35" />
      <rect x="274" y="150" width="18" height="6" rx="3" fill="#15803D" opacity="0.2" />
      {/* 朝 — green */}
      <rect x="240" y="174" width="96"  height="12" rx="6" fill="#22C55E" mask="url(#cardFadeB)" />
      <rect x="240" y="194" width="70"  height="12" rx="6" fill="#22C55E" opacity="0.60" mask="url(#cardFadeB)" />
      {/* 昼 — violet */}
      <rect x="240" y="232" width="104" height="12" rx="6" fill="#8B5CF6" mask="url(#cardFadeB)" />
      <rect x="240" y="252" width="74"  height="12" rx="6" fill="#8B5CF6" opacity="0.55" mask="url(#cardFadeB)" />
      <rect x="240" y="272" width="88"  height="12" rx="6" fill="#60A5FA" mask="url(#cardFadeB)" />
      {/* 午後 */}
      <rect x="240" y="310" width="62"  height="12" rx="6" fill="#22C55E" opacity="0.80" mask="url(#cardFadeB)" />
      <rect x="240" y="330" width="100" height="12" rx="6" fill="#F59E0B" mask="url(#cardFadeB)" />
      <rect x="240" y="350" width="78"  height="12" rx="6" fill="#22C55E" opacity="0.65" mask="url(#cardFadeB)" />
      {/* 夕方 */}
      <rect x="240" y="392" width="90"  height="12" rx="6" fill="#60A5FA" opacity="0.65" mask="url(#cardFadeB)" />
      <rect x="240" y="412" width="56"  height="12" rx="6" fill="#22C55E" opacity="0.55" mask="url(#cardFadeB)" />
      <rect x="240" y="432" width="72"  height="12" rx="6" fill="#8B5CF6" opacity="0.45" mask="url(#cardFadeB)" />
      <rect x="240" y="466" width="84"  height="12" rx="6" fill="#22C55E" opacity="0.35" mask="url(#cardFadeB)" />
    </g>

    {/* ── Borrow arc — カード間をつなぐ「借りる」動作 ── */}
    <path
      d="M 238 318 C 218 308 202 336 222 348"
      stroke="#22C55E" strokeWidth="1.5"
      strokeDasharray="4 3.5" strokeLinecap="round"
      opacity="0.22" fill="none"
    />
    {/* 起点ドット（amber = 他者の一日） */}
    <circle cx="238" cy="318" r="3" fill="#F59E0B" opacity="0.28" />
    {/* 終点ドット（green = 借りた一日） */}
    <circle cx="222" cy="348" r="3" fill="#22C55E" opacity="0.28" />

    {/* ── 浮遊タスクチップ（カード外に流れ出るイメージ） ── */}
    <rect x="158" y="288" width="58" height="10" rx="5" fill="#F59E0B" opacity="0.10" />
    <rect x="144" y="326" width="44" height="10" rx="5" fill="#8B5CF6" opacity="0.09" />
    <rect x="152" y="360" width="50" height="10" rx="5" fill="#22C55E" opacity="0.08" />

    {/* ── 装飾ドット ── */}
    <circle cx="168" cy="192" r="2.5" fill="#A78BFA" opacity="0.20" />
    <circle cx="356" cy="455" r="2.5" fill="#F59E0B" opacity="0.16" />
    <circle cx="118" cy="490" r="2"   fill="#4ADE80" opacity="0.16" />
    <circle cx="344" cy="710" r="3"   fill="#60A5FA" opacity="0.13" />
    <circle cx="195" cy="755" r="2"   fill="#F59E0B" opacity="0.11" />
    <circle cx="82"  cy="740" r="1.5" fill="#A78BFA" opacity="0.12" />
  </svg>
);

/* ─── Feature list ────────────────────────────────────────────────── */

const features = [
  {
    icon: <RoutineIcon />,
    label: '01',
    title: 'マイルーティン',
    desc: '理想の一日をデザインする',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    icon: <BorrowIcon />,
    label: '02',
    title: '一日を借りる',
    desc: '誰かの一日を借りて、新しい自分を試す',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    icon: <CatalogIcon />,
    label: '03',
    title: '探索する',
    desc: '75+のライフスタイルから自分に合うものを発見',
    iconBg: 'bg-violet-100 text-violet-700',
  },
];

/* ─── Screen ──────────────────────────────────────────────────────── */

export const ScreenTop = ({ onSignIn, onSignUp }: ScreenTopProps) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] relative overflow-x-hidden overflow-y-auto font-sans">

    {/* イラスト層（最背面） */}
    <BackgroundIllustration />

    {/* コンテンツ層 */}

    {/* ロゴ */}
    <div className="pt-14 px-8 z-10 relative">
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-stone-800" />
        <span className="font-bold tracking-[0.2em] text-[10px] uppercase text-stone-500">Life Explorer</span>
      </div>
    </div>

    {/* キャッチコピー */}
    <div className="pt-10 px-8 z-10 relative">
      <h1 className="text-5xl font-serif font-bold leading-[1.1] mb-4 text-stone-900">
        Borrow a Life,<br />
        <span className="text-green-700">Try</span>
        <br />New Self.
      </h1>
      <p className="text-stone-400 text-sm leading-relaxed">
        誰かのライフスタイルを借りて、<br />
        まだ知らない自分に出会おう。
      </p>
    </div>

    {/* フィーチャーリスト */}
    <div className="px-8 pt-9 z-10 relative">
      <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.18em] mb-4">特徴</p>
      <div className="space-y-0">
        {features.map(({ icon, label, title, desc, iconBg }) => (
          <div key={title} className="flex items-center gap-4 py-3.5 border-b border-stone-100/80 last:border-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-stone-800 leading-tight">{title}</div>
              <div className="text-xs text-stone-400 mt-0.5">{desc}</div>
            </div>
            <span className="text-[10px] font-mono font-bold text-stone-200 flex-shrink-0">{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* スペーサー */}
    <div className="flex-1" />

    {/* CTA */}
    <div className="px-6 pb-12 z-10 relative shrink-0 flex flex-col gap-3">
      <button
        onClick={onSignUp}
        className="w-full py-[17px] bg-stone-900 text-white rounded-2xl font-bold text-base tracking-wide hover:bg-stone-700 active:scale-[0.98] transition-all"
      >
        はじめる
      </button>
      <button
        onClick={onSignIn}
        className="w-full py-3 text-stone-400 text-sm font-medium hover:text-stone-700 transition-colors"
      >
        すでにアカウントをお持ちの方は{' '}
        <span className="text-stone-800 font-bold underline underline-offset-2">ログイン</span>
      </button>
    </div>
  </div>
);
