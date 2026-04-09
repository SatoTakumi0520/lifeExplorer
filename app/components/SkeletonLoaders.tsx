"use client";

import React from 'react';

const shimmer = 'animate-pulse bg-stone-200 rounded';

export const TimelineSkeleton = () => (
  <div className="flex flex-col h-full bg-[#FDFCF8] p-6 gap-4">
    <div className="flex items-center justify-between">
      <div className={`h-4 w-20 ${shimmer}`} />
      <div className={`h-8 w-40 ${shimmer} rounded-full`} />
      <div className={`h-4 w-20 ${shimmer}`} />
    </div>
    <div className={`h-3 w-48 mx-auto ${shimmer}`} />
    <div className="flex-1 space-y-4 mt-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className={`h-3 w-10 mt-1 ${shimmer}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-14 w-full ${shimmer} rounded-xl`} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ExploreSkeleton = () => (
  <div className="flex flex-col h-full bg-[#FDFCF8]">
    <div className="p-6 pb-4 bg-white/80 border-b border-stone-100">
      <div className={`h-7 w-32 ${shimmer} mb-2`} />
      <div className={`h-3 w-56 ${shimmer} mb-4`} />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-8 w-16 ${shimmer} rounded-full`} />
        ))}
      </div>
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${shimmer}`} />
            <div className="space-y-1.5">
              <div className={`h-4 w-28 ${shimmer}`} />
              <div className={`h-3 w-20 ${shimmer}`} />
            </div>
          </div>
          <div className={`h-5 w-3/4 ${shimmer}`} />
          <div className={`h-2 w-full ${shimmer} rounded-full`} />
          <div className={`h-3 w-24 ${shimmer}`} />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col h-full bg-[#FDFCF8] p-6 gap-4">
    <div className="flex items-center justify-between">
      <div className={`h-4 w-16 ${shimmer}`} />
      <div className={`h-5 w-24 ${shimmer}`} />
      <div className={`h-4 w-16 ${shimmer}`} />
    </div>
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className={`w-20 h-20 rounded-full ${shimmer}`} />
      <div className={`h-5 w-32 ${shimmer}`} />
      <div className={`h-3 w-48 ${shimmer}`} />
    </div>
    <div className="grid grid-cols-3 gap-3 mt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`h-16 ${shimmer} rounded-xl`} />
      ))}
    </div>
    <div className={`h-32 w-full ${shimmer} rounded-xl mt-4`} />
  </div>
);
