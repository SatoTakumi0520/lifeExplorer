"use client";

import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Coffee, Edit3, Sun } from 'lucide-react';
import { formatDate, timeToMinutes } from '../lib/utils';
import { RoutineTask, Screen, SocialPost } from '../lib/types';

type ScreenTimelineProps = {
  go: (screen: Screen) => void;
  targetDate: Date;
  shiftDate: (days: number) => void;
  myRoutine: RoutineTask[];
  isOther?: boolean;
  selectedUser?: SocialPost | null;
  setSelectedTask: (task: RoutineTask | null) => void;
  setBorrowingUser?: (user: SocialPost | null) => void;
  loadingRoutine?: boolean;
};

export const ScreenTimeline = ({
  go,
  targetDate,
  shiftDate,
  myRoutine,
  isOther = false,
  selectedUser,
  setSelectedTask,
  setBorrowingUser,
  loadingRoutine,
}: ScreenTimelineProps) => {
  const dayInfo = formatDate(targetDate);
  const isToday = new Date().toDateString() === targetDate.toDateString();
  const routine = isOther && selectedUser ? selectedUser.routine : myRoutine;

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-20 border-b border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (isOther ? go('SOCIAL') : go('TOP'))}
            className="flex items-center gap-1 text-xs font-bold text-stone-400 tracking-widest uppercase hover:text-stone-800"
          >
            {isOther && <ChevronLeft size={14} />} {isOther ? 'BACK' : 'Life OS'}
          </button>
          {!isOther && (
            <button onClick={() => go('EDIT')} className="p-2 bg-white rounded-full border border-stone-200 text-stone-600 hover:text-green-700 shadow-sm">
              <Edit3 size={18} />
            </button>
          )}
          {isOther && (
            <button
              onClick={() => {
                if (setBorrowingUser) setBorrowingUser(selectedUser ?? null);
                go('BORROW');
              }}
              className="px-4 py-1.5 bg-green-700 text-white rounded-full text-xs font-bold shadow-lg"
            >
              Borrow
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => shiftDate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
              {isOther && selectedUser ? (
                <>
                  <span className="text-2xl">{selectedUser.avatar}</span> {selectedUser.user.split(' ')[0]}'s Day
                </>
              ) : (
                <>
                  {dayInfo.dow}, {dayInfo.month} {dayInfo.day} {isToday && <span className="w-2 h-2 rounded-full bg-green-500" />}
                </>
              )}
            </h2>
            {!isOther && <p className="text-xs text-stone-400">{loadingRoutine ? 'Syncing...' : 'My Ideal Day'}</p>}
          </div>
          <button onClick={() => shiftDate(1)} className="p-2 hover:bg-stone-100 rounded-full">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 relative">
        {routine.length === 0 ? (
          <div className="text-center py-8 text-stone-300 text-xs">No tasks yet</div>
        ) : (
          <div className="relative" style={{ height: '1200px' }}>
            <div className="absolute left-[46px] top-0 bottom-0 w-[1px] bg-stone-200" />
            {routine.map((item, idx) => {
              const start = timeToMinutes(item.time);
              const top = (start - 300) * (80 / 60);
              if (top < 0) return null;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTask({ ...item, isOther })}
                  className="absolute left-0 right-0 flex gap-4 cursor-pointer group"
                  style={{ top: `${top}px` }}
                >
                  <div className="w-10 text-right text-xs font-mono text-stone-400 pt-1">{item.time}</div>
                  <div className="flex-1 p-3 rounded-xl border shadow-sm bg-white border-stone-100 hover:border-green-300 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === 'nature' && <Sun size={12} className="text-orange-400" />}
                      {item.type === 'mind' && <BookOpen size={12} className="text-blue-400" />}
                      {item.type === 'work' && <Coffee size={12} className="text-stone-500" />}
                      <div className="font-bold text-sm text-stone-800">{item.title}</div>
                    </div>
                    <div className="text-[10px] text-stone-400 line-clamp-1">{item.thought}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
