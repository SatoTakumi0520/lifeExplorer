"use client";

import React, { useState } from 'react';
import { Briefcase, Sparkles, BookOpen, Heart, Smile, Users } from 'lucide-react';
import { RoutineTask, RoutineType } from '../lib/types';

type AddTaskModalProps = {
  onClose: () => void;
  onAdd: (task: RoutineTask) => void;
};

/**
 * 6 カテゴリ MECE:
 *  軸 = その時間で何が起きるか
 *  - 働く (work)    経済義務として外界に出す
 *  - 創る (create)  自発的に外界に出す
 *  - 学ぶ (study)   外から取り込む
 *  - 整える (care)  自分を保つ
 *  - 楽しむ (enjoy) 一人で解放する
 *  - つながる (connect) 他者と共有する
 */
const typeConfig: {
  value: RoutineType;
  label: string;
  icon: typeof Briefcase;
  activeClass: string;
  inactiveClass: string;
}[] = [
  { value: 'work',    label: '働く',     icon: Briefcase, activeClass: 'bg-violet-500 text-white',  inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'create',  label: '創る',     icon: Sparkles,  activeClass: 'bg-orange-500 text-white',  inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'study',   label: '学ぶ',     icon: BookOpen,  activeClass: 'bg-blue-500 text-white',    inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'care',    label: '整える',   icon: Heart,     activeClass: 'bg-green-500 text-white',   inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'enjoy',   label: '楽しむ',   icon: Smile,     activeClass: 'bg-amber-500 text-white',   inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'connect', label: 'つながる', icon: Users,     activeClass: 'bg-rose-500 text-white',    inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
];

const inputClass = 'w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors';

/** 現在時刻を次の30分単位に丸めて HH:mm を返す。例: 14:23 → 14:30 / 14:31 → 15:00 */
function defaultStartTime(): string {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (m < 30) m = 30;
  else { m = 0; h = (h + 1) % 24; }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** HH:mm に1時間を加算する(24時を跨ぐ場合は 0 始まりに戻す) */
function plusOneHour(t: string): string {
  const [h, m] = t.split(':').map(Number);
  return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const AddTaskModal = ({ onClose, onAdd }: AddTaskModalProps) => {
  const initialStart = defaultStartTime();
  const [task, setTask] = useState<RoutineTask>({
    time: initialStart,
    endTime: plusOneHour(initialStart),
    title: '',
    thought: '',
    type: 'work',
  });

  return (
    <div className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        <div className="px-6 pb-10 pt-4">
          <h3 className="font-bold text-lg text-stone-800 mb-5">タスクを追加</h3>

          {/* タイプ選択 (2行×3列) */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {typeConfig.map(({ value, label, icon: Icon, activeClass, inactiveClass }) => (
              <button
                key={value}
                onClick={() => setTask({ ...task, type: value })}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all ${
                  task.type === value ? activeClass : inactiveClass
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* 時間 */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-400 tracking-wide mb-1.5 block">開始</label>
              <input
                type="time"
                value={task.time}
                onChange={(e) => setTask({ ...task, time: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-400 tracking-wide mb-1.5 block">終了</label>
              <input
                type="time"
                value={task.endTime}
                onChange={(e) => setTask({ ...task, endTime: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          {/* タイトル */}
          <div className="mb-4">
            <label className="text-xs font-bold text-stone-400 tracking-wide mb-1.5 block">タイトル</label>
            <input
              type="text"
              placeholder="何をしますか？"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* ノート */}
          <div className="mb-6">
            <label className="text-xs font-bold text-stone-400 tracking-wide mb-1.5 block">メモ</label>
            <textarea
              placeholder="例: 集中したい場所、目的、気持ち"
              value={task.thought}
              onChange={(e) => setTask({ ...task, thought: e.target.value })}
              className={`${inputClass} h-20 resize-none`}
            />
          </div>

          <button
            onClick={() => onAdd(task)}
            disabled={!task.title}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-base hover:bg-stone-700 disabled:opacity-40 transition-all"
          >
            タスクを追加
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-stone-400 text-sm font-medium mt-2 hover:text-stone-600 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
