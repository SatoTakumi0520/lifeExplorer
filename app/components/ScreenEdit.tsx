"use client";

import React, { useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { PersonaTemplate, RoutineTask, Screen } from '../lib/types';

type ScreenEditProps = {
  go: (screen: Screen) => void;
  myRoutine: RoutineTask[];
  personaTemplates: PersonaTemplate[];
  copyTaskFromTemplate: (task: RoutineTask) => void;
  removeCopiedTask: (task: RoutineTask) => void;
  deleteTaskFromRoutine: (index: number) => void;
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
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Templates</h3>
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
                <div className="text-[10px] text-stone-500">{persona.title}</div>
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
              <div className="flex-1 px-4 py-2 bg-orange-50/50"><span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{selectedTemplate.name}</span></div>
              <div className="w-10" />
              <div className="flex-1 px-4 py-2 bg-green-50/50"><span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">My Routine</span></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[...new Set([...selectedTemplate.routine.map((routine) => routine.time), ...myRoutine.map((routine) => routine.time)])]
                .sort()
                .map((time, idx) => {
                  const tplTask = selectedTemplate.routine.find((routine) => routine.time === time);
                  const myTasks = myRoutine.filter((routine) => routine.time === time);
                  const added = tplTask && isAdded(tplTask);
                  return (
                    <div key={idx} className="flex border-b border-stone-50">
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
                          <div key={index} className="bg-white p-3 rounded-xl border border-green-100 shadow-sm mb-1">
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
          <div className="p-4 space-y-4">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">My Routine</h3>
            {myRoutine.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm text-stone-800">{item.time} {item.title}</div>
                  <div className="text-xs text-stone-400">{item.thought}</div>
                </div>
                <button onClick={() => deleteTaskFromRoutine(idx)} className="text-stone-300 hover:text-red-500"><X size={16} /></button>
              </div>
            ))}
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 hover:border-green-300 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-bold text-sm"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
