'use client';

import React from 'react';

interface ListingImageGalleryProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (idx: number) => void;
  title: string;
}

export const ListingImageGallery: React.FC<ListingImageGalleryProps> = ({
  images,
  activeImageIndex,
  setActiveImageIndex,
  title,
}) => {
  const displayImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="space-y-3">
      {/* Main Active Image Preview */}
      <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
        <img
          src={displayImages[activeImageIndex] || displayImages[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                activeImageIndex === idx
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-95'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
