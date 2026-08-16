'use client';

import React, { useState, useMemo } from 'react';
import { User, Listing, Review, ProductVariant, ProductFeature, ProductOptionSection, ProductOptionItem } from '../types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  MessageSquare, 
  ShoppingBag, 
  Star, 
  Store,
  Folder,
  Plus,
  Minus,
  Check,
  Layers,
  Sliders,
  Radio,
  CheckSquare
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  currentUser: User;
  reviews: Review[];
  onClose: () => void;
  onOpenChat: (sellerId: string) => void;
  onBuyNow: (listing: Listing, shippingAddress: string, selectedOptions?: {
    variant?: ProductVariant;
    selectedFeatures?: ProductFeature[];
    quantity?: number;
    finalPrice?: number;
  }) => void;
  onOpenSellerProfile?: (sellerId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  currentUser,
  reviews,
  onClose,
  onOpenChat,
  onBuyNow,
  onOpenSellerProfile
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(currentUser.location || '');
  const [isBuying, setIsBuying] = useState(false);

  // ── Dynamic Customization State ──
  // 1. Variant Selection (e.g. Color, Style, Model)
  const defaultVariants: ProductVariant[] = useMemo(() => {
    if (listing.variants && listing.variants.length > 0) {
      return listing.variants;
    }
    return [
      { id: 'def_1', name: 'Standard Edition', priceDelta: 0, inStock: true },
      { id: 'def_2', name: 'Premium Edition', priceDelta: 10, inStock: true }
    ];
  }, [listing]);

  const defaultFeatures: ProductFeature[] = useMemo(() => {
    if (listing.features && listing.features.length > 0) {
      return listing.features;
    }
    return [
      { id: 'feat_d1', name: 'Priority Insured Express Dispatch', price: 9.50, description: 'Dispatched within 12 hours with dedicated tracking' },
      { id: 'feat_d2', name: 'Extended 2-Year Full Replacement Warranty', price: 15.00, description: '100% money back guarantee against wear & tear' }
    ];
  }, [listing]);

  const activeVariants = defaultVariants;
  const activeFeatures = defaultFeatures;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(activeVariants[0]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // ── Option Section selections: { [sectionId]: itemId[] }
  // For 'single' sections, max one itemId in the array.
  const [sectionSelections, setSectionSelections] = useState<Record<string, string[]>>({});

  // Sync state whenever listing prop changes & auto-select seller defaults
  React.useEffect(() => {
    // 1. Initialize Variant Default
    const defaultVar = activeVariants.find(v => v.isDefault) || activeVariants[0];
    if (defaultVar) {
      setSelectedVariant(defaultVar);
    }
    setSelectedFeatureIds([]);

    // 2. Initialize Option Section Defaults
    const initialSelections: Record<string, string[]> = {};
    if (listing.optionSections && listing.optionSections.length > 0) {
      listing.optionSections.forEach(section => {
        const defaultItems = section.items.filter(i => i.isDefault);
        if (defaultItems.length > 0) {
          initialSelections[section.id] = section.type === 'single'
            ? [defaultItems[0].id]
            : defaultItems.map(i => i.id);
        } else if (section.isRequired && section.type === 'single' && section.items.length > 0) {
          // If section is required single-choice without explicit default, pre-select first item
          initialSelections[section.id] = [section.items[0].id];
        } else {
          initialSelections[section.id] = [];
        }
      });
    }
    setSectionSelections(initialSelections);

    setQuantity(1);
    setSelectedImgIndex(0);
  }, [listing.id, activeVariants, listing.optionSections]);

  const maxStock = listing.stockQty || 10;

  const toggleFeature = (featureId: string) => {
    setSelectedFeatureIds(prev => 
      prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
    );
  };

  const handleSectionItemClick = (section: ProductOptionSection, itemId: string) => {
    setSectionSelections(prev => {
      const current = prev[section.id] || [];
      if (section.type === 'single') {
        // Toggle off if same and not required, else set new
        if (current[0] === itemId && !section.isRequired) {
          return { ...prev, [section.id]: [] };
        }
        return { ...prev, [section.id]: [itemId] };
      } else {
        // Multiple: toggle
        const updated = current.includes(itemId)
          ? current.filter(id => id !== itemId)
          : [...current, itemId];
        return { ...prev, [section.id]: updated };
      }
    });
  };

  // Selected features array
  const selectedFeatures = useMemo(() => {
    return activeFeatures.filter(f => selectedFeatureIds.includes(f.id));
  }, [activeFeatures, selectedFeatureIds]);

  // Total price delta from option sections
  const sectionPriceDelta = useMemo(() => {
    if (!listing.optionSections) return 0;
    let delta = 0;
    listing.optionSections.forEach(section => {
      const selectedIds = sectionSelections[section.id] || [];
      selectedIds.forEach(itemId => {
        const item = section.items.find(i => i.id === itemId);
        if (item) delta += item.priceDelta;
      });
    });
    return delta;
  }, [listing.optionSections, sectionSelections]);

  // Dynamic Unit Price Calculation = base price + variant delta + section deltas + selected features price
  const unitPrice = useMemo(() => {
    let price = listing.price;
    if (selectedVariant?.priceDelta) price += selectedVariant.priceDelta;
    price += sectionPriceDelta;
    selectedFeatures.forEach(f => { price += f.price; });
    return Math.max(0, price);
  }, [listing.price, selectedVariant, sectionPriceDelta, selectedFeatures]);

  // Total calculated price = unitPrice * quantity
  const totalPrice = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const sellerReviews = reviews.filter(r => r.sellerId === listing.sellerId);

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuying(true);
    setTimeout(() => {
      onBuyNow(listing, shippingAddress, {
        variant: selectedVariant,
        selectedFeatures,
        quantity,
        finalPrice: totalPrice
      });
      setIsBuying(false);
      setShowCheckoutModal(false);
      onClose();
    }, 600);
  };

  return (
    /* Outer overlay */
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="min-h-full flex items-start lg:items-center justify-center p-2 sm:p-3 lg:p-5">

        {/* Modal Card — grows wide on desktop, full-width on mobile */}
        <div className="bg-white rounded-2xl lg:rounded-3xl w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-7xl xl:max-w-[1320px] border border-slate-200 shadow-2xl overflow-hidden relative lg:max-h-[94vh] flex flex-col">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Two-column layout: stacks on mobile, wide side-by-side on lg+ */}
          <div className="flex flex-col lg:grid lg:grid-cols-[38%_62%] flex-1 min-h-0">

            {/* Left Column: Image Gallery & Summary */}
            <div className="bg-slate-950 p-4 lg:p-5 flex flex-col gap-3 h-full min-h-full overflow-y-auto justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-white/10">
                  <img
                    src={listing.images[selectedImgIndex] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
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
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImgIndex === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Summary of Chosen Customizations */}
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2 hidden md:block">
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 block">
                Configuration Summary
              </span>
              {selectedVariant && (
                <div className="flex justify-between text-slate-200">
                  <span>Variant:</span>
                  <span className="font-bold text-white">{selectedVariant.name}</span>
                </div>
              )}
                {/* Option section selections summary */}
                {listing.optionSections && listing.optionSections.map(section => {
                  const ids = sectionSelections[section.id] || [];
                  if (ids.length === 0) return null;
                  const items = section.items.filter(i => ids.includes(i.id));
                  return (
                    <div key={section.id} className="flex justify-between gap-2">
                      <span className="text-slate-400 shrink-0">{section.title}:</span>
                      <span className="font-bold text-white text-right">{items.map(i => i.name).join(', ')}</span>
                    </div>
                  );
                })}
                {selectedFeatures.length > 0 && (
                  <div className="space-y-0.5 pt-1 border-t border-white/10">
                    <span className="text-[10px] text-slate-400 font-semibold">Add-on Upgrades ({selectedFeatures.length}):</span>
                    {selectedFeatures.map(f => (
                      <div key={f.id} className="flex justify-between text-[11px] text-emerald-300">
                        <span className="truncate">+ {f.name}</span>
                        <span className="font-bold shrink-0">+${f.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-white/10 font-black text-white text-sm">
                  <span>Unit Price:</span>
                  <span className="text-emerald-400">${unitPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Listing Details, Modifications & Actions */}
            <div className="flex flex-col flex-1 h-full min-h-0 bg-white overflow-hidden">

              {/* Scrollable Details Body */}
              <div className="p-5 sm:p-6 lg:p-7 overflow-y-auto flex-1 min-h-0 space-y-4">

                {/* Category & Condition Badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-200">
                    {listing.category.replace('_', ' ')}
                  </span>
                  {listing.storeCategory && (
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-200 flex items-center gap-1">
                      <Folder className="w-3 h-3" /> {listing.storeCategory}
                    </span>
                  )}
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Condition: {listing.condition}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                  {listing.title}
                </h1>

                {/* Dynamic Calculated Price Header */}
                <div className="p-3.5 lg:p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-2xl lg:text-4xl font-black text-slate-900">
                      ${unitPrice.toFixed(2)}
                      {listing.rentalPeriod && <span className="text-base font-medium text-slate-500"> / {listing.rentalPeriod.replace('per_', '')}</span>}
                    </span>
                    {listing.originalPrice && (
                      <span className="text-sm lg:text-base text-slate-400 line-through ml-2">
                        ${listing.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 block font-medium mt-1">
                      Base price: ${listing.price.toFixed(2)}
                    </span>
                  </div>

                  {quantity > 1 && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total for {quantity} units</span>
                      <span className="text-xl lg:text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Escrow Guarantee Banner */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold block">100% Escrow Protection Guaranteed</span>
                    Funds held in neutral Escrow Vault until you receive & inspect your customized order.
                  </div>
                </div>

                {/* ── PRODUCT MODIFICATION FEATURES ── */}

                {/* 1. DYNAMIC VARIANT SELECTOR BUTTONS */}
                {activeVariants && activeVariants.length > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>Select Option / Variant:</span>
                      </label>
                      <span className="text-[11px] font-extrabold text-indigo-700">
                        {selectedVariant?.name || 'Default'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {activeVariants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102 ring-2 ring-indigo-500/30'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{v.name}</span>
                            {v.priceDelta && v.priceDelta !== 0 ? (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                                isSelected ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700'
                              }`}>
                                {v.priceDelta > 0 ? `+$${v.priceDelta.toFixed(2)}` : `-$${Math.abs(v.priceDelta).toFixed(2)}`}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. OPTION SECTIONS (seller-built: Size, Crust, Toppings etc.) */}
                {listing.optionSections && listing.optionSections.length > 0 && (
                  <div className="space-y-2.5">
                    {listing.optionSections.map((section) => {
                      const selectedIds = sectionSelections[section.id] || [];
                      return (
                        <div key={section.id} className="p-3.5 bg-violet-50/50 rounded-2xl border border-violet-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                              {section.type === 'single'
                                ? <Radio className="w-3.5 h-3.5 text-indigo-600" />
                                : <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                              }
                              <span>{section.title}</span>
                              {section.isRequired && (
                                <span className="text-[9px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">Required</span>
                              )}
                            </label>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {section.type === 'single' ? 'Choose 1' : 'Choose any'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {section.items.map((item) => {
                              const isSelected = selectedIds.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => handleSectionItemClick(section, item.id)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                    isSelected
                                      ? section.type === 'single'
                                        ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/30'
                                        : 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                                      : 'bg-white text-slate-700 border-slate-200 hover:border-violet-400 hover:bg-violet-50/50'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  <span>{item.name}</span>
                                  {item.priceDelta !== 0 && (
                                    <span className={`text-[10px] px-1 py-0.5 rounded-md font-extrabold ${
                                      isSelected
                                        ? 'bg-white/20 text-white'
                                        : item.priceDelta > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                    }`}>
                                      {item.priceDelta > 0 ? `+$${item.priceDelta.toFixed(2)}` : `-$${Math.abs(item.priceDelta).toFixed(2)}`}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. DYNAMIC PRICE-DEPENDENT ADD-ON FEATURES */}
                {activeFeatures && activeFeatures.length > 0 && (
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        <span>Custom Add-on Features (Price Dependent):</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {selectedFeatureIds.length} selected
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {activeFeatures.map((f) => {
                        const isSelected = selectedFeatureIds.includes(f.id);
                        return (
                          <div
                            key={f.id}
                            onClick={() => toggleFeature(f.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-400 shadow-2xs'
                                : 'bg-white border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                                isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-slate-900 block truncate">{f.name}</span>
                                {f.description && (
                                  <span className="text-[10px] text-slate-500 block truncate">{f.description}</span>
                                )}
                              </div>
                            </div>
                            <span className="font-extrabold text-xs text-emerald-700 shrink-0 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              +${f.price.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. QUANTITY SELECTION CONTROLS */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Quantity</label>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {maxStock} units available in stock
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-black text-xs text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.min(maxStock, prev + 1))}
                      disabled={quantity >= maxStock}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
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

                {/* Seller Card & Store Collections */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div 
                      onClick={() => {
                        onClose();
                        onOpenSellerProfile?.(listing.sellerId);
                      }}
                      className="flex items-center gap-3 cursor-pointer group/seller"
                      title="Click to view all categories & products from this seller"
                    >
                      <img
                        src={listing.sellerAvatar}
                        alt={listing.sellerName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-300 shrink-0 group-hover/seller:ring-2 group-hover/seller:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-xs text-slate-900 group-hover/seller:text-indigo-600 underline-offset-2 group-hover/seller:underline">
                            {listing.sellerName}
                          </span>
                          {listing.isVerifiedSeller && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                        </div>
                        <span className="text-[11px] text-slate-500 block">Verified Small Business Seller</span>
                        {listing.storeCategory && (
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
                            <Folder className="w-2.5 h-2.5" /> {listing.storeCategory}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenChat(listing.sellerId);
                        }}
                        className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenSellerProfile?.(listing.sellerId);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5" /> View Storefront
                      </button>
                    </div>
                  </div>
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

              {/* Fixed Bottom Buy Action Bar */}
              <div className="px-5 sm:px-6 lg:px-7 py-3.5 lg:py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Total</span>
                  <span className="text-xl lg:text-2xl font-black text-indigo-700">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm lg:text-base py-3 lg:py-3.5 px-4 sm:px-6 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 shrink-0" />
                  <span>Buy ({quantity} {quantity === 1 ? 'item' : 'items'}) · ${totalPrice.toFixed(2)} via Escrow</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-3 sm:p-4 py-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Secure Escrow Checkout
              </h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between gap-2 font-medium">
                <span className="text-slate-600 shrink-0">Item:</span>
                <span className="font-bold text-slate-900 text-right">{listing.title}</span>
              </div>
              {selectedVariant && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-600 shrink-0">Selected Variant:</span>
                  <span className="font-bold text-indigo-700">{selectedVariant.name}</span>
                </div>
              )}
              {/* Option section selections in checkout */}
              {listing.optionSections && listing.optionSections.map(section => {
                const ids = sectionSelections[section.id] || [];
                if (ids.length === 0) return null;
                const items = section.items.filter(i => ids.includes(i.id));
                const sectionDelta = items.reduce((sum, i) => sum + i.priceDelta, 0);
                return (
                  <div key={section.id} className="flex justify-between gap-2">
                    <span className="text-slate-600 shrink-0">{section.title}:</span>
                    <span className="font-bold text-violet-700 text-right">
                      {items.map(i => i.name).join(', ')}
                      {sectionDelta !== 0 && <span className="text-[10px] ml-1 text-emerald-700">{sectionDelta > 0 ? `+$${sectionDelta.toFixed(2)}` : `-$${Math.abs(sectionDelta).toFixed(2)}`}</span>}
                    </span>
                  </div>
                );
              })}
              {selectedFeatures.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-semibold block">Custom Add-on Features:</span>
                  {selectedFeatures.map(f => (
                    <div key={f.id} className="flex justify-between text-[11px] pl-2 text-emerald-800">
                      <span>• {f.name}</span>
                      <span className="font-bold">+${f.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between gap-2 pt-1 border-t border-slate-200">
                <span className="text-slate-600 shrink-0">Quantity:</span>
                <span className="font-bold">{quantity} units</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600 shrink-0">Unit Price:</span>
                <span className="font-bold">${unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600 shrink-0">Escrow & Insured Delivery:</span>
                <span className="font-bold">$4.50</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Escrow Hold:</span>
                <span className="text-indigo-600">${(totalPrice + 4.50).toFixed(2)}</span>
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isBuying ? 'Securing Escrow Vault...' : `Confirm & Hold $${(totalPrice + 4.50).toFixed(2)} in Escrow`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
