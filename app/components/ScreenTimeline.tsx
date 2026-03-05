"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Coffee, Edit3, Sun } from 'lucide-react';
import { formatDate, timeToMinutes } from '../lib/utils';
import { RoutineTask, Screen, SocialPost } from '../lib/types';

// タイプ別スタイル定義
const typeLeftBorder: Record<string, string> = {
  nature: 'border-l-amber-400',
  mind:   'border-l-blue-400',
  work:   'border-l-violet-400',
};
const typeIconColor: Record<string, string> = {
  nature: 'text-amber-500',
  mind:   'text-blue-500',
  work:   'text-violet-500',
};

const calculateTaskLayout = (tasks: RoutineTask[]): { lane: number; totalLanes: number }[] => {
  if (tasks.length === 0) return [];
  const n = tasks.length;
  const getEnd = (t: RoutineTask) => {
    const start = timeToMinutes(t.time);
    const end = t.endTime ? timeToMinutes(t.endTime) : start + 60;
    return Math.max(end, start + 1);
  };

  const indices = Array.from({ length: n }, (_, i) => i)
    .sort((a, b) => timeToMinutes(tasks[a].time) - timeToMinutes(tasks[b].time));

  const lane = new Array<number>(n).fill(-1);
  const laneEnd: number[] = [];
  for (const i of indices) {
    const start = timeToMinutes(tasks[i].time);
    let assigned = -1;
    for (let l = 0; l < laneEnd.length; l++) {
      if (laneEnd[l] <= start) { assigned = l; break; }
    }
    if (assigned === -1) { assigned = laneEnd.length; laneEnd.push(0); }
    lane[i] = assigned;
    laneEnd[assigned] = getEnd(tasks[i]);
  }

  const totalLanes = tasks.map((_, i) => {
    const startI = timeToMinutes(tasks[i].time);
    const endI = getEnd(tasks[i]);
    let max = lane[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const startJ = timeToMinutes(tasks[j].time);
      const endJ = getEnd(tasks[j]);
      if (startI < endJ && endI > startJ) max = Math.max(max, lane[j]);
    }
    return max + 1;
  });

  return tasks.map((_, i) => ({ lane: lane[i], totalLanes: totalLanes[i] }));
};

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

  // 現在時刻（今日の場合のみ1分ごとに更新）
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!isToday) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [isToday]);

  const PIXELS_PER_HOUR = 80;
  const TIMELINE_START = 300; // 5:00 AM
  const DEFAULT_END = 1320;   // 10:00 PM
  const latestMinute = routine.length > 0
    ? Math.max(...routine.map(t => timeToMinutes(t.endTime ?? t.time)))
    : DEFAULT_END;
  const containerHeight = (Math.max(latestMinute, DEFAULT_END) - TIMELINE_START + 60) * (PIXELS_PER_HOUR / 60);
  const layouts = calculateTaskLayout(routine);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTimeTop = (currentMinutes - TIMELINE_START) * (PIXELS_PER_HOUR / 60);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-20 border-b border-stone-100">
        <div className="flex items-center justify-between mb-4">
          {isOther ? (
            <button
              onClick={() => go('SOCIAL')}
              className="flex items-center gap-1 text-xs font-bold text-stone-400 tracking-widest uppercase hover:text-stone-800"
            >
              <ChevronLeft size={14} /> BACK
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-stone-400 tracking-widest uppercase">
              Life OS
            </span>
          )}
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
          <div className="relative" style={{ height: `${containerHeight}px` }}>
            {/* タイムライン縦線 */}
            <div className="absolute left-[46px] top-0 bottom-0 w-[1px] bg-stone-200" />

            {/* 現在時刻ライン */}
            {isToday && currentTimeTop > 0 && currentTimeTop < containerHeight && (
              <div
                className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="w-[46px]" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 -ml-1.5 ring-2 ring-white shadow-sm" />
                <div className="flex-1 h-px bg-red-400 opacity-70" />
              </div>
            )}

            {routine.map((item, idx) => {
              const start = timeToMinutes(item.time);
              const top = (start - 300) * (80 / 60);
              if (top < 0) return null;
              const { lane, totalLanes } = layouts[idx];
              const borderClass = typeLeftBorder[item.type ?? 'work'] ?? 'border-l-stone-300';
              const iconClass = typeIconColor[item.type ?? 'work'] ?? 'text-stone-400';
              return (
                <React.Fragment key={item.id ?? idx}>
                  {lane === 0 && (
                    <div
                      className="absolute w-10 text-right text-xs font-mono text-stone-400 pt-1 pointer-events-none"
                      style={{ top: `${top}px`, left: 0 }}
                    >
                      {item.time}
                    </div>
                  )}
                  <div
                    onClick={() => setSelectedTask({ ...item, isOther })}
                    className={`absolute cursor-pointer group px-3 pt-3 pb-2 rounded-xl border border-stone-100 border-l-[3px] shadow-sm bg-white hover:shadow-md hover:border-l-[3px] transition-all ${borderClass}`}
                    style={{
                      top: `${top}px`,
                      left: `calc(56px + ${lane / totalLanes} * (100% - 56px))`,
                      width: `calc((100% - 56px) / ${totalLanes} - ${totalLanes > 1 ? 3 : 0}px)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === 'nature' && <Sun size={12} className={iconClass} />}
                      {item.type === 'mind' && <BookOpen size={12} className={iconClass} />}
                      {item.type === 'work' && <Coffee size={12} className={iconClass} />}
                      <div className="font-bold text-sm text-stone-800 truncate">{item.title}</div>
                    </div>
                    <div className="text-xs text-stone-400 line-clamp-1">{item.thought}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
