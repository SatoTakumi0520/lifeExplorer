"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
import { generatePersona } from '../lib/aiService';
import { Screen, PersonaTemplate, PersonaCategory, SocialPost } from '../lib/types';
import { timeToMinutes } from '../lib/utils';

// ミニタイムライン: タスクを5am-10pm(1020分)の割合でカラーブロック表示
const MINI_START = 300;  // 5:00
const MINI_RANGE = 1020; // 17h
const typeBarColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};

type ScreenExploreProps = {
  go: (screen: Screen) => void;
  setSelectedUser: (user: SocialPost) => void;
  personaTemplates: PersonaTemplate[];
  hasApiKey: boolean;
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

export const ScreenExplore = ({ go, setSelectedUser, personaTemplates, hasApiKey }: ScreenExploreProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPersonas, setGeneratedPersonas] = useState<PersonaTemplate[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);

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

  const DISPLAY_LIMIT = 10;

  const filteredTemplates = useMemo(() => {
    // 生成済みペルソナは常に先頭に表示
    const curated = activeCategory === 'all'
      ? shuffledTemplates.slice(0, DISPLAY_LIMIT)
      : shuffledTemplates.filter((t) => t.category === activeCategory);
    const generated = activeCategory === 'all' || activeCategory === 'custom'
      ? generatedPersonas
      : [];
    return [...generated, ...curated];
  }, [shuffledTemplates, generatedPersonas, activeCategory]);

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
      default: return 'bg-stone-100 text-stone-600';
    }
  };

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
          {categories.map(([key, label]) => (
            <span
              key={key}
              onClick={() => setActiveCategory(key)}
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
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              setSelectedUser(templateToSocialPost(template));
              go('OTHER_HOME');
            }}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
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
              <div className="px-3 py-1 bg-stone-50 rounded-full text-xs text-stone-500 font-bold group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                Try →
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base text-stone-800 mb-3 leading-snug group-hover:text-green-800 transition-colors">
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
              <span>{template.routine.length} tasks</span>
              <span className="text-stone-200">·</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${template.color}`}>
                {template.category ? PERSONA_CATEGORY_LABELS[template.category] : 'Persona'}
              </span>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="text-center text-stone-300 pt-12">
            <p className="text-sm">このカテゴリにはまだペルソナがありません</p>
          </div>
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
                  Settings で設定する →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
