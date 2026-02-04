"use client";

import React from 'react';
import { Award, Settings, Sprout } from 'lucide-react';
import { Screen } from '../lib/types';

type ScreenProfileProps = {
  go: (screen: Screen) => void;
};

export const ScreenProfile = ({ go }: ScreenProfileProps) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
    <div className="p-6 border-b border-stone-100 bg-white/50">
      <div className="flex justify-end mb-4">
        <button onClick={() => go('SETTINGS')}>
          <Settings size={20} className="text-stone-300 hover:text-stone-600" />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center text-3xl">🌱</div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">My Garden</h2>
          <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">Status: Sprouting</p>
        </div>
      </div>
    </div>
    <div className="p-6 grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
          <Sprout size={20} />
        </div>
        <div className="text-2xl font-bold text-stone-800">12</div>
        <div className="text-[10px] text-stone-400 font-bold uppercase">Days Active</div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
          <Award size={20} />
        </div>
        <div className="text-2xl font-bold text-stone-800">3</div>
        <div className="text-[10px] text-stone-400 font-bold uppercase">Badges</div>
      </div>
    </div>
  </div>
);
