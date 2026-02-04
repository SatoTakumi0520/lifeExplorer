"use client";

import React from 'react';
import { ArrowRight, LogIn, Search, Sun } from 'lucide-react';
import { Screen } from '../lib/types';

type ScreenTopProps = {
  go: (screen: Screen) => void;
  session: any;
  setShowAuthModal: (show: boolean) => void;
};

export const ScreenTop = ({ go, session, setShowAuthModal }: ScreenTopProps) => (
  <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800 p-8 justify-between relative overflow-hidden font-sans">
    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-100/40 rounded-full blur-3xl" />
    <div className="absolute top-6 right-6 z-20">
      {session ? (
        <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-stone-100">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-stone-500 font-bold">{session.user.email?.split('@')[0]}</span>
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="text-xs font-bold text-stone-400 hover:text-stone-800 flex items-center gap-1"
        >
          <LogIn size={14} /> Login
        </button>
      )}
    </div>
    <div className="mt-16 z-10">
      <div className="flex items-center gap-2 text-stone-500 mb-6">
        <div className="w-8 h-1 bg-stone-800" />
        <span className="font-bold tracking-widest text-xs uppercase">Life OS</span>
      </div>
      <h1 className="text-5xl font-serif font-bold leading-[1.1] mb-6 text-stone-900">
        Borrow a Life,<br />
        <span className="text-green-700">Try</span>
        <br />New Self.
      </h1>
      <p className="text-stone-500 text-lg leading-relaxed font-light">今日は、ちょっと違う一日を借りてみる。</p>
    </div>
    <div className="flex flex-col gap-4 mb-8 z-10">
      <button
        onClick={() => {
          if (!session) setShowAuthModal(true);
          else go('HOME');
        }}
        className="group flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:border-green-600 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-lg text-stone-600 group-hover:bg-green-100 group-hover:text-green-700">
            <Sun size={24} />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg text-stone-800 group-hover:text-green-800">My Routine</div>
            <div className="text-stone-400 text-xs">自分の日常を実行する</div>
          </div>
        </div>
        <ArrowRight className="text-stone-300 group-hover:text-green-600" />
      </button>
      <button
        onClick={() => go('SOCIAL')}
        className="group flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-stone-200 hover:border-orange-400 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stone-100 rounded-lg text-stone-600 group-hover:bg-orange-100 group-hover:text-orange-700">
            <Search size={24} />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg text-stone-800 group-hover:text-orange-800">Find & Borrow</div>
            <div className="text-stone-400 text-xs">いろんな過ごし方を覗いてみる</div>
          </div>
        </div>
        <ArrowRight className="text-stone-300 group-hover:text-orange-600" />
      </button>
    </div>
  </div>
);
