'use client';

import React from 'react';
import { Eye, Bell, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { User } from '../../types';

interface PreferencesTabProps {
  currentUser: User;
  publicProfile: boolean;
  setPublicProfile: (v: boolean) => void;
  showSalesBadge: boolean;
  setShowSalesBadge: (v: boolean) => void;
  allowDirectRFQ: boolean;
  setAllowDirectRFQ: (v: boolean) => void;
  emailOrders: boolean;
  setEmailOrders: (v: boolean) => void;
  emailRFQ: boolean;
  setEmailRFQ: (v: boolean) => void;
  emailMarketing: boolean;
  setEmailMarketing: (v: boolean) => void;
  activeSubTab: 'privacy' | 'notifications' | 'billing';
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  currentUser,
  publicProfile,
  setPublicProfile,
  showSalesBadge,
  setShowSalesBadge,
  allowDirectRFQ,
  setAllowDirectRFQ,
  emailOrders,
  setEmailOrders,
  emailRFQ,
  setEmailRFQ,
  emailMarketing,
  setEmailMarketing,
  activeSubTab,
}) => {
  if (activeSubTab === 'privacy') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h3 className="text-lg font-black text-slate-900">Privacy & Storefront Visibility</h3>
          <p className="text-xs text-slate-500">Control who can discover your enterprise inventory, price quotes, and sales volume</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Public Marketplace Catalog</h5>
              <p className="text-[11px] text-slate-500">Allow your verified listings to appear on the global marketplace</p>
            </div>
            <input
              type="checkbox"
              checked={publicProfile}
              onChange={(e) => setPublicProfile(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Show Total Sales & Rating Badge</h5>
              <p className="text-[11px] text-slate-500">Display your historical escrow volume to build buyer trust</p>
            </div>
            <input
              type="checkbox"
              checked={showSalesBadge}
              onChange={(e) => setShowSalesBadge(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Allow Direct Buyout RFQs</h5>
              <p className="text-[11px] text-slate-500">Permit corporate procurement officers to send formal quotes</p>
            </div>
            <input
              type="checkbox"
              checked={allowDirectRFQ}
              onChange={(e) => setAllowDirectRFQ(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  if (activeSubTab === 'notifications') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h3 className="text-lg font-black text-slate-900">Notification Preferences</h3>
          <p className="text-xs text-slate-500">Choose when and how BizSocial alerts your enterprise team</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Escrow & Order Milestones</h5>
              <p className="text-[11px] text-slate-500">Immediate email when payment is secured or escrow is released</p>
            </div>
            <input
              type="checkbox"
              checked={emailOrders}
              onChange={(e) => setEmailOrders(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Direct Inquiries & Quote Offers</h5>
              <p className="text-[11px] text-slate-500">Alerts when a client messages your B2B chat or sends an RFQ</p>
            </div>
            <input
              type="checkbox"
              checked={emailRFQ}
              onChange={(e) => setEmailRFQ(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Platform Reports & Market Trends</h5>
              <p className="text-[11px] text-slate-500">Weekly B2B liquidation pricing reports and demand surges</p>
            </div>
            <input
              type="checkbox"
              checked={emailMarketing}
              onChange={(e) => setEmailMarketing(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  // Billing Tab
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-lg font-black text-slate-900">Enterprise Subscription & Billing</h3>
        <p className="text-xs text-slate-500">Manage plan tier, platform fees, and escrow vault payout methods</p>
      </div>

      <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Current Plan</span>
          <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-full text-xs font-bold capitalize">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <div>
          <h4 className="text-2xl font-black">{currentUser.role.includes('premium') ? 'PRO Enterprise Seller' : 'Standard Merchant'}</h4>
          <p className="text-xs text-slate-300">
            {currentUser.role.includes('premium')
              ? 'Priority Buy Desk queue, 0% platform fee, and custom domain active.'
              : 'Standard 3% escrow fee per transaction.'}
          </p>
        </div>
      </div>
    </div>
  );
};
