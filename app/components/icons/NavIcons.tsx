/**
 * Life Explorer 専用のナビゲーションアイコン群
 *
 * "Borrow a Life" のコンセプトに合わせて、植物・自然・時間の
 * モチーフでデザインされた独自SVGアイコン。currentColor を使うので
 * テーマごとの色変更（Tailwind の text-* クラスや CSS 上書き）に追従する。
 */

import React from 'react';

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

/** Home / Timeline — 時計（時間軸=ルーティンの象徴） */
export const NavHomeIcon = ({ size = 22, className, strokeWidth = 1.6 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* 文字盤 */}
    <circle cx="12" cy="12" r="9" />
    {/* 短針(12時方向) */}
    <line x1="12" y1="12" x2="12" y2="7.5" />
    {/* 長針(2時方向) */}
    <line x1="12" y1="12" x2="15" y2="13.5" />
  </svg>
);

/** Explore — コンパス（探索の方位） */
export const NavExploreIcon = ({ size = 22, className, strokeWidth = 1.6 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* 外円 */}
    <circle cx="12" cy="12" r="9" />
    {/* 上向きニードル(N) — 塗り */}
    <path d="M12 5 L14 12 L12 11 L10 12 Z" fill="currentColor" stroke="none" />
    {/* 下向きニードル(S) — 線のみ薄く */}
    <path d="M12 19 L14 12 L10 12 Z" opacity="0.35" />
  </svg>
);

/** Calendar — グリッドと「今日」を示す丸 */
export const NavCalendarIcon = ({ size = 22, className, strokeWidth = 1.6 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* 外枠 */}
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    {/* 上部の仕切り */}
    <line x1="3.5" y1="10" x2="20.5" y2="10" />
    {/* 上の留め具 */}
    <line x1="8.5" y1="3" x2="8.5" y2="7" />
    <line x1="15.5" y1="3" x2="15.5" y2="7" />
    {/* 「今日」を示す塗り丸 */}
    <circle cx="12" cy="15" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);

/** Profile — 人物シルエット（マイページの象徴） */
export const NavProfileIcon = ({ size = 22, className, strokeWidth = 1.6 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* 頭 */}
    <circle cx="12" cy="8" r="3.5" />
    {/* 肩 */}
    <path d="M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20" />
  </svg>
);
