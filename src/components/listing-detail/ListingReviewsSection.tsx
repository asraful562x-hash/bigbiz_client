'use client';

import React from 'react';
import { Review } from '../../types';
import { Star, ShieldCheck } from 'lucide-react';

interface ListingReviewsSectionProps {
  reviews: Review[];
  listingId: string;
}

export const ListingReviewsSection: React.FC<ListingReviewsSectionProps> = ({
  reviews,
  listingId,
}) => {
  const listingReviews = reviews.slice(0, 5);

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Verified Buyer Reviews ({listingReviews.length})
        </h4>
        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Verified
        </span>
      </div>

      <div className="space-y-2.5">
        {listingReviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No reviews yet for this listing. Be the first verified buyer!</p>
        ) : (
          listingReviews.slice(0, 3).map((r) => (
            <div key={r.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{r.buyerName}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{r.createdAt}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
