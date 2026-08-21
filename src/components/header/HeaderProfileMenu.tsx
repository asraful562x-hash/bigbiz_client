'use client';

import React from 'react';
import { User, UserRole } from '../../types';
import { 
  User as UserIcon, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

interface HeaderProfileMenuProps {
  currentUser: User;
  showProfileMenu: boolean;
  setShowProfileMenu: (v: boolean | ((prev: boolean) => boolean)) => void;
  onOpenProfile?: (userId: string) => void;
  onUpgradeTier?: () => void;
  onLogout?: () => void;
}

export const HeaderProfileMenu: React.FC<HeaderProfileMenuProps> = ({
  currentUser,
  showProfileMenu,
  setShowProfileMenu,
  onOpenProfile,
  onUpgradeTier,
  onLogout,
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowProfileMenu(prev => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200/80 shadow-xs"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-xl object-cover border border-indigo-200"
        />
        <div className="hidden lg:block text-left pr-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-800 leading-none truncate max-w-[90px]">{currentUser.name}</span>
            {currentUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
      </button>

      {/* Profile Menu Popover */}
      {showProfileMenu && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 text-left animate-in fade-in zoom-in-95 font-sans space-y-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 mt-1 border border-indigo-100">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false);
                onOpenProfile?.(currentUser.id);
              }}
              className="w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              View Public Storefront
            </button>

            {onUpgradeTier && !currentUser.role.includes('premium') && (
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onUpgradeTier();
                }}
                className="w-full px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Upgrade to PRO Seller ($29/mo)
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false);
                onLogout?.();
              }}
              className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
