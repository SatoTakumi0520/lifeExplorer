"use client";

import React, { useEffect, useState } from 'react';
import type { AppTheme } from '../hooks/useTheme';

type SplashScreenProps = {
  /** true の間はスプラッシュを表示し続ける */
  isLoading: boolean;
  /** 退場アニメーション完了後に呼ばれる */
  onFinished: () => void;
  /** 現在のテーマ */
  theme?: AppTheme;
};

type Palette = {
  bg: string;
  glowClass: string;
  textMain: string;
  textSub: string;
  lineClass: string;
  dotClass: string;
  logo: 'sprout' | 'star' | 'moon' | 'leaf';
  logoColor?: string;
  trackingClass: string;
  fontStyle?: 'italic' | 'caveat' | 'normal';
};

const PALETTES: Record<AppTheme, Palette> = {
  classic: {
    bg: '#FDFCF8',
    glowClass: 'bg-green-200/30',
    textMain: 'text-stone-800',
    textSub: 'text-stone-400',
    lineClass: 'bg-stone-800',
    dotClass: 'bg-stone-300',
    logo: 'sprout',
    trackingClass: 'tracking-[0.2em]',
  },
  vogue: {
    bg: '#F5F3F0',
    glowClass: 'bg-[#C4756A]/20',
    textMain: 'text-[#1A1A1A]',
    textSub: 'text-[#A09890]',
    lineClass: 'bg-[#1A1A1A]',
    dotClass: 'bg-[#CCC]',
    logo: 'star',
    logoColor: '#1A1A1A',
    trackingClass: 'tracking-[0.35em]',
    fontStyle: 'italic',
  },
  midnight: {
    bg: '#0E1320',
    glowClass: 'bg-[#9B8AC4]/30',
    textMain: 'text-[#F4F2EA]',
    textSub: 'text-[#8B8B95]',
    lineClass: 'bg-[#C9A961]',
    dotClass: 'bg-[#C9A961]/60',
    logo: 'moon',
    logoColor: '#C9A961',
    trackingClass: 'tracking-[0.35em]',
    fontStyle: 'italic',
  },
  botanical: {
    bg: '#E8EDE3',
    glowClass: 'bg-[#7C9474]/30',
    textMain: 'text-[#2D3E2A]',
    textSub: 'text-[#5A6E55]',
    lineClass: 'bg-[#3F5E3A]',
    dotClass: 'bg-[#7C9474]',
    logo: 'leaf',
    logoColor: '#3F5E3A',
    trackingClass: 'tracking-[0.18em]',
    fontStyle: 'caveat',
  },
};

export const SplashScreen = ({ isLoading, onFinished, theme = 'classic' }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const palette = PALETTES[theme];

  // 入場アニメーション（マウント後すぐに idle へ）
  useEffect(() => {
    const timer = setTimeout(() => setPhase('idle'), 100);
    return () => clearTimeout(timer);
  }, []);

  // isLoading が false になったら退場アニメーション開始
  useEffect(() => {
    if (!isLoading && phase === 'idle') {
      // 最低表示時間を確保（ちらつき防止）
      const timer = setTimeout(() => setPhase('exit'), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, phase]);

  // 退場アニメーション完了後にコールバック
  useEffect(() => {
    if (phase === 'exit') {
      const timer = setTimeout(() => onFinished(), 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onFinished]);

  const titleFontStyle =
    palette.fontStyle === 'italic'
      ? { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontStyle: 'italic' as const }
      : palette.fontStyle === 'caveat'
      ? { fontFamily: "var(--font-caveat), 'Caveat', cursive", fontWeight: 700, fontSize: '15px' }
      : undefined;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: palette.bg }}
    >
      <div className="flex flex-col items-center">
        {/* ロゴ */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase === 'enter'
              ? 'scale-50 opacity-0'
              : phase === 'exit'
              ? 'scale-[2.5] opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <div className="relative">
            {palette.logo === 'sprout' && <p className="text-6xl select-none splash-pulse">🌱</p>}
            {palette.logo === 'star' && (
              <p
                className="text-5xl select-none splash-pulse"
                style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: palette.logoColor }}
              >
                ✦
              </p>
            )}
            {palette.logo === 'moon' && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="splash-pulse"
                fill="none"
                stroke={palette.logoColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M44 14 A22 22 0 1 0 50 38 A18 18 0 0 1 44 14 Z" fill={palette.logoColor} fillOpacity="0.15" />
                <circle cx="14" cy="18" r="0.7" fill={palette.logoColor} />
                <circle cx="50" cy="50" r="0.7" fill={palette.logoColor} />
                <circle cx="20" cy="48" r="0.6" fill={palette.logoColor} />
              </svg>
            )}
            {palette.logo === 'leaf' && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="splash-pulse"
                fill="none"
                stroke={palette.logoColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* 茎 */}
                <line x1="32" y1="56" x2="32" y2="30" />
                {/* 左の葉 */}
                <path d="M32 36 C22 36 14 28 14 16 C24 16 32 24 32 36 Z" fill={palette.logoColor} fillOpacity="0.18" />
                {/* 右の葉 */}
                <path d="M32 30 C42 30 50 22 50 10 C40 10 32 18 32 30 Z" fill={palette.logoColor} fillOpacity="0.12" />
              </svg>
            )}

            {/* 背景グロー */}
            <div className={`absolute inset-0 rounded-full blur-2xl -z-10 scale-150 splash-glow ${palette.glowClass}`} />
          </div>
        </div>

        {/* テキスト */}
        <div
          className={`mt-6 flex flex-col items-center transition-all duration-500 delay-200 ${
            phase === 'enter'
              ? 'opacity-0 translate-y-2'
              : phase === 'exit'
              ? 'opacity-0 -translate-y-2'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-[2px] rounded-full w-8 ${palette.lineClass}`} />
            <span
              className={`font-bold text-xs uppercase ${palette.trackingClass} ${palette.textMain}`}
              style={titleFontStyle}
            >
              Life Explorer
            </span>
            <div className={`h-[2px] rounded-full w-8 ${palette.lineClass}`} />
          </div>
          <p className={`text-[11px] tracking-wide ${palette.textSub}`}>Borrow a Life, Try New Self.</p>
        </div>

        {/* ローディングドット */}
        <div
          className={`mt-8 flex gap-1.5 transition-opacity duration-300 ${
            phase === 'exit' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-1 ${palette.dotClass}`} />
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-2 ${palette.dotClass}`} />
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-3 ${palette.dotClass}`} />
        </div>
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        .splash-pulse {
          animation: splashPulse 2s ease-in-out infinite;
        }
        .splash-glow {
          animation: splashGlow 2s ease-in-out infinite;
        }
        .splash-dot {
          animation: splashDot 1.4s ease-in-out infinite;
        }
        .splash-dot-1 { animation-delay: 0s; }
        .splash-dot-2 { animation-delay: 0.2s; }
        .splash-dot-3 { animation-delay: 0.4s; }

        @keyframes splashPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes splashGlow {
          0%, 100% { opacity: 0.3; transform: scale(1.5); }
          50% { opacity: 0.6; transform: scale(1.8); }
        }
        @keyframes splashDot {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          40% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};
