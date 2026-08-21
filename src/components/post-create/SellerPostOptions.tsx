'use client';

import React from 'react';
import { Listing, PostType } from '../../types';
import { 
  ShoppingBag, 
  Tag, 
  Megaphone, 
  Film, 
  Boxes, 
  Sparkles, 
  Percent, 
  MessageSquare,
  Check
} from 'lucide-react';

interface SellerPostOptionsProps {
  postType: PostType;
  setPostType: (type: PostType) => void;
  sellerListings: Listing[];
  selectedListingId: string;
  setSelectedListingId: (id: string) => void;
  promoBadge: string;
  setPromoBadge: (badge: string) => void;
  callToAction: string;
  setCallToAction: (cta: string) => void;
}

const FORMAT_OPTIONS: { type: PostType; label: string; icon: React.FC<{ className?: string }>; desc: string; color: string }[] = [
  { 
    type: 'product', 
    label: 'Product Launch', 
    icon: ShoppingBag, 
    desc: 'Showcase new inventory or flagship item', 
    color: 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
  },
  { 
    type: 'deal', 
    label: 'Flash Deal', 
    icon: Percent, 
    desc: 'Limited discount, sale or promotion', 
    color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' 
  },
  { 
    type: 'announcement', 
    label: 'Announcement', 
    icon: Megaphone, 
    desc: 'Store update, restock, or news', 
    color: 'border-amber-500 bg-amber-50/50 text-amber-700' 
  },
  { 
    type: 'wholesale', 
    label: 'Wholesale Lot', 
    icon: Boxes, 
    desc: 'B2B bulk quantity ready to ship', 
    color: 'border-purple-500 bg-purple-50/50 text-purple-700' 
  },
];

const PRESET_BADGES = [
  '⭐ Featured Product',
  '🔥 20% OFF Deal',
  '📦 In Stock Ready to Ship',
  '🌿 100% Handcrafted',
  '⚡ Limited Quantity',
  '🏢 B2B Bulk Tier'
];

const CTA_OPTIONS = [
  { value: 'buy_now', label: '🛍️ Buy via Escrow' },
  { value: 'request_quote', label: '📋 Request B2B Quote' },
  { value: 'view_store', label: '🏪 View Storefront' },
  { value: 'message_seller', label: '💬 Message Seller' },
];

export const SellerPostOptions: React.FC<SellerPostOptionsProps> = ({
  postType,
  setPostType,
  sellerListings,
  selectedListingId,
  setSelectedListingId,
  promoBadge,
  setPromoBadge,
  callToAction,
  setCallToAction
}) => {
  return (
    <div className="space-y-4 pt-1 pb-1">
      {/* ── 1. Post Format Selector ─────────────────────────────────── */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Commercial Post Format</span>
          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 ml-auto">
            Seller Tools
          </span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = postType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setPostType(opt.type)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                  isSelected 
                    ? `${opt.color} shadow-xs ring-2 ring-indigo-500/20 font-bold` 
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-current' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold truncate">{opt.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight truncate">{opt.desc}</p>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Tag Catalog Product ──────────────────────────────────── */}
      {sellerListings.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-600" />
            <span>Tag Catalog Product (Optional)</span>
          </label>
          <div className="relative">
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium text-slate-800 appearance-none pr-8"
            >
              <option value="">No product tagged</option>
              {sellerListings.map((l) => (
                <option key={l.id} value={l.id}>
                  🏷️ {l.title} — ${l.price.toFixed(2)} ({l.category})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Promotional Badge ────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Promotional Badge / Banner (Optional)</span>
        </label>
        
        {/* Quick Badge Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_BADGES.map((badge) => (
            <button
              key={badge}
              type="button"
              onClick={() => setPromoBadge(promoBadge === badge ? '' : badge)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                promoBadge === badge
                  ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {badge}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={promoBadge}
          onChange={(e) => setPromoBadge(e.target.value)}
          placeholder="Or write custom badge: e.g. '🔥 Black Friday 30% OFF'"
          className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* ── 4. Call To Action (CTA) Button ──────────────────────────── */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Call-to-Action Button</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CTA_OPTIONS.map((cta) => (
            <button
              key={cta.value}
              type="button"
              onClick={() => setCallToAction(callToAction === cta.value ? '' : cta.value)}
              className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                callToAction === cta.value
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cta.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
