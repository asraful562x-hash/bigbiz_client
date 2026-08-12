'use client';

import React, { useState } from 'react';
import { User, Listing, Post, Review } from '../types';
import { X, CheckCircle2, MapPin, Star, Store, MessageSquare, ExternalLink, Grid } from 'lucide-react';

interface SellerProfileModalProps {
  seller?: User;
  sellerId?: string;
  users?: User[];
  listings: Listing[];
  posts: Post[];
  reviews: Review[];
  onClose: () => void;
  onOpenChat: (sellerId: string) => void;
  onSelectListing: (listing: Listing) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  seller: initialSeller,
  sellerId,
  users,
  listings,
  posts,
  reviews,
  onClose,
  onOpenChat,
  onSelectListing
}) => {
  const seller = initialSeller || users?.find(u => u.id === sellerId) || {
    id: sellerId || 'unknown',
    name: 'Business Vendor',
    username: '@vendor',
    email: 'vendor@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    role: 'seller_premium',
    bio: 'Verified business seller on BizSocial.',
    isVerified: true,
    subscriptionStatus: 'premium',
    location: 'Global Hub',
    followersCount: 150,
    followingCount: 30,
    rating: 5.0,
    reviewsCount: 12,
    totalSales: 45,
    createdAt: 'Joined 2024'
  } as User;
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'posts' | 'reviews'>('listings');

  const sellerListings = listings.filter(l => l.sellerId === seller.id);
  const sellerPosts = posts.filter(p => p.sellerId === seller.id);
  const sellerReviews = reviews.filter(r => r.sellerId === seller.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-8">
        
        {/* Cover Image */}
        <div className="h-36 bg-slate-900 relative">
          {seller.coverImage && (
            <img src={seller.coverImage} alt="" className="w-full h-full object-cover" />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-950/60 hover:bg-slate-950 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative pt-0">
          
          <div className="flex justify-between items-end -mt-10 mb-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-700 border border-slate-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                {isFollowing ? '✓ Following' : '+ Follow Shop'}
              </button>

              <button
                onClick={() => onOpenChat(seller.id)}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900">{seller.name}</h2>
                {seller.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-50" />}
              </div>
              <span className="text-xs text-slate-400">@{seller.username}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{seller.bio}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {seller.location}</span>
              <span><strong>{seller.followersCount + (isFollowing ? 1 : 0)}</strong> Followers</span>
              <span><strong>{seller.followingCount}</strong> Following</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" /> {seller.rating} ({seller.reviewsCount} reviews)
              </span>
            </div>

            {seller.customStorefrontUrl && (
              <div className="pt-1">
                <a
                  href={`https://${seller.customStorefrontUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> {seller.customStorefrontUrl}
                </a>
              </div>
            )}
          </div>

          {/* Storefront Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mt-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('listings')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'listings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Store Listings ({sellerListings.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'posts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Feed Posts ({sellerPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Unboxing Reviews ({sellerReviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-4 max-h-64 overflow-y-auto">
            {activeTab === 'listings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sellerListings.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectListing(l);
                      onClose();
                    }}
                    className="p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 flex items-center gap-2.5"
                  >
                    <img src={l.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{l.title}</h4>
                      <span className="text-xs font-extrabold text-indigo-600">${l.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-3">
                {sellerPosts.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <p className="text-slate-800 leading-relaxed mb-1">{p.content}</p>
                    <span className="text-[10px] text-slate-400">{p.createdAt} • ❤️ {p.likesCount}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-2">
                {sellerReviews.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{r.buyerName}</span>
                      <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-slate-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
