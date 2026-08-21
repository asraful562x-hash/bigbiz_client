'use client';

import React from 'react';
import { User } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Star, 
  MessageSquare, 
  ExternalLink, 
  Users 
} from 'lucide-react';

interface SellerHeaderCardProps {
  seller: User;
  onOpenChat?: (sellerId: string) => void;
  isCurrentUser: boolean;
  totalListings: number;
}

export const SellerHeaderCard: React.FC<SellerHeaderCardProps> = ({
  seller,
  onOpenChat,
  isCurrentUser,
  totalListings,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
      {/* Top Banner & Avatar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-md ring-1 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{seller.name}</h2>
              {seller.isVerified && <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />}
            </div>
            <p className="text-xs font-bold text-slate-500 mt-1">
              {seller.companyName || 'Verified Enterprise Storefront'}
            </p>
            {seller.location && (
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {seller.location}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {!isCurrentUser && onOpenChat && (
          <button
            type="button"
            onClick={() => onOpenChat(seller.id)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            Send Inquiry / Chat
          </button>
        )}
      </div>

      {/* Bio text */}
      {seller.bio && (
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          {seller.bio}
        </p>
      )}

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <span className="text-sm sm:text-base font-black text-slate-900 block">{totalListings}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog SKUs</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <span className="text-sm sm:text-base font-black text-slate-900 block">
            {seller.rating ? `${seller.rating.toFixed(1)} ★` : '5.0 ★'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating Score</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <span className="text-sm sm:text-base font-black text-slate-900 block">
            {seller.totalSales ? `$${seller.totalSales.toLocaleString()}` : '$12,450'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Escrow Volume</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <span className="text-sm sm:text-base font-black text-slate-900 block">
            {seller.followersCount || 128}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partners</span>
        </div>
      </div>
    </div>
  );
};
