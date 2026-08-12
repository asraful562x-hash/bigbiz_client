'use client';

import React, { useState } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { 
  Building2, 
  ShoppingBag, 
  Code2, 
  Wrench, 
  Handshake, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  TrendingUp, 
  Zap
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<'products' | 'software' | 'services' | 'b2b'>('products');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Map custom email or pick matching user or first user
    const existing = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      onLogin(existing);
    } else {
      // Create lightweight session user object
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: fullName || businessName || email.split('@')[0],
        username: `@${(fullName || email.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        role: businessCategory === 'b2b' ? 'procurement' : 'seller_premium',
        bio: `${businessCategory.toUpperCase()} vendor platform account`,
        isVerified: true,
        verificationBadgeType: 'b2b_verified',
        companyName: businessName || `${fullName || 'My'} Enterprise`,
        rating: 5.0,
        reviewsCount: 1,
        totalSales: 1,
        followersCount: 120,
        followingCount: 45,
        subscriptionStatus: 'premium',
        location: 'New York, USA',
        createdAt: 'Just now'
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Ambient Glassmorphism Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Branding */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white tracking-tight">BizSocial</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                BUSINESS PLATFORM
              </span>
            </div>
            <p className="text-xs text-slate-400">Social Commerce, SaaS Licensing & B2B Trading</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-slate-400">Need immediate demo access?</span>
          <button 
            onClick={() => onLogin(INITIAL_USERS[2])}
            className="text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 border border-indigo-400/30"
          >
            Instant Demo Access
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">

        {/* ── MOBILE LAYOUT: Hero text (top) → Login card (middle) → Feature grid (bottom) ── */}
        {/* ── DESKTOP LAYOUT: Left col = hero text + feature grid | Right col = login card ── */}

        {/* Hero Text — always on top (mobile) / left top (desktop) */}
        <div className="lg:col-span-6 lg:row-start-1 space-y-4 text-left mb-6 lg:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>The All-In-One Business Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Control Your <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Entire Business</span> on Social Media
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            From physical product selling, digital software licensing, and professional services to multi-million B2B procurement — direct trade, escrow security, and social networking under one roof.
          </p>

          {/* Feature Matrix Cards — hidden on mobile (shown below login), visible on desktop */}
          <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Product Selling & Buying</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Physical goods, wholesale inventory & instant checkout.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Software & Digital Assets</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Sell SaaS products, apps, API keys & digital tools.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Services & Consultancy</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Custom services, freelance contracts & rentals.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Handshake className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">B2B Procurement & Offers</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Bulk RFQs, direct sell-to-us offers & escrow safety.</p>
            </div>
          </div>

          {/* Platform Trust Stats — desktop only */}
          <div className="hidden lg:flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Payment Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Global Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Payouts</span>
            </div>
          </div>
        </div>

        {/* Right Form Column: Login — shown FIRST on mobile (top, centered), right on desktop */}
        <div className="lg:col-span-6 w-full max-w-lg lg:max-w-none mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-950/60 rounded-2xl p-1 border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Business Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'register' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Business
              </button>
            </div>

            {/* Custom Login / Signup Form */}
            <form onSubmit={handleCustomLogin} className="space-y-4 text-left">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Software Solutions"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Business Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Focus</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'products', label: 'Product Selling', icon: ShoppingBag },
                        { id: 'software', label: 'Software / SaaS', icon: Code2 },
                        { id: 'services', label: 'Services & Consultancy', icon: Wrench },
                        { id: 'b2b', label: 'B2B Procurement', icon: Handshake },
                      ].map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setBusinessCategory(cat.id as any)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              businessCategory === cat.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 shrink-0" />
                            <span className="text-[11px] truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-[11px] text-indigo-400 hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
              >
                <span>{mode === 'login' ? 'Sign In to Business Hub' : 'Create Business Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Switch Persona Box */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ⚡ Quick Demo Business Accounts
                </span>
                <span className="text-[10px] text-slate-500">Select any role to test</span>
              </div>

              <div className="space-y-2">
                {INITIAL_USERS.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onLogin(u)}
                    className="w-full p-2 rounded-xl bg-slate-950/50 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-left group transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {u.companyName || u.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      Login as →
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Feature Grid + Trust Stats — mobile only, shown below login card */}
        <div className="lg:hidden space-y-4 mt-6 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Product Selling & Buying</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Physical goods, wholesale inventory & instant checkout.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Software & Digital Assets</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Sell SaaS products, apps, API keys & digital tools.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Services & Consultancy</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Custom services, freelance contracts & rentals.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Handshake className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">B2B Procurement & Offers</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Bulk RFQs, direct sell-to-us offers & escrow safety.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Payment Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Global Verified Vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Payouts</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>© 2026 BizSocial Ecosystem Inc. All rights reserved. Built for global sellers, SaaS developers, and B2B buyers.</p>
      </footer>
    </div>
  );
};
