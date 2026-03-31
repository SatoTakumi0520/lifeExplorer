"use client";

import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { RoutineTask, Screen, SocialPost } from '../lib/types';

type ScreenBorrowProps = {
  go: (screen: Screen) => void;
  borrowingUser: SocialPost | null;
  setBorrowingUser: (user: SocialPost | null) => void;
  myRoutine: RoutineTask[];
  copyTaskFromTemplate: (task: RoutineTask) => void;
  removeCopiedTask: (task: RoutineTask) => void;
};

export const ScreenBorrow = ({
  go,
  borrowingUser,
  setBorrowingUser,
  myRoutine,
  copyTaskFromTemplate,
  removeCopiedTask,
}: ScreenBorrowProps) => {
  if (!borrowingUser) return null;
  const allTimes = [...new Set([...borrowingUser.routine.map((routine) => routine.time), ...myRoutine.map((routine) => routine.time)])].sort();
  const isAdded = (task: RoutineTask) => myRoutine.find((routine) => routine.time === task.time && routine.title === task.title);

  return (
    <div className="flex flex-col h-full bg-[#FDFCF8] text-stone-800">
      <div className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-100 flex items-center justify-between">
        <button
          onClick={() => {
            setBorrowingUser(null);
            go('OTHER_HOME');
          }}
          className="text-stone-400 font-bold text-sm"
        >
          戻る
        </button>
        <h2 className="font-bold text-stone-800">ルーティンを借りる</h2>
        <button
          onClick={() => {
            setBorrowingUser(null);
            go('HOME');
          }}
          className="text-white bg-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg"
        >
          完了
        </button>
      </div>
      <div className="flex border-b border-stone-100">
        <div className="flex-1 px-4 py-2 bg-orange-50/50 text-center text-xs font-bold text-orange-600 uppercase tracking-wider truncate">{borrowingUser.user}</div>
        <div className="w-10" />
        <div className="flex-1 px-4 py-2 bg-green-50/50 text-center text-xs font-bold text-green-600 tracking-wider">マイルーティン</div>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        {allTimes.map((time, idx) => {
          const userTask = borrowingUser.routine.find((routine) => routine.time === time);
          const myTasks = myRoutine.filter((routine) => routine.time === time);
          const added = userTask && isAdded(userTask);
          return (
            <div key={time} className="flex border-b border-stone-50">
              <div className="flex-1 p-3 bg-orange-50/30">
                {userTask ? (
                  <div className="bg-white p-3 rounded-xl border border-orange-100">
                    <div className="text-xs font-bold text-orange-600">{userTask.time}</div>
                    <div className="font-bold text-sm">{userTask.title}</div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-stone-300">-</div>
                )}
              </div>
              <div className="w-10 flex items-center justify-center bg-stone-50/50">
                {userTask && !added && (
                  <button onClick={() => copyTaskFromTemplate(userTask)} className="p-1.5 rounded-full bg-white border">
                    <ArrowRight size={12} />
                  </button>
                )}
                {added && (
                  <button onClick={() => removeCopiedTask(userTask)} className="p-1.5 rounded-full bg-green-100 text-green-600">
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex-1 p-3 bg-green-50/30">
                {myTasks.map((task, index) => (
                  <div key={task.id ?? index} className="bg-white p-3 rounded-xl border border-green-100 mb-1">
                    <div className="text-xs font-bold text-green-700">{task.time}</div>
                    <div className="font-bold text-sm">{task.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
