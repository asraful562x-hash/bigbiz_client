import React, { useState, useRef, useId } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

interface ImageGalleryUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({ images, setImages }) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // useId guarantees a unique id even when multiple uploaders exist on the same page
  const uniqueId = useId();
  const fileInputId = `product-file-upload-${uniqueId.replace(/:/g, '-')}`;

  // 1. Handle adding via Image URL
  const handleAddUrlImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // 2. Handle adding via Local File Input (Direct upload / Cloudinary CDN / Data URI)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to dedicated product image endpoint → Cloudinary "products" folder with unique ID
        let finalUrl = base64Data;
        try {
          const uploadRes = await fetch('/api/products/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_input: base64Data,
              media_type: 'image',
            }),
          });
          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            if (uploadJson.data && uploadJson.data.secure_url) {
              finalUrl = uploadJson.data.secure_url;
            }
          }
        } catch {
          // Fallback to base64 data URI if server is offline
        }

        setImages(prev => [...prev, finalUrl]);
      } catch (err) {
        console.error('[ImageUpload] Failed to process image file:', err);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <ImageIcon className="w-4 h-4 text-indigo-600" /> Product Images ({images.length} Added)
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">1st photo is the primary cover</span>
      </div>

      {/* Mode Selector Tabs: File Input vs Web URL */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            uploadMode === 'file'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            uploadMode === 'url'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Image URL
        </button>
      </div>

      {/* 1. FILE UPLOAD DROPZONE */}
      {uploadMode === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={fileInputId}
          />
          <label
            htmlFor={fileInputId}
            className={`w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              isUploading
                ? 'border-indigo-400 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/20'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading to CDN...
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">Click to browse or drop local product images</p>
                  <p className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP (Multiple allowed)</p>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {/* 2. IMAGE URL INPUT */}
      {uploadMode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste image URL (https://images.unsplash.com/...)"
            className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrlImage();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddUrlImage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add URL
          </button>
        </div>
      )}

      {/* Thumbnail Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden aspect-video sm:aspect-square flex items-center justify-center">
              <img src={url} alt={`Product photo ${idx + 1}`} className="w-full h-full object-cover" />
              
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
