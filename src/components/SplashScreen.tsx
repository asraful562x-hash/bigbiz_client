'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-slate-100 font-sans p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-indigo-600/30 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header info */}
      <div className="w-full flex items-center justify-between opacity-70">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Enterprise Secure Environment</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono tracking-wider">v2.4 Pro</div>
      </div>

      {/* Center Brand Splash Animation */}
      <div className="flex flex-col items-center text-center space-y-6 my-auto relative z-10">
        {/* Glowing Logo Badge with floating animation */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-3xl blur-2xl opacity-75 animate-pulse transition duration-1000" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl border border-white/25 transform hover:scale-105 transition-transform duration-300">
            B
          </div>
        </div>

        {/* Brand Name & Subtitle */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>The All-In-One Business Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Biz<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Social</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Social Commerce, SaaS Licensing & B2B Trading Hub
          </p>
        </div>

        {/* Modern Shimmering Progress Bar & Status */}
        <div className="flex flex-col items-center space-y-3 pt-4">
          <div className="relative w-52 h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full" 
              style={{
                animation: 'splashShimmer 1.4s infinite ease-in-out',
              }}
            />
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Verifying secure session & loading workspace...
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 relative z-10 font-medium">
        © 2026 BizSocial Ecosystem Inc. All rights reserved.
      </div>

      <style jsx>{`
        @keyframes splashShimmer {
          0% {
            left: -40%;
            width: 40%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
};
