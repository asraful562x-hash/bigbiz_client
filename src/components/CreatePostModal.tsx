'use client';

import React, { useState } from 'react';
import { User, Listing, PostType } from '../types';
import { X, Sparkles, Image as ImageIcon, Tag, Play } from 'lucide-react';

interface CreatePostModalProps {
  currentUser: User;
  listings: Listing[];
  onClose: () => void;
  onSubmitPost: (postData: {
    content: string;
    mediaUrls: string[];
    postType: PostType;
    listingId?: string;
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
  const [mediaUrl, setMediaUrl] = useState('');
  const [postType, setPostType] = useState<PostType>('product');
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [hashtags, setHashtags] = useState('#smallbiz #handmade');

  const sellerListings = listings.filter(l => l.sellerId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = hashtags.split(' ').filter(t => t.startsWith('#'));
    onSubmitPost({
      content,
      mediaUrls: mediaUrl ? [mediaUrl] : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
      postType,
      listingId: selectedListingId || undefined,
      hashtags: tags.length > 0 ? tags : ['#bizsocial']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Share Post to Social Feed
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Post Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPostType('product')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  postType === 'product' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Product Release
              </button>
              <button
                type="button"
                onClick={() => setPostType('update')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  postType === 'update' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Store Update
              </button>
              <button
                type="button"
                onClick={() => setPostType('reel')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  postType === 'reel' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Short Reel Demo
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Story Update</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in your shop today? Detail product features or announcements..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Media URL (Photo or Reel Video)</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {sellerListings.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tag Marketplace Product (Optional)</label>
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
              >
                <option value="">No product tagged</option>
                {sellerListings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} (${l.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#handmade #smallbiz #ceramics"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Publish to Feed
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
