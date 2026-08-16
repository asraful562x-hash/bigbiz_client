'use client';

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  Building2,
  ShoppingBag,
  Code2,
  Wrench,
  Handshake,
  ArrowRight,
  User as UserIcon,
  Mail,
  Sparkles,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';

const mapOnboardingRole = (roleName: string): UserRole => {
  if (roleName.includes('seller')) return 'seller_free';
  return 'buyer_free';
};

interface OnboardingModalProps {
  initialUser: User;
  onComplete: (updatedUser: User) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ initialUser, onComplete }) => {
  const [fullName, setFullName] = useState(initialUser.name || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [companyName, setCompanyName] = useState(initialUser.companyName || '');
  const [roleType, setRoleType] = useState<UserRole>('buyer_free');
  const [businessCategory, setBusinessCategory] = useState<'products' | 'software' | 'services' | 'b2b'>('products');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !companyName.trim() || !email.trim()) {
      setErrorMessage('Please fill in all required fields to enter the platform.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const resolvedRole = mapOnboardingRole(roleType);

    try {
      const res = await fetch(`${API_BASE}/api/users/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim(),
          company_name: companyName.trim(),
          role_name: roleType,
          business_focus: businessCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const payload = data.data;

        // 1st user is ALWAYS admin
        const finalRole: UserRole = (initialUser.role === 'admin' || payload.id === 1 || payload.role_name === 'admin') 
          ? 'admin' 
          : (payload.role_name ? (payload.role_name as UserRole) : resolvedRole);

        const updated: User = {
          ...initialUser,
          name: payload.full_name,
          email: payload.email,
          companyName: payload.company_name,
          role: finalRole,
          isVerified: finalRole === 'admin' || finalRole.includes('premium'),
          subscriptionStatus: finalRole === 'admin' || finalRole.includes('premium') ? 'premium' : 'free',
          bio: `${businessCategory.toUpperCase()} verified organization`,
        };

        // Update stored session and permanently mark onboarded
        localStorage.setItem(`onboarded_${updated.email}`, 'true');
        localStorage.setItem('auth_user', JSON.stringify(updated));
        onComplete(updated);
        return;
      }

      const errData = await res.json().catch(() => ({ message: 'Failed to complete profile' }));
      setErrorMessage(errData.message || 'Error updating profile');
    } catch {
      // Offline fallback
      const finalRole: UserRole = initialUser.role === 'admin' ? 'admin' : resolvedRole;
      const updated: User = {
        ...initialUser,
        name: fullName.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        role: finalRole,
        isVerified: finalRole === 'admin' || finalRole.includes('premium'),
        subscriptionStatus: finalRole === 'admin' || finalRole.includes('premium') ? 'premium' : 'free',
        bio: `${businessCategory.toUpperCase()} verified organization`,
      };
      localStorage.setItem(`onboarded_${updated.email}`, 'true');
      localStorage.setItem('auth_user', JSON.stringify(updated));
      onComplete(updated);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-4xl p-5 sm:p-8 md:p-10 bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl text-left my-auto backdrop-blur-xl">
        
        {/* Header with resilient responsive flex-wrap and badge protection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                Complete Business Onboarding
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Set up your commercial profile to activate your verified trading hub.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-500/15 text-amber-300 font-bold px-3 py-1 rounded-full border border-amber-500/30 whitespace-nowrap shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              REQUIRED STEP
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Responsive Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Left Column: Personal & Company Credentials */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <span>1. Organization Identity</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Business Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Company / Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Brand Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Cyberdyne Systems Enterprise"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Roles and Category Focus */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <span>2. Trading Role & Focus</span>
              </div>

              {/* Account Role Selector (Only Buyer and Seller) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Your Account Role <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoleType('buyer_free')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      roleType === 'buyer_free'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 font-bold ring-2 ring-indigo-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-black text-white">Buyer</span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-snug">
                      Browse verified products & purchase with Escrow
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleType('seller_free')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      roleType === 'seller_free'
                        ? 'bg-teal-600/30 border-teal-500 text-teal-100 shadow-lg shadow-teal-600/20 font-bold ring-2 ring-teal-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-black text-white">Seller</span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-snug">
                      Publish listings, receive RFQs & manage sales
                    </span>
                  </button>
                </div>
                <p className="text-[11px] text-indigo-300/80 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>You can upgrade to a PRO / VIP package anytime in Profile & Settings.</span>
                </p>
              </div>

              {/* Business Focus Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Business Focus <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'products', label: 'Products & Goods', icon: ShoppingBag, desc: 'Wholesale & retail goods' },
                    { id: 'software', label: 'Software & SaaS', icon: Code2, desc: 'Digital licenses & APIs' },
                    { id: 'services', label: 'Services & BPO', icon: Wrench, desc: 'Custom consultancy' },
                    { id: 'b2b', label: 'B2B Trade & RFQs', icon: Handshake, desc: 'Direct corporate trade' },
                  ].map((cat) => {
                    const IconComponent = cat.icon;
                    const isSelected = businessCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setBusinessCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-600/15'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-100 truncate">{cat.label}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{cat.desc}</div>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Enterprise Escrow Protection Enabled</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Complete Onboarding & Enter App</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
