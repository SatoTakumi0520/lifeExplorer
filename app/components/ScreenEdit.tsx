"use client";

import React, { useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { PersonaTemplate, RoutineTask, Screen } from '../lib/types';
import { timeToMinutes } from '../lib/utils';

const fmtDur = (min: number): string | null => {
  if (min <= 0) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const typeLeftBorder: Record<string, string> = {
  nature: 'border-l-amber-400',
  mind:   'border-l-blue-400',
  work:   'border-l-violet-400',
};

type ScreenEditProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  personaTemplates: PersonaTemplate[];
  copyTaskFromTemplate: (task: RoutineTask) => void;
  removeCopiedTask: (task: RoutineTask) => void;
  deleteTaskFromRoutine: (id: string | number) => void;
  setShowAddTask: (show: boolean) => void;
};

export const ScreenEdit = ({
  go,
  myRoutine,
  personaTemplates,
  copyTaskFromTemplate,
  removeCopiedTask,
  deleteTaskFromRoutine,
  setShowAddTask,
}: ScreenEditProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PersonaTemplate | null>(null);
  const isAdded = (tplTask: RoutineTask) => myRoutine.find((task) => task.time === tplTask.time && task.title === tplTask.title);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button onClick={() => {
          setSelectedTemplate(null);
          go('HOME');
        }} className="text-stone-400 hover:text-stone-800 text-sm font-bold">Cancel</button>
        <h2 className="font-bold text-stone-800">Routine Editor</h2>
        <button onClick={() => {
          setSelectedTemplate(null);
          go('HOME');
        }} className="text-white bg-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-colors">Done</button>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="py-6 px-4 bg-white border-b border-stone-50">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Templates</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {personaTemplates.map((persona) => (
              <div
                key={persona.id}
                onClick={() => setSelectedTemplate(selectedTemplate?.id === persona.id ? null : persona)}
                className={`flex flex-col gap-2 cursor-pointer group min-w-[120px] p-3 rounded-xl border transition-colors ${
                  selectedTemplate?.id === persona.id
                    ? 'bg-green-50 border-green-300'
                    : 'bg-stone-50 border-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${persona.color}`}>{persona.name.charAt(0)}</div>
                  <span className="text-xs font-bold text-stone-700 truncate">{persona.name}</span>
                </div>
                <div className="text-xs text-stone-500">{persona.title}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedTemplate ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${selectedTemplate.color}`}>{selectedTemplate.name.charAt(0)}</div>
                <h3 className="text-sm font-bold text-stone-700">{selectedTemplate.name}と比較中</h3>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-xs text-stone-400 hover:text-stone-600 px-3 py-1 bg-white rounded-full border border-stone-200">閉じる</button>
            </div>
            <div className="flex border-b border-stone-100">
              <div className="flex-1 px-4 py-2 bg-orange-50/50"><span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{selectedTemplate.name}</span></div>
              <div className="w-10" />
              <div className="flex-1 px-4 py-2 bg-green-50/50"><span className="text-xs font-bold text-green-600 uppercase tracking-wider">My Routine</span></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[...new Set([...selectedTemplate.routine.map((routine) => routine.time), ...myRoutine.map((routine) => routine.time)])]
                .sort()
                .map((time, idx) => {
                  const tplTask = selectedTemplate.routine.find((routine) => routine.time === time);
                  const myTasks = myRoutine.filter((routine) => routine.time === time);
                  const added = tplTask && isAdded(tplTask);
                  return (
                    <div key={time} className="flex border-b border-stone-50">
                      <div className="flex-1 p-3 bg-orange-50/30">
                        {tplTask ? (
                          <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                            <div className="font-bold text-xs text-orange-600 mb-1">{tplTask.time}</div>
                            <div className="text-xs font-bold text-stone-800">{tplTask.title}</div>
                          </div>
                        ) : (
                          <div className="text-center text-xs text-stone-300">-</div>
                        )}
                      </div>
                      <div className="w-10 flex items-center justify-center bg-stone-50/50">
                        {tplTask && !added && (
                          <button onClick={() => copyTaskFromTemplate(tplTask)} className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-green-600">
                            <ArrowRight size={12} />
                          </button>
                        )}
                        {added && (
                          <button onClick={() => removeCopiedTask(tplTask)} className="p-1.5 rounded-full bg-green-100 text-green-600">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <div className="flex-1 p-3 bg-green-50/30">
                        {myTasks.map((task, index) => (
                          <div key={task.id ?? index} className="bg-white p-3 rounded-xl border border-green-100 shadow-sm mb-1">
                            <div className="font-bold text-xs text-green-700 mb-1">{task.time}</div>
                            <div className="text-xs font-bold text-stone-800">{task.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">My Routine</h3>
            <div className="space-y-0">
              {myRoutine.map((item, idx) => {
                const prevItem = myRoutine[idx - 1];
                const gapMin = prevItem
                  ? timeToMinutes(item.time) - (prevItem.endTime ? timeToMinutes(prevItem.endTime) : timeToMinutes(prevItem.time) + 60)
                  : null;
                const durationMin = item.endTime
                  ? timeToMinutes(item.endTime) - timeToMinutes(item.time)
                  : 60;
                const duration = fmtDur(durationMin);

                return (
                  <React.Fragment key={item.id ?? idx}>
                    {/* 空き時間コネクタ */}
                    {gapMin !== null && (
                      <div className="flex items-stretch gap-0 ml-4 my-0.5">
                        <div className="flex flex-col items-center w-6 flex-shrink-0">
                          <div className={`w-px flex-1 ${gapMin > 0 ? 'border-l-2 border-dashed border-stone-200' : 'bg-stone-200'}`} />
                        </div>
                        {gapMin > 0 && (
                          <span className="text-[10px] text-stone-300 font-mono self-center pl-2 py-1">
                            {fmtDur(gapMin)} free
                          </span>
                        )}
                      </div>
                    )}
                    {/* タスクカード */}
                    <div className={`bg-white rounded-xl border border-stone-200 border-l-[3px] shadow-sm flex items-center gap-3 px-4 py-3 ${typeLeftBorder[item.type ?? 'work'] ?? 'border-l-stone-300'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-mono text-stone-400">{item.time}</span>
                          <span className="font-bold text-sm text-stone-800 truncate">{item.title}</span>
                        </div>
                        {item.thought && (
                          <div className="text-xs text-stone-400 truncate">{item.thought}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {duration && (
                          <span className="text-[10px] font-mono text-stone-300 bg-stone-50 px-1.5 py-0.5 rounded">{duration}</span>
                        )}
                        <button onClick={() => deleteTaskFromRoutine(item.id!)} className="text-stone-300 hover:text-red-400 transition-colors">
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full mt-3 py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 hover:border-green-300 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-bold text-sm"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
