'use client';

import React, { useRef } from 'react';
import { User, UserRole } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { Shield, Sparkles, CheckCircle, Store, ShoppingBag, Briefcase, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: User;
  allUsers?: User[];
  users?: User[];
  onSelectUser: (user: User) => void;
  onUpgradeTier?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  allUsers,
  users,
  onSelectUser,
  onUpgradeTier
}) => {
  const userList = allUsers || users || [];
  const roleScrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft: canRolesScrollLeft, canScrollRight: canRolesScrollRight } = useScrollOverflow(roleScrollRef);

  const scrollRoles = (direction: 'left' | 'right') => {
    if (roleScrollRef.current) {
      roleScrollRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth'
      });
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'buyer': return 'Customer / Buyer';
      case 'seller_free': return 'Seller (Free Tier)';
      case 'seller_premium': return 'Seller (Premium Tier)';
      case 'admin': return 'Super Admin';
      case 'moderator': return 'Moderator / Trust & Safety';
      case 'procurement': return 'Procurement / Buy Desk';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'seller_premium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'seller_free': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'procurement': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Deduplicate user list by role so each role is represented exactly once
  const uniqueRoleUsers = userList.reduce<User[]>((acc, u) => {
    if (!acc.some(existing => existing.role === u.role)) {
      acc.push(u);
    }
    return acc;
  }, []);

  return (
    <div className="bg-slate-900 text-white px-2.5 sm:px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-700/50 text-[10px] sm:text-xs shrink-0">
          <Eye className="w-3.5 h-3.5" /> ROLE DEMO MODE
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Switch viewing role to experience all platform perspectives:
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap max-w-full overflow-hidden">
        <span className="text-slate-300 font-medium hidden md:inline shrink-0">Current Role:</span>
        
        <div className="flex items-center gap-1 max-w-full overflow-hidden">
          {canRolesScrollLeft && (
            <button
              onClick={() => scrollRoles('left')}
              aria-label="Scroll left"
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div 
            ref={roleScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xs sm:max-w-md md:max-w-lg no-scrollbar scroll-smooth"
          >
            {uniqueRoleUsers.map((u) => {
              const isActive = u.id === currentUser.id || u.role === currentUser.role;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border text-[11px] sm:text-xs shrink-0 ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm font-semibold' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  <span>{u.name.split(' ')[0]}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded border font-medium ${getRoleBadgeColor(u.role)}`}>
                    {getRoleLabel(u.role).split(' ')[0]}
                  </span>
                  {u.isVerified && <CheckCircle className="w-3 h-3 text-sky-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {canRolesScrollRight && (
            <button
              onClick={() => scrollRoles('right')}
              aria-label="Scroll right"
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {currentUser.subscriptionStatus === 'free' && (
          <button
            onClick={onUpgradeTier}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md text-[11px] sm:text-xs transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" /> Upgrade
          </button>
        )}
      </div>
    </div>
  );
};
