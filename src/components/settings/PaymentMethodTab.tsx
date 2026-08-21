'use client';

import React from 'react';
import { 
  Building2, 
  Key, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  Save 
} from 'lucide-react';

interface PaymentMethodTabProps {
  chainHookClientName: string;
  setChainHookClientName: (v: string) => void;
  chainHookApiKey: string;
  setChainHookApiKey: (v: string) => void;
  chainHookBaseUrl: string;
  setChainHookBaseUrl: (v: string) => void;
  isPaymentConfigured: boolean;
  isSavingPayment: boolean;
  paymentSaveSuccess: boolean;
  paymentSaveError: string | null;
  onSavePaymentSettings: (e: React.FormEvent) => void;
}

export const PaymentMethodTab: React.FC<PaymentMethodTabProps> = ({
  chainHookClientName,
  setChainHookClientName,
  chainHookApiKey,
  setChainHookApiKey,
  chainHookBaseUrl,
  setChainHookBaseUrl,
  isPaymentConfigured,
  isSavingPayment,
  paymentSaveSuccess,
  paymentSaveError,
  onSavePaymentSettings,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center p-2">
            <img 
              src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png" 
              alt="Chain Hook" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              Chain Hook Payment Gateway
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Seller Payout
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure your seller Chain Hook credentials so customer payments go directly to your address.
            </p>
          </div>
        </div>

        {isPaymentConfigured && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Configured & Active
          </div>
        )}
      </div>

      <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs space-y-1 text-amber-900">
        <p className="font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Required for Seller Product Creation
        </p>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Sellers must configure their <strong>Client Name</strong>, <strong>API Key</strong>, and <strong>Base URL</strong> before adding products for sale. When customers purchase your listings, payments route directly using your registered credentials with Escrow Vault protection.
        </p>
      </div>

      <form onSubmit={onSavePaymentSettings} className="space-y-4">
        {paymentSaveError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
            ⚠️ {paymentSaveError}
          </div>
        )}

        {paymentSaveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Payment credentials successfully verified & saved to database!
          </div>
        )}

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Client Name / Merchant ID
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={chainHookClientName}
              onChange={(e) => setChainHookClientName(e.target.value)}
              placeholder="e.g. BigBiz or your registered store name"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">This will be passed as the payment platform merchant name</p>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Chain Hook API Key
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={chainHookApiKey}
              onChange={(e) => setChainHookApiKey(e.target.value)}
              placeholder="your_chain_hook_api_key_here"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Your secret API key for authentication on the Chain Hook network</p>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Store Base URL (Website / App Domain)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="url"
              required
              value={chainHookBaseUrl}
              onChange={(e) => setChainHookBaseUrl(e.target.value)}
              placeholder="https://yourstore.vercel.app or http://localhost:3000"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Used to construct payment token requests and callback webhook URLs</p>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isSavingPayment}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSavingPayment ? 'Verifying & Saving...' : 'Save Payment Platform Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
