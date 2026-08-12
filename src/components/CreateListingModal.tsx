'use client';

import React, { useState } from 'react';
import { User, MarketplaceCategory, ProductCondition } from '../types';
import { X, Store, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CreateListingModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitListing: (listingData: {
    title: string;
    description: string;
    category: MarketplaceCategory;
    condition: ProductCondition;
    price: number;
    originalPrice?: number;
    rentalPeriod?: 'per_hour' | 'per_day' | 'per_week' | 'per_month';
    wholesaleMinQty?: number;
    images: string[];
    location: string;
    stockQty?: number;
    tags: string[];
  }) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  onClose,
  onSubmitListing
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('new_products');
  const [condition, setCondition] = useState<ProductCondition>('new');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState<'per_day' | 'per_week'>('per_day');
  const [wholesaleMinQty, setWholesaleMinQty] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'Austin, TX');
  const [stockQty, setStockQty] = useState('10');
  const [tags, setTags] = useState('smallbusiness, handmade, shoplocal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) return;

    const tagList = tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    onSubmitListing({
      title,
      description,
      category,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      rentalPeriod: category === 'rentals' ? rentalPeriod : undefined,
      wholesaleMinQty: category === 'wholesale_b2b' ? Number(wholesaleMinQty) : undefined,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
      location,
      stockQty: Number(stockQty) || 1,
      tags: tagList
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl relative space-y-4 my-8">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-600" /> Create Marketplace Listing
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ergonomic Walnut Desk Stand"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
              >
                <option value="new_products">✨ New Products</option>
                <option value="second_hand">🔄 Second-hand / Used Goods</option>
                <option value="services">🛠️ Services Marketplace</option>
                <option value="rentals">🗝️ Rental Marketplace</option>
                <option value="wholesale_b2b">📦 Wholesale / B2B Section</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
                <option value="service">Service</option>
                <option value="rental">Rental Item</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-bold"
              />
            </div>

            {category === 'rentals' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rental Period</label>
                <select
                  value={rentalPeriod}
                  onChange={(e) => setRentalPeriod(e.target.value as 'per_day' | 'per_week')}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="per_day">Per Day</option>
                  <option value="per_week">Per Week</option>
                </select>
              </div>
            ) : category === 'wholesale_b2b' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Min Order Qty</label>
                <input
                  type="number"
                  value={wholesaleMinQty}
                  onChange={(e) => setWholesaleMinQty(e.target.value)}
                  placeholder="5"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original Price ($) (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="65.00"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail materials, dimensions, features, or service terms..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Photo URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Publish Listing
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
