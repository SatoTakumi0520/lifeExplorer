"use client";

import React, { useState } from 'react';
import { BookOpen, Coffee, Sun } from 'lucide-react';
import { RoutineTask } from '../lib/types';

type AddTaskModalProps = {
  onClose: () => void;
  onAdd: (task: RoutineTask) => void;
};

const typeConfig = [
  { value: 'nature' as const, label: 'Nature', icon: Sun,      activeClass: 'bg-amber-500 text-white',  inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'mind'   as const, label: 'Mind',   icon: BookOpen, activeClass: 'bg-blue-500 text-white',   inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
  { value: 'work'   as const, label: 'Work',   icon: Coffee,   activeClass: 'bg-violet-500 text-white', inactiveClass: 'bg-stone-50 text-stone-500 hover:bg-stone-100' },
];

const inputClass = 'w-full p-3 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-stone-400 transition-colors';

export const AddTaskModal = ({ onClose, onAdd }: AddTaskModalProps) => {
  const [task, setTask] = useState<RoutineTask>({
    time: '12:00',
    endTime: '13:00',
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
          <h3 className="font-bold text-lg text-stone-800 mb-5">Add Task</h3>

          {/* タイプ選択 */}
          <div className="flex gap-2 mb-5">
            {typeConfig.map(({ value, label, icon: Icon, activeClass, inactiveClass }) => (
              <button
                key={value}
                onClick={() => setTask({ ...task, type: value })}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl font-bold text-xs transition-all ${
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
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1.5 block">Start</label>
              <input
                type="time"
                value={task.time}
                onChange={(e) => setTask({ ...task, time: e.target.value })}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1.5 block">End</label>
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
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1.5 block">Title</label>
            <input
              type="text"
              placeholder="What are you doing?"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* ノート */}
          <div className="mb-6">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1.5 block">Note</label>
            <textarea
              placeholder="Why does this matter to you?"
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
            Add Task
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-stone-400 text-sm font-medium mt-2 hover:text-stone-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
