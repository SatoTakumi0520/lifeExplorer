"use client";

import React from 'react';
import { Calendar, Search, User } from 'lucide-react';
import { Screen } from '../lib/types';

type BottomNavProps = {
  go: (screen: Screen) => void;
  currentScreen: Screen;
};

export const BottomNav = ({ go, currentScreen }: BottomNavProps) => (
  <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur border-t border-stone-200 flex justify-around p-2 pb-6 z-30">
    <button
      onClick={() => go('HOME')}
      className={`flex flex-col items-center w-16 ${['HOME', 'OTHER_HOME'].includes(currentScreen) ? 'text-green-700' : 'text-stone-400'}`}
    >
      <Calendar size={22} />
      <span className="text-[10px] font-bold">Home</span>
    </button>
    <button onClick={() => go('SOCIAL')} className={`flex flex-col items-center w-16 ${currentScreen === 'SOCIAL' ? 'text-orange-600' : 'text-stone-400'}`}>
      <Search size={22} />
      <span className="text-[10px] font-bold">Search</span>
    </button>
    <button onClick={() => go('PROFILE')} className={`flex flex-col items-center w-16 ${currentScreen === 'PROFILE' ? 'text-stone-800' : 'text-stone-400'}`}>
      <User size={22} />
      <span className="text-[10px] font-bold">Me</span>
    </button>
  </div>
);
