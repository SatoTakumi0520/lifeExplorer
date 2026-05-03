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

export const SplashScreen = ({ isLoading, onFinished, theme = 'classic' }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const isVogue = theme === 'vogue';

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

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isVogue ? 'bg-white' : 'bg-[#FDFCF8]'
      } ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}
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
            {isVogue ? (
              <p className="text-5xl select-none splash-pulse" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: 300, color: '#111' }}>✦</p>
            ) : (
              <p className="text-6xl select-none splash-pulse">🌱</p>
            )}
            {/* 背景グロー */}
            <div className={`absolute inset-0 rounded-full blur-2xl -z-10 scale-150 splash-glow ${
              isVogue ? 'bg-[#B8877A]/20' : 'bg-green-200/30'
            }`} />
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
            <div className={`h-[2px] rounded-full ${isVogue ? 'w-8 bg-[#111]' : 'w-6 bg-stone-800'}`} />
            <span
              className={`font-bold text-xs uppercase ${
                isVogue ? 'tracking-[0.35em] text-[#111]' : 'tracking-[0.2em] text-stone-800'
              }`}
              style={isVogue ? { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: 400 } : undefined}
            >
              Life Explorer
            </span>
            <div className={`h-[2px] rounded-full ${isVogue ? 'w-8 bg-[#111]' : 'w-6 bg-stone-800'}`} />
          </div>
          <p className={`text-[11px] tracking-wide ${isVogue ? 'text-[#AAA]' : 'text-stone-400'}`}>
            Borrow a Life, Try New Self.
          </p>
        </div>

        {/* ローディングドット */}
        <div
          className={`mt-8 flex gap-1.5 transition-opacity duration-300 ${
            phase === 'exit' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-1 ${isVogue ? 'bg-[#CCC]' : 'bg-stone-300'}`} />
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-2 ${isVogue ? 'bg-[#CCC]' : 'bg-stone-300'}`} />
          <div className={`w-1.5 h-1.5 rounded-full splash-dot splash-dot-3 ${isVogue ? 'bg-[#CCC]' : 'bg-stone-300'}`} />
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
