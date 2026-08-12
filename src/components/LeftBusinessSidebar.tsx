import React, { useState } from 'react';
import { User } from '../types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  Code2, 
  FileText, 
  Award, 
  Zap, 
  ExternalLink, 
  Lock, 
  BarChart3, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface LeftBusinessSidebarProps {
  currentUser: User;
  onOpenSellerProfile: (userId: string) => void;
  onOpenSettings: () => void;
  onOpenCreateModal: () => void;
  onOpenSellToUs: () => void;
  onOpenCreateQuote?: () => void;
  onUpgradeTier: () => void;
  isInDrawer?: boolean;
}

export const LeftBusinessSidebar: React.FC<LeftBusinessSidebarProps> = ({
  currentUser,
  onOpenSellerProfile,
  onOpenSettings,
  onOpenCreateModal,
  onOpenSellToUs,
  onOpenCreateQuote,
  onUpgradeTier,
  isInDrawer = false
}) => {
  const [activeMetricTab, setActiveMetricTab] = useState<'sales' | 'views'>('sales');

  const card = isInDrawer ? 'rounded-none' : 'rounded-3xl';
  const card2 = isInDrawer ? 'rounded-none' : 'rounded-2xl';
  const inner = isInDrawer ? 'rounded-none' : 'rounded-2xl';
  const innerSm = isInDrawer ? 'rounded-none' : 'rounded-xl';

  return (
    <aside className={`space-y-5 text-left font-sans ${isInDrawer ? 'px-0' : ''}`}>
      
      {/* 1. ELABORATE BUSINESS PROFILE CARD */}
      <div className={`bg-white ${card} border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:shadow-md`}>
        
        {/* Banner Cover Image */}
        <div className="h-20 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 relative p-3">
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
            <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Store
            </span>
          </div>
        </div>

        {/* Profile Avatar & Primary Info Header */}
        <div className="px-5 pb-5 pt-0 relative">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative group">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-18 h-18 rounded-2xl object-cover border-4 border-white shadow-md cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => onOpenSellerProfile(currentUser.id)}
              />
              {currentUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-1 rounded-full shadow-xs ring-2 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <button
              onClick={onOpenSettings}
              className={`text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 ${innerSm} border border-slate-200 transition-colors flex items-center gap-1`}
            >
              <SlidersHorizontal className="w-3 h-3" /> Edit Hub
            </button>
          </div>

          {/* Name & Enterprise Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 
                onClick={() => onOpenSellerProfile(currentUser.id)}
                className="font-black text-base text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
              >
                {currentUser.name}
              </h3>
              {currentUser.verificationBadgeType && (
                <span className="bg-sky-50 text-sky-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-sky-200 uppercase tracking-wider shrink-0">
                  {currentUser.verificationBadgeType.replace('_', ' ')}
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-slate-500 truncate flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {currentUser.companyName || `${currentUser.name} Global Solutions`}
            </p>
          </div>

          {/* Level Progress Bar & Trust Metric */}
          <div className={`mt-4 p-3 bg-slate-50 ${inner} border border-slate-100 space-y-2`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Merchant Level 4 (PRO)
              </span>
              <span className="text-[11px] font-black text-indigo-600">{currentUser.trustScore || 98}% Trust</span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full w-[88%] shadow-xs"></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-0.5">
              <span>Tier: {currentUser.subscriptionStatus.toUpperCase()}</span>
              <span>120 / 150 Level XP</span>
            </div>
          </div>

          {/* Detailed Financial & Store Operations Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-left">
            <div className={`p-2.5 bg-indigo-50/60 ${inner} border border-indigo-100/80 space-y-0.5`}>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block flex items-center gap-1">
                <Wallet className="w-3 h-3 text-indigo-500" /> Escrow Balance
              </span>
              <span className="text-sm font-black text-slate-900 block">$14,850.00</span>
              <span className="text-[9px] text-slate-500 font-semibold block">Secured in Escrow</span>
            </div>

            <div className={`p-2.5 bg-emerald-50/60 ${inner} border border-emerald-100/80 space-y-0.5`}>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Total Sales
              </span>
              <span className="text-sm font-black text-slate-900 block">{currentUser.totalSales} Deals</span>
              <span className="text-[9px] text-slate-500 font-semibold block">100% Payout Rate</span>
            </div>
          </div>

          {/* Additional Business Details */}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Response Rate</span>
              <span className="font-bold text-emerald-600">{currentUser.responseRate || '100% (Instant)'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Verified Partner Since</span>
              <span className="font-bold text-slate-700">{currentUser.joinDate || 'Jan 2024'}</span>
            </div>
          </div>

          {/* Upgrade Banner Button */}
          {currentUser.subscriptionStatus !== 'premium' && (
            <button
              onClick={onUpgradeTier}
              className={`mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs py-2.5 ${innerSm} shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95`}
            >
              <Zap className="w-4 h-4 text-slate-950 fill-current" /> Upgrade to Enterprise PRO
            </button>
          )}

        </div>
      </div>

      {/* 2. ADVANCED BUSINESS OPERATIONAL COMMAND SUITE */}
      <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Business Operations
          </h4>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
            Tools & Vault
          </span>
        </div>

        {/* Live Performance Metric Mini Tab */}
        <div className={`bg-slate-50 p-3 ${inner} border border-slate-100 space-y-2`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-500">Analytics Overview</span>
            <div className="flex gap-1 text-[10px]">
              <button 
                onClick={() => setActiveMetricTab('sales')} 
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${activeMetricTab === 'sales' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                Revenue
              </button>
              <button 
                onClick={() => setActiveMetricTab('views')} 
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${activeMetricTab === 'views' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                Views
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            {activeMetricTab === 'sales' ? (
              <div>
                <span className="text-xl font-black text-slate-900">$24,900.00</span>
                <span className="text-[10px] text-emerald-600 font-bold ml-1.5 inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4% this mo
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xl font-black text-slate-900">14,250</span>
                <span className="text-[10px] text-indigo-600 font-bold ml-1.5 inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +32% Clicks
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Operational Shortcut Action Cards */}
        <div className="space-y-2">
          
          <button
            onClick={onOpenCreateQuote}
            className={`w-full p-3 ${card2} bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between text-left group`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${innerSm} bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}>
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-indigo-600">Draft B2B Quote / Contract</span>
                <span className="text-[10px] text-slate-500 block">Send formal quotes with Escrow</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={onOpenCreateModal}
            className={`w-full p-3 ${card2} bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between text-left group`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${innerSm} bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}>
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-indigo-600">Publish Software or Product</span>
                <span className="text-[10px] text-slate-500 block">List SaaS, License, or Inventory</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={onOpenSellToUs}
            className={`w-full p-3 ${card2} bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between text-left group`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${innerSm} bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block group-hover:text-emerald-700">Instant Platform Buyout</span>
                <span className="text-[10px] text-slate-500 block">Sell software/products to Buy Desk</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>

        </div>

      </div>

      {/* 3. ESCROW & BUYER PROTECTION GUARANTEE SHIELD */}
      <div className={`bg-gradient-to-br from-slate-900 to-indigo-950 text-white ${card} p-4 shadow-md border border-slate-800 space-y-3`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${innerSm} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">BizSocial Escrow Shield</h5>
            <p className="text-[10px] text-slate-400">100% Funds Secured Until Inspection</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Every transaction on BizSocial (Software SaaS transfers, Wholesale products, Services) is protected by our automated Escrow Vault.
        </p>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-bold">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit Encrypted Vault
          </span>
          <span>Zero Dispute Loss</span>
        </div>
      </div>

    </aside>
  );
};
