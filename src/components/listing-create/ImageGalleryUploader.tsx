import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ImageGalleryUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({ images, setImages }) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryCover = (index: number) => {
    setImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-indigo-600" /> Multi-Photo Gallery ({images.length} Photos)
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">1st photo is the primary cover</span>
      </div>

      {/* Input URL Bar + Add Button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Paste image URL (https://images.unsplash.com/...)"
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
        />
        <button
          type="button"
          onClick={handleAddImage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Photo
        </button>
      </div>

      {/* Thumbnail Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden aspect-video sm:aspect-square flex items-center justify-center">
              <img src={url} alt={`Listing photo ${idx + 1}`} className="w-full h-full object-cover" />
              
              {/* Primary Badge */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                  Cover
                </span>
              )}

              {/* Hover Actions Bar */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryCover(idx)}
                    className="p-1.5 bg-white text-slate-800 rounded-lg text-[10px] font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer"
                    title="Set as primary cover"
                  >
                    Make Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
