'use client';

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { 
  Building2, 
  ShoppingBag, 
  Code2, 
  Wrench, 
  Handshake, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User, token?: string) => void;
}

const mapRoleNameToUserRole = (roleName: string): UserRole => {
  if (roleName === 'buyer_premium') return 'buyer_premium';
  if (roleName === 'buyer_free' || roleName === 'buyer') return 'buyer_free';
  if (roleName === 'seller_free') return 'seller_free';
  if (roleName === 'seller_premium' || roleName === 'seller') return 'seller_premium';
  if (roleName === 'admin') return 'admin';
  if (roleName === 'moderator') return 'moderator';
  if (roleName === 'procurement') return 'procurement';
  return 'buyer_free';
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://bigbiz-backend.onrender.com';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<'products' | 'software' | 'services' | 'b2b'>('products');
  const [roleType, setRoleType] = useState<UserRole>('buyer_free');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `${API_BASE}/api/auth/${provider}`;
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Backend login
        const response = await fetch(`${API_BASE}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const userPayload = data.data;

          const roleName = userPayload.role_name || 'buyer_free';
          const resolvedRole = mapRoleNameToUserRole(roleName);
          const loggedInUser: User = {
            // FIX: use the real numeric ID from the backend as-is (stringified).
            // Previously this was `user-${userPayload.id || Date.now()}`, which
            // fabricated an ID that never matched the raw ID returned by
            // /api/users, breaking every network/status/message lookup that
            // compared currentUser.id against another user's id.
            id: String(userPayload.id),
            name: userPayload.full_name || email.split('@')[0],
            username: `@${(userPayload.full_name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            email: userPayload.email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            role: resolvedRole,
            bio: `${(userPayload.business_focus || roleName).toUpperCase()} platform account`,
            isVerified: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement',
            verificationBadgeType: 'b2b_verified',
            companyName: userPayload.company_name || 'Enterprise Account',
            rating: 5.0,
            reviewsCount: 1,
            totalSales: 1,
            followersCount: 120,
            followingCount: 45,
            subscriptionStatus: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement' ? 'premium' : 'free',
            location: 'Global',
            createdAt: 'Just now'
          };

          // Dual-storage token
          if (userPayload.token) {
            localStorage.setItem('auth_token', userPayload.token);
            document.cookie = `auth_token=${userPayload.token}; path=/; max-age=86400; SameSite=Lax`;
          }
          localStorage.setItem('auth_user', JSON.stringify(loggedInUser));

          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => onLogin(loggedInUser, userPayload.token), 600);
          return;
        }

        if (response.status === 401 || response.status === 400 || response.status === 403) {
          const errData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
          setErrorMessage(errData.message || 'Invalid email or password.');
          setIsLoading(false);
          return;
        }
      } else {
        // Register Mode: create user in backend
        const response = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName || businessName || email.split('@')[0],
            company_name: businessName,
            email: email,
            role_name: roleType,
            business_focus: businessCategory,
            password: password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const userPayload = data.data;
          const roleName = userPayload.role_name || roleType;
          const resolvedRole = mapRoleNameToUserRole(roleName);

          const newUser: User = {
            // FIX: same as above — use the real numeric ID from the backend.
            id: String(userPayload.id),
            name: userPayload.full_name,
            username: `@${userPayload.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            email: userPayload.email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            role: resolvedRole,
            bio: `${businessCategory.toUpperCase()} account`,
            isVerified: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement',
            verificationBadgeType: 'b2b_verified',
            companyName: userPayload.company_name || `${fullName}'s Business`,
            rating: 5.0,
            reviewsCount: 0,
            totalSales: 0,
            followersCount: 10,
            followingCount: 5,
            subscriptionStatus: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement' ? 'premium' : 'free',
            location: 'Global',
            createdAt: 'Just now'
          };

          // Get a real JWT by logging in with the freshly created credentials —
          // a fabricated token here would fail /api/users/me on reload
          let token: string | undefined;
          try {
            const loginRes = await fetch(`${API_BASE}/api/users/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            if (loginRes.ok) {
              const loginData = await loginRes.json();
              token = loginData.data?.token;
            }
          } catch {}

          if (token) {
            localStorage.setItem('auth_token', token);
            document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          localStorage.setItem('auth_user', JSON.stringify(newUser));

          setSuccessMessage('Account registered successfully! Accessing workspace...');
          setTimeout(() => onLogin(newUser, token), 600);
          return;
        }

        const errData = await response.json().catch(() => ({ message: 'Registration failed' }));
        setErrorMessage(errData.message || 'Registration failed. Email may already be registered.');
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback for offline demonstration (backend unreachable / network error).
      // NOTE: this path has no real backend user to reference, so a synthetic
      // `user-${Date.now()}` id is intentionally kept here for existing demo
      // accounts. Any real backend call made while in this state (network
      // requests, chat, etc.) will not resolve against real data, since
      // there's no matching row in Postgres. This is expected for a pure
      // offline/demo fallback.
      const existing = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        localStorage.setItem('auth_token', `demo_token_${existing.id}`);
        localStorage.setItem('auth_user', JSON.stringify(existing));
        onLogin(existing);
      } else {
        const resolvedRole = mapRoleNameToUserRole(roleType);
        const fallbackUser: User = {
          id: `user-${Date.now()}`,
          name: fullName || businessName || email.split('@')[0],
          username: `@${(fullName || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          email: email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          role: resolvedRole,
          bio: `${businessCategory.toUpperCase()} account`,
          isVerified: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement',
          verificationBadgeType: 'b2b_verified',
          companyName: businessName || `${fullName || 'My'} Enterprise`,
          rating: 5.0,
          reviewsCount: 1,
          totalSales: 1,
          followersCount: 120,
          followingCount: 45,
          subscriptionStatus: resolvedRole.includes('premium') || resolvedRole === 'admin' || resolvedRole === 'procurement' ? 'premium' : 'free',
          location: 'Global',
          createdAt: 'Just now'
        };
        const token = `demo_token_${fallbackUser.id}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
        onLogin(fallbackUser, token);
      }
    } finally {
      setIsLoading(false);
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

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Enterprise Secure Authentication</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">

        {/* Hero Text */}
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

          {/* Feature Matrix Cards */}
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

          {/* Platform Trust Stats */}
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

        {/* Right Form Column: OAuth + Email Sign-In / Register */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className={`w-full ${mode === 'login' ? 'max-w-md' : 'max-w-lg'} bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 transition-all duration-200`}>
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-950/70 rounded-2xl p-1 border border-white/5 mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Business Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Business
              </button>
            </div>

            {/* Prominent OAuth Options Section */}
            <div className="space-y-2.5 mb-5">
              {/* Google OAuth Button */}
              <button
                type="button"
                id="btn-oauth-google"
                onClick={() => handleOAuthLogin('google')}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] border border-slate-200 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                <span>{mode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}</span>
              </button>

              {/* Facebook OAuth Button */}
              <button
                type="button"
                id="btn-oauth-facebook"
                onClick={() => handleOAuthLogin('facebook')}
                className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                <span>{mode === 'login' ? 'Continue with Facebook' : 'Sign Up with Facebook'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 absolute">
                or with business email
              </span>
            </div>

            {/* Error & Success Feedback Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Custom Login / Signup Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3.5 text-left">
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
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Enterprise Solutions"
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Account Role Selector (Free Buyer or Free Seller only) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">Account Role</label>
                      <span className="text-[10px] text-amber-400 font-medium">⚡ Upgrade to PRO inside app anytime</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRoleType('buyer_free')}
                        className={`py-3 px-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col ${
                          roleType === 'buyer_free'
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-xs font-bold ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-extrabold text-sm">🛒 Buyer</span>
                        <span className="text-[10px] opacity-70 font-normal mt-0.5">Purchase products, rent & request quotes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRoleType('seller_free')}
                        className={`py-3 px-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col ${
                          roleType === 'seller_free'
                            ? 'bg-teal-600/30 border-teal-500 text-teal-200 shadow-xs font-bold ring-1 ring-teal-500/50'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-extrabold text-sm">🏪 Seller / Merchant</span>
                        <span className="text-[10px] opacity-70 font-normal mt-0.5">List products, manage store & sell</span>
                      </button>
                    </div>
                  </div>

                  {/* Business Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Business Focus</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'products', label: 'Products', icon: ShoppingBag },
                        { id: 'software', label: 'Software/SaaS', icon: Code2 },
                        { id: 'services', label: 'Services', icon: Wrench },
                        { id: 'b2b', label: 'B2B Trade', icon: Handshake },
                      ].map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setBusinessCategory(cat.id as any)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              businessCategory === cat.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5 shrink-0" />
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
                    <button type="button" className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
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
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Business Hub' : 'Create Business Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* Feature Grid + Trust Stats — mobile only */}
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