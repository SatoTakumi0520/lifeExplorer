"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, Search, Loader2, Heart, ChevronDown, ChevronUp, CalendarDays, MapPin, Users, MessageCircle, Send, Trash2, UserPlus, UserCheck, ExternalLink, CalendarPlus, Check } from 'lucide-react';
import type { PublicRoutine } from '../hooks/usePublicRoutines';
import type { RoutineComment } from '../lib/types';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
import { generatePersona } from '../lib/aiService';
import { Screen, PersonaTemplate, PersonaCategory, SocialPost } from '../lib/types';
import { timeToMinutes } from '../lib/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useEvents } from '../hooks/useEvents';
import { EVENT_CATEGORY_LABELS, type EventItem } from '../lib/eventService';

// ミニタイムライン: タスクを5am-10pm(1020分)の割合でカラーブロック表示
const MINI_START = 300;  // 5:00
const MINI_RANGE = 1020; // 17h
const typeBarColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};
const typeLabel: Record<string, string> = {
  nature: 'Nature',
  mind:   'Mind',
  work:   'Work',
};
const typeDotColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};

type ScreenExploreProps = {
  go: (screen: Screen) => void;
  setSelectedUser: (user: SocialPost) => void;
  personaTemplates: PersonaTemplate[];
  hasApiKey: boolean;
  preferredCategories?: PersonaCategory[];
  lifestyleRhythm?: 'morning' | 'night' | 'balanced' | null;
  recordBorrow?: (persona: { id: string | number; name: string; title: string; category?: string }) => void;
  onScheduleEvent?: (event: import('../lib/eventService').EventItem) => void;
  isEventScheduled?: (title: string, date: string) => boolean;
  prefecture?: string | null;
  publicRoutines?: PublicRoutine[];
  onToggleLike?: (routineId: string) => void;
  // コメント機能
  commentsByRoutine?: Record<string, RoutineComment[]>;
  loadingComments?: string | null;
  postingComment?: string | null;
  onFetchComments?: (routineId: string) => void;
  onPostComment?: (routineId: string, body: string) => void;
  onDeleteComment?: (routineId: string, commentId: string) => void;
  currentUserId?: string;
  // フォロー機能
  isFollowing?: (userId: string) => boolean;
  onToggleFollow?: (userId: string) => void;
};

