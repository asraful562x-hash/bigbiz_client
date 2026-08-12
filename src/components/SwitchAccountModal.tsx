'use client';

import React from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { X, CheckCircle2, UserCheck, Shield, Building2, PlusCircle, ArrowRight } from 'lucide-react';

interface SwitchAccountModalProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const SwitchAccountModal: React.FC<SwitchAccountModalProps> = ({
  currentUser,
  onSelectUser,
  onClose
}) => {
  const roleBadges: Record<string, { label: string; color: string }> = {
    buyer: { label: 'Verified Buyer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    seller_free: { label: 'Free Vendor', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    seller_premium: { label: 'PRO Seller / SaaS', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    admin: { label: 'Platform Admin', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    moderator: { label: 'Safety & Trust', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    procurement: { label: 'Procurement Desk', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Switch Business Account</h2>
              <p className="text-xs text-slate-500">Easily toggle between your active enterprise roles.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Accounts List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {INITIAL_USERS.map((user) => {
            const isCurrent = user.id === currentUser.id;
            const badge = roleBadges[user.role] || { label: user.role, color: 'bg-slate-100 text-slate-700 border-slate-200' };

            return (
              <div
                key={user.id}
                onClick={() => {
                  if (!isCurrent) {
                    onSelectUser(user);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{user.name}</span>
                      {user.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{user.companyName || user.email}</p>
                    <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isCurrent ? (
                    <span className="text-xs font-black text-indigo-600 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-indigo-200">
                      Active
                    </span>
                  ) : (
                    <button className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                      <span>Switch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Business Account Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Another Business</span>
          </button>
          <span className="text-[11px] text-slate-400">BizSocial Multi-Account Support</span>
        </div>

      </div>
    </div>
  );
};
