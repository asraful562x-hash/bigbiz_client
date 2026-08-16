import React, { useState, useMemo } from 'react';
import { User, Listing, Post, Review } from '../types';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Store, 
  MessageSquare, 
  Grid, 
  Tag, 
  Sparkles, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Share2, 
  PlusCircle, 
  Calendar,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface SellerProfileModalProps {
  seller?: User;
  sellerId?: string;
  currentUser?: User;
  users?: User[];
  listings: Listing[];
  posts: Post[];
  reviews: Review[];
  onClose: () => void;
  onOpenChat: (sellerId: string) => void;
  onSelectListing: (listing: Listing) => void;
  onDeletePost?: (postId: string) => void;
  onOpenCreatePost?: () => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  seller: initialSeller,
  sellerId,
  currentUser,
  users,
  listings,
  posts,
  reviews,
  onClose,
  onOpenChat,
  onSelectListing,
  onDeletePost,
  onOpenCreatePost
}) => {
  const seller = initialSeller || users?.find(u => u.id === sellerId) || (
    currentUser && currentUser.id === sellerId ? currentUser : {
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
    } as User
  );

  const isOwnProfile = useMemo(() => {
    if (!currentUser) return false;
    return (
      seller.id === currentUser.id ||
      seller.email === currentUser.email ||
      seller.username === currentUser.username ||
      Number(seller.id) === Number(currentUser.id)
    );
  }, [seller, currentUser]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'listings' | 'reviews'>('posts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewGrouping, setViewGrouping] = useState<'all' | 'grouped'>('grouped');
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const sellerListings = useMemo(() => {
    return listings.filter(l => l.sellerId === seller.id || (isOwnProfile && l.sellerId === currentUser?.id));
  }, [listings, seller.id, isOwnProfile, currentUser?.id]);

  // Robust matching for user's own posts
  const sellerPosts = useMemo(() => {
    return posts.filter(p => {
      const matchSellerId = p.sellerId === seller.id || (isOwnProfile && p.sellerId === currentUser?.id);
      const matchSellerName = p.sellerName === seller.name || (isOwnProfile && p.sellerName === currentUser?.name);
      return matchSellerId || matchSellerName;
    });
  }, [posts, seller, isOwnProfile, currentUser]);

  const sellerReviews = useMemo(() => {
    return reviews.filter(r => r.sellerId === seller.id || (isOwnProfile && r.sellerId === currentUser?.id));
  }, [reviews, seller.id, isOwnProfile, currentUser?.id]);

  // Extract all distinct categories used by this seller
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    if (seller.customCategories) {
      seller.customCategories.forEach(c => set.add(c));
    }
    sellerListings.forEach(l => {
      if (l.storeCategory) set.add(l.storeCategory);
    });
    return Array.from(set);
  }, [seller.customCategories, sellerListings]);

  // Filtered listings based on selectedCategory
  const filteredListings = useMemo(() => {
    if (selectedCategory === 'all') return sellerListings;
    return sellerListings.filter(l => (l.storeCategory || 'General') === selectedCategory);
  }, [sellerListings, selectedCategory]);

  // Group listings by store category
  const groupedListings = useMemo(() => {
    const map: Record<string, Listing[]> = {};
    sellerListings.forEach(l => {
      const cat = l.storeCategory || 'General Collection';
      if (!map[cat]) map[cat] = [];
      map[cat].push(l);
    });
    return map;
  }, [sellerListings]);

  const handleDeletePostClick = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this post? This will remove its images and data permanently.')) {
      return;
    }
    setDeletingPostId(postId);
    if (onDeletePost) {
      onDeletePost(postId);
    }
    setDeletingPostId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-8 text-left font-sans">
        
        {/* Cover Image */}
        <div className="h-36 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 relative">
          {seller.coverImage && (
            <img src={seller.coverImage} alt="" className="w-full h-full object-cover opacity-80" />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-slate-950/60 hover:bg-slate-950 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative pt-0">
          
          <div className="flex justify-between items-end -mt-10 mb-4">
            <div className="relative">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
              {seller.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-1 rounded-full shadow-xs ring-2 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <span className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ✨ My Profile
                </span>
              ) : (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 border border-slate-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow Shop'}
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat(seller.id);
                    }}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Direct Chat with Seller"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900">{seller.name}</h2>
                {seller.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-50" />}
              </div>
              <span className="text-xs text-slate-400">@{seller.username || seller.email?.split('@')[0]}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{seller.bio || 'Active member on BizSocial platform.'}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {seller.location || 'Global'}</span>
              <span><strong>{(seller.followersCount || 0) + (isFollowing ? 1 : 0)}</strong> Followers</span>
              <span><strong>{seller.followingCount || 0}</strong> Following</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" /> {seller.rating || 5.0} ({seller.reviewsCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 mt-6 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'posts'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Posts</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-indigo-50 text-indigo-700">
                  {sellerPosts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('listings')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'listings'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Store Catalog</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-slate-100 text-slate-600">
                  {sellerListings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reviews</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-slate-100 text-slate-600">
                  {sellerReviews.length}
                </span>
              </button>
            </div>

            {activeTab === 'posts' && isOwnProfile && onOpenCreatePost && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCreatePost();
                }}
                className="mb-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Post</span>
              </button>
            )}
          </div>

          {/* TAB CONTENTS */}
          <div className="mt-2">
            
            {/* 1. POSTS TAB */}
            {activeTab === 'posts' && (
              <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                {sellerPosts.map((p) => {
                  const mediaList = p.mediaItems && p.mediaItems.length > 0
                    ? p.mediaItems
                    : p.mediaUrls && p.mediaUrls.length > 0
                    ? p.mediaUrls.map(url => ({ url, type: 'image' as const }))
                    : [];

                  return (
                    <div 
                      key={p.id} 
                      className="p-4 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all space-y-3 relative group"
                    >
                      {/* Post Header & Author Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={p.sellerAvatar || seller.avatar} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{p.sellerName || seller.name}</span>
                              {p.postType && p.postType !== 'update' && (
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700">
                                  {p.postType}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {p.createdAt || 'Just now'}
                            </span>
                          </div>
                        </div>

                        {/* Actions (Delete button if own post) */}
                        {isOwnProfile && (
                          <button
                            onClick={(e) => handleDeletePostClick(p.id, e)}
                            disabled={deletingPostId === p.id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Promo Banner if present */}
                      {p.promoBadge && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-xl text-[11px] font-bold">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{p.promoBadge}</span>
                        </div>
                      )}

                      {/* Post Content with Hashtags */}
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                        {p.content}
                      </p>

                      {/* Hashtags Pills */}
                      {p.hashtags && p.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              #{tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Media Gallery / Attachments */}
                      {mediaList.length > 0 && (
                        <div className={`grid gap-2 rounded-xl overflow-hidden border border-slate-200/80 ${
                          mediaList.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                        }`}>
                          {mediaList.map((item, idx) => (
                            <div key={idx} className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden group/media">
                              {item.type === 'video' ? (
                                <video 
                                  src={item.url} 
                                  controls 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <img 
                                  src={item.url} 
                                  alt="" 
                                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" 
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Call-To-Action if configured */}
                      {p.callToAction && p.callToAction !== 'none' && (
                        <div className="pt-1">
                          <button className="w-full py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            <Store className="w-3.5 h-3.5" />
                            <span>{p.callToAction.replace('_', ' ').toUpperCase()}</span>
                          </button>
                        </div>
                      )}

                      {/* Engagement Counters */}
                      <div className="flex items-center gap-4 text-slate-500 text-xs pt-1 border-t border-slate-200/60 font-medium">
                        <span className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-50" />
                          <span>{p.likesCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{p.commentsCount || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                          <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{p.sharesCount || 0}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {sellerPosts.length === 0 && (
                  <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {isOwnProfile ? "You haven't posted any updates yet." : "No posts by this user yet."}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isOwnProfile ? "Share announcements, deals, products, and insights with your network." : "Check back later for fresh updates."}
                    </p>
                    {isOwnProfile && onOpenCreatePost && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenCreatePost();
                        }}
                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        + Create Your First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. LISTINGS TAB */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                {/* CATEGORY FILTER PILLS */}
                {availableCategories.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1"><Grid className="w-3.5 h-3.5 text-indigo-600" /> Store Collections</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                        <button
                          onClick={() => setViewGrouping('grouped')}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            viewGrouping === 'grouped' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Sections
                        </button>
                        <button
                          onClick={() => setViewGrouping('all')}
                          className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                            viewGrouping === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                          }`}
                        >
                          Grid
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pb-1">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setViewGrouping('grouped');
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedCategory === 'all'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        All Categories ({sellerListings.length})
                      </button>

                      {availableCategories.map((cat) => {
                        const count = sellerListings.filter(l => (l.storeCategory || 'General') === cat).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setViewGrouping('all');
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                              selectedCategory === cat
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              selectedCategory === cat ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* GROUPED VIEW */}
                {viewGrouping === 'grouped' && selectedCategory === 'all' ? (
                  <div className="space-y-5">
                    {Object.entries(groupedListings).map(([catName, items]) => (
                      <div key={catName} className="space-y-2.5 p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/70">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <h4 className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{catName}</span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-md font-bold">
                              {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                          </h4>
                          <button
                            onClick={() => {
                              setSelectedCategory(catName);
                              setViewGrouping('all');
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            View only this →
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {items.map((l) => (
                            <div
                              key={l.id}
                              onClick={() => {
                                onSelectListing(l);
                                onClose();
                              }}
                              className="p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-400 hover:shadow-xs transition-all flex items-center gap-2.5 group"
                            >
                              <img src={l.images[0]} alt="" className="w-13 h-13 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                              <div className="min-w-0 flex-1">
                                <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                  {l.title}
                                </h5>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs font-black text-slate-900">${l.price.toFixed(2)}</span>
                                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                                    In Stock
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {sellerListings.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs font-medium">
                        No products posted by this seller yet.
                      </div>
                    )}
                  </div>
                ) : (
                  /* FLAT / FILTERED LIST VIEW */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredListings.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onSelectListing(l);
                          onClose();
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-400 hover:shadow-xs transition-all flex items-center gap-2.5 group"
                      >
                        <img src={l.images[0]} alt="" className="w-13 h-13 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider block truncate">
                            {l.storeCategory || 'General Collection'}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {l.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-slate-900">${l.price.toFixed(2)}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{l.condition}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredListings.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-slate-400 text-xs font-medium">
                        No products found in category "{selectedCategory}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. REVIEWS TAB */}
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
                {sellerReviews.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs font-medium">
                    No buyer reviews yet.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
