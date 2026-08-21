'use client';

import React from 'react';
import { Listing } from '../../types';
import { ShoppingBag, Star, Tag } from 'lucide-react';

interface SellerProductsTabProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export const SellerProductsTab: React.FC<SellerProductsTabProps> = ({
  listings,
  onSelectListing,
}) => {
  if (listings.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-2">
        <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
        <p className="text-sm font-bold">No active product listings in this storefront</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((l) => (
        <div
          key={l.id}
          onClick={() => onSelectListing?.(l)}
          className="group bg-white rounded-3xl p-3.5 border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer space-y-3"
        >
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={l.images[0]}
              alt={l.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
              {l.category.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {l.title}
            </h4>
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-black text-slate-900">${l.price.toFixed(2)}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Escrow Protected
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
