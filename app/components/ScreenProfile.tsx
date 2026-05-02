"use client";

import React, { useMemo, useState } from 'react';
import { Settings, ArrowRight, Users, Globe, Lock, Edit2, CalendarDays, MapPin, ExternalLink, Sparkles, RefreshCw, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { Screen, RoutineTask, ScheduledEvent, PersonaTemplate, SocialPost } from '../lib/types';
import { timeToMinutes } from '../lib/utils';
import { BorrowRecord } from '../hooks/useBorrowHistory';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  session: Session | null;
  borrowHistory: BorrowRecord[];
  upcomingEvents: ScheduledEvent[];
  personaTemplates: PersonaTemplate[];
  onViewRoutine: (user: SocialPost) => void;
  isPublished: boolean;
  onPublish: (title: string) => void;
  onUnpublish: () => void;
};

/* ─── Static constants ─────────────────────────────────────────────── */

const typeConfig = {
  nature: { label: 'Nature', color: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  mind:   { label: 'Mind',   color: 'bg-blue-400',  text: 'text-blue-600',  bg: 'bg-blue-50',  dot: 'bg-blue-400'  },
  work:   { label: 'Work',   color: 'bg-violet-400', text: 'text-violet-600', bg: 'bg-violet-50', dot: 'bg-violet-400' },
} as const;

// ミニタイムラインバー用
const MINI_START = 300;  // 5:00
const MINI_RANGE = 1020; // 17h
const typeBarColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatEventDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  return `${m}/${d} ${dow}`;
}

/* ─── Component ────────────────────────────────────────────────────── */

