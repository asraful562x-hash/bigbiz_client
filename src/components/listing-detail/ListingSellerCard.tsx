'use client';

import React from 'react';
import { Listing } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  Star, 
  ExternalLink 
} from 'lucide-react';

interface ListingSellerCardProps {
  listing: Listing;
  onOpenChat?: (sellerId: string) => void;
  onOpenSellerProfile?: (sellerId: string) => void;
}

export const ListingSellerCard: React.FC<ListingSellerCardProps> = ({
  listing,
  onOpenChat,
  onOpenSellerProfile,
}) => {
  return (
    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={listing.sellerAvatar}
            alt={listing.sellerName}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                {listing.sellerName}
              </h4>
              {listing.isVerifiedSeller && (
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block">
              {listing.storeCategory || 'Verified Enterprise Merchant'}
            </span>
          </div>
        </div>

        {listing.location && (
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {listing.location}
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        {onOpenChat && (
          <button
            type="button"
            onClick={() => onOpenChat(listing.sellerId)}
            className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            Inquire / Send Quote
          </button>
        )}

        {onOpenSellerProfile && (
          <button
            type="button"
            onClick={() => onOpenSellerProfile(listing.sellerId)}
            className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Storefront
          </button>
        )}
      </div>
    </div>
  );
};
