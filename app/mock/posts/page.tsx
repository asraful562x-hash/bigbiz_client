'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Database, Sparkles, RefreshCw, ArrowLeft, ExternalLink, Heart, MessageSquare } from 'lucide-react';
import { API_CONFIG } from '../../../src/config/api.config';

export default function MockPostsPage() {
  const [count, setCount] = useState<number>(5);
  const [category, setCategory] = useState<string>('all');
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [includeReacts, setIncludeReacts] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          category,
          include_images: includeImages,
          include_comments: includeComments,
          include_reacts: includeReacts,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPosts(data.data);
        setMessage(`✅ Successfully generated ${data.data.length} posts with user relations!`);
      } else {
        setMessage(`❌ ${data.message || 'Generation failed'}`);
      }
    } catch (e: any) {
      setMessage(`❌ ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/mock-generator" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" /> Posts & Interactions Generator
              </h1>
              <p className="text-xs text-slate-400">Generate posts referencing existing database users with comments & reacts</p>
            </div>
          </div>
          <Link href="/feed" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
            Feed <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
            {message}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Count</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Industry Focus</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="all">Mixed B2B</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="logistics">Logistics</option>
                <option value="saas">Enterprise SaaS</option>
                <option value="wholesale">Wholesale</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="rounded accent-purple-600"
              />
              Include Images
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeComments}
                onChange={(e) => setIncludeComments(e.target.checked)}
                className="rounded accent-purple-600"
              />
              Include Comments
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeReacts}
                onChange={(e) => setIncludeReacts(e.target.checked)}
                className="rounded accent-purple-600"
              />
              Include Reactions
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate {count} Posts
          </button>
        </div>

        {posts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase">Inserted Posts ({posts.length})</h2>
            <div className="space-y-3">
              {posts.map((p, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white text-sm">{p.author_name} <span className="text-slate-400 font-normal">({p.author_company})</span></p>
                    <span className="text-[10px] text-slate-500">Post #{p.id}</span>
                  </div>
                  <p className="text-slate-300">{p.content}</p>
                  <div className="flex gap-4 text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-rose-400"><Heart className="w-3.5 h-3.5" /> {p.reacts_count} Reacts</span>
                    <span className="flex items-center gap-1 text-blue-400"><MessageSquare className="w-3.5 h-3.5" /> {p.comments_count} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
