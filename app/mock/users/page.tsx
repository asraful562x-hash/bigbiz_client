'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Database, Sparkles, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';
import { API_CONFIG } from '../../../src/config/api.config';

export default function MockUsersPage() {
  const [count, setCount] = useState<number>(5);
  const [role, setRole] = useState<string>('random');
  const [focus, setFocus] = useState<string>('random');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(API_CONFIG.resolveUrl('/dev/mock/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          role_name: role === 'random' ? '' : role,
          business_focus: focus === 'random' ? '' : focus,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(data.data);
        setMessage(`✅ Successfully generated and inserted ${data.data.length} users into the database!`);
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
                <Users className="w-5 h-5 text-indigo-400" /> Users Table Generator
              </h1>
              <p className="text-xs text-slate-400">Generate & seed mock user records into PostgreSQL</p>
            </div>
          </div>
          <Link href="/feed" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
            Feed <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
            {message}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="random">Random</option>
                <option value="buyer_free">Buyer Free</option>
                <option value="buyer_premium">Buyer Premium</option>
                <option value="seller_free">Seller Free</option>
                <option value="seller_premium">Seller Premium</option>
                <option value="procurement">Procurement</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Focus</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="random">Random</option>
                <option value="products">Products</option>
                <option value="software">Software</option>
                <option value="services">Services</option>
                <option value="wholesale_b2b">Wholesale</option>
                <option value="rentals">Rentals</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate {count} Users
          </button>
        </div>

        {users.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase">Inserted Users ({users.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map((u, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <p className="font-bold text-white text-sm">{u.full_name}</p>
                  <p className="text-slate-400">{u.company_name} — {u.email}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">{u.role_name}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">{u.business_focus}</span>
                  </div>
                  <p className="text-emerald-400 font-mono text-[11px] truncate">Slug: {u.encrypted_id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
