"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, ExternalLink, Trash2, Clock } from 'lucide-react';
import { RoutineTask, ScheduledEvent, Screen } from '../lib/types';
import { timeToMinutes } from '../lib/utils';

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const typeColor: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  nature: { dot: 'bg-amber-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  mind:   { dot: 'bg-blue-400',  bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700' },
  work:   { dot: 'bg-violet-400', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
};

type ScreenCalendarProps = {
  go: (screen: Screen) => void;
  myRoutineWeekday: RoutineTask[];
  myRoutineWeekend: RoutineTask[];
  scheduledEvents: ScheduledEvent[];
  getTasksForDate: (date: Date) => RoutineTask[];
  getEventDatesForMonth: (year: number, month: number) => Set<string>;
  onRemoveEvent?: (eventId: string) => void;
};

const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const ScreenCalendar = ({
  go,
  myRoutineWeekday,
  myRoutineWeekend,
  scheduledEvents,
  getTasksForDate,
  getEventDatesForMonth,
  onRemoveEvent,
}: ScreenCalendarProps) => {
  const today = new Date();
  const todayKey = toDateKey(today);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey);

  // カレンダーグリッドのセル生成
  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const startDow = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    // 前月の余白
    const prevMonthDays = new Date(viewYear, viewMonth - 1, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = viewMonth - 1 < 1 ? 12 : viewMonth - 1;
      const y = viewMonth - 1 < 1 ? viewYear - 1 : viewYear;
      cells.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false });
    }

    // 当月
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: true });
    }

    // 翌月の余白（6行 = 42セル）
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth + 1 > 12 ? 1 : viewMonth + 1;
      const y = viewMonth + 1 > 12 ? viewYear + 1 : viewYear;
      cells.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const eventDates = useMemo(() => getEventDatesForMonth(viewYear, viewMonth), [getEventDatesForMonth, viewYear, viewMonth]);

  // 選択日のルーティン + イベント
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isPast = selectedDate < todayKey;
    const isToday = selectedDate === todayKey;
    const isFuture = selectedDate > todayKey;

    const routineTasks = isWeekend ? myRoutineWeekend : myRoutineWeekday;
    const eventTasks = getTasksForDate(date);
    const dayEvents = scheduledEvents.filter(e => e.date === selectedDate);

    // ルーティン + イベントを時刻順に結合
    const allTasks = [...routineTasks, ...eventTasks].sort((a, b) => a.time.localeCompare(b.time));

    return { date, dow, isWeekend, isPast, isToday, isFuture, routineTasks, eventTasks, dayEvents, allTasks };
  }, [selectedDate, todayKey, myRoutineWeekday, myRoutineWeekend, getTasksForDate, scheduledEvents]);

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      {/* ヘッダー */}
      <div className="p-5 pb-3 bg-white/80 backdrop-blur border-b border-stone-100">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={18} className="text-green-600" />
          <h2 className="text-xl font-serif font-bold">Calendar</h2>
        </div>

        {/* 月ナビゲーション */}
        <div className="flex items-center justify-between">
          <button onClick={() => goMonth(-1)} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
            <ChevronLeft size={18} className="text-stone-400" />
          </button>
          <button
            onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth() + 1); setSelectedDate(todayKey); }}
            className="text-base font-bold text-stone-800"
          >
            {new Date(viewYear, viewMonth - 1).toLocaleString('en', { month: 'long' })} {viewYear}
          </button>
          <button onClick={() => goMonth(1)} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
            <ChevronRight size={18} className="text-stone-400" />
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mt-2">
          {DOW_LABELS.map((dow, i) => (
            <div key={dow} className={`text-center text-[10px] font-bold py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-stone-400'}`}>
              {dow}
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-px">
          {calendarCells.map((cell, i) => {
            const isSelected = cell.date === selectedDate;
            const isToday = cell.date === todayKey;
            const hasEvent = eventDates.has(cell.date);
            const dow = i % 7;

            return (
              <button
                key={cell.date}
                onClick={() => setSelectedDate(cell.date)}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-all text-sm ${
                  !cell.isCurrentMonth ? 'text-stone-200' :
                  isSelected ? 'bg-stone-800 text-white' :
                  isToday ? 'bg-green-50 text-green-700 font-bold' :
                  dow === 0 ? 'text-red-500' :
                  dow === 6 ? 'text-blue-500' :
                  'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs">{cell.day}</span>
                {hasEvent && cell.isCurrentMonth && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択日の詳細 */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        {selectedDayData && (
          <>
            {/* 日付ラベル */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-800">
                {DOW_LABELS[selectedDayData.dow]}, {selectedDayData.date.toLocaleString('en', { month: 'short' })} {selectedDayData.date.getDate()}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                selectedDayData.isToday ? 'bg-green-100 text-green-700' :
                selectedDayData.isPast ? 'bg-stone-100 text-stone-400' :
                'bg-blue-50 text-blue-600'
              }`}>
                {selectedDayData.isToday ? 'Today' : selectedDayData.isPast ? 'Past' : 'Upcoming'}
              </span>
              <span className="text-[10px] text-stone-300 ml-auto">
                {selectedDayData.isWeekend ? 'Weekend Routine' : 'Weekday Routine'}
              </span>
            </div>

            {/* イベント（あれば） */}
            {selectedDayData.dayEvents.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">Scheduled Events</p>
                {selectedDayData.dayEvents.map(event => (
                  <div key={event.id} className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-800 leading-snug">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                          <span className="font-mono">{event.time}{event.endTime ? ` — ${event.endTime}` : ''}</span>
                          {event.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin size={9} />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {event.url && (
                          <a href={event.url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {onRemoveEvent && (
                          <button onClick={() => onRemoveEvent(event.id)}
                            className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* タイムライン（ルーティン + イベント統合） */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Timeline</p>
              {selectedDayData.allTasks.length === 0 ? (
                <p className="text-xs text-stone-300 py-4 text-center">No routine for this day yet</p>
              ) : (
                selectedDayData.allTasks.map((task, i) => {
                  const colors = typeColor[task.type] ?? typeColor.work;
                  const isEvent = selectedDayData.eventTasks.some(e => e.id === task.id);
                  const duration = task.endTime
                    ? Math.round((timeToMinutes(task.endTime) - timeToMinutes(task.time)))
                    : null;

                  return (
                    <div key={task.id ?? `${task.time}-${task.title}`} className={`flex gap-3 p-3 rounded-xl border ${isEvent ? 'border-orange-200 bg-orange-50/50' : `${colors.border} ${colors.bg}`}`}>
                      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${isEvent ? 'bg-orange-400' : colors.dot}`} />
                        {i < selectedDayData.allTasks.length - 1 && (
                          <div className="w-px flex-1 bg-stone-100 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-stone-400">{task.time}</span>
                          {task.endTime && <span className="text-[10px] text-stone-300">— {task.endTime}</span>}
                          {duration && <span className="text-[10px] text-stone-300">({duration}min)</span>}
                          {isEvent && (
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold ml-auto">Event</span>
                          )}
                        </div>
                        <p className={`text-sm font-bold mt-0.5 ${isEvent ? 'text-orange-800' : 'text-stone-700'}`}>{task.title}</p>
                        {task.thought && <p className="text-[11px] text-stone-400 mt-0.5">{task.thought}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
