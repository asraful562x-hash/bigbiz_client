import React from 'react';
import { User, Dispute, Order, Listing } from '../../types';
import { Users, DollarSign, AlertTriangle, Sliders, Cpu, ArrowUpRight } from 'lucide-react';

interface AdminOverviewSectionProps {
  users: User[];
  orders: Order[];
  disputes: Dispute[];
  listings: Listing[];
  totalEscrowVolume: number;
  onNavigateSection: (section: any) => void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  users,
  orders,
  disputes,
  listings,
  totalEscrowVolume,
  onNavigateSection
}) => {
  return (
    <div className="space-y-4">
      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{users.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1">100% active profiles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Escrow Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">${totalEscrowVolume.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">Across all orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Open Disputes</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{disputes.length}</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1">Requires immediate ruling</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Catalog Listings</span>
            <Sliders className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">{listings.length}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1">Active verified products</span>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600" /> Quick Administrative Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigateSection('escrow_vault')}
            className="p-4 bg-purple-50/70 hover:bg-purple-100 rounded-2xl border border-purple-200 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-950">Arbitrate Disputes</span>
              <ArrowUpRight className="w-4 h-4 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-purple-700 mt-1">Review evidence & release or refund escrow deposits.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('user_control')}
            className="p-4 bg-indigo-50/70 hover:bg-indigo-100 rounded-2xl border border-indigo-200 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-950">Merchant Verifications</span>
              <ArrowUpRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-indigo-700 mt-1">Review seller KYC documentation and issue verified badges.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('fee_settings')}
            className="p-4 bg-emerald-50/70 hover:bg-emerald-100 rounded-2xl border border-emerald-200 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-950">Platform Fee Controller</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">Configure transaction commission and minimum payout thresholds.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
