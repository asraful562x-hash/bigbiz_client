'use client';

import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Key, Lock, Check } from 'lucide-react';

interface SecuritySettingsTabProps {
  twoFactor: boolean;
  setTwoFactor: (v: boolean) => void;
  loginAlerts: boolean;
  setLoginAlerts: (v: boolean) => void;
}

export const SecuritySettingsTab: React.FC<SecuritySettingsTabProps> = ({
  twoFactor,
  setTwoFactor,
  loginAlerts,
  setLoginAlerts,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-lg font-black text-slate-900">Security & Authentication</h3>
        <p className="text-xs text-slate-500">Protect your enterprise assets, escrow orders, and customer accounts</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Two-Factor Authentication (2FA)</h5>
              <p className="text-[11px] text-slate-500">Require an authenticator code for logins and escrow withdrawals</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-slate-900">Security Login Alerts</h5>
              <p className="text-[11px] text-slate-500">Get notified immediately if an unrecognized device logs in</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={loginAlerts}
            onChange={(e) => setLoginAlerts(e.target.checked)}
            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
          />
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="border-t border-slate-100 pt-5 space-y-4">
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          Update Password
        </h4>

        {passwordSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" /> Password updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};
