"use client";

import React from 'react';
import { BookOpen, Coffee, ExternalLink, Sun, Trash2, X } from 'lucide-react';
import { RoutineTask } from '../lib/types';

type TaskDetailModalProps = {
  task: RoutineTask | null;
  onClose: () => void;
  onDelete?: () => void;
};

const typeConfig: Record<string, { icon: React.ReactNode; bgClass: string; label: string }> = {
  nature: { icon: <Sun size={20} className="text-amber-500" />,  bgClass: 'bg-amber-50',  label: '自然' },
  mind:   { icon: <BookOpen size={20} className="text-blue-500" />, bgClass: 'bg-blue-50', label: '思考'   },
  work:   { icon: <Coffee size={20} className="text-violet-500" />, bgClass: 'bg-violet-50', label: '仕事' },
};

export const TaskDetailModal = ({ task, onClose, onDelete }: TaskDetailModalProps) => {
  if (!task) return null;
  const typeInfo = typeConfig[task.type ?? 'work'] ?? typeConfig.work;

  return (
    <div
      className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FDFCF8] w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        <div className="px-6 pb-10 pt-4">
          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${typeInfo.bgClass}`}>
                {typeInfo.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-stone-400 tracking-wide">スケジュール</div>
                <div className="text-base font-mono font-bold text-stone-800">
                  {task.time}{task.endTime ? ` — ${task.endTime}` : ''}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* タイトル */}
          <h3 className="text-2xl font-serif font-bold text-stone-800 mb-4 leading-tight">
            {task.title}
          </h3>

          {/* メモ */}
          {task.thought && (
            <div className="bg-white p-4 rounded-2xl border border-stone-100 mb-6">
              <p className="text-stone-500 leading-relaxed font-serif italic">"{task.thought}"</p>
            </div>
          )}

          {/* イベントリンク */}
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors mb-4"
            >
              <ExternalLink size={14} />
              <span className="text-sm font-bold">connpassで類似イベントを探す</span>
              <span className="text-[10px] text-blue-400 ml-auto">→</span>
            </a>
          )}

          {/* アクション */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-stone-700 transition-all"
            >
              閉じる
            </button>
            {!task.isOther && onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
