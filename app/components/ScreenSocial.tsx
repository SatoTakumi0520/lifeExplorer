"use client";

import React, { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { INITIAL_SOCIAL_FEED, SOCIAL_CATEGORIES } from '../lib/mockData';
import { Screen, SocialPost } from '../lib/types';
import { timeToMinutes } from '../lib/utils';

// ミニタイムライン: タスクを5am-10pm(1020分)の割合でカラーブロック表示
const MINI_START = 300;  // 5:00
const MINI_RANGE = 1020; // 17h
const typeBarColor: Record<string, string> = {
  nature: 'bg-amber-400',
  mind:   'bg-blue-400',
  work:   'bg-violet-400',
};

type ScreenSocialProps = {
  go: (screen: Screen) => void;
  setSelectedUser: (user: SocialPost) => void;
  socialFeed: SocialPost[];
};

export const ScreenSocial = ({ go, setSelectedUser, socialFeed }: ScreenSocialProps) => {
  const [activeCategory, setActiveCategory] = useState('Recommended');

  const categoryData: Record<string, SocialPost[]> = useMemo(
    () => ({
      Recommended: [...socialFeed, ...INITIAL_SOCIAL_FEED],
      ...SOCIAL_CATEGORIES,
    }),
    [socialFeed]
  );

  const currentFeed = (categoryData[activeCategory] || []).filter(
    (value, index, array) => array.findIndex((item) => item.id === value.id) === index
  );

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-6 pb-4 bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-stone-100">
        <h2 className="text-2xl font-serif font-bold mb-1">Catalog</h2>
        <p className="text-xs text-stone-400">Discover how others spend their day</p>
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {['Recommended', 'Business', 'Creative', 'Wellness'].map((tag) => (
            <span
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === tag
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {currentFeed.map((post) => (
          <div
            key={post.id}
            onClick={() => {
              setSelectedUser(post);
              go('OTHER_HOME');
            }}
            className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl">
                  {post.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-800">{post.user}</div>
                  <div className="text-xs text-stone-400 uppercase tracking-wider">{post.role}</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-stone-50 rounded-full text-xs text-stone-500 font-bold group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                Try →
              </div>
            </div>
            <h3 className="font-bold text-base text-stone-800 mb-3 leading-snug group-hover:text-green-800 transition-colors">
              {post.title}
            </h3>

            {/* ミニタイムライン */}
            {post.routine && post.routine.length > 0 && (
              <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
                {post.routine.map((task, i) => {
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

            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="text-xs text-stone-400 uppercase tracking-wide">{post.role}</span>
              <span className="text-stone-200">·</span>
              <span className="flex items-center gap-1"><Heart size={11} className="text-pink-400" /> {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
