"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, Search, Loader2, Heart, ChevronDown, ChevronUp, CalendarDays, MapPin } from 'lucide-react';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
import { generatePersona } from '../lib/aiService';
import { Screen, PersonaTemplate, PersonaCategory, SocialPost } from '../lib/types';
import { timeToMinutes } from '../lib/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useEvents } from '../hooks/useEvents';
import { EVENT_CATEGORY_LABELS } from '../lib/eventService';

// ミニタイムライン: タスクを5am-10pm(1020分)の割合でカラーブロック表示
const MINI_START = 300;  // 5:00
const MINI_RANGE = 1020; // 17h
const typeBarColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};
const typeLabel: Record<string, string> = {
  nature: '自然',
  mind:   '思考',
  work:   '仕事',
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

export const ScreenExplore = ({ go, setSelectedUser, personaTemplates, hasApiKey, preferredCategories = [], lifestyleRhythm, recordBorrow }: ScreenExploreProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { events, loading: eventsLoading } = useEvents();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPersonas, setGeneratedPersonas] = useState<PersonaTemplate[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
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

  const canGenerate = IS_DEMO || hasApiKey;

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setGenerateError(null);
    const result = await generatePersona(prompt.trim());
    if (result.success && result.persona) {
      setGeneratedPersonas((prev) => [result.persona!, ...prev]);
      setPrompt('');
    } else {
      setGenerateError(result.error || '生成に失敗しました');
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

  const categoriesWithFav = useMemo(() => {
    const favCount = sortedTemplates.filter((t) => isFavorite(t.id)).length + generatedPersonas.filter((t) => isFavorite(t.id)).length;
    const base = categories.filter(([key]) => key !== 'all');
    return [
      ['all', 'すべて'] as [string, string],
      ...(favCount > 0 ? [['favorites', `♡ お気に入り (${favCount})`] as [string, string]] : []),
      ...base,
    ];
  }, [categories, sortedTemplates, generatedPersonas, isFavorite]);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      {/* Header */}
      <div className="p-6 pb-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-orange-500" />
          <h2 className="text-2xl font-serif font-bold">Explore</h2>
        </div>
        <p className="text-xs text-stone-400">さまざまなライフスタイルを試してみよう</p>

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
        {filteredTemplates.map((template) => {
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
                    {template.routine.map((task, i) => {
                      const start = timeToMinutes(task.time);
                      const end = task.endTime ? timeToMinutes(task.endTime) : start + 60;
                      const left = Math.max(0, (start - MINI_START) / MINI_RANGE) * 100;
                      const width = Math.min(100 - left, (end - start) / MINI_RANGE * 100);
                      return (
                        <div
                          key={i}
                          className={`absolute top-0 h-full rounded-sm ${typeBarColor[task.type ?? 'work'] ?? 'bg-stone-300'}`}
                          style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Task count */}
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{template.routine.length} タスク</span>
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
                      <div key={i} className="flex gap-3">
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
                    このルーティンを試す →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="text-center text-stone-300 pt-12">
            <p className="text-sm">
              {activeCategory === 'favorites'
                ? 'まだお気に入りがありません。ハートをタップして追加しましょう。'
                : 'このカテゴリにはまだペルソナがありません'}
            </p>
          </div>
        )}

        {/* もっと見るボタン */}
        {canLoadMore && (
          <button
            onClick={() => setDisplayLimit((prev) => prev + 12)}
            className="w-full py-3.5 border border-stone-200 rounded-2xl text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-all"
          >
            もっと見る ({totalCurated! - displayLimit} 件)
          </button>
        )}
        {activeCategory === 'all' && totalCurated !== null && displayLimit >= totalCurated && filteredTemplates.length > 0 && (
          <p className="text-center text-xs text-stone-300 py-2">すべて表示しました</p>
        )}

        {/* 日常を見つけるカード */}
        {(activeCategory === 'all' || activeCategory === 'custom') && (
          <div className="bg-white p-5 rounded-2xl border border-dashed border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-stone-400" />
              <h3 className="text-sm font-bold text-stone-600">まだ出会っていない日常を見つける</h3>
            </div>
            {canGenerate ? (
              <>
                <p className="text-xs text-stone-400">どんな一日を過ごしてみたいですか？</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="例: 早起きして創作に集中する一日"
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
                        <span>探索中</span>
                      </>
                    ) : (
                      '見つける'
                    )}
                  </button>
                </div>
                {generating && (
                  <p className="text-xs text-stone-400 animate-pulse">あなたに合った日常を探しています…</p>
                )}
                {generateError && (
                  <p className="text-xs text-red-500">{generateError}</p>
                )}
              </>
            ) : (
              <div>
                <p className="text-xs text-stone-400 mb-2">この機能を使うにはAPIキーの設定が必要です</p>
                <button
                  onClick={() => go('SETTINGS')}
                  className="text-xs text-green-700 font-bold hover:underline"
                >
                  設定画面で設定する →
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
              <h3 className="text-sm font-bold text-stone-600">今週のイベント</h3>
              <span className="text-[10px] text-stone-300 ml-auto">東京都周辺</span>
            </div>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-stone-300">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">イベントを取得中...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => {
                  const catInfo = EVENT_CATEGORY_LABELS[event.category] ?? EVENT_CATEGORY_LABELS['culture'];
                  return (
                    <div key={event.id} className="bg-white rounded-2xl border border-stone-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 mt-0.5 ${catInfo.bg} ${catInfo.color}`}>
                          {catInfo.label}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-800 leading-snug">{event.title}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[11px] text-stone-400 font-mono">{event.date}</span>
                            <span className="flex items-center gap-0.5 text-[11px] text-stone-400">
                              <MapPin size={10} className="flex-shrink-0" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
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
