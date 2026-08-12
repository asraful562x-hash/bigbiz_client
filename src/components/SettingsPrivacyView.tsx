'use client';

import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Bell, 
  CreditCard, 
  Eye, 
  Key, 
  Smartphone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Save, 
  Sparkles,
  Check
} from 'lucide-react';

interface SettingsPrivacyViewProps {
  currentUser: User;
  onUpdateUser?: (updated: User) => void;
}

export const SettingsPrivacyView: React.FC<SettingsPrivacyViewProps> = ({ currentUser, onUpdateUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'privacy' | 'notifications' | 'billing'>('profile');
  
  // Form State
  const [name, setName] = useState(currentUser.name);
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState('Leading vendor for verified commercial equipment & software licensing.');
  const [website, setWebsite] = useState('https://bizsocial.com/vendor/nordic-timber');
  
  // Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showSalesBadge, setShowSalesBadge] = useState(true);
  const [allowDirectRFQ, setAllowDirectRFQ] = useState(true);

  // Email notifications
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailRFQ, setEmailRFQ] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name,
        companyName,
        email
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-6 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                ACCOUNT & SECURITY HUB
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Settings & Privacy</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage your business branding, security credentials, visibility permissions & subscription plans.
            </p>
          </div>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Changes Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sub-Tab Navigation Bar */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs space-y-1">
            {[
              { id: 'profile', label: 'Business Profile', icon: Building2 },
              { id: 'security', label: 'Security & Auth', icon: Lock },
              { id: 'privacy', label: 'Privacy & Permissions', icon: Eye },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    activeSubTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-9">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">

            {/* TAB 1: PROFILE & BUSINESS INFO */}
            {activeSubTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-5 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Business & Account Info</h2>
                  <p className="text-xs text-slate-500">Update how your business appears across the marketplace and B2B directory.</p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md" />
                  <div>
                    <button type="button" className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors">
                      Upload New Logo
                    </button>
                    <p className="text-[11px] text-slate-400 mt-1">Recommended: 400x400 PNG or SVG</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Representative Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Bio / Tagline</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY & AUTH */}
            {activeSubTab === 'security' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Security & Credentials</h2>
                  <p className="text-xs text-slate-500">Protect your business transactions, escrow funds, and team access.</p>
                </div>

                {/* 2FA Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[11px] text-slate-500">Require an authenticator app code for sensitive escrow payouts.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Login Alerts Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Unrecognized Device Alerts</h4>
                      <p className="text-[11px] text-slate-500">Get instant SMS and email warnings when logging in from new devices.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={() => setLoginAlerts(!loginAlerts)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Active Sessions */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">Active Business Logins</h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">Windows PC • Chrome Browser</span>
                        <span className="text-[10px] text-emerald-600 font-bold ml-2">● Current Session</span>
                        <p className="text-[10px] text-slate-400">IP: 192.168.1.42 • New York, USA</p>
                      </div>
                      <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600">Active</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRIVACY & PERMISSIONS */}
            {activeSubTab === 'privacy' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Privacy & Storefront Visibility</h2>
                  <p className="text-xs text-slate-500">Control who can discover your products, send direct RFQs, or view trade metrics.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Public Business Listing</h4>
                      <p className="text-[11px] text-slate-500">Make your storefront visible in global search engines and public feeds.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={publicProfile}
                      onChange={() => setPublicProfile(!publicProfile)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Show Sales & Trust Badge</h4>
                      <p className="text-[11px] text-slate-500">Display verified sales count ({currentUser.totalSales}) and trust rating ({currentUser.rating}★).</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showSalesBadge}
                      onChange={() => setShowSalesBadge(!showSalesBadge)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Allow Direct Buy Desk RFQs</h4>
                      <p className="text-[11px] text-slate-500">Permit enterprise buyers to send bulk custom quotes directly to your inbox.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowDirectRFQ}
                      onChange={() => setAllowDirectRFQ(!allowDirectRFQ)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeSubTab === 'notifications' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-xs text-slate-500">Choose how and when you receive order updates and buyer messages.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">New Escrow Orders & Payout Alerts</h4>
                      <p className="text-[11px] text-slate-500">Instant notifications when a customer purchases an item or funds enter escrow.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailOrders}
                      onChange={() => setEmailOrders(!emailOrders)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Direct Messages & Software License Inquiries</h4>
                      <p className="text-[11px] text-slate-500">Alerts when potential buyers message your chat desk.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailRFQ}
                      onChange={() => setEmailRFQ(!emailRFQ)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Weekly Business Insights & Growth Reports</h4>
                      <p className="text-[11px] text-slate-500">Receive analytics summary on your product views and conversion rates.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailMarketing}
                      onChange={() => setEmailMarketing(!emailMarketing)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BILLING & PLANS */}
            {activeSubTab === 'billing' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Subscription & Business Plan</h2>
                  <p className="text-xs text-slate-500">Manage your BizSocial seller tier, payment methods, and invoice records.</p>
                </div>

                {/* Current Active Plan Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">CURRENT PLAN</span>
                    </div>
                    <h3 className="text-xl font-black">Business PRO Seller</h3>
                    <p className="text-xs text-slate-300 mt-1">Unlimited product listings, SaaS licensing suite & 1.5% low escrow fee.</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-black">$49</span>
                    <span className="text-xs text-slate-300"> / month</span>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Renews Aug 28, 2026</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Visa ending in •••• 4242</h4>
                      <p className="text-[10px] text-slate-500">Expires 12/28 • Default Payment Method</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Method</button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
