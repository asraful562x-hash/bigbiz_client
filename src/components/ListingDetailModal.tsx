'use client';

import React, { useState } from 'react';
import { User, Listing, Review } from '../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  ShoppingBag, 
  Star, 
  Heart, 
  Share2, 
  Calendar, 
  Box, 
  Truck,
  Sparkles
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  currentUser: User;
  reviews: Review[];
  onClose: () => void;
  onOpenChat: (sellerId: string) => void;
  onBuyNow: (listing: Listing, shippingAddress: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentUser,
  reviews,
  onClose,
  onOpenChat,
  onBuyNow
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(currentUser.location || '');
  const [isBuying, setIsBuying] = useState(false);

  const sellerReviews = reviews.filter(r => r.sellerId === listing.sellerId);

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuying(true);
    setTimeout(() => {
      onBuyNow(listing, shippingAddress);
      setIsBuying(false);
      setShowCheckoutModal(false);
      onClose();
    }, 600);
  };

  return (
    /* Outer overlay: scrollable so full modal is reachable on any screen size */
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="min-h-full flex items-start md:items-center justify-center p-3 sm:p-4 py-6">

        {/* Modal Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl border border-slate-200 shadow-2xl overflow-hidden relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Two-column layout: stacks on mobile, side-by-side on md+ */}
          <div className="flex flex-col md:grid md:grid-cols-2">

            {/* Left Column: Image Gallery */}
            <div className="bg-slate-950 p-4 flex flex-col gap-3">
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={listing.images[selectedImgIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail selector */}
              {listing.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImgIndex === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Listing Details & Actions */}
            {/* On desktop: max-h + scroll. On mobile: no max-h, flows naturally */}
            <div className="p-4 sm:p-6 flex flex-col gap-5 md:max-h-[80vh] md:overflow-y-auto">

              <div className="space-y-4">

                {/* Category & Condition Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200">
                    {listing.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Condition: {listing.condition}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl font-black text-slate-900 leading-snug">
                  {listing.title}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-black text-slate-900">
                    ${listing.price.toFixed(2)}
                    {listing.rentalPeriod && <span className="text-sm font-medium text-slate-500"> / {listing.rentalPeriod.replace('per_', '')}</span>}
                  </span>
                  {listing.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${listing.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Escrow Guarantee Banner */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold block">100% Escrow Protection Guaranteed</span>
                    Your payment is safely held in Escrow until you receive and confirm your order.
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{listing.location}</span>
                </div>

                {/* Seller Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={listing.sellerAvatar}
                      alt={listing.sellerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-900">{listing.sellerName}</span>
                        {listing.isVerifiedSeller && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                      </div>
                      <span className="text-[11px] text-slate-500">Verified Small Business Seller</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat(listing.sellerId);
                    }}
                    className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>

                {/* Seller Reviews */}
                {sellerReviews.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Buyer Reviews ({sellerReviews.length})
                    </h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {sellerReviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{rev.buyerName}</span>
                            <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-slate-600">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Buy Action Bar — sticky at bottom on desktop, normal flow on mobile */}
              <div className="pt-4 border-t border-slate-200 flex items-center gap-3 md:sticky md:bottom-0 bg-white md:pb-2">
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Buy Now via Escrow (${listing.price.toFixed(2)})</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-3 sm:p-4 py-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Secure Escrow Checkout
              </h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between gap-2 font-medium">
                <span className="text-slate-600 shrink-0">Item:</span>
                <span className="font-bold text-slate-900 text-right">{listing.title}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600 shrink-0">Price:</span>
                <span className="font-bold">${listing.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600 shrink-0">Escrow & Insured Shipping:</span>
                <span className="font-bold">$4.50</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Escrow Amount:</span>
                <span className="text-indigo-600">${(listing.price + 4.50).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPurchase} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery / Shipping Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, City, State ZIP"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                🔒 Funds will be held safely in the BizSocial Escrow Vault and will only be released to {listing.sellerName} when you confirm delivery.
              </p>

              <button
                type="submit"
                disabled={isBuying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isBuying ? 'Securing Escrow Vault...' : 'Confirm & Hold Payment in Escrow'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
