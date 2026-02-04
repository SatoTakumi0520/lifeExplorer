"use client";

import React, { useMemo, useState } from 'react';
import { Sun } from 'lucide-react';
import { INITIAL_SOCIAL_FEED } from '../lib/mockData';
import { Screen, SocialPost } from '../lib/types';

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
      Business: [
        {
          id: 101,
          user: 'Takeshi M.',
          role: 'CEO',
          title: '経営者の朝5時起床ルーティン',
          likes: 312,
          avatar: '💼',
          routine: [
            { time: '05:00', title: 'News Check', thought: '日経新聞とWSJ...', type: 'work' },
            { time: '06:00', title: 'Strategic Planning', thought: '戦略を練る...', type: 'work' },
          ],
        },
        { id: 102, user: 'Yuki T.', role: 'Consultant', title: '週7MTGを乗り切る集中術', likes: 189, avatar: '📊', routine: [] },
      ],
      Creative: [
        { id: 201, user: 'Sakura N.', role: 'Illustrator', title: 'アイデアが湧く散歩', likes: 428, avatar: '🎨', routine: [] },
      ],
      Wellness: [{ id: 301, user: 'Mika S.', role: 'Yoga Teacher', title: '心身を整える朝', likes: 521, avatar: '🧘', routine: [] }],
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
        <p className="text-xs text-stone-400">みんなの過ごし方を見てみよう</p>
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
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">{post.role}</div>
                </div>
              </div>
              <div className="px-3 py-1 bg-stone-50 rounded-full text-xs text-stone-500 font-mono group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                Try
              </div>
            </div>
            <h3 className="font-bold text-lg text-stone-800 mb-2 leading-tight group-hover:text-green-800 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Sun size={12} /> 朝型
              </span>
              <span className="flex items-center gap-1">⏱ {post.routine?.length || 3}h</span>
              <span className="flex items-center gap-1 text-pink-400">♥ {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
