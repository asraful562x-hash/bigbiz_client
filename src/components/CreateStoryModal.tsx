'use client';

import React, { useState } from 'react';
import { User } from '../types';
import { X, Sparkles } from 'lucide-react';

interface CreateStoryModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitStory: (mediaUrl: string, caption?: string) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  currentUser,
  onClose,
  onSubmitStory
}) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;

    onSubmitStory(mediaUrl, caption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Post 24-Hour Story
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Story Media URL</label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caption (Optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Behind the scenes in our workshop today! 🏺"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Post Story (Expires in 24h)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
