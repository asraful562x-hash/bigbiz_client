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
  Check,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  Network,
  MessageSquare,
  Star,
  MapPin,
  Search
} from 'lucide-react';

interface SettingsPrivacyViewProps {
  currentUser: User;
  onUpdateUser?: (updated: User) => void;
  allUsers?: User[];
}

type SubTab = 'profile' | 'network' | 'security' | 'privacy' | 'notifications' | 'billing';
type NetworkTab = 'following' | 'followers' | 'connections';

export const SettingsPrivacyView: React.FC<SettingsPrivacyViewProps> = ({ currentUser, onUpdateUser, allUsers = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('profile');
  
  // Form State
  const [name, setName] = useState(currentUser.name);
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio || 'Leading vendor for verified commercial equipment & software licensing.');
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

  // Network state
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkTab, setNetworkTab] = useState<NetworkTab>('followers');
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(
    new Set(allUsers.slice(0, 3).map(u => u.id))
  );

  const otherUsers = allUsers.filter(u => u.id !== currentUser.id);

  const followers = otherUsers.filter(u => !followedUsers.has(u.id) ? false : true).slice(0, 8);
  const following = otherUsers.filter(u => followedUsers.has(u.id));
  const connections = otherUsers.filter(u => followedUsers.has(u.id)).slice(0, 6);

  const networkSearchFiltered = (list: User[]) =>
    networkSearch.trim()
      ? list.filter(u =>
          u.name.toLowerCase().includes(networkSearch.toLowerCase()) ||
          (u.companyName || '').toLowerCase().includes(networkSearch.toLowerCase())
        )
      : list;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, name, companyName, email });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const UserCard = ({ user, showUnfollow = false }: { user: User; showUnfollow?: boolean }) => (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="relative shrink-0">
        <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-100" />
        {user.isVerified && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
        </div>
        {user.companyName && (
          <span className="text-[10px] text-slate-500 block truncate">{user.companyName}</span>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" /> {user.location}
          </span>
          <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-current" /> {user.rating}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Message"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => toggleFollow(user.id)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            followedUsers.has(user.id)
              ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30'
          }`}
        >
          {followedUsers.has(user.id) ? (
            <><UserMinus className="w-3 h-3" /> Unfollow</>
          ) : (
            <><UserPlus className="w-3 h-3" /> Follow</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-6 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">Profile & Settings</h1>
                  {currentUser.isVerified && (
                    <span className="bg-sky-400/20 border border-sky-400/40 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {currentUser.companyName || currentUser.name} · {currentUser.location}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <span className="font-black text-white text-base block">{currentUser.followersCount}</span>
                <span className="text-slate-400 text-[10px]">Followers</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <span className="font-black text-white text-base block">{currentUser.followingCount}</span>
                <span className="text-slate-400 text-[10px]">Following</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <span className="font-black text-white text-base block">{currentUser.totalSales}</span>
                <span className="text-slate-400 text-[10px]">Total Sales</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <span className="font-black text-amber-400 text-base block">{currentUser.rating}★</span>
                <span className="text-slate-400 text-[10px]">Rating</span>
              </div>
            </div>
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
              { id: 'network', label: 'Network & Connections', icon: Network },
              { id: 'security', label: 'Security & Auth', icon: Lock },
              { id: 'privacy', label: 'Privacy & Permissions', icon: Eye },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as SubTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
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

            {/* TAB 1: PROFILE */}
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
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Bio / Tagline</label>
                  <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: NETWORK & CONNECTIONS */}
            {activeSubTab === 'network' && (
              <div className="space-y-5 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Network & Connections</h2>
                    <p className="text-xs text-slate-500">Manage who you follow, your followers, and discover new business contacts.</p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={networkSearch}
                      onChange={(e) => setNetworkSearch(e.target.value)}
                      placeholder="Search people..."
                      className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Network Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Followers', count: currentUser.followersCount, icon: Users, color: 'indigo', tab: 'followers' as const },
                    { label: 'Following', count: currentUser.followingCount, icon: UserCheck, color: 'emerald', tab: 'following' as const },
                    { label: 'Connections', count: connections.length, icon: Network, color: 'purple', tab: 'connections' as const },
                  ].map(({ label, count, icon: Icon, color, tab }) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setNetworkTab(tab as NetworkTab)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        networkTab === tab
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${networkTab === tab ? 'text-white' : `text-${color}-500`}`} />
                      <div className={`text-xl font-black ${networkTab === tab ? 'text-white' : 'text-slate-900'}`}>{count}</div>
                      <div className={`text-[11px] font-semibold mt-0.5 ${networkTab === tab ? 'text-indigo-200' : 'text-slate-500'}`}>{label}</div>
                    </button>
                  ))}
                </div>

                {/* Followers */}
                {networkTab === 'followers' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-bold text-sm text-slate-900">Followers</h3>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{currentUser.followersCount} people follow you</span>
                    </div>
                    {networkSearchFiltered(otherUsers.slice(0, currentUser.followersCount)).length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">No followers found.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {networkSearchFiltered(otherUsers.slice(0, currentUser.followersCount)).map(u => (
                          <UserCard key={u.id} user={u} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Following */}
                {networkTab === 'following' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-bold text-sm text-slate-900">Following</h3>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">You follow {following.length} people</span>
                    </div>
                    {networkSearchFiltered(following).length === 0 ? (
                      <div className="text-center py-8 space-y-2">
                        <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-400 italic">You're not following anyone yet.</p>
                        <button
                          type="button"
                          onClick={() => setNetworkTab('followers')}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          Browse Followers →
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {networkSearchFiltered(following).map(u => (
                          <UserCard key={u.id} user={u} showUnfollow />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Connections (mutual follows) */}
                {networkTab === 'connections' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Network className="w-4 h-4 text-purple-600" />
                      <h3 className="font-bold text-sm text-slate-900">Connected Contacts</h3>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Mutual business connections</span>
                    </div>
                    {networkSearchFiltered(connections).length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">No mutual connections yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {networkSearchFiltered(connections).map(u => (
                          <UserCard key={u.id} user={u} />
                        ))}
                      </div>
                    )}
                  </div>
                )}


              </div>
            )}

            {/* TAB 3: SECURITY */}
            {activeSubTab === 'security' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Security & Credentials</h2>
                  <p className="text-xs text-slate-500">Protect your business transactions, escrow funds, and team access.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Smartphone className="w-5 h-5" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[11px] text-slate-500">Require an authenticator app code for sensitive escrow payouts.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center"><Key className="w-5 h-5" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Unrecognized Device Alerts</h4>
                      <p className="text-[11px] text-slate-500">Get instant SMS and email warnings when logging in from new devices.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">Active Business Logins</h3>
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
            )}

            {/* TAB 4: PRIVACY */}
            {activeSubTab === 'privacy' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Privacy & Storefront Visibility</h2>
                  <p className="text-xs text-slate-500">Control who can discover your products, send direct RFQs, or view trade metrics.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Public Business Listing', desc: 'Make your storefront visible in global search engines and public feeds.', state: publicProfile, set: setPublicProfile },
                    { label: 'Show Sales & Trust Badge', desc: `Display verified sales count (${currentUser.totalSales}) and trust rating (${currentUser.rating}★).`, state: showSalesBadge, set: setShowSalesBadge },
                    { label: 'Allow Direct Buy Desk RFQs', desc: 'Permit enterprise buyers to send bulk custom quotes directly to your inbox.', state: allowDirectRFQ, set: setAllowDirectRFQ },
                  ].map(({ label, desc, state, set }) => (
                    <div key={label} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{label}</h4>
                        <p className="text-[11px] text-slate-500">{desc}</p>
                      </div>
                      <input type="checkbox" checked={state} onChange={() => set(!state)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeSubTab === 'notifications' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                  <p className="text-xs text-slate-500">Choose how and when you receive order updates and buyer messages.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'New Escrow Orders & Payout Alerts', desc: 'Instant notifications when a customer purchases an item or funds enter escrow.', state: emailOrders, set: setEmailOrders },
                    { label: 'Direct Messages & Software License Inquiries', desc: 'Alerts when potential buyers message your chat desk.', state: emailRFQ, set: setEmailRFQ },
                    { label: 'Weekly Business Insights & Growth Reports', desc: 'Receive analytics summary on your product views and conversion rates.', state: emailMarketing, set: setEmailMarketing },
                  ].map(({ label, desc, state, set }) => (
                    <div key={label} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{label}</h4>
                        <p className="text-[11px] text-slate-500">{desc}</p>
                      </div>
                      <input type="checkbox" checked={state} onChange={() => set(!state)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: BILLING */}
            {activeSubTab === 'billing' && (
              <div className="space-y-6 text-left">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Subscription & Business Plan</h2>
                  <p className="text-xs text-slate-500">Manage your BizSocial seller tier, payment methods, and invoice records.</p>
                </div>

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
                  <button className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Edit Method</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