// PersonaTemplate → SocialPost へ変換（既存のOTHER_HOME画面で表示するため）
const templateToSocialPost = (t: PersonaTemplate): SocialPost => ({
  id: t.id,
  user: t.name,
  role: t.title,
  title: t.title,
  likes: 0,
  avatar: '',
  routine: t.routine,
});

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const ScreenExplore = ({ go, setSelectedUser, personaTemplates, hasApiKey, preferredCategories = [], lifestyleRhythm, recordBorrow, onScheduleEvent, isEventScheduled, prefecture, publicRoutines = [], onToggleLike, commentsByRoutine = {}, loadingComments, postingComment, onFetchComments, onPostComment, onDeleteComment, currentUserId, isFollowing, onToggleFollow }: ScreenExploreProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { events, loading: eventsLoading } = useEvents(prefecture ?? null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [communitySearch, setCommunitySearch] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPersonas, setGeneratedPersonas] = useState<PersonaTemplate[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [displayLimit, setDisplayLimit] = useState(12);

  const { toggle: toggleFavorite, isFavorite } = useFavorites();

  const categories = useMemo(() => Object.entries(PERSONA_CATEGORY_LABELS), []);

  // シャッフル用のシード（マウント時に1回だけ決定、画面を開き直すたびに変わる）
  const shuffleSeed = useRef(Date.now());

  // キュレーション済みをシャッフル（seeded shuffle で安定表示、開き直すと変わる）
  const shuffledTemplates = useMemo(() => {
    const seed = shuffleSeed.current;
    const arr = [...personaTemplates];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(((Math.sin(seed + i) + 1) / 2) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [personaTemplates]);

  // 生活リズムでブーストするカテゴリ
  const boostedCategories = useMemo(() => {
    const cats = new Set(preferredCategories);
    if (lifestyleRhythm === 'morning') cats.add('morning');
    if (lifestyleRhythm === 'night') cats.add('nightowl');
    return cats;
  }, [preferredCategories, lifestyleRhythm]);

  // お気に入りペルソナ（シャッフル前に先頭へ）
  const sortedTemplates = useMemo(() => {
    const favs = shuffledTemplates.filter((t) => isFavorite(t.id));
    const others = shuffledTemplates.filter((t) => !isFavorite(t.id));
    return [...favs, ...others];
  }, [shuffledTemplates, isFavorite]);

  const filteredTemplates = useMemo(() => {
    const generated = activeCategory === 'all' || activeCategory === 'custom'
      ? generatedPersonas
      : [];

    if (activeCategory === 'favorites') {
      const favs = sortedTemplates.filter((t) => isFavorite(t.id));
      return [...generatedPersonas.filter((t) => isFavorite(t.id)), ...favs];
    }

    if (activeCategory !== 'all') {
      const curated = sortedTemplates.filter((t) => t.category === activeCategory);
      return [...generated, ...curated];
    }

    // 「すべて」タブ: 嗜好カテゴリ優先表示 + 表示数制限
    if (boostedCategories.size > 0) {
      const preferred = sortedTemplates.filter((t) => t.category && boostedCategories.has(t.category));
      const others = sortedTemplates.filter((t) => !t.category || !boostedCategories.has(t.category));
      const preferredLimit = Math.ceil(displayLimit * 0.7);
      const othersLimit = displayLimit - Math.min(preferred.length, preferredLimit);
      return [...generated, ...preferred.slice(0, preferredLimit), ...others.slice(0, othersLimit)];
    }

    return [...generated, ...sortedTemplates.slice(0, displayLimit)];
  }, [sortedTemplates, generatedPersonas, activeCategory, boostedCategories, displayLimit, isFavorite]);

  const totalCurated = useMemo(() => {
    if (activeCategory !== 'all') return null;
    return sortedTemplates.length;
  }, [sortedTemplates, activeCategory]);

  const canLoadMore = activeCategory === 'all' && totalCurated !== null && displayLimit < totalCurated;

  // デモモード: モックデータ返却 / 本番: ユーザーがSettings画面で設定したAPIキーをEdge Function経由で使用
  const canGenerate = true;

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setGenerateError(null);
    const result = await generatePersona(prompt.trim());
    if (result.success && result.persona) {
      setGeneratedPersonas((prev) => [result.persona!, ...prev]);
      setPrompt('');
    } else {
      setGenerateError(result.error || 'Generation failed');
    }
    setGenerating(false);
  };

  // カテゴリの初期文字 → アバター色
  const avatarColor = (category?: PersonaCategory) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-700';
      case 'creative': return 'bg-fuchsia-100 text-fuchsia-700';
      case 'wellness': return 'bg-emerald-100 text-emerald-700';
      case 'morning': return 'bg-yellow-100 text-yellow-700';
      case 'minimalist': return 'bg-stone-100 text-stone-700';
      case 'student': return 'bg-violet-100 text-violet-700';
      case 'custom': return 'bg-rose-100 text-rose-700';
      case 'fitness': return 'bg-red-100 text-red-700';
      case 'cooking': return 'bg-amber-100 text-amber-700';
      case 'reading': return 'bg-indigo-100 text-indigo-700';
      case 'nightowl': return 'bg-slate-700 text-slate-100';
      case 'productivity': return 'bg-blue-100 text-blue-700';
      case 'parenting': return 'bg-pink-100 text-pink-700';
      case 'travel': return 'bg-emerald-100 text-emerald-700';
      case 'spiritual': return 'bg-purple-100 text-purple-700';
      case 'digital': return 'bg-cyan-100 text-cyan-700';
      case 'social': return 'bg-orange-100 text-orange-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const followingRoutines = useMemo(() =>
    publicRoutines.filter(r => isFollowing?.(r.userId)),
  [publicRoutines, isFollowing]);

  const filteredCommunityRoutines = useMemo(() => {
    if (!communitySearch.trim()) return publicRoutines;
    const q = communitySearch.toLowerCase();
    return publicRoutines.filter(r =>
      r.displayName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      (r.category && PERSONA_CATEGORY_LABELS[r.category]?.toLowerCase().includes(q))
    );
  }, [publicRoutines, communitySearch]);

  const categoriesWithFav = useMemo(() => {
    const favCount = sortedTemplates.filter((t) => isFavorite(t.id)).length + generatedPersonas.filter((t) => isFavorite(t.id)).length;
    const base = categories.filter(([key]) => key !== 'all');
    return [
      ['all', 'All'] as [string, string],
      ['community', publicRoutines.length > 0 ? `👥 Community (${publicRoutines.length})` : '👥 Community'] as [string, string],
      ...(followingRoutines.length > 0 ? [['following', `🤝 Following (${followingRoutines.length})`] as [string, string]] : []),
      ...(favCount > 0 ? [['favorites', `♡ Favorites (${favCount})`] as [string, string]] : []),
      ...base,
    ];
  }, [categories, sortedTemplates, generatedPersonas, isFavorite, publicRoutines.length, followingRoutines.length]);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      {/* Header */}
      <div className="p-6 pb-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-orange-500" />
          <h2 className="text-2xl font-serif font-bold">Explore</h2>
        </div>
        <p className="text-xs text-stone-400">Discover and try different lifestyles</p>

        {/* Category tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {categoriesWithFav.map(([key, label]) => (
            <span
              key={key}
              onClick={() => { setActiveCategory(key); setDisplayLimit(12); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === key
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Persona cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">

        {/* ── みんなの一日（コミュニティ）/ フォロー中 タブ ─────── */}
        {(activeCategory === 'community' || activeCategory === 'following') && (
          <>
            {/* 検索バー（コミュニティタブのみ） */}
            {activeCategory === 'community' && publicRoutines.length > 0 && (
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
                <input
                  type="text"
                  value={communitySearch}
                  onChange={e => setCommunitySearch(e.target.value)}
                  placeholder="Search users or routines"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            )}

            {(activeCategory === 'community' ? filteredCommunityRoutines : followingRoutines).length === 0 ? (
              <div className="text-center text-stone-300 pt-12">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                {activeCategory === 'following' ? (
                  <>
                    <p className="text-sm">You&apos;re not following anyone yet</p>
                    <p className="text-xs mt-1">Follow people from the Community tab</p>
                  </>
                ) : communitySearch ? (
                  <p className="text-sm">No routines matching &ldquo;{communitySearch}&rdquo;</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-stone-500">No published routines yet</p>
                    <p className="text-xs mt-1 text-stone-400 leading-relaxed">
                      Share your routine and<br />be the first to publish!
                    </p>
                    <button
                      onClick={() => go('PROFILE')}
                      className="mt-4 px-6 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-700 transition-colors"
                    >
                      Publish from Profile →
                    </button>
                  </>
                )}
              </div>
            ) : (
              (activeCategory === 'community' ? filteredCommunityRoutines : followingRoutines).map((r) => {
                const expanded = expandedId === r.id;
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <div className="p-5 cursor-pointer" onClick={() => {
                      const next = expanded ? null : r.id;
                      setExpandedId(next);
                      if (next && onFetchComments) onFetchComments(r.id);
                    }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center text-sm font-bold text-green-700">
                            {r.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-stone-800 truncate">{r.displayName}</span>
                              {r.userId !== currentUserId && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleFollow?.(r.userId); }}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                    isFollowing?.(r.userId)
                                      ? 'bg-green-50 text-green-700 border border-green-200'
                                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                  }`}
                                >
                                  {isFollowing?.(r.userId) ? <UserCheck size={10} /> : <UserPlus size={10} />}
                                  {isFollowing?.(r.userId) ? 'Following' : 'Follow'}
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-stone-400">
                              {r.category ? PERSONA_CATEGORY_LABELS[r.category] ?? r.category : 'Lifestyle'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onToggleLike?.(r.id); }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${r.isLikedByMe ? 'text-red-500 bg-red-50' : 'text-stone-300 hover:text-red-400'}`}
                          >
                            <Heart size={14} fill={r.isLikedByMe ? 'currentColor' : 'none'} />
                            <span className="text-xs font-bold">{r.likesCount}</span>
                          </button>
                          <span className="flex items-center gap-1 text-stone-300">
                            <MessageCircle size={14} />
                            <span className="text-xs font-bold">{(commentsByRoutine[r.id] ?? []).length || ''}</span>
                          </span>
                          {expanded ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                        </div>
                      </div>
                      <h3 className="font-bold text-base text-stone-800 mb-3 leading-snug">{r.title}</h3>
                      {r.routineTasks.length > 0 && (
                        <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
                          {r.routineTasks.map((task) => {
                            const start = timeToMinutes(task.time);
                            const end = task.endTime ? timeToMinutes(task.endTime) : start + 60;
                            const left = Math.max(0, (start - MINI_START) / MINI_RANGE) * 100;
                            const width = Math.min(100 - left, (end - start) / MINI_RANGE * 100);
                            return (
                              <div key={`${task.time}-${task.title}`} className={`absolute top-0 h-full rounded-sm ${typeBarColor[task.type ?? 'work'] ?? 'bg-stone-300'}`}
                                style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }} />
                            );
                          })}
                        </div>
                      )}
                      <div className="text-xs text-stone-400">{r.routineTasks.length} tasks</div>
                    </div>
                    {expanded && (
                      <div className="border-t border-stone-100 px-5 pb-5">
                        <div className="pt-4 space-y-3">
                          {r.routineTasks.map((task, i) => (
                            <div key={`${task.time}-${task.title}`} className="flex gap-3">
                              <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-2 h-2 rounded-full mt-1 ${typeDotColor[task.type ?? 'work'] ?? 'bg-stone-300'}`} />
                                {i < r.routineTasks.length - 1 && <div className="w-px flex-1 bg-stone-100 mt-1" />}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-mono text-stone-400">{task.time}</span>
                                  <span className="text-xs font-bold text-stone-700">{task.title}</span>
                                </div>
                                {task.thought && <p className="text-xs text-stone-400 mt-1 leading-relaxed">{task.thought}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* ── コメントセクション ── */}
                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <div className="flex items-center gap-1.5 mb-3">
                            <MessageCircle size={14} className="text-stone-400" />
                            <span className="text-xs font-bold text-stone-600">Comments</span>
                          </div>

                          {loadingComments === r.id ? (
                            <div className="flex justify-center py-3">
                              <Loader2 size={16} className="animate-spin text-stone-300" />
                            </div>
                          ) : (
                            <>
                              {(commentsByRoutine[r.id] ?? []).length === 0 ? (
                                <p className="text-xs text-stone-300 mb-3">No comments yet</p>
                              ) : (
                                <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto">
                                  {(commentsByRoutine[r.id] ?? []).map(c => (
                                    <div key={c.id} className="flex gap-2 group">
                                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500 flex-shrink-0 mt-0.5">
                                        {c.displayName.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-1.5">
                                          <span className="text-xs font-bold text-stone-700">{c.displayName}</span>
                                          <span className="text-[10px] text-stone-300">
                                            {new Date(c.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                          </span>
                                          {c.userId === currentUserId && (
                                            <button
                                              onClick={() => onDeleteComment?.(r.id, c.id)}
                                              className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all ml-auto"
                                            >
                                              <Trash2 size={11} />
                                            </button>
                                          )}
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed break-words">{c.body}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* コメント入力欄 */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={commentInputs[r.id] ?? ''}
                                  onChange={e => setCommentInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && (commentInputs[r.id] ?? '').trim()) {
                                      onPostComment?.(r.id, commentInputs[r.id]);
                                      setCommentInputs(prev => ({ ...prev, [r.id]: '' }));
                                    }
                                  }}
                                  placeholder="Write a comment..."
                                  maxLength={500}
                                  disabled={postingComment === r.id}
                                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors disabled:opacity-50"
                                />
                                <button
                                  onClick={() => {
                                    if ((commentInputs[r.id] ?? '').trim()) {
                                      onPostComment?.(r.id, commentInputs[r.id]);
                                      setCommentInputs(prev => ({ ...prev, [r.id]: '' }));
                                    }
                                  }}
                                  disabled={!(commentInputs[r.id] ?? '').trim() || postingComment === r.id}
                                  className="p-2 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {postingComment === r.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedUser({ id: r.id, user: r.displayName, title: r.title, likes: r.likesCount, avatar: '', routine: r.routineTasks });
                            go('OTHER_HOME');
                          }}
                          className="w-full mt-4 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors"
                        >
                          Try this routine →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {activeCategory !== 'community' && activeCategory !== 'following' && filteredTemplates.map((template) => {
          const expanded = expandedId === template.id;
          const fav = isFavorite(template.id);
          return (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
            >
              {/* カードヘッダー（タップで展開） */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : template.id)}
              >
                {/* User row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor(template.category)}`}>
                      {template.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-800">{template.name}</div>
                      <div className="text-xs text-stone-400">
                        {template.category ? PERSONA_CATEGORY_LABELS[template.category] : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* お気に入りボタン */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(template.id); }}
                      className={`p-1.5 rounded-full transition-colors ${fav ? 'text-red-500' : 'text-stone-300 hover:text-red-400'}`}
                    >
                      <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                    </button>
                    {/* 展開インジケーター */}
                    {expanded
                      ? <ChevronUp size={16} className="text-stone-400" />
                      : <ChevronDown size={16} className="text-stone-400" />
                    }
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-stone-800 mb-3 leading-snug">
                  {template.title}
                </h3>

                {/* Mini timeline */}
                {template.routine && template.routine.length > 0 && (
                  <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
                    {template.routine.map((task) => {
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
                )}

                {/* Task count */}
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{template.routine.length} tasks</span>
                  <span className="text-stone-200">·</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${template.color}`}>
                    {template.category ? PERSONA_CATEGORY_LABELS[template.category] : 'Persona'}
                  </span>
                </div>
              </div>

              {/* 展開コンテンツ */}
              {expanded && (
                <div className="border-t border-stone-100 px-5 pb-5">
                  <div className="pt-4 space-y-3">
                    {template.routine.map((task, i) => (
                      <div key={`${task.time}-${task.title}`} className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-1 ${typeDotColor[task.type ?? 'work'] ?? 'bg-stone-300'}`} />
                          {i < template.routine.length - 1 && (
                            <div className="w-px flex-1 bg-stone-100 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-mono text-stone-400">{task.time}</span>
                            <span className="text-xs font-bold text-stone-700">{task.title}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0 ${
                              task.type === 'nature' ? 'bg-amber-50 text-amber-600' :
                              task.type === 'mind' ? 'bg-blue-50 text-blue-600' :
                              'bg-violet-50 text-violet-600'
                            }`}>
                              {typeLabel[task.type ?? 'work']}
                            </span>
                          </div>
                          {task.thought && (
                            <p className="text-xs text-stone-400 mt-1 leading-relaxed">{task.thought}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 試すボタン */}
                  <button
                    onClick={() => {
                      recordBorrow?.({ id: template.id, name: template.name, title: template.title, category: template.category });
                      setSelectedUser(templateToSocialPost(template));
                      go('OTHER_HOME');
                    }}
                    className="w-full mt-4 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors"
                  >
                    Try this routine →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {activeCategory !== 'community' && activeCategory !== 'following' && filteredTemplates.length === 0 && (
          <div className="text-center text-stone-300 pt-12">
            <p className="text-sm">
              {activeCategory === 'favorites'
                ? 'No favorites yet. Tap the heart to add some.'
                : 'No personas in this category yet'}
            </p>
          </div>
        )}

        {/* もっと見るボタン */}
        {canLoadMore && (
          <button
            onClick={() => setDisplayLimit((prev) => prev + 12)}
            className="w-full py-3.5 border border-stone-200 rounded-2xl text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-all"
          >
            Show more ({totalCurated! - displayLimit})
          </button>
        )}
        {activeCategory === 'all' && totalCurated !== null && displayLimit >= totalCurated && filteredTemplates.length > 0 && (
          <p className="text-center text-xs text-stone-300 py-2">All personas shown</p>
        )}

        {/* 日常を見つけるカード */}
        {(activeCategory === 'all' || activeCategory === 'custom') && (
          <div className="bg-white p-5 rounded-2xl border border-dashed border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-stone-400" />
              <h3 className="text-sm font-bold text-stone-600">Discover a new lifestyle</h3>
            </div>
            {canGenerate ? (
              <>
                <p className="text-xs text-stone-400">What kind of day would you like to try?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="e.g. A day focused on early morning creativity"
                    disabled={generating}
                    className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generating}
                    className="px-4 py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                  >
                    {generating ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Searching</span>
                      </>
                    ) : (
                      'Discover'
                    )}
                  </button>
                </div>
                {generating && (
                  <p className="text-xs text-stone-400 animate-pulse">Finding a lifestyle that fits you…</p>
                )}
                {generateError && (
                  <p className="text-xs text-red-500">{generateError}</p>
                )}
              </>
            ) : (
              <div>
                <p className="text-xs text-stone-400 mb-2">An API key is required to use this feature</p>
                <button
                  onClick={() => go('SETTINGS')}
                  className="text-xs text-green-700 font-bold hover:underline"
                >
                  Configure in Settings →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 今週のイベント ──────────────────────────────────────── */}
        {activeCategory === 'all' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <CalendarDays size={14} className="text-stone-400" />
              <h3 className="text-sm font-bold text-stone-600">This Week&apos;s Events</h3>
              {events.some((e: EventItem) => e.source === 'doorkeeper') && (
                <span className="text-[9px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">LIVE</span>
              )}
              <span className="text-[10px] text-stone-300 ml-auto">
                {prefecture ? `Near ${prefecture} · Online` : 'All regions · Online'}
              </span>
            </div>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-stone-300">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Loading events...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => {
                  const catInfo = EVENT_CATEGORY_LABELS[event.category] ?? EVENT_CATEGORY_LABELS['culture'];
                  const isExpanded = expandedEventId === event.id;
                  return (
                    <div key={event.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                      {/* ヘッダー（タップで展開） */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${catInfo.bg} ${catInfo.color}`}>
                              {catInfo.label}
                            </div>
                            {event.isOnline ? (
                              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">Online</div>
                            ) : prefecture && event.prefecture === prefecture ? (
                              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">Nearby</div>
                            ) : (
                              <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-50 text-stone-400">{event.prefecture}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-800 leading-snug">{event.title}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
                              <span className="text-[11px] text-stone-400 font-mono">{event.date}{event.time ? ` ${event.time}〜` : ''}</span>
                              {event.duration && <span className="text-[11px] text-stone-300">{event.duration}</span>}
                              <span className="flex items-center gap-0.5 text-[11px] text-stone-400">
                                <MapPin size={10} className="flex-shrink-0" />
                                {event.location}
                              </span>
                              {event.price && (
                                <span className={`text-[11px] font-bold ${event.price === '無料' || event.price === 'Free' ? 'text-green-600' : 'text-stone-500'}`}>
                                  {event.price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-stone-300 ml-1">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* 展開エリア */}
                      {isExpanded && (
                        <div className="border-t border-stone-100 px-4 pb-4 pt-3 space-y-3">
                          {event.description && (
                            <p className="text-xs text-stone-500 leading-relaxed">{event.description}</p>
                          )}
                          <div className="flex gap-2">
                            {(() => {
                              const dateKey = event.startsAt ? event.startsAt.slice(0, 10) : '';
                              const alreadyScheduled = dateKey && isEventScheduled?.(event.title, dateKey);
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!alreadyScheduled && onScheduleEvent) onScheduleEvent(event);
                                  }}
                                  disabled={!!alreadyScheduled}
                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                                    alreadyScheduled
                                      ? 'bg-green-50 text-green-600 border border-green-200'
                                      : 'bg-stone-900 text-white hover:bg-stone-700'
                                  }`}
                                >
                                  {alreadyScheduled ? <><Check size={16} />Scheduled</> : <><CalendarPlus size={16} />Add to Schedule</>}
                                </button>
                              );
                            })()}
                            {event.url && (
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-bold whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={14} />
                                Details
                              </a>
                            )}
                          </div>
                          {event.source === 'doorkeeper' && (
                            <p className="text-[9px] text-stone-300 text-right mt-1">powered by Doorkeeper</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
