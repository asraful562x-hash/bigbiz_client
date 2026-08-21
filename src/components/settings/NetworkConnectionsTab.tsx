'use client';

import React, { useState } from 'react';
import { User } from '../../types';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  UserMinus, 
  Search, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Building2 
} from 'lucide-react';

interface NetworkConnectionsTabProps {
  currentUser: User;
  allUsers: User[];
}

type NetworkTab = 'following' | 'followers' | 'connections';

export const NetworkConnectionsTab: React.FC<NetworkConnectionsTabProps> = ({
  currentUser,
  allUsers,
}) => {
  const [networkTab, setNetworkTab] = useState<NetworkTab>('followers');
  const [networkSearch, setNetworkSearch] = useState('');
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(
    new Set(allUsers.slice(0, 3).map(u => u.id))
  );

  const otherUsers = allUsers.filter(u => u.id !== currentUser.id);

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const getFilteredUsers = () => {
    let list: User[] = [];
    if (networkTab === 'following') {
      list = otherUsers.filter(u => followedUsers.has(u.id));
    } else if (networkTab === 'followers') {
      list = otherUsers;
    } else {
      list = otherUsers.filter(u => followedUsers.has(u.id) && u.isVerified);
    }

    if (networkSearch.trim()) {
      const q = networkSearch.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.companyName && u.companyName.toLowerCase().includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q))
      );
    }
    return list;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900">B2B Business Network</h3>
          <p className="text-xs text-slate-500">Manage your verified partners, followers, and procurement connections</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-1.5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <span className="text-xs font-black text-indigo-700 block">{followedUsers.size}</span>
            <span className="text-[10px] font-bold text-slate-400">Following</span>
          </div>
          <div className="text-center px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-black text-slate-700 block">{currentUser.followersCount || otherUsers.length}</span>
            <span className="text-[10px] font-bold text-slate-400">Followers</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setNetworkTab('followers')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              networkTab === 'followers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Followers ({otherUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setNetworkTab('following')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              networkTab === 'following'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Following ({followedUsers.size})
          </button>
          <button
            type="button"
            onClick={() => setNetworkTab('connections')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              networkTab === 'connections'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Verified ({otherUsers.filter(u => u.isVerified).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={networkSearch}
            onChange={(e) => setNetworkSearch(e.target.value)}
            placeholder="Search network members..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold">No members match your criteria</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isFollowing = followedUsers.has(u.id);
            return (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-xs text-slate-900 truncate">{u.name}</span>
                      {u.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {u.companyName || 'Enterprise Partner'}
                    </span>
                    {u.location && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {u.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(u.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 ${
                    isFollowing
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
