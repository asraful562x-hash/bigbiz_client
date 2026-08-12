'use client';

import React, { useState } from 'react';
import { User, MarketplaceCategory, ProductCondition } from '../types';
import { X, Handshake, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface SellToUsModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitOffer: (offerData: {
    title: string;
    category: MarketplaceCategory;
    condition: ProductCondition;
    expectedPrice: number;
    description: string;
    images: string[];
    location: string;
  }) => void;
}

export const SellToUsModal: React.FC<SellToUsModalProps> = ({
  currentUser,
  onClose,
  onSubmitOffer
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('second_hand');
  const [condition, setCondition] = useState<ProductCondition>('used');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'Austin, TX');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !expectedPrice || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitOffer({
        title,
        category,
        condition,
        expectedPrice: Number(expectedPrice),
        description,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'],
        location
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const isPremium = currentUser.subscriptionStatus === 'premium';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Direct Procurement Offer
            </span>
            {isPremium && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Priority Review
              </span>
            )}
          </div>

          <h2 className="text-xl font-black">Submit Direct Offer to BizSocial Buy Desk</h2>
          <p className="text-xs text-slate-300 mt-1">
            Skip public marketplace negotiation! Submit your overstock or used items directly to our team for a fast buyout offer.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surplus Woodworking Router Bits Lot (15 pcs)"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              >
                <option value="new_products">New Products Overstock</option>
                <option value="second_hand">Second-hand / Used Equipment</option>
                <option value="rentals">Rentals / Tools</option>
                <option value="wholesale_b2b">Wholesale / B2B Inventory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              >
                <option value="new">Brand New / Sealed</option>
                <option value="used">Used / Fair</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Buyout Price ($)</label>
              <input
                type="number"
                required
                min="1"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                placeholder="250.00"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Inspection Notes</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail quantity, reason for selling, accessories included, and condition specifics..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Photo URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Guarantee info */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>If rejected or counter-offered, you can automatically convert this offer into a public marketplace listing in 1-click!</span>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? 'Submitting to Buy Desk...' : 'Submit Offer to Buy Desk'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
