"use client";

import React from 'react';
import { BookOpen, Coffee, Sun, X } from 'lucide-react';
import { RoutineTask } from '../lib/types';

type TaskDetailModalProps = {
  task: RoutineTask | null;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

export const TaskDetailModal = ({ task, onClose, onDelete }: TaskDetailModalProps) => {
  if (!task) return null;

  return (
    <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] w-full max-w-sm rounded-3xl border border-stone-100 shadow-2xl p-6 relative animate-in slide-in-from-bottom-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-800"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          {task.type === 'nature' && (
            <div className="p-2 bg-orange-50 rounded-lg">
              <Sun size={20} className="text-orange-400" />
            </div>
          )}
          {task.type === 'mind' && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen size={20} className="text-blue-400" />
            </div>
          )}
          {task.type === 'work' && (
            <div className="p-2 bg-stone-100 rounded-lg">
              <Coffee size={20} className="text-stone-600" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Schedule</span>
            <span className="text-lg font-mono font-bold text-stone-800">
              {task.time} - {task.endTime || '...'}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-4 leading-tight">{task.title}</h3>
        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-inner mb-6">
          <p className="text-stone-600 leading-relaxed font-serif italic text-lg">"{task.thought}"</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-stone-800 text-white rounded-xl font-bold text-sm shadow-lg">
            Close
          </button>
          {!task.isOther && onDelete && (
            <button onClick={onDelete} className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
