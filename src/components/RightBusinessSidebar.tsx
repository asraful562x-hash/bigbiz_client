import React from 'react';
import { User, DirectOffer, Listing } from '../types';
import { useTopMerchants } from '../hooks/useTopMerchants';
import { MerchantNetworkButton } from './MerchantNetworkButton';
import { 
  Building2, 
  Handshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Flame, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Tag,
  ChevronRight,
  UserPlus,
  UserCheck,
  Star,
  ShoppingBag,
  Package,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface RightBusinessSidebarProps {
  /**
   * @deprecated No longer used — RightBusinessSidebar now fetches its own
   * merchant list via useTopMerchants. Kept optional so any parent still
   * passing this prop doesn't break the build; safe to remove once callers
   * are updated.
   */
  users?: User[];
  offers: DirectOffer[];
  listings: Listing[];
  activeTab: string;
  currentUser: User;
  onOpenSellerProfile: (userId: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
  onOpenSellToUs: () => void;
  onOpenChat: (userId: string) => void;
  isInDrawer?: boolean;
  isLoading?: boolean;
}

export const RightBusinessSidebar: React.FC<RightBusinessSidebarProps> = ({
  users: _unusedUsersProp,
  offers,
  listings,
  activeTab,
  currentUser,
  onOpenSellerProfile,
  onOpenListingDetail,
  onOpenSellToUs,
  onOpenChat,
  isInDrawer = false,
  isLoading = false
}) => {
  const role = currentUser.role;
  const isBuyer = role === 'buyer_free' || role === 'buyer_premium' || role === 'buyer';
  const isSeller = role === 'seller_free' || role === 'seller_premium';
  const isVipBuyer = role === 'buyer_premium';

  // Fetches GET /api/users, filters to sellers, excludes currentUser, caps at 3.
  // See hooks/useTopMerchants.ts — this replaces the old `users` prop, so
  // this component no longer depends on a parent to fetch/pass merchants in.
  const { merchants: featuredMerchants, isLoading: isLoadingMerchants } = useTopMerchants(currentUser.id);

  const trendingListings = listings.slice(0, 3);

  // Live activity stream mock items
  const liveEscrowDeals = [
    { id: '1', buyer: 'TechFlow Corp', amount: '$12,500', item: 'SaaS Platform Source Code', time: '2m ago' },
    { id: '2', buyer: 'Nexus Logistics', amount: '$4,800', item: 'Wholesale Electronics Bulk', time: '8m ago' },
    { id: '3', buyer: 'Alpha Ventures', amount: '$3,200', item: 'Enterprise ERP License', time: '14m ago' },
  ];

  const card = isInDrawer ? 'rounded-none' : 'rounded-3xl';
  const inner = isInDrawer ? 'rounded-none' : 'rounded-2xl';
  const innerSm = isInDrawer ? 'rounded-none' : 'rounded-xl';

  return (
    <aside className={`space-y-5 text-left font-sans ${isInDrawer ? 'px-0' : ''}`}>

      {/* 1. CONTEXT-DEPENDENT PRIMARY TOP WIDGET */}
      {activeTab === 'marketplace' ? (
        /* MARKETPLACE: Hot Deals & Best Value Listings */
        <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-1.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Top Rated Deals</span>
            </h4>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full shrink-0">
              Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {listings.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                onClick={() => onOpenListingDetail(item)}
                className={`p-2.5 bg-slate-50 hover:bg-indigo-50/50 ${inner} border border-slate-100 transition-all cursor-pointer flex gap-3`}
              >
                <img 
                  src={item.images[0] || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400'} 
                  alt={item.title}
                  className={`w-12 h-12 ${innerSm} object-cover shrink-0`}
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs text-slate-900 truncate">{item.title}</h5>
                  <p className="text-[10px] text-slate-500 truncate">By {item.sellerName}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-xs text-indigo-700">${item.price.toLocaleString()}</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Escrow Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        /* ORDERS: Escrow Protection Summary */
        <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Buyer Protection Vault
            </h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Zero Risk
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-1.5">
            <p className="font-bold text-emerald-900">How Escrow Secures Every Transaction:</p>
            <ul className="text-[11px] text-emerald-800 space-y-1 list-disc list-inside">
              <li>Funds held in neutral bank vault</li>
              <li>Released only after buyer confirmation</li>
              <li>Instant dispute resolution team</li>
            </ul>
          </div>
        </div>
      ) : (
        /* FEED / GENERAL: Live B2B Buy Desk RFQs */
        <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider truncate">
                Live B2B Buy Desk RFQs
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
              Active Buyers
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 px-1 text-slate-500 text-xs">
                <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold text-[11px] text-slate-600">Please wait, loading active RFQs…</span>
              </div>
              {[0, 1].map((i) => (
                <div key={i} className={`p-3 bg-slate-50 ${inner} border border-slate-100 space-y-2 animate-pulse`}>
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-200 rounded w-4/5" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {offers.slice(0, 2).map((off) => (
                <div 
                  key={off.id}
                  className={`p-3 bg-slate-50 hover:bg-slate-100/80 ${inner} border border-slate-100 transition-colors space-y-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {off.category.replace('_', ' ')}
                    </span>
                    <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Target: ${off.expectedPrice.toLocaleString()}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                    {off.title}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 font-medium truncate">{off.sellerName}</span>
                    <button
                      onClick={onOpenSellToUs}
                      className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline shrink-0"
                    >
                      Submit Quote <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onOpenSellToUs}
            className={`w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2 ${innerSm} border border-indigo-100 transition-colors block truncate`}
          >
            View All RFQs & Direct Buyouts →
          </button>
        </div>
      )}

      {/* 2. TRENDING B2B SOFTWARE & PRODUCT DEALS */}
      <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-1.5">
          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
            <Flame className="w-4 h-4 text-amber-500 fill-current shrink-0" /> <span className="truncate">Trending SaaS & Products</span>
          </h4>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
            Escrow Ready
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2.5 py-1">
            <div className="flex items-center gap-2 px-1 text-slate-500 text-xs">
              <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-semibold text-[11px] text-slate-600">Please wait, loading trending deals…</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className={`flex items-center gap-3 p-2 ${inner} animate-pulse bg-slate-50/70`}>
                <div className={`w-14 h-14 ${innerSm} bg-slate-200 shrink-0`} />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-2 bg-slate-200 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingListings.map((item) => (
              <div 
                key={item.id}
                onClick={() => onOpenListingDetail(item)}
                className={`group cursor-pointer flex items-center gap-3 p-2 ${inner} hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100`}
              >
                <img 
                  src={item.images[0] || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400'} 
                  alt={item.title} 
                  className={`w-14 h-14 ${innerSm} object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform`} 
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded uppercase">
                      {item.category === 'wholesale_b2b' ? 'B2B Wholesale' : item.condition}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {item.title}
                  </h5>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">${item.price.toLocaleString()}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Protected
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. VERIFIED BUSINESS SPOTLIGHT & NETWORK */}
      <div className={`bg-white ${card} p-4 border border-slate-200/90 shadow-sm space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-1.5">
          <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 min-w-0 truncate">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" /> <span className="truncate">Verified Merchants</span>
          </h4>
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
            Verified B2B
          </span>
        </div>

        {isLoadingMerchants ? (
          <div className="space-y-3 py-1">
            <div className="flex items-center gap-2 px-1 text-slate-500 text-xs">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-semibold text-[11px] text-slate-600">Please wait, loading merchants…</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 animate-pulse bg-slate-50/70 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="h-2.5 bg-slate-200 rounded w-2/3" />
                  <div className="h-2 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredMerchants.length > 0 ? (
          <div className="space-y-3">
            {featuredMerchants.map((merchant) => (
              <div key={merchant.id} className={`flex items-center justify-between gap-2 p-2 ${inner} hover:bg-slate-50 transition-colors`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={merchant.avatar}
                    alt={merchant.name}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-200 shrink-0 cursor-pointer"
                    onClick={() => onOpenSellerProfile(merchant.id)}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span 
                        onClick={() => onOpenSellerProfile(merchant.id)}
                        className="font-extrabold text-xs text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate block"
                      >
                        {merchant.name}
                      </span>
                      {merchant.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {merchant.companyName || 'Verified Enterprise Store'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onOpenChat(merchant.id)}
                    className={`p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 ${innerSm} transition-colors`}
                    title="Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <MerchantNetworkButton
                    currentUserId={currentUser.id}
                    merchantId={merchant.id}
                    innerSm={innerSm}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state — no verified merchants other than the current user yet */
          <div className="flex flex-col items-center justify-center text-center py-8 px-3 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-xs font-bold text-slate-600">No merchants to show yet</p>
            <p className="text-[10px] text-slate-400 max-w-[200px]">
              Verified sellers will show up here as they join the platform.
            </p>
          </div>
        )}
      </div>

      {/* 4. REAL-TIME ESCROW TRANSACTION TICKER */}
      <div className={`bg-slate-900 text-white ${card} p-4 shadow-md border border-slate-800 space-y-3`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h5 className="font-extrabold text-xs text-white">Live Escrow Deals Activity</h5>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Real-time</span>
        </div>

        <div className="space-y-2">
          {liveEscrowDeals.map((deal) => (
            <div key={deal.id} className={`p-2.5 bg-white/5 ${inner} border border-white/5 space-y-1 text-xs`}>
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-slate-200">{deal.buyer}</span>
                <span className="font-black text-emerald-400">{deal.amount}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="truncate">{deal.item}</span>
                <span className="shrink-0">{deal.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};