export const ScreenProfile = ({ go, myRoutine, session, borrowHistory, upcomingEvents, personaTemplates, onViewRoutine, isPublished, onPublish, onUnpublish }: ScreenProfileProps) => {
  const displayName = session?.user?.email?.split('@')[0] ?? 'Explorer';
  const [publishTitle, setPublishTitle] = useState('');
  const [expandedBorrowId, setExpandedBorrowId] = useState<string | number | null>(null);

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

  // personaTemplates を id → template のマップに変換
  const templateMap = useMemo(() => {
    const map = new Map<string | number, PersonaTemplate>();
    personaTemplates.forEach(t => map.set(t.id, t));
    return map;
  }, [personaTemplates]);

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
                  {hasRoutine ? `${myRoutine.length} tasks` : 'Get Started'}
                </span>
                {borrowHistory.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-bold text-orange-600">
                    {borrowHistory.length} tried
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
            <h3 className="text-sm font-bold text-stone-700">My Routine</h3>
            <button
              onClick={() => go('EDIT')}
              className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              Edit <ArrowRight size={12} />
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
                  {myRoutine.length} tasks · Nature {typeBalance.nature}% · Mind {typeBalance.mind}% · Work {typeBalance.work}%
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} className="text-green-400" />
              </div>
              <p className="text-xs text-stone-400 mb-3">ルーティンで理想の1日をデザインしよう</p>
              <button
                onClick={() => go('EDIT')}
                className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
              >
                Add Tasks
              </button>
            </div>
          )}
        </div>

        {/* ── Upcoming Events ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-blue-500" />
              <h3 className="text-sm font-bold text-stone-700">Upcoming Events</h3>
            </div>
            {upcomingEvents.length > 0 && (
              <button
                onClick={() => go('CALENDAR')}
                className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Calendar →
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
                  Show {upcomingEvents.length - 5} more →
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <CalendarDays size={20} className="text-blue-300" />
              </div>
              <p className="text-xs text-stone-400 mb-2">予定されたイベントはありません</p>
              <p className="text-[10px] text-stone-300">Explore からイベントを追加</p>
            </div>
          )}
        </div>

        {/* ── Borrow History ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-orange-500" />
              <h3 className="text-sm font-bold text-stone-700">Tried Routines</h3>
            </div>
            {borrowHistory.length > 0 && (
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                {borrowHistory.reduce((s, r) => s + r.triedCount, 0)} times
              </span>
            )}
          </div>
          {borrowHistory.length > 0 ? (
            <div className="space-y-2">
              {borrowHistory.map(item => {
                const isExpanded = expandedBorrowId === item.personaId;
                const template = templateMap.get(item.personaId);
                const routine = template?.routine ?? [];

                return (
                  <div key={item.personaId} className={`rounded-xl border transition-all ${isExpanded ? 'border-orange-200 bg-orange-50/30' : 'border-transparent bg-stone-50'}`}>
                    {/* カードヘッダー（タップで展開） */}
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer"
                      onClick={() => setExpandedBorrowId(isExpanded ? null : item.personaId)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-base font-bold text-stone-400 flex-shrink-0">
                        {String(item.personaName).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-700 truncate">{item.title}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{item.personaName} · {routine.length} tasks</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-orange-500">{item.triedCount}×</span>
                          <span className="text-[10px] text-stone-300">{relativeTime(item.lastBorrowedAt)}</span>
                        </div>
                        {isExpanded
                          ? <ChevronUp size={14} className="text-stone-300" />
                          : <ChevronDown size={14} className="text-stone-300" />
                        }
                      </div>
                    </div>

                    {/* 展開コンテンツ */}
                    {isExpanded && (
                      <div className="px-3 pb-3">
                        {routine.length > 0 ? (
                          <>
                            {/* ミニタイムラインバー */}
                            <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
                              {routine.map((task) => {
                                const start = timeToMinutes(task.time);
                                const end = task.endTime ? timeToMinutes(task.endTime) : start + 60;
                                const left = Math.max(0, (start - MINI_START) / MINI_RANGE) * 100;
                                const width = Math.min(100 - left, (end - start) / MINI_RANGE * 100);
                                return (
                                  <div
                                    key={`${task.time}-${task.title}`}
                                    className={`absolute top-0 h-full rounded-sm ${typeBarColor[task.type ?? 'work'] ?? 'bg-stone-300'}`}
                                    style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                                  />
                                );
                              })}
                            </div>

                            {/* タスク一覧 */}
                            <div className="space-y-1.5 mb-3">
                              {routine.map((task, i) => {
                                const cfg = typeConfig[task.type] ?? typeConfig.work;
                                return (
                                  <div key={`${task.time}-${task.title}`} className="flex gap-2.5 items-start">
                                    <div className="flex flex-col items-center flex-shrink-0 pt-1">
                                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                      {i < routine.length - 1 && <div className="w-px flex-1 bg-stone-100 mt-0.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0 pb-1.5">
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-[10px] font-mono text-stone-400">{task.time}</span>
                                        {task.endTime && <span className="text-[9px] text-stone-300">— {task.endTime}</span>}
                                      </div>
                                      <p className="text-xs font-bold text-stone-700 leading-snug">{task.title}</p>
                                      {task.thought && <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">{task.thought}</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* アクションボタン */}
                            <button
                              onClick={() => {
                                if (template) {
                                  onViewRoutine({
                                    id: template.id,
                                    user: template.name,
                                    title: template.title,
                                    likes: 0,
                                    avatar: '',
                                    routine: template.routine,
                                  });
                                }
                              }}
                              className="w-full py-2.5 bg-green-700 text-white rounded-xl text-xs font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Eye size={14} />
                              このルーティンを見る →
                            </button>
                          </>
                        ) : (
                          <p className="text-[10px] text-stone-300 text-center py-3">ルーティンデータが見つかりません</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
                Explore で探す →
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
                <h3 className="text-sm font-bold text-stone-700">Share Publicly</h3>
              </div>
              {isPublished && (
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Published</span>
              )}
            </div>

            {isPublished ? (
              <div className="space-y-2">
                <p className="text-xs text-stone-500">あなたのルーティンがExploreに公開されています。</p>
                <button
                  onClick={onUnpublish}
                  className="w-full py-2 text-xs font-bold text-stone-500 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Unpublish
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-stone-400">
                  {hasRoutine ? 'ルーティンをコミュニティに共有しましょう。' : '公開するにはまずタスクを追加してください。'}
                </p>
                {hasRoutine && (
                  <>
                    <div className="flex items-center gap-2 bg-white border border-stone-100 rounded-xl px-3 py-2">
                      <Edit2 size={12} className="text-stone-300 flex-shrink-0" />
                      <input
                        type="text"
                        value={publishTitle}
                        onChange={e => setPublishTitle(e.target.value)}
                        placeholder="タイトル（例：早起きエンジニア）"
                        className="flex-1 text-xs text-stone-700 bg-transparent outline-none placeholder:text-stone-300"
                        maxLength={30}
                      />
                    </div>
                    <button
                      onClick={() => onPublish(publishTitle || `${displayName}'s Day`)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors"
                    >
                      Publish
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
