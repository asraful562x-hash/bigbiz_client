'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Post, Story, Listing } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { ConfirmModal } from './ConfirmModal';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  CheckCircle2, 
  Plus, 
  ShoppingBag, 
  Sparkles, 
  Play, 
  Tag, 
  Send,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';

interface FeedViewProps {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  listings: Listing[];
  onLikePost: (postId: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onSelectListing: (listing: Listing) => void;
  onOpenCreatePost: () => void;
  onOpenCreateStory: () => void;
  onViewStory: (story: Story) => void;
  onOpenSellerProfile: (sellerId: string) => void;
  onDeletePost?: (postId: string) => void;
  isLoading?: boolean;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  posts,
  stories,
  listings,
  onLikePost,
  onCommentPost,
  onSelectListing,
  onOpenCreatePost,
  onOpenCreateStory,
  onViewStory,
  onOpenSellerProfile,
  onDeletePost,
  isLoading = false
}) => {
  const [activeFeedFilter, setActiveFeedFilter] = useState<'all' | 'product'>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);

  const { canScrollLeft: canStoriesScrollLeft, canScrollRight: canStoriesScrollRight } = useScrollOverflow(storiesScrollRef);
  const { canScrollLeft: canFilterScrollLeft, canScrollRight: canFilterScrollRight } = useScrollOverflow(filterScrollRef);

  // Infinite scroll intersection observer: continuously cycles and loads random post batches seamlessly
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { rootMargin: '500px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoadingMore]);

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesScrollRef.current) {
      storiesScrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  const scrollFilter = (direction: 'left' | 'right') => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({
        left: direction === 'left' ? -180 : 180,
        behavior: 'smooth'
      });
    }
  };

  // Social Media Feed Ranking Algorithm:
  // Score = (Likes*1 + Comments*4 + Shares*6) / (hoursSincePost + 2)^1.5
  const computeClientPostScore = (p: Post): number => {
    const engagement = (p.likesCount || 0) * 1 + (p.commentsCount || 0) * 4 + (p.sharesCount || 0) * 6;
    let hoursOld = 0.5; // default for 'Just now'
    if (p.createdAt && p.createdAt !== 'Just now') {
      const parsedDate = new Date(p.createdAt);
      if (!isNaN(parsedDate.getTime())) {
        hoursOld = Math.max(0, (Date.now() - parsedDate.getTime()) / (1000 * 60 * 60));
      }
    }
    const decay = Math.pow(hoursOld + 2, 1.5);
    return engagement / decay;
  };

  const allFilteredPosts = posts
    .filter(p => {
      if (activeFeedFilter === 'all') return true;
      return p.postType === activeFeedFilter;
    })
    .slice()
    .sort((a, b) => {
      const scoreA = computeClientPostScore(a);
      const scoreB = computeClientPostScore(b);
      return scoreB - scoreA;
    });

  // Endless Looping / Random Cycle: If visibleCount exceeds pool, loop through items continuously
  const visiblePosts = React.useMemo(() => {
    if (allFilteredPosts.length === 0) return [];
    if (visibleCount <= allFilteredPosts.length) {
      return allFilteredPosts.slice(0, visibleCount);
    }
    // Generate looped stream so scrolling never hits a dead end
    const stream: Post[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const basePost = allFilteredPosts[i % allFilteredPosts.length];
      const cycleIndex = Math.floor(i / allFilteredPosts.length);
      stream.push(cycleIndex === 0 ? basePost : { ...basePost, id: `${basePost.id}_cycle_${cycleIndex}` });
    }
    return stream;
  }, [allFilteredPosts, visibleCount]);


  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onCommentPost(postId, text.trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-4">

      {/* 1. Stories Tray Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 24-Hour Seller Stories
          </span>
          <span className="text-[11px] text-slate-400">Temporary Behind-The-Scenes</span>
        </div>

        <div className="relative flex items-center">
          {canStoriesScrollLeft && (
            <button
              onClick={() => scrollStories('left')}
              aria-label="Scroll left"
              className="p-1 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 mr-1 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div 
            ref={storiesScrollRef}
            className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth flex-1 min-w-0"
          >
            {isLoading ? (
              <div className="flex items-center gap-3 py-1">
                <div className="flex items-center gap-2 px-2 text-slate-500 text-xs shrink-0">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-semibold text-[11px] text-slate-600">Please wait, loading stories…</span>
                </div>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0 animate-pulse">
                    <div className="w-15 h-15 rounded-full bg-slate-200" />
                    <div className="w-10 h-2 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Add Story Button for Sellers */}
                {(currentUser.role === 'seller_free' || currentUser.role === 'seller_premium') && (
                  <div 
                    onClick={onOpenCreateStory}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-indigo-400 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-all relative">
                      <Plus className="w-6 h-6" />
                      <span className="absolute -bottom-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-xs">
                        <Plus className="w-3 h-3" />
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Your Story</span>
                  </div>
                )}

                {/* Stories List */}
                {stories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => onViewStory(story)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
                      <img
                        src={story.sellerAvatar}
                        alt={story.sellerName}
                        className="w-15 h-15 rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[11px] font-medium text-slate-800 truncate max-w-[70px]">
                        {story.sellerName.split(' ')[0]}
                      </span>
                      {story.isVerifiedSeller && <CheckCircle2 className="w-3 h-3 text-sky-500 shrink-0" />}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {canStoriesScrollRight && (
            <button
              onClick={() => scrollStories('right')}
              aria-label="Scroll right"
              className="p-1 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 ml-1 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>{/* end stories */}

      {/* 2. Feed Filter Bar & Create Post Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200">
        <div className="relative flex items-center min-w-0 flex-1">
          {canFilterScrollLeft && (
            <button
              onClick={() => scrollFilter('left')}
              aria-label="Scroll left"
              className="p-1 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 mr-1 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={filterScrollRef}
            className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto whitespace-nowrap no-scrollbar py-0.5 max-w-full scroll-smooth flex-1"
          >
            <button
              onClick={() => setActiveFeedFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                activeFeedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Updates
            </button>
            <button
              onClick={() => setActiveFeedFilter('product')}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
                activeFeedFilter === 'product'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Tag className="w-3.5 h-3.5 shrink-0" /> <span>Product Releases</span>
            </button>
          </div>

          {canFilterScrollRight && (
            <button
              onClick={() => scrollFilter('right')}
              aria-label="Scroll right"
              className="p-1 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 transition-colors shrink-0 ml-1 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onOpenCreatePost}
          className="text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" /> <span>Post to Feed</span>
        </button>
      </div>{/* end filter bar */}

      {/* 3. Feed Posts Stream */}
      <div className="space-y-4 pb-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                <span className="font-bold text-slate-800 text-sm tracking-wide">Please wait, loading feed updates…</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Syncing latest B2B marketplace posts, verified listings, and social signals.</p>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                    <div className="h-2 bg-slate-100 rounded w-1/6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded w-full" />
                  <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                </div>
                <div className="h-48 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <span className="font-bold text-slate-800 text-sm tracking-wide">Please wait, loading feed updates…</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Syncing latest B2B marketplace posts, verified listings, and social signals.</p>
          </div>
        ) : null}
        {!isLoading && visiblePosts.map((post) => {
          const linkedListing = post.listingId 
            ? listings.find(l => l.id === post.listingId) 
            : null;

          const isCommentsExpanded = expandedComments[post.id];

          return (
            <article 
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between gap-2">
                <div 
                  onClick={() => onOpenSellerProfile(post.sellerId)}
                  className="flex items-center gap-3 cursor-pointer group min-w-0"
                >
                  <img
                    src={post.sellerAvatar}
                    alt={post.sellerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:opacity-90 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {post.sellerName}
                      </span>
                      {post.isVerifiedSeller && (
                        <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-50 shrink-0" />
                      )}
                      {post.postType === 'deal' && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          🔥 Flash Deal
                        </span>
                      )}
                      {post.postType === 'wholesale' && (
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          📦 Wholesale Lot
                        </span>
                      )}
                      {post.postType === 'product' && (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          🛍️ Product Launch
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block truncate">{post.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {(post.sellerId === currentUser.id || post.sellerName === currentUser.name) && onDeletePost && (
                    <button
                      type="button"
                      onClick={() => setPostToDelete(post.id)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Promotional Badge Banner (if present) */}
              {post.promoBadge && (
                <div className="mx-4 mb-2 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-300 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{post.promoBadge}</span>
                </div>
              )}

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Media / Image Carousel */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="relative bg-slate-950 overflow-hidden max-h-[480px] flex items-center justify-center">
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post media"
                    className="w-full h-auto object-cover max-h-[480px]"
                  />
                  {post.postType === 'reel' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg pl-1">
                        <Play className="w-7 h-7 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Linked Marketplace Product Banner */}
              {linkedListing && (
                <div className="m-3 sm:m-4 p-3 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={linkedListing.images[0]}
                      alt={linkedListing.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block">
                        Tagged Marketplace Item
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {linkedListing.title}
                      </h4>
                      <span className="text-xs font-extrabold text-indigo-700 block">
                        ${linkedListing.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectListing(linkedListing)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 shrink-0 w-full sm:w-auto"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> Buy via Escrow
                  </button>
                </div>
              )}

              {/* Social Engagement Actions */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-slate-600 text-xs font-medium">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current text-rose-600' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} Comments</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>{post.sharesCount}</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">Escrow Verified Merchant</span>
              </div>

              {/* Expandable Comments Section */}
              {isCommentsExpanded && (
                <div className="bg-slate-50/70 p-4 border-t border-slate-100 space-y-3">
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 text-xs">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="font-bold text-slate-900">{comment.userName}</span>
                              <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No comments yet. Be the first to start the conversation!</p>
                  )}

                  {/* Add Comment Input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </article>
          );
        })}

        {/* Infinite Scroll Sentinel: intersection observer watches this to trigger more posts */}
        <div ref={sentinelRef} className="py-1" aria-hidden="true" />

        {/* Loading indicator while fetching next batch */}
        {isLoadingMore && (
          <div className="flex items-center justify-center gap-3 py-6">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Fetching more updates…</span>
          </div>
        )}

      </div>{/* end posts list */}

      {/* Modern Delete Confirmation Overlay Modal */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This will permanently delete its attached media and remove it from the feed."
        confirmText="Delete Post"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={() => {
          if (postToDelete && onDeletePost) {
            onDeletePost(postToDelete);
          }
          setPostToDelete(null);
        }}
        onCancel={() => setPostToDelete(null)}
      />

    </div>
  );
};
