'use client';

import React from 'react';

/**
 * Full-layout placeholder shown while the real feed / sidebar data is being
 * fetched from the backend — replaces the blank columns with skeletons and a
 * "please wait" note. Mirrors AppShell's responsive 3-column grid.
 */
export const LoadingSkeleton: React.FC = () => {
  const bar = 'animate-pulse rounded-lg bg-slate-200/80';

  return (
    <div className="flex flex-col min-[881px]:flex-row min-[1300px]:grid min-[1300px]:grid-cols-10 gap-4 sm:gap-5 h-full pb-28 sm:pb-4">
      {/* LEFT SIDEBAR SKELETON — visible ≥1300px */}
      <div className="min-[1300px]:col-span-3 hidden min-[1300px]:block space-y-4 overflow-hidden">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl ${bar}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-3.5 w-3/4 ${bar}`} />
              <div className={`h-2.5 w-1/2 ${bar}`} />
            </div>
          </div>
          <div className={`h-9 w-full ${bar}`} />
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-8 w-full ${bar}`} />
            ))}
          </div>
        </div>
      </div>

      {/* CENTER FEED SKELETON — always visible */}
      <div className="flex-1 min-w-0 min-h-0 overflow-hidden sidebar-scroll overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2.5 py-1.5">
            <span className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-slate-500 tracking-tight">
              Loading your workspace — please wait…
            </span>
          </div>

          {[0, 1].map((card) => (
            <div key={card} className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${bar}`} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3 w-40 ${bar}`} />
                  <div className={`h-2.5 w-20 ${bar}`} />
                </div>
              </div>
              <div className="space-y-2">
                <div className={`h-3 w-full ${bar}`} />
                <div className={`h-3 w-11/12 ${bar}`} />
                <div className={`h-3 w-3/5 ${bar}`} />
              </div>
              {card === 0 && <div className={`h-52 w-full ${bar}`} />}
              <div className="flex gap-6 pt-1">
                <div className={`h-3 w-14 ${bar}`} />
                <div className={`h-3 w-14 ${bar}`} />
                <div className={`h-3 w-14 ${bar}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR SKELETON — visible ≥881px */}
      <div className="w-full min-[881px]:w-[400px] min-[1100px]:w-[430px] min-[1300px]:w-auto min-[1300px]:col-span-3 shrink-0 hidden min-[881px]:block space-y-4 overflow-hidden">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4">
          <div className={`h-4 w-44 ${bar}`} />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${bar}`} />
                <div className="flex-1 space-y-1.5">
                  <div className={`h-2.5 w-2/3 ${bar}`} />
                  <div className={`h-2 w-1/3 ${bar}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-3">
          <div className={`h-4 w-36 ${bar}`} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-16 w-full ${bar}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
