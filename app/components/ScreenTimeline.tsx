"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Briefcase, ChevronLeft, Coffee, Edit3, Palmtree, Sun } from 'lucide-react';
import { formatDate, timeToMinutes } from '../lib/utils';
import { RoutineTask, ScheduleType, Screen, SocialPost } from '../lib/types';

/* ─── タイプ別スタイル ────────────────────────────────────────────── */
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
const typeBg: Record<string, string> = {
  nature: 'bg-amber-50/60',
  mind:   'bg-blue-50/60',
  work:   'bg-violet-50/60',
};

/* ─── レイアウト計算（重なりレーン） ─────────────────────────────── */
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

/* ─── 時間ラベル生成 ─────────────────────────────────────────────── */
const PIXELS_PER_HOUR = 80;
const TIMELINE_START  = 300;  // 5:00 AM
const TIMELINE_END    = 1320; // 10:00 PM

const hourMarkers = Array.from({ length: 18 }, (_, i) => {
  const hour = 5 + i;
  const top  = (hour * 60 - TIMELINE_START) * (PIXELS_PER_HOUR / 60);
  const h12  = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
  const suffix = hour === 5 ? 'am' : hour === 12 ? 'pm' : hour === 13 ? 'pm' : '';
  const label  = `${h12}${suffix}`;
  const isMajor = hour % 3 === 0;
  return { hour, top, label, isMajor };
});

/* ─── 時間帯ゾーン背景 ───────────────────────────────────────────── */
const timeZones = [
  { from: 300,  to: 720,  gradient: 'from-amber-50/30 to-amber-50/10' },   // 朝 5–12
  { from: 720,  to: 1080, gradient: 'from-sky-50/20 to-sky-50/10' },        // 午後 12–18
  { from: 1080, to: 1320, gradient: 'from-violet-50/20 to-violet-50/5' },   // 夜 18–22
];

