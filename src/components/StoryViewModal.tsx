'use client';

import React, { useEffect, useState } from 'react';
import { Story } from '../types';
import { X, CheckCircle2, Eye } from 'lucide-react';

interface StoryViewModalProps {
  story: Story;
  onClose: () => void;
}

export const StoryViewModal: React.FC<StoryViewModalProps> = ({
  story,
  onClose
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative max-w-sm w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between bg-slate-950 border border-slate-800">
        
        {/* Progress Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Header */}
        <div className="p-4 pt-6 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <img
              src={story.sellerAvatar}
              alt={story.sellerName}
              className="w-9 h-9 rounded-full object-cover border border-white/50"
            />
            <div>
              <div className="flex items-center gap-1 text-white font-bold text-xs">
                <span>{story.sellerName}</span>
                {story.isVerifiedSeller && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
              </div>
              <span className="text-[10px] text-slate-300">{story.createdAt}</span>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Story Media Background */}
        <img
          src={story.mediaUrl}
          alt="Story content"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Story Caption Footer */}
        <div className="p-6 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-2">
          {story.caption && (
            <p className="text-white text-xs font-semibold leading-relaxed bg-black/40 p-3 rounded-2xl backdrop-blur-xs border border-white/10">
              {story.caption}
            </p>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {story.viewCount} views</span>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/30">
              24h Temporary Story
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
