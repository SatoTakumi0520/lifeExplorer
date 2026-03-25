"use client";

import React, { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PERSONA_CATEGORY_LABELS } from '../lib/mockData';
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

export const ScreenExplore = ({ go, setSelectedUser, personaTemplates }: ScreenExploreProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => Object.entries(PERSONA_CATEGORY_LABELS), []);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return personaTemplates;
    return personaTemplates.filter((t) => t.category === activeCategory);
  }, [personaTemplates, activeCategory]);

  // カテゴリの初期文字 → アバター色
  const avatarColor = (category?: PersonaCategory) => {
    switch (category) {
      case 'business': return 'bg-blue-100 text-blue-700';
      case 'creative': return 'bg-fuchsia-100 text-fuchsia-700';
      case 'wellness': return 'bg-emerald-100 text-emerald-700';
      case 'morning': return 'bg-yellow-100 text-yellow-700';
      case 'minimalist': return 'bg-stone-100 text-stone-700';
      case 'student': return 'bg-violet-100 text-violet-700';
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
      </div>
    </div>
  );
};
