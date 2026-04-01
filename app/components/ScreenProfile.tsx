"use client";

import React, { useMemo } from 'react';
import { Settings, Flame, ArrowRight, Users } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { Screen, RoutineTask } from '../lib/types';
import { BorrowRecord } from '../hooks/useBorrowHistory';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  session: Session | null;
  borrowHistory: BorrowRecord[];
  streak: number;
  last35Days: number[];
  totalActiveDays: number;
};

/* ─── Static constants ─────────────────────────────────────────────── */

const DOW = ['月', '火', '水', '木', '金', '土', '日'];
const activityColors = ['bg-stone-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'];

const typeConfig = {
  nature: { label: '自然', color: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  mind:   { label: '思考',   color: 'bg-blue-400',  text: 'text-blue-600',  bg: 'bg-blue-50'  },
  work:   { label: '仕事',   color: 'bg-violet-400', text: 'text-violet-600', bg: 'bg-violet-50' },
} as const;

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

/* ─── Streak week row ──────────────────────────────────────────────── */

function buildStreakWeek(streak: number): boolean[] {
  // Last 7 days: true if within streak
  return DOW.map((_, i) => i >= 7 - streak);
}

/* ─── Component ────────────────────────────────────────────────────── */

export const ScreenProfile = ({ go, myRoutine, session, borrowHistory, streak, last35Days, totalActiveDays }: ScreenProfileProps) => {
  const displayName = session?.user?.email?.split('@')[0] ?? 'My Garden';

  const typeBalance = useMemo(() => {
    const total = myRoutine.length;
    if (total === 0) return { nature: 0, mind: 0, work: 0 };
    const counts = { nature: 0, mind: 0, work: 0 };
    myRoutine.forEach(task => { counts[task.type]++; });
    return {
      nature: Math.round((counts.nature / total) * 100),
      mind:   Math.round((counts.mind   / total) * 100),
      work:   Math.round((counts.work   / total) * 100),
    };
  }, [myRoutine]);

  const hasRoutine = myRoutine.length > 0;
  const streakWeek = buildStreakWeek(Math.min(streak, 7));

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 overflow-y-auto pb-24">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-12 pb-6 bg-white/60 border-b border-stone-100">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200/60 flex items-center justify-center text-2xl shadow-sm">
              🌱
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">{displayName}</h2>
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-green-50 border border-green-100 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-wide">
                成長中
              </span>
            </div>
          </div>
          <button
            onClick={() => go('SETTINGS')}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors -mt-1"
          >
            <Settings size={18} className="text-stone-400" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: String(totalActiveDays), label: '記録日数' },
            { value: String(borrowHistory.length), label: '試した数' },
            { value: String(borrowHistory.reduce((s, r) => s + r.triedCount, 0)), label: '試した回数' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-2xl font-bold text-stone-900 leading-none">{value}</span>
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── Streak ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-orange-500" />
              <h3 className="text-sm font-bold text-stone-700">継続記録</h3>
            </div>
            <span className="text-sm font-bold text-orange-500">{streak} 日 🔥</span>
          </div>
          <div className="flex gap-1.5">
            {streakWeek.map((active, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full aspect-square rounded-lg ${active ? 'bg-orange-400' : 'bg-stone-100'}`} />
                <span className="text-[9px] text-stone-300 font-bold uppercase">{DOW[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Routine Balance ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">ルーティンバランス</h3>
            {!hasRoutine && <span className="text-[10px] text-stone-300">タスクなし</span>}
          </div>
          {hasRoutine ? (
            <div className="space-y-2.5">
              {(Object.keys(typeConfig) as (keyof typeof typeConfig)[]).map(type => {
                const pct = typeBalance[type];
                const cfg = typeConfig[type];
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wide w-10 ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-400 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-300 text-center py-2">
              タスクを追加するとバランスが表示されます
            </p>
          )}
        </div>

        {/* ── Activity Calendar ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">アクティビティ</h3>
            <span className="text-xs text-stone-400">直近5週間</span>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DOW.map((d, i) => (
              <div key={i} className="text-center text-[9px] font-bold text-stone-300 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {last35Days.map((level, i) => (
              <div key={i} className={`aspect-square rounded-sm ${activityColors[level]}`} />
            ))}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-stone-300">少</span>
            {activityColors.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[10px] text-stone-300">多</span>
          </div>
        </div>

        {/* ── Borrow History ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">借用履歴</h3>
            <span className="text-xs text-stone-400">{borrowHistory.length} 件試した</span>
          </div>
          {borrowHistory.length > 0 ? (
            <div className="space-y-2">
              {borrowHistory.map(item => (
                <div key={item.personaId} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-base font-bold text-stone-400 flex-shrink-0">
                    {String(item.personaName).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-700 truncate">{item.title}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{item.personaName}</div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] font-bold text-stone-500">{item.triedCount}x</span>
                    <span className="text-[10px] text-stone-300">{relativeTime(item.lastBorrowedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-300 text-center py-4">
              Explore画面から気になるルーティンを試してみよう
            </p>
          )}
        </div>

        {/* ── My Routine Summary ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-stone-700 mb-3">マイルーティン</h3>
          <div className="flex items-center gap-3 p-3 bg-green-50/50 border border-green-100 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Users size={17} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-700">
                {hasRoutine ? `${myRoutine.length} タスク登録済み` : 'タスク未登録'}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">
                {hasRoutine
                  ? `自然 ${typeBalance.nature}% · 思考 ${typeBalance.mind}% · 仕事 ${typeBalance.work}%`
                  : 'Editからタスクを追加しよう'}
              </div>
            </div>
            <button
              onClick={() => go('EDIT')}
              className="p-2 rounded-lg bg-white border border-stone-100 hover:bg-stone-50 transition-colors flex-shrink-0"
            >
              <ArrowRight size={14} className="text-stone-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
