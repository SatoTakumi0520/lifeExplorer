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

/** Home / Timeline — 地平線から昇る太陽（一日の始まり） */
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
    {/* 地平線 */}
    <line x1="3" y1="18" x2="21" y2="18" />
    {/* 半円の太陽 */}
    <path d="M6 18 A6 6 0 0 1 18 18" />
    {/* 太陽の中心ライン */}
    <line x1="12" y1="13" x2="12" y2="15" />
    {/* 短い光 */}
    <line x1="3.5" y1="21" x2="6" y2="21" />
    <line x1="18" y1="21" x2="20.5" y2="21" />
  </svg>
);

/** Explore — ダイヤモンド型の方位磁針（探索の方向） */
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
    {/* ダイヤ型のニードル（NE 方向） */}
    <path d="M15.5 8.5 L12.5 12.5 L8.5 15.5 L11.5 11.5 Z" fill="currentColor" stroke="none" />
    {/* 反対側の薄いダイヤ */}
    <path d="M15.5 8.5 L12.5 12.5 L11.5 11.5 L14.5 7.5 Z" opacity="0.0" />
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

/** Profile / My Garden — 双葉の芽生え（成長・自分） */
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
    {/* 茎 */}
    <line x1="12" y1="21" x2="12" y2="11" />
    {/* 左の葉 */}
    <path d="M12 13 C8.5 13 6 11 6 8 C9 8 12 10 12 13 Z" />
    {/* 右の葉 */}
    <path d="M12 11 C15.5 11 18 9 18 6 C15 6 12 8 12 11 Z" />
    {/* 土台のライン */}
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);
