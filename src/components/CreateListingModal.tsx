'use client';

import React, { useState } from 'react';
import { User, MarketplaceCategory, ProductCondition, ProductVariant, ProductFeature, ProductOptionSection } from '../types';
import { X, Store, FolderPlus, Plus, Check, Sliders, Trash2 } from 'lucide-react';

import { ImageGalleryUploader } from './listing-create/ImageGalleryUploader';
import { VariantManager } from './listing-create/VariantManager';
import { OptionSectionBuilder } from './listing-create/OptionSectionBuilder';

interface CreateListingModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitListing: (listingData: {
    title: string;
    description: string;
    category: MarketplaceCategory;
    storeCategory: string;
    condition: ProductCondition;
    price: number;
    originalPrice?: number;
    variants?: ProductVariant[];
    features?: ProductFeature[];
    optionSections?: ProductOptionSection[];
    rentalPeriod?: 'per_hour' | 'per_day' | 'per_week' | 'per_month';
    wholesaleMinQty?: number;
    images: string[];
    location: string;
    stockQty?: number;
    tags: string[];
  }) => void;
  onAddCategory?: (categoryName: string) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  onClose,
  onSubmitListing,
  onAddCategory
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('new_products');
  const [storeCategory, setStoreCategory] = useState<string>(
    currentUser.customCategories && currentUser.customCategories.length > 0 
      ? currentUser.customCategories[0] 
      : ''
  );
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(
    !currentUser.customCategories || currentUser.customCategories.length === 0
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [condition, setCondition] = useState<ProductCondition>('new');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState<'per_day' | 'per_week'>('per_day');
  const [wholesaleMinQty, setWholesaleMinQty] = useState('');
  
  // Multi-image list
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
  ]);
  
  const [location, setLocation] = useState(currentUser.location || 'Austin, TX');
  const [stockQty, setStockQty] = useState('10');
  const [tags, setTags] = useState('smallbusiness, handmade, shoplocal');

  // Modular Sub-State: Variants, Features, Custom Option Sections
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [optionSections, setOptionSections] = useState<ProductOptionSection[]>([]);

  // Feature Add-on Inputs
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeaturePrice, setNewFeaturePrice] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Feature
  const handleAddFeature = () => {
    if (!newFeatureName.trim() || !newFeaturePrice) return;
    const newFeature: ProductFeature = {
      id: `feat_${Date.now()}`,
      name: newFeatureName.trim(),
      price: Number(newFeaturePrice),
      description: newFeatureDesc.trim() || undefined
    };
    setFeatures(prev => [...prev, newFeature]);
    setNewFeatureName('');
    setNewFeaturePrice('');
    setNewFeatureDesc('');
  };

  const handleRemoveFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  // Add Storefront Category
  const handleAddNewStoreCategory = () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name cannot be empty');
      return;
    }
    const cleanName = newCategoryName.trim();
    if (currentUser.customCategories?.includes(cleanName)) {
      setCategoryError('This category already exists');
      return;
    }
    if (onAddCategory) {
      onAddCategory(cleanName);
    }
    setStoreCategory(cleanName);
    setNewCategoryName('');
    setIsCreatingNewCategory(false);
    setCategoryError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) return;

    if (images.length === 0) {
      alert('Please add at least 1 photo for your listing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitListing({
        title,
        description,
        category,
        storeCategory: storeCategory || 'General Collection',
        condition,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        variants: variants.length > 0 ? variants : undefined,
        features: features.length > 0 ? features : undefined,
        optionSections: optionSections.length > 0 ? optionSections : undefined,
        rentalPeriod: category === 'rentals' ? rentalPeriod : undefined,
        wholesaleMinQty: category === 'wholesale_b2b' && wholesaleMinQty ? Number(wholesaleMinQty) : undefined,
        images,
        location,
        stockQty: Number(stockQty) || 1,
        tags: tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).filter(Boolean)
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* ── 1. LAYER: PINNED FIXED HEADER ── */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 px-6 shrink-0 relative flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Create Verified Business Listing
              </h2>
              <p className="text-xs text-indigo-200">
                Publish products, services, rentals, or wholesale lots with dynamic options & escrow protection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── 2. LAYER: ISOLATED SCROLLABLE FORM BODY ── */}
        <form id="createListingForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Multi-Photo Gallery */}
          <ImageGalleryUploader images={images} setImages={setImages} />

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Listing Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ergonomic Solid Oak Standing Desk"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Description & Scope <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material, specifications, warranty, shipping & deliverables..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category, Condition & Base Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marketplace Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
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
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
                <option value="service">Service</option>
                <option value="rental">Rental Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Dynamic Product Variants */}
          <VariantManager variants={variants} setVariants={setVariants} />

          {/* Dynamic Option & Selection Sections */}
          <OptionSectionBuilder optionSections={optionSections} setOptionSections={setOptionSections} />

          {/* Add-on Feature Upgrades */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Add-on Feature Upgrades (Checklist)</span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-700">Buyer checks & price adjusts</span>
            </div>

            {features.length > 0 && (
              <div className="space-y-1.5">
                {features.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-200 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{f.name}</span>
                        <span className="font-extrabold text-emerald-700">+${f.price.toFixed(2)}</span>
                      </div>
                      {f.description && <p className="text-[10px] text-slate-500 mt-0.5">{f.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(f.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                placeholder="Feature name (e.g. Laser Engraving, Extended Warranty)"
                className="flex-1 text-xs px-3 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none"
              />
              <input
                type="number"
                step="0.01"
                value={newFeaturePrice}
                onChange={(e) => setNewFeaturePrice(e.target.value)}
                placeholder="+$ Price"
                className="w-24 text-xs font-bold px-2 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none text-right"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch / Pickup Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Keywords / Hashtags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. furniture, tech, wholesale"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

        </form>

        {/* ── 3. LAYER: PINNED FIXED ACTION FOOTER ── */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 shadow-lg z-10">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="createListingForm"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing Listing...' : 'Publish Listing with Escrow'}
          </button>
        </div>

      </div>
    </div>
  );
};
