"use client";

import React, { useState } from 'react';
import { RoutineTask } from '../lib/types';

type AddTaskModalProps = {
  onClose: () => void;
  onAdd: (task: RoutineTask) => void;
};

export const AddTaskModal = ({ onClose, onAdd }: AddTaskModalProps) => {
  const [task, setTask] = useState<RoutineTask>({
    time: '12:00',
    endTime: '13:00',
    title: '',
    thought: '',
    type: 'work',
  });

  return (
    <div className="absolute inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex items-end justify-center p-6 animate-in slide-in-from-bottom-10">
      <div className="bg-white w-full rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold mb-4">Add Task</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="time"
            value={task.time}
            onChange={(e) => setTask({ ...task, time: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="time"
            value={task.endTime}
            onChange={(e) => setTask({ ...task, endTime: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Note"
          value={task.thought}
          onChange={(e) => setTask({ ...task, thought: e.target.value })}
          className="border p-2 rounded w-full mb-4 h-24 resize-none"
        />
        <div className="flex gap-2 mb-4">
          {(['nature', 'mind', 'work'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTask({ ...task, type: t })}
              className={`px-3 py-1 rounded text-xs capitalize ${
                task.type === t ? 'bg-stone-800 text-white' : 'bg-stone-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button onClick={() => onAdd(task)} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold">
          Add
        </button>
        <button onClick={onClose} className="w-full mt-2 text-stone-400">
          Cancel
        </button>
      </div>
    </div>
  );
};
