'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Shield,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Heart,
  Sliders,
  Layers,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { API_CONFIG } from '../../src/config/api.config';

interface MockStats {
  users: number;
  posts: number;
  products: number;
  comments: number;
  rfqs: number;
  trending_products: number;
  follows?: number;
  last_rotation?: {
    cycle_timestamp: string;
    comments_added: number;
    comments_pruned: number;
    reacts_added: number;
    reacts_pruned: number;
  };
}

export default function MockGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'products' | 'rfqs' | 'trending' | 'follows' | 'rotation'>('users');
  const [stats, setStats] = useState<MockStats>({ users: 0, posts: 0, products: 0, comments: 0, rfqs: 0, trending_products: 0, follows: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // User Generator State
  const [userCount, setUserCount] = useState<number>(5);
  const [selectedRole, setSelectedRole] = useState<string>('random');
  const [selectedFocus, setSelectedFocus] = useState<string>('random');
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
  const [generatedUsers, setGeneratedUsers] = useState<any[]>([]);

  // Post Generator State
  const [postCount, setPostCount] = useState<number>(5);
  const [selectedPostCategory, setSelectedPostCategory] = useState<string>('all');
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [includeReacts, setIncludeReacts] = useState<boolean>(true);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  // Product Generator State
  const [productCount, setProductCount] = useState<number>(4);
  const [includeVariants, setIncludeVariants] = useState<boolean>(true);
  const [includeOptions, setIncludeOptions] = useState<boolean>(true);
  const [includeKeywords, setIncludeKeywords] = useState<boolean>(true);
  const [isGeneratingProducts, setIsGeneratingProducts] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState<any[]>([]);

  // RFQ Generator State
  const [rfqCount, setRfqCount] = useState<number>(4);
  const [isGeneratingRFQs, setIsGeneratingRFQs] = useState(false);
  const [generatedRFQs, setGeneratedRFQs] = useState<any[]>([]);

  // Trending Generator State
  const [trendingCount, setTrendingCount] = useState<number>(4);
  const [isGeneratingTrending, setIsGeneratingTrending] = useState(false);
  const [generatedTrending, setGeneratedTrending] = useState<any[]>([]);

  // Follows & Network Generator State
  const [followsPerUser, setFollowsPerUser] = useState<number>(5);
  const [injectNetworks, setInjectNetworks] = useState<boolean>(true);
  const [injectNetworkReqs, setInjectNetworkReqs] = useState<boolean>(true);
  const [clearExistingFollows, setClearExistingFollows] = useState<boolean>(false);
  const [isGeneratingFollows, setIsGeneratingFollows] = useState(false);
  const [followsResult, setFollowsResult] = useState<any>(null);

  // Rotation State
  const [isRotating, setIsRotating] = useState(false);
  const [rotationResult, setRotationResult] = useState<any>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/stats'));
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch {
      // ignore
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGenerateUsers = async () => {
    setIsGeneratingUsers(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: userCount,
          role_name: selectedRole === 'random' ? '' : selectedRole,
          business_focus: selectedFocus === 'random' ? '' : selectedFocus,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedUsers(data.data);
        setNotification({ type: 'success', message: `✅ Successfully inserted ${data.data.length} users into the database (with auto MegaShop321go payment platform & tracking)!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate users' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingUsers(false);
    }
  };

  const handleGeneratePosts = async () => {
    setIsGeneratingPosts(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: postCount,
          category: selectedPostCategory,
          include_images: includeImages,
          include_comments: includeComments,
          include_reacts: includeReacts,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPosts(data.data);
        setNotification({ type: 'success', message: `✅ Successfully generated ${data.data.length} posts with user relations, comments & reactions!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate posts' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingPosts(false);
    }
  };

  const handleGenerateProducts = async () => {
    setIsGeneratingProducts(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: productCount,
          include_variants: includeVariants,
          include_custom_option: includeOptions,
          include_keywords: includeKeywords,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedProducts(data.data);
        setNotification({ type: 'success', message: `✅ Successfully generated ${data.data.length} products with variants, custom options & keywords!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate products' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingProducts(false);
    }
  };

  const handleGenerateRFQs = async () => {
    setIsGeneratingRFQs(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/rfqs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: rfqCount }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedRFQs(data.data);
        setNotification({ type: 'success', message: `✅ Successfully generated ${data.data.length} Live B2B Buy Desk RFQs!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate RFQs' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingRFQs(false);
    }
  };

  const handleGenerateTrending = async () => {
    setIsGeneratingTrending(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/trending'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: trendingCount }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedTrending(data.data);
        setNotification({ type: 'success', message: `✅ Successfully generated ${data.data.length} Trending SaaS & Products items!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate trending products' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingTrending(false);
    }
  };

  const handleGenerateFollows = async () => {
    setIsGeneratingFollows(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/follows'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follows_per_user: followsPerUser,
          inject_networks: injectNetworks,
          inject_network_reqs: injectNetworkReqs,
          clear_existing: clearExistingFollows,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFollowsResult(data.data);
        setNotification({ type: 'success', message: data.message || `✅ Injected random follows across ${data.data.users_processed} users!` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to generate follows' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsGeneratingFollows(false);
    }
  };

  const handleTrigger5HourRotation = async () => {
    setIsRotating(true);
    setNotification(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/rotate-interactions?force=true'), { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setRotationResult(data.data);
        setNotification({ type: 'success', message: `🔄 5-Hour Rotation executed! Pruned 10 old comments/reacts and added 10 new interactions from random users across random posts.` });
        fetchStats();
      } else {
        setNotification({ type: 'error', message: data.message || 'Rotation failed' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsRotating(false);
    }
  };

  const handleClearData = async (target: 'posts' | 'products' | 'rfqs' | 'all') => {
    if (!confirm(`Are you sure you want to clear ${target}?`)) return;
    try {
      await fetch(API_CONFIG.resolveUrl(`/dev/mock/clear-all?target=${target}`), { method: 'DELETE' });
      setNotification({ type: 'success', message: `Cleared ${target} from database` });
      if (target === 'posts' || target === 'all') setGeneratedPosts([]);
      if (target === 'products' || target === 'all') setGeneratedProducts([]);
      if (target === 'rfqs' || target === 'all') setGeneratedRFQs([]);
      if (target === 'all') setGeneratedUsers([]);
      fetchStats();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  Database Mock Generator & Automation Hub
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider">
                    Debug Tool
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Seed Users, Posts, Products, RFQs, Trending Items & 5-Hour Automated Interaction Rotation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/feed"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              View Feed <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              View Marketplace <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Database Live Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Users</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.users}</p>
            </div>
            <Users className="w-4 h-4 text-indigo-400 opacity-60" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Feed Posts</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.posts}</p>
            </div>
            <FileText className="w-4 h-4 text-purple-400 opacity-60" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Products</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.products}</p>
            </div>
            <ShoppingBag className="w-4 h-4 text-emerald-400 opacity-60" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Live RFQs</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.rfqs}</p>
            </div>
            <Briefcase className="w-4 h-4 text-amber-400 opacity-60" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Trending</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.trending_products}</p>
            </div>
            <TrendingUp className="w-4 h-4 text-rose-400 opacity-60" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Follows</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{stats.follows ?? 0}</p>
            </div>
            <UserPlus className="w-4 h-4 text-sky-400 opacity-60" />
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <button
              onClick={fetchStats}
              disabled={isStatsLoading}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className={`w-3 h-3 ${isStatsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Real User 2-Day Cleanup Banner */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold text-indigo-200">Portfolio Database Auto-Clean Active</p>
              <p className="text-slate-400">Real user accounts older than 2 days (48 hours) are automatically cleaned on login to keep the portfolio DB fresh.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-md bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-mono text-[10px]">
              MegaShop321go Auto-Hook
            </span>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className={`p-4 rounded-2xl border text-sm font-medium flex items-center justify-between ${
            notification.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-xs opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'users', label: '1. Users', icon: Users },
            { id: 'posts', label: '2. Posts & Interactions', icon: FileText },
            { id: 'products', label: '3. Products with Elements', icon: ShoppingBag },
            { id: 'rfqs', label: '4. Live B2B RFQs', icon: Briefcase },
            { id: 'trending', label: '5. Trending SaaS', icon: TrendingUp },
            { id: 'follows', label: '6. Follows & Network', icon: UserPlus },
            { id: 'rotation', label: '7. 5-Hour Interaction Cycle', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleClearData('posts')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold transition"
            >
              <Trash2 className="w-3 h-3" /> Clear Posts
            </button>
          </div>
        </div>

        {/* TAB 1: USERS GENERATOR */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Generate Business Users</h2>
                </div>
                <span className="text-xs text-slate-400">Inserts to `users`, `user_roles`, `user_business_focuses`, & seeds constant payment credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Count (Max 20)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={userCount}
                      onChange={(e) => setUserCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                      className="w-14 bg-slate-800 border border-slate-700 text-indigo-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 5, 10, 20].map((c) => (
                      <button
                        key={c}
                        onClick={() => setUserCount(c)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                          userCount === c
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="random">🎲 Random Roles</option>
                    <option value="buyer_free">Buyer (Free)</option>
                    <option value="buyer_premium">Buyer (Premium PRO)</option>
                    <option value="seller_free">Seller (Free)</option>
                    <option value="seller_premium">Seller (Premium PRO)</option>
                    <option value="procurement">Corporate Procurement</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Focus</label>
                  <select
                    value={selectedFocus}
                    onChange={(e) => setSelectedFocus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="random">🎲 Random Business Focus</option>
                    <option value="products">Products & Hardware</option>
                    <option value="software">Software & SaaS</option>
                    <option value="services">B2B Professional Services</option>
                    <option value="wholesale_b2b">Wholesale & Bulk Supply</option>
                    <option value="rentals">Equipment Rentals</option>
                    <option value="second_hand">Surplus & Second-Hand</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateUsers}
                disabled={isGeneratingUsers}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingUsers ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Inserting {userCount} Users into PostgreSQL...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Insert {userCount} Users
                  </>
                )}
              </button>
            </div>

            {generatedUsers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Recently Generated Users ({generatedUsers.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {generatedUsers.map((u, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-sm">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-sm truncate">{u.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.company_name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {u.role_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                          {u.business_focus}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        ID: {u.id} | Slug: <span className="text-emerald-400">{u.encrypted_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POSTS & INTERACTIONS GENERATOR */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Generate Social Feed Posts</h2>
                </div>
                <span className="text-xs text-slate-400">Randomly references authors from `users` with media, comments & reacts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Count (Max 20)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={postCount}
                      onChange={(e) => setPostCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                      className="w-14 bg-slate-800 border border-slate-700 text-purple-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 5, 10, 20].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPostCount(c)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                          postCount === c
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Focus</label>
                  <select
                    value={selectedPostCategory}
                    onChange={(e) => setSelectedPostCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">🌐 All B2B Industries Mix</option>
                    <option value="manufacturing">Industrial & Manufacturing</option>
                    <option value="logistics">Supply Chain & Freight</option>
                    <option value="saas">Enterprise SaaS & Tech</option>
                    <option value="wholesale">Wholesale & Inventory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Include HD Images</p>
                    <p className="text-[10px] text-slate-400">Adds post_media rows</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeComments}
                    onChange={(e) => setIncludeComments(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Generate Comments</p>
                    <p className="text-[10px] text-slate-400">Random DB users</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeReacts}
                    onChange={(e) => setIncludeReacts(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Generate Reactions</p>
                    <p className="text-[10px] text-slate-400">Random user likes</p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleGeneratePosts}
                disabled={isGeneratingPosts}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingPosts ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating {postCount} Posts with Relations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Insert {postCount} Posts
                  </>
                )}
              </button>
            </div>

            {generatedPosts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Recently Generated Posts ({generatedPosts.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedPosts.map((p, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-sm">{p.author_name}</p>
                          <p className="text-xs text-slate-400">{p.author_company}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Post #{p.id}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3">{p.content}</p>

                      {p.images && p.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {p.images.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt="media" className="w-20 h-14 rounded-lg object-cover border border-slate-700" />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                        <span className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3.5 h-3.5" /> {p.reacts_count} Reacts
                        </span>
                        <span className="flex items-center gap-1 text-blue-400">
                          <MessageSquare className="w-3.5 h-3.5" /> {p.comments_count} Comments
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS WITH ELEMENTS GENERATOR */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Generate Marketplace Products</h2>
                </div>
                <span className="text-xs text-slate-400">Creates products with Variants, Custom Option Sections, & Keywords</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Count (Max 20)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={productCount}
                      onChange={(e) => setProductCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                      className="w-14 bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 4, 10, 20].map((c) => (
                      <button
                        key={c}
                        onClick={() => setProductCount(c)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                          productCount === c
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-6">
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={includeVariants} onChange={(e) => setIncludeVariants(e.target.checked)} className="accent-emerald-600" />
                    Variants
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={includeOptions} onChange={(e) => setIncludeOptions(e.target.checked)} className="accent-emerald-600" />
                    Options
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={includeKeywords} onChange={(e) => setIncludeKeywords(e.target.checked)} className="accent-emerald-600" />
                    Keywords
                  </label>
                </div>
              </div>

              <button
                onClick={handleGenerateProducts}
                disabled={isGeneratingProducts}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingProducts ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate & Insert {productCount} Complex Products
              </button>
            </div>

            {generatedProducts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Recently Generated Products ({generatedProducts.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedProducts.map((p, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{p.title}</p>
                          <p className="text-xs text-slate-400">By {p.seller_name} • ${p.price.toFixed(2)}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-emerald-400 font-mono text-[11px]">Slug: {p.encrypted_id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LIVE B2B BUY DESK RFQS */}
        {activeTab === 'rfqs' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Generate Live B2B Buy Desk RFQs</h2>
                </div>
                <span className="text-xs text-slate-400">Inserts to `rfqs` table with target prices, quantities, and deadlines</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Count (Max 20)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={rfqCount}
                    onChange={(e) => setRfqCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="w-14 bg-slate-800 border border-slate-700 text-amber-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[1, 4, 10, 20].map((c) => (
                    <button
                      key={c}
                      onClick={() => setRfqCount(c)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        rfqCount === c
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c} RFQs
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateRFQs}
                disabled={isGeneratingRFQs}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingRFQs ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate & Insert {rfqCount} B2B Buy Desk RFQs
              </button>
            </div>

            {generatedRFQs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Recently Generated RFQs ({generatedRFQs.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedRFQs.map((r, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{r.title}</p>
                          <p className="text-xs text-slate-400">{r.buyer_name} ({r.buyer_company})</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {r.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-300 border-t border-slate-800 pt-2">
                        <span>Target: <strong className="text-emerald-400">${r.target_price?.toLocaleString()}</strong></span>
                        <span>Qty: {r.quantity} {r.unit}</span>
                        <span className="text-slate-400">{r.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRENDING SAAS & PRODUCTS */}
        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                  <h2 className="text-lg font-bold text-white">Generate Trending SaaS & Products</h2>
                </div>
                <span className="text-xs text-slate-400">Inserts to `trending_products` table linking to existing products</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Count (Max 20)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={trendingCount}
                    onChange={(e) => setTrendingCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="w-14 bg-slate-800 border border-slate-700 text-rose-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[1, 4, 10, 20].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTrendingCount(c)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        trendingCount === c
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c} Items
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateTrending}
                disabled={isGeneratingTrending}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingTrending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate {trendingCount} Trending SaaS & Product Entries
              </button>
            </div>

            {generatedTrending.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Recently Generated Trending Items ({generatedTrending.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedTrending.map((t, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{t.badge || 'Trending #1'}</span>
                        <span className="text-xs text-emerald-400 font-bold">{t.growth_rate}</span>
                      </div>
                      <p className="text-xs text-slate-400">Product ID #{t.product_id} • Score {t.rank_score} • ★ {t.rating}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FOLLOWS & NETWORK GENERATOR */}
        {activeTab === 'follows' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-white">Generate Random Follows & Network Connections</h2>
                </div>
                <span className="text-xs text-slate-400">Inserts to `follows`, `networks` & `network_requests` between existing users</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Follows Per User (Max 20)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={followsPerUser}
                    onChange={(e) => setFollowsPerUser(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="w-14 bg-slate-800 border border-slate-700 text-sky-400 font-bold text-center rounded-lg px-1.5 py-0.5 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[1, 5, 10, 20].map((c) => (
                    <button
                      key={c}
                      onClick={() => setFollowsPerUser(c)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        followsPerUser === c
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">Each user randomly follows up to this many other users (duplicates skipped, max 20).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={injectNetworks}
                    onChange={(e) => setInjectNetworks(e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Network Connections</p>
                    <p className="text-[10px] text-slate-400">Accepted `networks` rows</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={injectNetworkReqs}
                    onChange={(e) => setInjectNetworkReqs(e.target.checked)}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Pending Requests</p>
                    <p className="text-[10px] text-slate-400">Incoming invites to accept</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clearExistingFollows}
                    onChange={(e) => setClearExistingFollows(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-rose-200">Clear Existing First</p>
                    <p className="text-[10px] text-rose-300/70">Wipes follows & networks tables</p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleGenerateFollows}
                disabled={isGeneratingFollows}
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition"
              >
                {isGeneratingFollows ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Injecting Random Follows...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Insert Random Follows
                  </>
                )}
              </button>
            </div>

            {followsResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Follow Injection Complete
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Follows Created</span>
                    <p className="text-base font-bold text-sky-400">+{followsResult.follows_created}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Network Connections</span>
                    <p className="text-base font-bold text-emerald-400">+{followsResult.networks_created}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Pending Requests</span>
                    <p className="text-base font-bold text-amber-400">+{followsResult.network_reqs_created}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Users Processed</span>
                    <p className="text-base font-bold text-white">{followsResult.users_processed}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: 5-HOUR AUTOMATED INTERACTION CYCLE */}
        {activeTab === 'rotation' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">5-Hour Automated Interaction Rotation Engine</h2>
                </div>
                <span className="text-xs text-slate-400">Automated cycle in `interaction_rotation_logs`</span>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> How the 5-Hour Cycle Works:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li>When any user visits the landing page or stats endpoint, the system checks if 5 hours have passed.</li>
                  <li>Every 5 hours, the engine automatically <strong>removes 10 old comments & reacts</strong> and <strong>adds 10 new random comments & reacts</strong> from random users across random posts.</li>
                  <li>Each cycle is permanently recorded in the <strong>`interaction_rotation_logs`</strong> table.</li>
                </ul>
              </div>

              <button
                onClick={handleTrigger5HourRotation}
                disabled={isRotating}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                {isRotating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Trigger Immediate 5-Hour Rotation Cycle Now
              </button>
            </div>

            {rotationResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Rotation Cycle Executed Successfully
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Comments Added</span>
                    <p className="text-base font-bold text-emerald-400">+{rotationResult.comments_added}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Comments Pruned</span>
                    <p className="text-base font-bold text-rose-400">-{rotationResult.comments_pruned}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Reacts Added</span>
                    <p className="text-base font-bold text-emerald-400">+{rotationResult.reacts_added}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl">
                    <span className="text-slate-400">Reacts Pruned</span>
                    <p className="text-base font-bold text-rose-400">-{rotationResult.reacts_pruned}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-mono pt-1">{rotationResult.details}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
