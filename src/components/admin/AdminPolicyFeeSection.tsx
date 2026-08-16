import React from 'react';
import { Settings2, CheckCircle2 } from 'lucide-react';

interface AdminPolicyFeeSectionProps {
  platformFee: string;
  setPlatformFee: (fee: string) => void;
  minPayout: string;
  setMinPayout: (payout: string) => void;
  feeSavedToast: boolean;
  onSavePlatformFees: (e: React.FormEvent) => void;
}

export const AdminPolicyFeeSection: React.FC<AdminPolicyFeeSectionProps> = ({
  platformFee,
  setPlatformFee,
  minPayout,
  setMinPayout,
  feeSavedToast,
  onSavePlatformFees
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
      <div>
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-600" /> Platform Monetary Policy & Fee Engine
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Configure transaction commission, Escrow reserve fees, and payout constraints.</p>
      </div>

      <form onSubmit={onSavePlatformFees} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Marketplace Sales Commission Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Deducted automatically upon Escrow release to sellers.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Minimum Merchant Payout Threshold ($ USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">$</span>
            <input
              type="number"
              step="1"
              min="10"
              value={minPayout}
              onChange={(e) => setMinPayout(e.target.value)}
              className="w-full text-xs font-bold pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save & Apply Policy Updates
          </button>
          {feeSavedToast && (
            <span className="text-xs font-bold text-emerald-600 animate-in fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Policy Updated Successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
