'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Listing, Order, AnalyticsData } from '../types';
import { 
  Sparkles, 
  PlusCircle, 
  Upload, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  CheckCircle2, 
  Store, 
  ShoppingBag, 
  BarChart3, 
  AlertCircle,
  ShieldCheck,
  FileSpreadsheet,
  Users,
  LayoutDashboard,
  Package,
  Shield,
  BarChart2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SellerDashboardProps {
  currentUser: User;
  listings: Listing[];
  orders: Order[];
  analytics: AnalyticsData;
  onOpenCreateListing: () => void;
  onUpgradeTier: () => void;
  onBulkUploadCSV?: (csvRows: any[]) => void;
  onConfirmReceipt?: (orderId: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentUser,
  listings,
  orders,
  analytics,
  onOpenCreateListing,
  onUpgradeTier,
  onBulkUploadCSV,
  onConfirmReceipt
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'orders' | 'analytics' | 'bulk'>('overview');
  const [csvText, setCsvText] = useState<string>(
    `title,category,condition,price,image\nHandmade Leather Wallet,new_products,new,45.00,https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80\nVintage Ceramic Vase,second_hand,used,68.00,https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80`
  );
  const [isImporting, setIsImporting] = useState(false);

  // ── Tab Scroller: pure transform-based, zero browser scroll APIs ──────────
  // Outer wrapper: overflow:hidden — the browser can never scroll it.
  // Inner strip: moves via CSS translateX driven by tabOffset state.
  // tabOffset is always clamped to [0, maxOffset] — over-scroll is impossible.
  const [tabOffset, setTabOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const tabOuterRef = useRef<HTMLDivElement>(null);
  const tabInnerRef = useRef<HTMLDivElement>(null);

  const recalcMax = useCallback(() => {
    const outer = tabOuterRef.current;
    const inner = tabInnerRef.current;
    if (!outer || !inner) return;
    // Use getBoundingClientRect for sub-pixel accuracy
    const outerW = outer.getBoundingClientRect().width;
    const innerW = inner.getBoundingClientRect().width;
    const newMax = Math.max(0, Math.round(innerW - outerW));
    setMaxOffset(newMax);
    setTabOffset(prev => Math.min(prev, newMax));
  }, []);

  // useLayoutEffect fires synchronously before paint — gives correct measurements
  // on the very first render (useEffect fires too late and starts with maxOffset=0)
  useEffect(() => {
    recalcMax();
    // ResizeObserver on the inner strip catches width changes (e.g. badge numbers)
    const ro = new ResizeObserver(recalcMax);
    if (tabInnerRef.current) ro.observe(tabInnerRef.current);
    if (tabOuterRef.current) ro.observe(tabOuterRef.current);
    return () => ro.disconnect();
  }, [recalcMax]);

  const STEP = 140;
  // 1px tolerance prevents floating-point rounding from keeping the arrow visible
  // a single pixel past the true end
  const canScrollLeft = tabOffset > 1;
  const canScrollRight = tabOffset < maxOffset - 1;

  const scrollTabs = (direction: 'left' | 'right') => {
    setTabOffset(prev => {
      const next = direction === 'left' ? prev - STEP : prev + STEP;
      return Math.max(0, Math.min(next, maxOffset));
    });
  };

  const sellerListings = listings.filter(l => l.sellerId === currentUser.id);
  const sellerOrders = orders.filter(o => o.sellerId === currentUser.id);
  const isPremium = currentUser.subscriptionStatus === 'premium';
  const activeListingCount = sellerListings.filter(l => l.status === 'active').length;

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium) return;

    setIsImporting(true);
    setTimeout(() => {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          title: values[0],
          category: values[1],
          condition: values[2],
          price: values[3],
          image: values[4]
        };
      });

      onBulkUploadCSV(rows);
      setIsImporting(false);
      setActiveTab('listings');
    }, 800);
  };

  return (
    <div className="space-y-4 pb-6">
      
      {/* Top Banner & Tier Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">{currentUser.name}</h1>
              {currentUser.isVerified && <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />}
              {isPremium ? (
                <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5" /> PREMIUM SELLER
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-slate-300 shrink-0">
                  FREE SELLER TIER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{currentUser.bio}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {!isPremium && (
            <button
              onClick={onUpgradeTier}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
            >
              <Sparkles className="w-4 h-4 text-slate-950 shrink-0" /> Upgrade ($29/mo)
            </button>
          )}

          <button
            onClick={onOpenCreateListing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
          >
            <PlusCircle className="w-4 h-4 shrink-0" /> Create Listing
          </button>
        </div>
      </div>

      {/* Free Tier Active Limit Notice */}
      {!isPremium && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-900 font-medium">
          <div className="flex items-start sm:items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Free Tier Status: <strong>{activeListingCount}/5 Active Listings Used</strong>. Upgrade to Premium for unlimited active listings, priority search boosting, and bulk CSV uploads!
            </span>
          </div>
          <button
            onClick={onUpgradeTier}
            className="font-extrabold text-amber-800 underline hover:text-amber-950 shrink-0"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Seller Hub Responsive Nav Tabs Bar with Left/Right Arrow Controls */}
      <div className="relative flex items-center bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {canScrollLeft && (
          <button
            onClick={() => scrollTabs('left')}
            aria-label="Scroll left"
            className="p-1 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 mr-1 shadow-2xs z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* overflow:hidden mask — the inner strip slides via translateX only */}
        <div ref={tabOuterRef} className="flex-1 overflow-hidden">
          <div
            ref={tabInnerRef}
            style={{ transform: `translateX(-${tabOffset}px)`, transition: 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap py-0.5 w-max"
          >
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 ${
              activeTab === 'listings' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Listings</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {sellerListings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Orders & Escrow</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {sellerOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analytics & Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bulk' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV Bulk Upload</span>
            {isPremium && (
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded shadow-2xs">PRO</span>
            )}
          </button>
          </div>
        </div>

        {canScrollRight && (
          <button
            onClick={() => scrollTabs('right')}
            aria-label="Scroll right"
            className="p-1 rounded-xl bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 ml-1 shadow-2xs z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>


      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Each card: flex-col, fixed min-height, label top / value middle / subtext bottom */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Total Revenue</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none">${analytics.totalRevenue.toFixed(2)}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-auto">↑ 12.4% vs last month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Storefront Views</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none">{analytics.views.toLocaleString()}</div>
              <span className="text-[11px] text-indigo-600 font-semibold mt-auto">High Engagement</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Conversion Rate</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none">{analytics.conversionRate}%</div>
              <span className="text-[11px] text-slate-500 font-semibold mt-auto">Industry Avg 3.2%</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2 min-h-[110px]">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Followers</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none">{currentUser.followersCount.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-auto">↑ 85 new this week</span>
            </div>
          </div>

          {/* Active Listings Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Your Active Storefront Listings</h3>
              <button onClick={() => setActiveTab('listings')} className="text-xs font-bold text-indigo-600 hover:underline">
                View All ({sellerListings.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sellerListings.map((listing) => (
                <div key={listing.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3">
                  <img src={listing.images[0]} alt={listing.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{listing.title}</h4>
                    <span className="text-xs font-extrabold text-indigo-600">${listing.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>👁️ {listing.viewsCount} views</span>
                      <span>❤️ {listing.likesCount} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Your Listings</h2>
              <p className="text-xs text-slate-400 mt-0.5">{sellerListings.length} total · {activeListingCount} active</p>
            </div>
            <button
              onClick={onOpenCreateListing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> New Listing
            </button>
          </div>

          {sellerListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-500 text-sm">No listings yet</h3>
              <p className="text-xs text-slate-400">Create your first listing to start selling</p>
              <button onClick={onOpenCreateListing} className="mt-2 bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {sellerListings.map((listing) => {
                const statusColor: Record<string, string> = {
                  active: 'bg-emerald-100 text-emerald-700',
                  sold: 'bg-slate-100 text-slate-500',
                  pending_approval: 'bg-amber-100 text-amber-700',
                  rejected: 'bg-red-100 text-red-600',
                };
                const statusLabel: Record<string, string> = {
                  active: 'Active',
                  sold: 'Sold',
                  pending_approval: 'Pending',
                  rejected: 'Rejected',
                };
                return (
                  <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                    <div className="relative">
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-40 object-cover" />
                      <span className={`absolute top-2 right-2 text-[10px] font-black px-2.5 py-1 rounded-full ${statusColor[listing.status]}`}>
                        {statusLabel[listing.status]}
                      </span>
                      {listing.isFeatured && (
                        <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">{listing.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-indigo-600">${listing.price.toFixed(2)}</span>
                        {listing.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">${listing.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.viewsCount}</span>
                        <span className="flex items-center gap-1">❤️ {listing.likesCount}</span>
                        {listing.stockQty !== undefined && (
                          <span className="flex items-center gap-1 text-slate-500">📦 {listing.stockQty} left</span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1 mt-auto">
                        <button className="flex-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition-colors">Edit</button>
                        <button className="flex-1 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl transition-colors">
                          {listing.status === 'active' ? 'Delist' : 'Relist'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Orders & Escrow Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Orders & Escrow</h2>
            <p className="text-xs text-slate-400 mt-0.5">{sellerOrders.length} total orders</p>
          </div>

          {sellerOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-500 text-sm">No orders yet</h3>
              <p className="text-xs text-slate-400">Orders from buyers will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sellerOrders.map((order) => {
                const escrowBadge: Record<string, string> = {
                  held: 'bg-amber-100 text-amber-700',
                  released: 'bg-emerald-100 text-emerald-700',
                  refunded: 'bg-red-100 text-red-600',
                };
                const statusBadge: Record<string, string> = {
                  escrow_held: 'bg-amber-50 text-amber-700 border-amber-200',
                  shipped: 'bg-sky-50 text-sky-700 border-sky-200',
                  delivered: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  buyer_confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  released: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  disputed: 'bg-red-50 text-red-600 border-red-200',
                  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
                };
                const statusLabel: Record<string, string> = {
                  escrow_held: '🔒 Escrow Held',
                  shipped: '🚚 Shipped',
                  delivered: '📦 Delivered',
                  buyer_confirmed: '✅ Confirmed',
                  released: '💸 Released',
                  disputed: '⚠️ Disputed',
                  cancelled: '❌ Cancelled',
                };
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row gap-4">
                    <img src={order.listingImage} alt={order.listingTitle} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{order.listingTitle}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Order #{order.id.slice(-6).toUpperCase()} · Buyer: <span className="text-slate-600 font-semibold">{order.buyerName}</span></p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusBadge[order.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'} shrink-0`}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="font-black text-indigo-600">${order.totalAmount.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${escrowBadge[order.escrowStatus]}`}>
                          Escrow: {order.escrowStatus.charAt(0).toUpperCase() + order.escrowStatus.slice(1)}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-[11px] text-slate-500 font-mono">📬 {order.trackingNumber}</span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">📍 {order.shippingAddress}</p>

                      <div className="flex gap-2 pt-1">
                        {order.status === 'escrow_held' && (
                          <button className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors">
                            Mark as Shipped
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'shipped') && (
                          <button
                            onClick={() => onConfirmReceipt?.(order.id)}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors"
                          >
                            Confirm Delivery
                          </button>
                        )}
                        {order.status === 'disputed' && (
                          <button className="text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl transition-colors">
                            View Dispute
                          </button>
                        )}
                        <button className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors">
                          Message Buyer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CSV Bulk Upload Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <h2 className="font-extrabold text-base text-slate-900">CSV Bulk Product Import Tool</h2>
            {isPremium ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">UNLOCKED</span>
            ) : (
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM FEATURE</span>
            )}
          </div>

          {!isPremium ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Bulk CSV Upload requires Seller Premium</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Easily import hundreds of product SKUs in seconds using our standardized CSV format. Upgrade your seller subscription to unlock this feature.
              </p>
              <button
                onClick={onUpgradeTier}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Upgrade to Premium ($29/mo)
              </button>
            </div>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Paste your CSV rows below or edit the sample template to import multiple listings simultaneously:
              </p>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isImporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                {isImporting ? 'Processing & Validating CSV...' : 'Import CSV Products Now'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
          <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Advanced Seller Analytics Dashboard
          </h2>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Performing Products</h3>
            <div className="space-y-2">
              {analytics.topProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold">
                  <span className="text-slate-900">{p.title}</span>
                  <div className="flex gap-4 text-slate-500">
                    <span>{p.views} Views</span>
                    <span className="text-emerald-600">{p.sales} Sales</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
