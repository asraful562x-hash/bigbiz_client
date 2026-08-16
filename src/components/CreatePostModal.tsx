'use client';

import React, { useState } from 'react';
import { User, Listing, PostType, PostMediaItem } from '../types';
import { X, Sparkles, Send, Store, User as UserIcon } from 'lucide-react';
import { SellerPostOptions } from './post-create/SellerPostOptions';
import { PostMediaUploader } from './post-create/PostMediaUploader';

interface CreatePostModalProps {
  currentUser: User;
  listings: Listing[];
  onClose: () => void;
  onSubmitPost: (postData: {
    content: string;
    mediaUrls: string[];
    mediaItems?: PostMediaItem[];
    postType: PostType;
    listingId?: string;
    promoBadge?: string;
    callToAction?: string;
    hashtags: string[];
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  listings,
  onClose,
  onSubmitPost
}) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('product');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [promoBadge, setPromoBadge] = useState('');
  const [callToAction, setCallToAction] = useState('buy_now');
  const [hashtags, setHashtags] = useState('#BizSocial #Commerce');
  
  // Dual Media Items State (Files & Links)
  const [mediaItems, setMediaItems] = useState<PostMediaItem[]>([
    {
      url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      type: 'image'
    }
  ]);

  const isMerchant = currentUser.role.includes('seller') || currentUser.role === 'procurement' || currentUser.role === 'admin';
  const sellerListings = listings.filter(l => l.sellerId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = hashtags.split(' ').filter(t => t.startsWith('#'));
    const urls = mediaItems.map(m => m.url);

    onSubmitPost({
      content: content.trim(),
      mediaUrls: urls.length > 0 ? urls : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
      mediaItems,
      postType: isMerchant ? postType : 'update',
      listingId: selectedListingId || undefined,
      promoBadge: promoBadge.trim() || undefined,
      callToAction: callToAction || undefined,
      hashtags: tags.length > 0 ? tags : ['#BizSocial']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 border border-slate-200 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col">
        
        {/* ── Modal Header ────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                {isMerchant ? 'Create Merchant Post' : 'Share Feed Update'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                {isMerchant ? (
                  <>
                    <Store className="w-3 h-3 text-emerald-600 inline" />
                    <span>Publishing as verified merchant storefront</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3 h-3 text-slate-400 inline" />
                    <span>Publishing community social update</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Form Body (Scrollable) ────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
          
          {/* Seller-Specific Commercial Post Options Component */}
          {isMerchant && (
            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
              <SellerPostOptions
                postType={postType}
                setPostType={setPostType}
                sellerListings={sellerListings}
                selectedListingId={selectedListingId}
                setSelectedListingId={setSelectedListingId}
                promoBadge={promoBadge}
                setPromoBadge={setPromoBadge}
                callToAction={callToAction}
                setCallToAction={setCallToAction}
              />
            </div>
          )}

          {/* Post Caption / Story */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Caption / Product Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in your shop today? Describe product features, materials, stock or special promotions..."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900 placeholder:text-slate-400 leading-relaxed font-normal"
            />
          </div>

          {/* Dual Media Uploader (File Upload & URL Link) Component */}
          <PostMediaUploader
            mediaItems={mediaItems}
            setMediaItems={setMediaItems}
          />

          {/* Hashtags Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Commercial Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#Handcrafted #Ceramics #B2BWholesale #Sustainable"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
            />
          </div>

          {/* ── Modal Footer ────────────────────────────────────────── */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-400 font-medium">
              ✨ Visible across global feed & merchant storefront
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
