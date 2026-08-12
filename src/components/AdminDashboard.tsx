'use client';

import React, { useState } from 'react';
import { User, Dispute, Order, Listing } from '../types';
import { ShieldAlert, Users, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  disputes: Dispute[];
  orders?: Order[];
  listings?: Listing[];
  onUpdateDisputeStatus?: (disputeId: string, status: Dispute['status']) => void;
  onToggleUserVerification?: (userId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users = [],
  disputes = [],
  orders = [],
  listings = [],
  onUpdateDisputeStatus,
  onToggleUserVerification
}) => {
  return (
    <div className="space-y-4 pb-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-extrabold">BizSocial Platform Admin & Safety Hub</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Supervising user roles, merchant verification badges, Escrow dispute resolution, and community guidelines safety.
          </p>
        </div>

        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
          Super Admin Privileges
        </span>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Total Users</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">{users.length}</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-auto">Buyers, Sellers, Mods</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Escrow Orders</span>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">{orders.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-auto">Active Escrow Protection</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Active Disputes</span>
          </div>
          <div className="text-2xl font-black text-rose-600 leading-none">{disputes.length}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-auto">Requires Moderation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Verified Merchants</span>
          </div>
          <div className="text-2xl font-black text-sky-600 leading-none">{users.filter(u => u.isVerified).length}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-auto">Blue Badge Certified</span>
        </div>
      </div>

      {/* Dispute Resolution Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Escrow Dispute Resolution Center
        </h2>

        {disputes.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No open disputes. All escrow transactions are proceeding smoothly.</p>
        ) : (
          <div className="space-y-3">
            {disputes.map((disp) => (
              <div key={disp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Dispute #{disp.id}</span>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {disp.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700"><strong>Buyer:</strong> {disp.buyerName} vs <strong>Seller:</strong> {disp.sellerName}</p>
                  <p className="text-xs text-slate-500"><strong>Reason:</strong> {disp.reason} (${disp.amount.toFixed(2)})</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateDisputeStatus?.(disp.id, 'resolved_refund')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Refund Buyer
                  </button>
                  <button
                    onClick={() => onUpdateDisputeStatus?.(disp.id, 'resolved_payout')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Release Payout to Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" /> User Directory & Merchant Verification
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Subscription</th>
                <th className="py-2.5 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-slate-400 text-[10px]">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 capitalize font-semibold text-slate-700">
                    {u.role.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      u.subscriptionStatus === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.subscriptionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleUserVerification?.(u.id)}
                      className={`px-3 py-1 rounded-xl font-bold transition-colors ${
                        u.isVerified 
                          ? 'bg-sky-100 text-sky-800 hover:bg-sky-200' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {u.isVerified ? '✓ Verified Badge' : '+ Verify Merchant'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
