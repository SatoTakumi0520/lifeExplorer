"use client";

import React, { useMemo, useState } from 'react';
import { Settings, ArrowRight, Users, Globe, Lock, Edit2, CalendarDays, MapPin, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { Screen, RoutineTask, ScheduledEvent } from '../lib/types';
import { BorrowRecord } from '../hooks/useBorrowHistory';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  session: Session | null;
  borrowHistory: BorrowRecord[];
  upcomingEvents: ScheduledEvent[];
  isPublished: boolean;
  onPublish: (title: string) => void;
  onUnpublish: () => void;
};

/* ─── Static constants ─────────────────────────────────────────────── */

const typeConfig = {
  nature: { label: '自然', color: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  mind:   { label: '思考', color: 'bg-blue-400',  text: 'text-blue-600',  bg: 'bg-blue-50'  },
  work:   { label: '仕事', color: 'bg-violet-400', text: 'text-violet-600', bg: 'bg-violet-50' },
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

function formatEventDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${m}/${d}（${dow}）`;
}

/* ─── Component ────────────────────────────────────────────────────── */

export const ScreenProfile = ({ go, myRoutine, session, borrowHistory, upcomingEvents, isPublished, onPublish, onUnpublish }: ScreenProfileProps) => {
  const displayName = session?.user?.email?.split('@')[0] ?? 'Explorer';
  const [publishTitle, setPublishTitle] = useState('');

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
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 border border-green-100 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-wide">
                  {hasRoutine ? `${myRoutine.length} タスク` : 'はじめよう'}
                </span>
                {borrowHistory.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                    {borrowHistory.length} 件体験
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => go('SETTINGS')}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors -mt-1"
          >
            <Settings size={18} className="text-stone-400" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* ── Routine Balance ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-700">マイルーティン</h3>
            <button
              onClick={() => go('EDIT')}
              className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              編集 <ArrowRight size={12} />
            </button>
          </div>
          {hasRoutine ? (
            <>
              <div className="space-y-2.5 mb-4">
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
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                <Users size={14} className="text-stone-400" />
                <span className="text-xs text-stone-500">
                  {myRoutine.length} タスク · 自然 {typeBalance.nature}% · 思考 {typeBalance.mind}% · 仕事 {typeBalance.work}%
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-green-400" />
              </div>
              <p className="text-xs text-stone-400 mb-3">ルーティンを作って一日をデザインしよう</p>
              <button
                onClick={() => go('EDIT')}
                className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
              >
                タスクを追加する
              </button>
            </div>
          )}
        </div>

        {/* ── Upcoming Events ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-blue-500" />
              <h3 className="text-sm font-bold text-stone-700">予定中のイベント</h3>
            </div>
            {upcomingEvents.length > 0 && (
              <button
                onClick={() => go('CALENDAR')}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
              >
                カレンダー →
              </button>
            )}
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl">
                  <div className="flex flex-col items-center flex-shrink-0 w-12">
                    <span className="text-[10px] font-bold text-blue-600">{formatEventDate(event.date)}</span>
                    <span className="text-[10px] font-mono text-blue-400">{event.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-700 truncate">{event.title}</div>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={9} className="text-stone-300 flex-shrink-0" />
                        <span className="text-[10px] text-stone-400 truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
              {upcomingEvents.length > 5 && (
                <button
                  onClick={() => go('CALENDAR')}
                  className="w-full py-2 text-xs text-blue-500 font-bold hover:bg-blue-50 rounded-xl transition-colors"
                >
                  他 {upcomingEvents.length - 5} 件を表示 →
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <CalendarDays size={20} className="text-blue-300" />
              </div>
              <p className="text-xs text-stone-400 mb-2">予定中のイベントはありません</p>
              <p className="text-[10px] text-stone-300">Exploreからイベントを予定に追加できます</p>
            </div>
          )}
        </div>

        {/* ── Borrow History ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-orange-500" />
              <h3 className="text-sm font-bold text-stone-700">試したルーティン</h3>
            </div>
            {borrowHistory.length > 0 && (
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                {borrowHistory.reduce((s, r) => s + r.triedCount, 0)} 回体験
              </span>
            )}
          </div>
          {borrowHistory.length > 0 ? (
            <div className="space-y-2">
              {borrowHistory.slice(0, 5).map(item => (
                <div key={item.personaId} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-base font-bold text-stone-400 flex-shrink-0">
                    {String(item.personaName).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-700 truncate">{item.title}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{item.personaName}</div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-[10px] font-bold text-orange-500">{item.triedCount}回</span>
                    <span className="text-[10px] text-stone-300">{relativeTime(item.lastBorrowedAt)}</span>
                  </div>
                </div>
              ))}
              {borrowHistory.length > 5 && (
                <p className="text-[10px] text-stone-300 text-center pt-1">
                  他 {borrowHistory.length - 5} 件
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-orange-300" />
              </div>
              <p className="text-xs text-stone-400 mb-2">まだルーティンを試していません</p>
              <button
                onClick={() => go('EXPLORE')}
                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Exploreで探す →
              </button>
            </div>
          )}
        </div>

        {/* ── Publish Section ──────────────────────────────────────── */}
        {session && (
          <div className={`rounded-2xl border shadow-sm p-4 ${isPublished ? 'bg-green-50 border-green-100' : 'bg-white border-stone-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {isPublished ? <Globe size={15} className="text-green-600" /> : <Lock size={15} className="text-stone-400" />}
                <h3 className="text-sm font-bold text-stone-700">みんなに公開</h3>
              </div>
              {isPublished && (
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">公開中</span>
              )}
            </div>

            {isPublished ? (
              <div className="space-y-2">
                <p className="text-xs text-stone-500">あなたのルーティンがExploreに掲載されています。</p>
                <button
                  onClick={onUnpublish}
                  className="w-full py-2 text-xs font-bold text-stone-500 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  公開を取り下げる
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-stone-400">
                  {hasRoutine ? 'マイルーティンをみんなに公開してみましょう。' : 'タスクを登録してから公開できます。'}
                </p>
                {hasRoutine && (
                  <>
                    <div className="flex items-center gap-2 bg-white border border-stone-100 rounded-xl px-3 py-2">
                      <Edit2 size={12} className="text-stone-300 flex-shrink-0" />
                      <input
                        type="text"
                        value={publishTitle}
                        onChange={e => setPublishTitle(e.target.value)}
                        placeholder="タイトル（例：早起きエンジニアの朝）"
                        className="flex-1 text-xs text-stone-700 bg-transparent outline-none placeholder:text-stone-300"
                        maxLength={30}
                      />
                    </div>
                    <button
                      onClick={() => onPublish(publishTitle || `${displayName}の一日`)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors"
                    >
                      公開する
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
