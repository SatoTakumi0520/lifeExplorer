"use client";

import React, { useMemo } from 'react';
import { Settings, Flame, ArrowRight, Users } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { Screen, RoutineTask } from '../lib/types';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  session: Session | null;
};

/* ─── Mock data ────────────────────────────────────────────────────── */

const BORROW_HISTORY = [
  {
    id: 1,
    avatar: '🧘‍♀️',
    name: 'Anna K.',
    role: 'Yoga Instructor',
    title: '心と体を整える朝の3時間',
    triedCount: 3,
    lastTried: '2日前',
  },
  {
    id: 2,
    avatar: '💼',
    name: 'Takeshi M.',
    role: 'CEO',
    title: '経営者の朝5時起床ルーティン',
    triedCount: 1,
    lastTried: '1週間前',
  },
];

const MY_PUBLIC_STATS = { borrowCount: 24, title: 'My Morning Flow' };

/* ─── Activity calendar ────────────────────────────────────────────── */

const activityData = Array.from({ length: 35 }, (_, i) => {
  const seed = (i * 13 + 7) % 7;
  if (seed === 0) return 0;
  if (seed <= 2) return 1;
  if (seed <= 4) return 2;
  return 3;
});
const activityColors = ['bg-stone-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'];

/* ─── Static constants ─────────────────────────────────────────────── */

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const STREAK_DAYS = [true, true, true, false, true, true, true];
const CURRENT_STREAK = 6;

const typeConfig = {
  nature: { label: 'Nature', color: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  mind:   { label: 'Mind',   color: 'bg-blue-400',  text: 'text-blue-600',  bg: 'bg-blue-50'  },
  work:   { label: 'Work',   color: 'bg-violet-400', text: 'text-violet-600', bg: 'bg-violet-50' },
} as const;

/* ─── Component ────────────────────────────────────────────────────── */

export const ScreenProfile = ({ go, myRoutine, session }: ScreenProfileProps) => {
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
                Sprouting
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
            { value: '12',                                  label: 'Days Logged' },
            { value: String(BORROW_HISTORY.length),         label: 'Tried'       },
            { value: String(MY_PUBLIC_STATS.borrowCount),   label: 'Lent to'     },
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
              <h3 className="text-sm font-bold text-stone-700">Streak</h3>
            </div>
            <span className="text-sm font-bold text-orange-500">{CURRENT_STREAK} days 🔥</span>
          </div>
          <div className="flex gap-1.5">
            {STREAK_DAYS.map((active, i) => (
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
            <h3 className="text-sm font-bold text-stone-700">Routine Balance</h3>
            {!hasRoutine && <span className="text-[10px] text-stone-300">No tasks yet</span>}
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
              Add tasks to your routine to see your balance
            </p>
          )}
        </div>

        {/* ── Activity Calendar ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">Activity</h3>
            <span className="text-xs text-stone-400">Last 5 weeks</span>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DOW.map((d, i) => (
              <div key={i} className="text-center text-[9px] font-bold text-stone-300 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {activityData.map((level, i) => (
              <div key={i} className={`aspect-square rounded-sm ${activityColors[level]}`} />
            ))}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-stone-300">Less</span>
            {activityColors.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[10px] text-stone-300">More</span>
          </div>
        </div>

        {/* ── Borrow History ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">Borrow History</h3>
            <span className="text-xs text-stone-400">{BORROW_HISTORY.length} tried</span>
          </div>
          {BORROW_HISTORY.length > 0 ? (
            <div className="space-y-2">
              {BORROW_HISTORY.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-lg flex-shrink-0">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-700 truncate">{item.title}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{item.name} · {item.role}</div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] font-bold text-stone-500">{item.triedCount}x</span>
                    <span className="text-[10px] text-stone-300">{item.lastTried}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-300 text-center py-4">No borrowed routines yet</p>
          )}
        </div>

        {/* ── My Public Routine ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <h3 className="text-sm font-bold text-stone-700 mb-3">My Public Routine</h3>
          <div className="flex items-center gap-3 p-3 bg-green-50/50 border border-green-100 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Users size={17} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-700">{MY_PUBLIC_STATS.title}</div>
              <div className="text-[10px] text-stone-400 mt-0.5">
                <span className="font-bold text-green-600">{MY_PUBLIC_STATS.borrowCount}</span> people borrowed this
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
