'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Listing, MarketplaceCategory, ProductCondition } from '../types';
import { 
  Store, 
  Sparkles, 
  Handshake, 
  CheckCircle2, 
  MapPin, 
  Eye, 
  Heart, 
  ShoppingBag, 
  SlidersHorizontal, 
  Filter, 
  Grid, 
  List,
  Calendar,
  Box,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ChevronDown
} from 'lucide-react';

interface MarketplaceViewProps {
  currentUser: User;
  listings: Listing[];
  selectedCategory: MarketplaceCategory | 'all';
  setSelectedCategory: (cat: MarketplaceCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectListing: (listing: Listing) => void;
  onOpenSellToUs: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  currentUser,
  listings,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectListing,
  onOpenSellToUs
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // ── Category Scroller: pure transform-based, zero browser scroll APIs ─────
  const [catOffset, setCatOffset] = useState(0);
  const [catMaxOffset, setCatMaxOffset] = useState(0);
  const catOuterRef = useRef<HTMLDivElement>(null);
  const catInnerRef = useRef<HTMLDivElement>(null);

  const recalcCatMax = useCallback(() => {
    const outer = catOuterRef.current;
    const inner = catInnerRef.current;
    if (!outer || !inner) return;
    const outerW = outer.getBoundingClientRect().width;
    const innerW = inner.getBoundingClientRect().width;
    const newMax = Math.max(0, Math.round(innerW - outerW));
    setCatMaxOffset(newMax);
    setCatOffset(prev => Math.min(prev, newMax));
  }, []);

  useEffect(() => {
    recalcCatMax();
    const ro = new ResizeObserver(recalcCatMax);
    if (catInnerRef.current) ro.observe(catInnerRef.current);
    if (catOuterRef.current) ro.observe(catOuterRef.current);
    return () => ro.disconnect();
  }, [recalcCatMax]);

  const CAT_STEP = 200;
  const canCategoriesScrollLeft = catOffset > 1;
  const canCategoriesScrollRight = catOffset < catMaxOffset - 1;

  const scrollCategories = (direction: 'left' | 'right') => {
    setCatOffset(prev => {
      const next = direction === 'left' ? prev - CAT_STEP : prev + CAT_STEP;
      return Math.max(0, Math.min(next, catMaxOffset));
    });
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏪' },
    { id: 'new_products', name: 'New Products', icon: '✨' },
    { id: 'second_hand', name: 'Second-hand / Used', icon: '🔄' },
    { id: 'services', name: 'Services Marketplace', icon: '🛠️' },
    { id: 'rentals', name: 'Rental Marketplace', icon: '🗝️' },
    { id: 'wholesale_b2b', name: 'Wholesale / B2B', icon: '📦' },
  ];

  const filteredListings = listings.filter((l) => {
    if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
    if (selectedCondition !== 'all' && l.condition !== selectedCondition) return false;
    if (l.price < minPrice || l.price > maxPrice) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      const matchLoc = l.location.toLowerCase().includes(q);
      const matchTags = l.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-6">
      
      {/* 1. Promotional "Sell to Us" Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Handshake className="w-3.5 h-3.5" /> Direct Procurement Program
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Need Instant Cashflow for Your Small Business?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Submit your overstock, used tools, or commercial products directly to our <strong className="text-white">BizSocial Buy Desk</strong>. Get a cash purchase offer within 24-48 hours with guaranteed payout!
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSellToUs}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Submit "Sell to Us" Offer</span>
            </button>
            <span className="text-xs text-emerald-200">⭐ Priority queue for Premium Sellers</span>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Category Selector Pills */}
      <div className="relative flex items-center bg-white/60 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        {canCategoriesScrollLeft && (
          <button
            onClick={() => scrollCategories('left')}
            aria-label="Scroll left"
            className="p-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors shrink-0 mr-1.5 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* overflow:hidden mask — inner strip slides via translateX only */}
        <div ref={catOuterRef} className="flex-1 overflow-hidden min-w-0">
          <div
            ref={catInnerRef}
            style={{ transform: `translateX(-${catOffset}px)`, transition: 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            className="flex items-center gap-2 pb-0.5 w-max"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as MarketplaceCategory | 'all')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all border shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {canCategoriesScrollRight && (
          <button
            onClick={() => scrollCategories('right')}
            aria-label="Scroll right"
            className="p-1.5 rounded-xl bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors shrink-0 ml-1.5 shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Filters & View Toggle Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">

        {/* Top Row: Show Filters toggle (mobile/tablet) + View mode toggle (always right) */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filter Catalog</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 ml-auto">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`} title="Grid View">
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'}`} title="List View">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Filter Controls */}
        <div className={`${showFilters ? 'block' : 'hidden sm:block'} space-y-3 pt-2 border-t border-slate-100 min-[1300px]:space-y-0 min-[1300px]:flex min-[1300px]:items-center min-[1300px]:justify-between min-[1300px]:gap-4`}>

          {/* Condition Pills */}
          <div className="flex flex-wrap items-center gap-1.5 py-0.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-600" /> Condition:
            </span>
            {(['all', 'new', 'used', 'refurbished', 'service', 'rental'] as const).map((cond) => (
              <button key={cond} onClick={() => setSelectedCondition(cond)}
                className={`px-3 py-1 rounded-xl text-xs capitalize transition-all font-semibold shrink-0 ${
                  selectedCondition === cond ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >{cond}</button>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex items-center justify-end w-full min-[1300px]:w-auto">
            <div className="flex flex-col min-[1300px]:flex-row min-[1300px]:items-center gap-3 bg-slate-50/80 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-700 w-full min-[1300px]:w-auto">
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-500 font-bold">Price Range:</span>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-slate-400 font-medium text-xs">$</span>
                    <input type="number" min={0} max={maxPrice - 1} value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Math.min(Number(e.target.value) || 0, maxPrice - 1)))}
                      className="w-20 sm:w-24 pl-5 pr-1.5 py-1 text-xs font-extrabold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <span className="text-slate-400 font-bold px-0.5">–</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-slate-400 font-medium text-xs">$</span>
                    <input type="number" min={minPrice + 1} max={2000} value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.min(2000, Math.max(Number(e.target.value) || minPrice + 1, minPrice + 1)))}
                      className="w-20 sm:w-24 pl-5 pr-1.5 py-1 text-xs font-extrabold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
              <div className="relative w-full min-[1300px]:w-52 min-[1450px]:w-64 h-6 flex items-center select-none py-1">
                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
                <div className="absolute h-1.5 bg-slate-700 rounded-full transition-all duration-75 ease-out"
                  style={{ left: `${(minPrice / 2000) * 100}%`, width: `${((maxPrice - minPrice) / 2000) * 100}%` }} />
                <input type="range" min="0" max="2000" step="1" value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))}
                  className={`absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-700 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-700 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer ${minPrice > 1000 ? 'z-40' : 'z-25'}`}
                />
                <input type="range" min="0" max="2000" step="1" value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))}
                  className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-700 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-700 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer z-30"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Listings Catalog */}

      {filteredListings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No listings found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, price range, or category filter to discover more small business offerings.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCondition('all');
              setMinPrice(0);
              setMaxPrice(2000);
            }}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4" : "space-y-4"}>
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className={`group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
                viewMode === 'list' ? 'sm:flex-row' : ''
              }`}
            >
              {/* Product Thumbnail */}
              <div className={`relative bg-slate-100/80 overflow-hidden ${viewMode === 'list' ? 'sm:w-48 h-48 shrink-0' : 'aspect-[4/3] w-full'}`}>
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 ease-out"
                />

                {/* Subtle Refined Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  {listing.isFeatured && (
                    <span className="bg-amber-400/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-lg tracking-wide shadow-2xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-900" /> Featured
                    </span>
                  )}
                  {listing.category === 'rentals' && (
                    <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" /> Rental
                    </span>
                  )}
                  {listing.category === 'wholesale_b2b' && (
                    <span className="bg-indigo-950/90 backdrop-blur-xs text-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-indigo-500/20">
                      <Box className="w-3 h-3 text-indigo-400" /> B2B Wholesale
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Eye className="w-3 h-3 opacity-70" /> {listing.viewsCount}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  
                  {/* Seller info line */}
                  <div className="flex items-center gap-1.5">
                    <img
                      src={listing.sellerAvatar}
                      alt={listing.sellerName}
                      className="w-4 h-4 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-[11px] font-medium text-slate-500 truncate">
                      {listing.sellerName}
                    </span>
                    {listing.isVerifiedSeller && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {listing.title}
                  </h3>

                  {/* Price & Discount */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-base font-extrabold text-slate-900">
                      ${listing.price.toFixed(2)}
                      {listing.rentalPeriod && <span className="text-xs text-slate-500 font-normal"> / {listing.rentalPeriod.replace('per_', '')}</span>}
                    </span>
                    {listing.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${listing.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {listing.wholesaleMinQty && (
                    <span className="text-[10px] text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 rounded-md font-semibold block w-max">
                      Min Order: {listing.wholesaleMinQty} units
                    </span>
                  )}
                </div>

                {/* Location & Buy Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </span>

                  <button className="bg-slate-900 group-hover:bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-colors shrink-0">
                    <ShoppingBag className="w-3 h-3" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
