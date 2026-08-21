'use client';

import React from 'react';
import { Listing, ProductVariant, ProductOptionSection } from '../../types';
import { ShieldCheck, Plus, Minus, Sparkles } from 'lucide-react';

interface ListingPricingOptionsProps {
  listing: Listing;
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (v: ProductVariant | null) => void;
  selectedOptions: Record<string, string[]>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  calculatedUnitPrice: number;
  calculatedTotalPrice: number;
  onBuyNow: () => void;
  isPurchasing: boolean;
}

export const ListingPricingOptions: React.FC<ListingPricingOptionsProps> = ({
  listing,
  selectedVariant,
  setSelectedVariant,
  selectedOptions,
  setSelectedOptions,
  quantity,
  setQuantity,
  calculatedUnitPrice,
  calculatedTotalPrice,
  onBuyNow,
  isPurchasing,
}) => {
  const toggleOption = (sectionId: string, optionName: string, isSingle: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[sectionId] || [];
      if (isSingle) {
        return { ...prev, [sectionId]: [optionName] };
      }
      const exists = current.includes(optionName);
      const updated = exists ? current.filter((o) => o !== optionName) : [...current, optionName];
      return { ...prev, [sectionId]: updated };
    });
  };

  return (
    <div className="space-y-5">
      {/* Price Summary Banner */}
      <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Unit Price</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">${calculatedUnitPrice.toFixed(2)}</span>
            {listing.originalPrice && (
              <span className="text-xs text-slate-400 line-through">${listing.originalPrice}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 block">Total Escrow</span>
          <span className="text-2xl font-black text-indigo-600">${calculatedTotalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Variants Section */}
      {listing.variants && listing.variants.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
            Select Configuration / SKU
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {listing.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-900 block truncate">{v.name}</span>
                  <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                    {v.priceDelta >= 0 ? `+$${v.priceDelta}` : `-$${Math.abs(v.priceDelta)}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Options & Modifiers Sections */}
      {listing.optionSections && listing.optionSections.length > 0 && (
        <div className="space-y-4">
          {listing.optionSections.map((sec) => (
            <div key={sec.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{sec.title}</span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {sec.type === 'single' ? 'Pick 1 choice' : 'Multi-select'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.items.map((opt) => {
                  const isChecked = (selectedOptions[sec.id] || []).includes(opt.name);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleOption(sec.id, opt.name, sec.type === 'single')}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 font-medium hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.name}</span>
                      {opt.priceDelta !== 0 && (
                        <span className="text-[10px] font-bold opacity-70 ml-2">
                          +${opt.priceDelta}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity & Buy Button */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-black text-xs text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={isPurchasing}
          className="flex-1 py-3 px-6 bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 active:scale-98 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isPurchasing ? 'Processing Order...' : `Buy with Escrow Vault Protection ($${calculatedTotalPrice.toFixed(2)})`}</span>
        </button>
      </div>
    </div>
  );
};