/* ─── 所要時間フォーマット ───────────────────────────────────────── */
const formatDuration = (minutes: number) => {
  if (minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

/* ─── Props ──────────────────────────────────────────────────────── */
type ScreenTimelineProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  scheduleType: ScheduleType;
  onToggleSchedule: () => void;
  isOther?: boolean;
  selectedUser?: SocialPost | null;
  setSelectedTask: (task: RoutineTask | null) => void;
  setBorrowingUser?: (user: SocialPost | null) => void;
  loadingRoutine?: boolean;
};

/* ─── Component ──────────────────────────────────────────────────── */
export const ScreenTimeline = ({
  go,
  myRoutine,
  scheduleType,
  onToggleSchedule,
  isOther = false,
  selectedUser,
  setSelectedTask,
  setBorrowingUser,
  loadingRoutine,
}: ScreenTimelineProps) => {
  const today    = new Date();
  const dayInfo  = formatDate(today);
  const isToday  = true;
  const routine  = isOther && selectedUser ? selectedUser.routine : myRoutine;

  /* 現在時刻（今日のみ1分更新） */
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!isToday) return;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [isToday]);

  const latestMinute   = routine.length > 0
    ? Math.max(...routine.map(t => timeToMinutes(t.endTime ?? t.time)))
    : TIMELINE_END;
  const containerHeight = (Math.max(latestMinute, TIMELINE_END) - TIMELINE_START + 60) * (PIXELS_PER_HOUR / 60);
  const layouts        = calculateTaskLayout(routine);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTimeTop = (currentMinutes - TIMELINE_START) * (PIXELS_PER_HOUR / 60);

  /* ヘッダー統計 */
  const totalTasks = routine.length;
  const totalMin   = routine.reduce((acc, t) => {
    const end = t.endTime ? timeToMinutes(t.endTime) : timeToMinutes(t.time) + 60;
    return acc + Math.max(end - timeToMinutes(t.time), 0);
  }, 0);
  const statsText = totalTasks > 0
    ? `${totalTasks} tasks · ${formatDuration(totalMin)}`
    : null;

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">

      {/* ── ヘッダー ── */}
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-[#FDFCF8]/95 backdrop-blur z-20 border-b border-stone-100">
        {/* 上段：ロゴ / 編集ボタン */}
        <div className="flex items-center justify-between mb-3">
          {isOther ? (
            <button
              onClick={() => go('EXPLORE')}
              className="flex items-center gap-1 text-xs font-bold text-stone-400 tracking-widest uppercase hover:text-stone-800"
            >
              <ChevronLeft size={14} /> Back
            </button>
          ) : (
            <span className="text-xs font-bold text-stone-300 tracking-[0.18em] uppercase select-none">
              Life Explorer
            </span>
          )}
          {!isOther && (
            <button
              onClick={() => go('EDIT')}
              className="p-2 bg-white rounded-full border border-stone-200 text-stone-500 hover:text-green-700 shadow-sm transition-colors"
            >
              <Edit3 size={16} />
            </button>
          )}
          {isOther && (
            <button
              onClick={() => {
                if (setBorrowingUser) setBorrowingUser(selectedUser ?? null);
                go('BORROW');
              }}
              className="px-4 py-1.5 bg-green-700 text-white rounded-full text-xs font-bold shadow-md"
            >
              Borrow
            </button>
          )}
        </div>

        {/* 下段：日付 + 平日/休日トグル */}
        <div className="flex flex-col items-center gap-2">
          {isOther && selectedUser ? (
            <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span className="text-xl">{selectedUser.avatar}</span>
              {selectedUser.user.split(' ')[0]}&apos;s Day
            </h2>
          ) : (
            <>
              {/* 日付表示 */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  {dayInfo.dow}, {dayInfo.month} {dayInfo.day}
                </h2>
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              </div>

              {/* 平日/休日トグル */}
              <div className="flex items-center bg-stone-100 rounded-full p-0.5">
                <button
                  onClick={() => scheduleType !== 'weekday' && onToggleSchedule()}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    scheduleType === 'weekday'
                      ? 'bg-white text-stone-800 shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Briefcase size={12} />
                  Weekday
                </button>
                <button
                  onClick={() => scheduleType !== 'weekend' && onToggleSchedule()}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    scheduleType === 'weekend'
                      ? 'bg-white text-stone-800 shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Palmtree size={12} />
                  Weekend
                </button>
              </div>

              {/* 統計 */}
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-stone-400">
                  {loadingRoutine ? 'Syncing…' : scheduleType === 'weekday' ? 'Weekday Routine' : 'Weekend Routine'}
                </p>
                {statsText && !loadingRoutine && (
                  <>
                    <span className="text-stone-200 text-xs">·</span>
                    <p className="text-xs text-stone-300">{statsText}</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── タイムライン本体 ── */}
      <div className="flex-1 overflow-y-auto pb-24 relative">
        {/* 上部フェード */}
        <div className="sticky top-0 h-3 bg-gradient-to-b from-[#FDFCF8] to-transparent z-10 pointer-events-none" />

        <div className="px-4 pt-1 pb-4">
          <div className="relative" style={{ height: `${containerHeight}px` }}>

            {/* ── 時間帯ゾーン背景 ── */}
            {timeZones.map(({ from, to, gradient }) => {
              const zTop = (from - TIMELINE_START) * (PIXELS_PER_HOUR / 60);
              const zH   = (to - from) * (PIXELS_PER_HOUR / 60);
              return (
                <div
                  key={from}
                  className={`absolute left-[47px] right-0 bg-gradient-to-b ${gradient} pointer-events-none rounded-r-lg`}
                  style={{ top: `${zTop}px`, height: `${zH}px` }}
                />
              );
            })}

            {/* ── 時間グリッド ── */}
            {hourMarkers.map(({ hour, top, label, isMajor }) => (
              <div
                key={hour}
                className="absolute left-0 right-0 flex items-center pointer-events-none"
                style={{ top: `${top}px` }}
              >
                <div className="w-[46px] text-right pr-2.5 select-none">
                  <span className="text-[10px] font-mono text-stone-300 leading-none">{label}</span>
                </div>
                <div className={`flex-1 h-px ${isMajor ? 'bg-stone-200' : 'bg-stone-100'}`} />
              </div>
            ))}

            {/* ── 現在時刻ライン ── */}
            {isToday && currentTimeTop > 0 && currentTimeTop < containerHeight && (
              <div
                className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                style={{ top: `${currentTimeTop}px` }}
              >
                <div className="w-[46px]" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 -ml-1.5 ring-2 ring-[#FDFCF8] shadow-sm" />
                <div className="flex-1 h-px bg-red-400 opacity-80" />
              </div>
            )}

            {/* ── タスクカード ── */}
            {routine.map((item, idx) => {
              const start = timeToMinutes(item.time);
              const top   = (start - TIMELINE_START) * (PIXELS_PER_HOUR / 60);
              if (top < 0) return null;

              const endMin    = item.endTime ? timeToMinutes(item.endTime) : start + 60;
              const durationM = endMin - start;
              const heightPx  = Math.max(durationM * (PIXELS_PER_HOUR / 60) - 4, 44);
              const duration  = formatDuration(durationM);

              const { lane, totalLanes } = layouts[idx];
              const borderClass = typeLeftBorder[item.type ?? 'work'] ?? 'border-l-stone-300';
              const iconClass   = typeIconColor[item.type ?? 'work'] ?? 'text-stone-400';
              const bgClass     = typeBg[item.type ?? 'work'] ?? '';

              // 正時はグリッドラベルが担当。非正時のみタスク用ラベルを表示
              const [tH, tM] = item.time.split(':').map(Number);
              const taskLabel = (lane === 0 && tM !== 0)
                ? `${tH > 12 ? tH - 12 : tH}:${String(tM).padStart(2, '0')}`
                : null;

              return (
                <React.Fragment key={item.id ?? `${item.time}-${item.title}`}>
                  {taskLabel && (
                    <div
                      className="absolute w-10 text-right pointer-events-none"
                      style={{ top: `${top + 2}px`, left: 0 }}
                    >
                      <span className="text-[10px] font-mono text-stone-400 leading-none">{taskLabel}</span>
                    </div>
                  )}
                  <div
                    onClick={() => setSelectedTask({ ...item, isOther })}
                    className={`absolute cursor-pointer overflow-hidden rounded-xl border border-stone-100/80 border-l-[3px] shadow-sm hover:shadow-md transition-all ${borderClass} ${bgClass}`}
                    style={{
                      top:    `${top}px`,
                      height: `${heightPx}px`,
                      left:   `calc(56px + ${lane / totalLanes} * (100% - 56px))`,
                      width:  `calc((100% - 56px) / ${totalLanes} - ${totalLanes > 1 ? 4 : 0}px)`,
                    }}
                  >
                    <div className="px-3 pt-2.5 pb-2 h-full flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1 min-w-0">
                        {item.type === 'nature' && <Sun      size={11} className={`${iconClass} flex-shrink-0`} />}
                        {item.type === 'mind'   && <BookOpen size={11} className={`${iconClass} flex-shrink-0`} />}
                        {item.type === 'work'   && <Coffee   size={11} className={`${iconClass} flex-shrink-0`} />}
                        <span className="font-bold text-sm text-stone-800 truncate leading-tight">{item.title}</span>
                      </div>
                      {heightPx >= 58 && item.thought && (
                        <p className="text-xs text-stone-400 line-clamp-1 flex-1 leading-snug">{item.thought}</p>
                      )}
                      {heightPx >= 52 && duration && (
                        <span className="text-[10px] font-mono text-stone-300 mt-auto pt-1 leading-none">{duration}</span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* ── 空の状態（9AM付近に固定表示） ── */}
            {routine.length === 0 && (
              <div
                className="absolute left-[56px] right-0 flex flex-col items-center gap-3 pointer-events-none"
                style={{ top: `${(9 * 60 - TIMELINE_START) * (PIXELS_PER_HOUR / 60)}px` }}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/90 border border-stone-100 rounded-2xl shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <Edit3 size={12} className="text-stone-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500">タスクがまだありません</p>
                    <p className="text-[10px] text-stone-300">✎ をタップして1日をデザインしよう</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
