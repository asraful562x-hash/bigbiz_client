'use client';

import React, { useState } from 'react';
import { User, MarketplaceCategory, ProductCondition, ProductVariant, ProductFeature, ProductOptionSection } from '../types';
import { X, Store, FolderPlus, Plus, Check, Sliders, Trash2 } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

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
    condition?: ProductCondition;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
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
  onNavigateToPaymentSettings?: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  onClose,
  onSubmitListing,
  onAddCategory,
  onNavigateToPaymentSettings
}) => {
  const [isPaymentConfigured, setIsPaymentConfigured] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkPaymentMethod = async () => {
      try {
        const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;
        const res = await fetch(`/api/payment/settings?user_id=${numUserId}`);
        if (res.ok) {
          const json = await res.json();
          setIsPaymentConfigured(Boolean(json.configured));
        } else {
          setIsPaymentConfigured(false);
        }
      } catch {
        setIsPaymentConfigured(false);
      }
    };
    checkPaymentMethod();
  }, [currentUser.id]);
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

  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState<'per_day' | 'per_week'>('per_day');
  const [wholesaleMinQty, setWholesaleMinQty] = useState('');
  
  // Multi-image list — start empty so only user's actual uploads appear
  const [images, setImages] = useState<string[]>([]);
  
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
      setCategoryError('Please type a category name first');
      return;
    }
    const cleanName = newCategoryName.trim();
    if (onAddCategory) {
      onAddCategory(cleanName);
    }
    setStoreCategory(cleanName);
    setNewCategoryName('');
    setIsCreatingNewCategory(false);
    setCategoryError(null);
  };

  const [showMissingImageModal, setShowMissingImageModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !description) return;

    if (isPaymentConfigured === false) {
      alert('Please connect your Chain Hook payment method in Settings before listing products for sale.');
      if (onNavigateToPaymentSettings) {
        onClose();
        onNavigateToPaymentSettings();
      }
      return;
    }

    if (images.length === 0) {
      setShowMissingImageModal(true);
      return;
    }

    // Auto-create category if seller typed a new one but didn't click "Add" button
    let finalStoreCategory = storeCategory || 'General Collection';
    if (isCreatingNewCategory && newCategoryName.trim()) {
      const cleanName = newCategoryName.trim();
      finalStoreCategory = cleanName;
      if (onAddCategory) {
        onAddCategory(cleanName);
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitListing({
        title,
        description,
        category,
        storeCategory: finalStoreCategory,
        condition: 'new',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPercent: discountPercent && Number(discountPercent) >= 1 && Number(discountPercent) <= 99 ? Number(discountPercent) : undefined,
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
          
          {/* Payment Method Guard Banner */}
          {isPaymentConfigured === false && (
            <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/90 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="https://res.cloudinary.com/ecxs6pgw/image/upload/v1783354359/logo_acvlmj.png"
                    alt="Chain Hook Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    ⚠️ Chain Hook Payment Method Required
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    You must connect your Chain Hook merchant credentials (Client Name & API Key) in Settings before you can list products for sale.
                  </p>
                </div>
              </div>
              {onNavigateToPaymentSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToPaymentSettings();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Configure in Settings →
                </button>
              )}
            </div>
          )}

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

          {/* Category, Base Price & Discount % (1-99) */}
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Discount %</span>
                <span className="text-[10px] text-indigo-600 font-bold">Range: 1 - 99%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="99"
                  step="1"
                  value={discountPercent}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setDiscountPercent('');
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (num < 1) setDiscountPercent('1');
                    else if (num > 99) setDiscountPercent('99');
                    else setDiscountPercent(String(num));
                  }}
                  placeholder="e.g. 15"
                  className="w-full text-xs px-3.5 py-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-indigo-700"
                />
                <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400 pointer-events-none">%</span>
              </div>
              {price && Number(price) > 0 && discountPercent && Number(discountPercent) >= 1 && Number(discountPercent) <= 99 && (
                <p className="text-[10px] text-emerald-600 font-extrabold mt-1">
                  Final: ${(Number(price) * (1 - Number(discountPercent) / 100)).toFixed(2)} (Save {discountPercent}%)
                </p>
              )}
            </div>
          </div>

          {/* ── STOREFRONT CATEGORY & CATEGORY CREATOR ── */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">Storefront Category / Collection</h4>
                  <p className="text-[10px] text-indigo-600 font-medium">
                    Organize your product inside your profile store under a specific category
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-indigo-200 text-[10px]">
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCategory(false)}
                  className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    !isCreatingNewCategory ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Select Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCategory(true)}
                  className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isCreatingNewCategory ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Create New</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Select Existing Category */}
            {!isCreatingNewCategory ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(['General Collection', ...(currentUser.customCategories || [])])).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStoreCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                        storeCategory === cat
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-indigo-200/80 hover:bg-indigo-50'
                      }`}
                    >
                      {storeCategory === cat && <Check className="w-3.5 h-3.5" />}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Selected Category: <span className="font-extrabold text-indigo-700">{storeCategory || 'General Collection'}</span>
                </p>
              </div>
            ) : (
              /* Mode 2: Category Creator (Create and assign new category on the fly) */
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setCategoryError(null);
                    }}
                    placeholder="New category name (e.g. Mechanical Keyboards, Winter Specials, Artisan Crafts)"
                    className="flex-1 text-xs px-3.5 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewStoreCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewStoreCategory}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>
                {categoryError && (
                  <p className="text-[11px] font-bold text-rose-600">{categoryError}</p>
                )}
                {storeCategory && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Will be assigned to category: "{storeCategory}"</span>
                  </p>
                )}
              </div>
            )}
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

          {/* Search Keywords / Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Search Keywords / Hashtags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. furniture, tech, wholesale, handmade"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
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

      {/* Missing Image Notification Modal Overlay */}
      <ConfirmModal
        isOpen={showMissingImageModal}
        title="Photo Required"
        message="Please add at least 1 photo for your product or software listing to proceed."
        confirmText="Got It"
        cancelText="Close"
        isDestructive={false}
        onConfirm={() => setShowMissingImageModal(false)}
        onCancel={() => setShowMissingImageModal(false)}
      />
    </div>
  );
};
