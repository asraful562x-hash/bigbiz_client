'use client';

import React, { useState, useRef } from 'react';
import { PostMediaItem } from '../../types';
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Film, 
  X, 
  Plus, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PostMediaUploaderProps {
  mediaItems: PostMediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<PostMediaItem[]>>;
}

export const PostMediaUploader: React.FC<PostMediaUploaderProps> = ({
  mediaItems,
  setMediaItems,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState<'image' | 'video'>('image');
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file uploads (FileReader -> Base64 Data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isImage && !isVideo) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64Url = loadEvt.target?.result as string;
        if (base64Url) {
          setMediaItems(prev => [
            ...prev,
            { url: base64Url, type: isVideo ? 'video' : 'image' }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle URL Link addition
  const handleAddUrl = () => {
    setUrlError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    // Check basic URL format
    try {
      new URL(trimmed);
    } catch {
      setUrlError('Please enter a valid HTTP or HTTPS URL');
      return;
    }

    setMediaItems(prev => [
      ...prev,
      { url: trimmed, type: urlType }
    ]);
    setUrlInput('');
  };

  const handleRemoveItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span>Post Media (Photos & Videos)</span>
          <span className="text-[10px] font-normal text-slate-500">
            ({mediaItems.length} attached)
          </span>
        </label>

        {/* Tab switch: File Upload vs URL Link */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
              tab === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
              tab === 'url'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste Link</span>
          </button>
        </div>
      </div>

      {/* ── Tab 1: Local File Upload ──────────────────────────────── */}
      {tab === 'upload' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-700">
            Click to upload or drag & drop photos/videos
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Supports PNG, JPG, GIF, WebP, MP4 up to 50MB
          </p>
        </div>
      )}

      {/* ── Tab 2: Direct URL Link ───────────────────────────────── */}
      {tab === 'url' && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Paste image or video URL (https://images.unsplash.com/...)"
              className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value as 'image' | 'video')}
              className="text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-semibold"
            >
              <option value="image">🖼️ Image</option>
              <option value="video">🎬 Video</option>
            </select>
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          {urlError && (
            <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>{urlError}</span>
            </p>
          )}
        </div>
      )}

      {/* ── Attached Media Gallery Preview ───────────────────────── */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square"
            >
              {item.type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2">
                  <Film className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Video</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}

              {/* Media Type Badge */}
              <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                {item.type === 'video' ? <Film className="w-2.5 h-2.5 text-rose-400" /> : <ImageIcon className="w-2.5 h-2.5 text-indigo-400" />}
                <span>{item.type === 'video' ? 'Reel' : 'Photo'}</span>
              </span>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110"
                title="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
