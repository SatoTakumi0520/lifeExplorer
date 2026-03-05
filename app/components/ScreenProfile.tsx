"use client";

import React from 'react';
import { Award, Settings, Sprout } from 'lucide-react';
import { Screen } from '../lib/types';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
};

// 過去35日分のアクティビティ（0=なし, 1=低, 2=中, 3=高）
const activityData = Array.from({ length: 35 }, (_, i) => {
  const seed = (i * 13 + 7) % 7;
  if (seed === 0) return 0;
  if (seed <= 2) return 1;
  if (seed <= 4) return 2;
  return 3;
});
const activityColors = ['bg-stone-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'];
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const ScreenProfile = ({ go }: ScreenProfileProps) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 overflow-y-auto pb-24">
    {/* ヘッダー */}
    <div className="p-6 border-b border-stone-100 bg-white/50">
      <div className="flex justify-end mb-4">
        <button onClick={() => go('SETTINGS')} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
          <Settings size={20} className="text-stone-400 hover:text-stone-600" />
        </button>
      </div>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-stone-100 border border-stone-200 flex items-center justify-center text-3xl shadow-sm">
          🌱
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">My Garden</h2>
          <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Status: Sprouting</p>
        </div>
      </div>
    </div>

    {/* スタッツ */}
    <div className="px-6 py-5 grid grid-cols-2 gap-3">
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-2">
          <Sprout size={20} />
        </div>
        <div className="text-3xl font-bold text-stone-800 leading-none mb-1">12</div>
        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide">Days Active</div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
          <Award size={20} />
        </div>
        <div className="text-3xl font-bold text-stone-800 leading-none mb-1">3</div>
        <div className="text-xs text-stone-400 font-semibold uppercase tracking-wide">Badges</div>
      </div>
    </div>

    {/* アクティビティカレンダー */}
    <div className="px-6 pb-6">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
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
    </div>
  </div>
);
