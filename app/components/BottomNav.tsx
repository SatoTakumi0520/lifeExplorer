"use client";

import React from 'react';
import { Calendar, Sparkles, User } from 'lucide-react';
import { Screen } from '../lib/types';

type BottomNavProps = {
  go: (screen: Screen) => void;
  currentScreen: Screen;
};

const tabs = [
  { screen: 'HOME' as Screen, icon: Calendar, activeScreens: ['HOME', 'OTHER_HOME'], activeClass: 'bg-green-50 text-green-700' },
  { screen: 'SOCIAL' as Screen, icon: Sparkles, activeScreens: ['SOCIAL'], activeClass: 'bg-orange-50 text-orange-600' },
  { screen: 'PROFILE' as Screen, icon: User, activeScreens: ['PROFILE', 'SETTINGS'], activeClass: 'bg-stone-100 text-stone-800' },
];

export const BottomNav = ({ go, currentScreen }: BottomNavProps) => (
  <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-7 z-30 pointer-events-none">
    <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-lg shadow-stone-300/30 px-2 py-2 flex gap-1 pointer-events-auto">
      {tabs.map(({ screen, icon: Icon, activeScreens, activeClass }) => {
        const isActive = activeScreens.includes(currentScreen);
        return (
          <button
            key={screen}
            onClick={() => go(screen)}
            className={`flex items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
              isActive ? activeClass : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'
            }`}
          >
            <Icon size={22} />
          </button>
        );
      })}
    </div>
  </div>
);
