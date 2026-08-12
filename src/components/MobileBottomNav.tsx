'use client';

import React from 'react';
import { User } from '../types';
import { 
  Newspaper, 
  Store, 
  Handshake, 
  Package, 
  User as UserIcon, 
  LayoutDashboard, 
  ShieldAlert 
} from 'lucide-react';

interface MobileBottomNavProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  escrowOrdersCount: number;
  onOpenProfile?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  escrowOrdersCount,
  onOpenProfile,
}) => {
  // Determine 4th item based on role:
  // Normal user ('buyer') gets 'Profile'
  // Other roles get their respective Hub/Dashboard
  const getRoleNavItem = () => {
    if (currentUser.role === 'buyer') {
      return {
        id: 'profile',
        label: 'Profile',
        icon: UserIcon,
        onClick: () => onOpenProfile?.(),
        isActive: false,
      };
    } else if (currentUser.role === 'seller_free' || currentUser.role === 'seller_premium') {
      return {
        id: 'seller',
        label: 'Seller Hub',
        icon: LayoutDashboard,
        onClick: () => setActiveTab('seller'),
        isActive: activeTab === 'seller',
      };
    } else if (currentUser.role === 'procurement') {
      return {
        id: 'procurement',
        label: 'Buy Desk',
        icon: Handshake,
        onClick: () => setActiveTab('procurement'),
        isActive: activeTab === 'procurement',
      };
    } else {
      // admin or moderator
      return {
        id: 'admin',
        label: 'Admin Hub',
        icon: ShieldAlert,
        onClick: () => setActiveTab('admin'),
        isActive: activeTab === 'admin',
      };
    }
  };

  const roleItem = getRoleNavItem();

  const navItems = [
    {
      id: 'feed',
      label: 'Feed',
      icon: Newspaper,
      onClick: () => setActiveTab('feed'),
      isActive: activeTab === 'feed',
      // Bell curve alignment settings: outer baseline
      curveStyle: 'translate-y-1 scale-95',
      pillClass: 'px-3 py-1',
    },
    {
      id: 'marketplace',
      label: 'Market',
      icon: Store,
      onClick: () => setActiveTab('marketplace'),
      isActive: activeTab === 'marketplace',
      // Bell curve alignment settings: mid elevated
      curveStyle: '-translate-y-2 scale-100',
      pillClass: 'px-3.5 py-1',
    },
    {
      id: 'sell_to_us',
      label: 'Sell to Us',
      icon: Handshake,
      onClick: () => setActiveTab('sell_to_us'),
      isActive: activeTab === 'sell_to_us',
      // Bell curve alignment settings: PEAK CENTER
      isPeak: true,
      curveStyle: '-translate-y-6 scale-110 z-10',
      pillClass: 'p-3 rounded-full shadow-lg shadow-indigo-500/30 ring-4 ring-white',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      onClick: () => setActiveTab('orders'),
      isActive: activeTab === 'orders',
      badge: escrowOrdersCount,
      // Bell curve alignment settings: mid elevated
      curveStyle: '-translate-y-2 scale-100',
      pillClass: 'px-3.5 py-1',
    },
    {
      ...roleItem,
      // Bell curve alignment settings: outer baseline
      curveStyle: 'translate-y-1 scale-95',
      pillClass: 'px-3 py-1',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pb-2 pt-2 sm:hidden transition-all duration-200">
      {/* Bell Curve Visual Guide Line in Background */}
      <div className="absolute inset-x-0 -top-3 h-3 pointer-events-none overflow-hidden opacity-30">
        <svg className="w-full h-full text-indigo-500/20 fill-current" viewBox="0 0 100 10" preserveAspectRatio="none">
          <path d="M0 10 C 30 10, 35 0, 50 0 C 65 0, 70 10, 100 10 Z" />
        </svg>
      </div>

      <div className="flex items-end justify-around max-w-md mx-auto pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center transition-all duration-300 relative min-w-[54px] active:scale-95 ${item.curveStyle} ${
                item.isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Android Material 3 Active Pill Highlight / Peak Center FAB */}
              <div
                className={`flex items-center justify-center transition-all duration-300 relative ${item.pillClass} ${
                  item.isPeak
                    ? item.isActive
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 ring-4 ring-indigo-300/80 scale-105'
                      : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white'
                    : item.isActive
                    ? 'bg-indigo-100/90 text-indigo-700 rounded-full shadow-2xs'
                    : 'bg-transparent text-slate-500'
                }`}
              >
                <Icon
                  className={`transition-transform duration-200 ${
                    item.isPeak
                      ? 'w-6 h-6 stroke-[2.2]'
                      : item.isActive
                      ? 'w-5 h-5 scale-110 stroke-[2.3]'
                      : 'w-5 h-5 stroke-[1.8]'
                  }`}
                />
                
                {/* Badge for unread counts */}
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Caption Label */}
              <span
                className={`text-[10px] mt-1 tracking-tight transition-all duration-200 whitespace-nowrap ${
                  item.isPeak
                    ? item.isActive
                      ? 'text-indigo-600 font-black'
                      : 'text-indigo-700 font-bold'
                    : item.isActive
                    ? 'text-indigo-600 font-extrabold'
                    : 'text-slate-500 font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

