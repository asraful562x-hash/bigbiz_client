'use client';

import React from 'react';
import { User } from '../../types';
import { 
  User as UserIcon, 
  Building2, 
  Mail, 
  Globe, 
  Save, 
  Check, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

interface ProfileSettingsTabProps {
  currentUser: User;
  name: string;
  setName: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  savedSuccess: boolean;
  onSaveProfile: (e: React.FormEvent) => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  currentUser,
  name,
  setName,
  companyName,
  setCompanyName,
  email,
  setEmail,
  bio,
  setBio,
  website,
  setWebsite,
  savedSuccess,
  onSaveProfile,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900">Public Business Profile</h3>
          <p className="text-xs text-slate-500">Manage how buyers, vendors, and partners see your enterprise presence</p>
        </div>
        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
            <Check className="w-4 h-4" /> Changes Saved
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-slate-900">{currentUser.name}</h4>
            {currentUser.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
          </div>
          <p className="text-xs text-slate-500">{currentUser.companyName || 'Enterprise Member'}</p>
          <div className="pt-1 flex gap-2">
            <button type="button" className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Change Avatar
            </button>
            <button type="button" className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Upload Banner
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={onSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Contact / Representative Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Company / Brand Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Nordic Timber Corp"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Storefront / Company Website
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Business Bio / Scope of Operations
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
