'use client';

import React, { useState, useRef } from 'react';
import { User, MarketplaceCategory, AppNotification, Conversation, Message } from '../types';
import { useScrollOverflow } from '../hooks/useScrollOverflow';
import { 
  Store, 
  Newspaper, 
  Handshake, 
  LayoutDashboard, 
  MessageSquare, 
  Bell, 
  ShoppingBag,
  Search, 
  PlusCircle, 
  ShieldAlert, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  UserCheck,
  Send,
  Check,
  Building2,
  Clock,
  ArrowRight,
  Menu,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: MarketplaceCategory | 'all';
  setSelectedCategory: (cat: MarketplaceCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  escrowOrdersCount: number;
  onOpenCreateModal: () => void;
  onOpenSellToUs: () => void;
  onOpenNotifications: () => void;
  isNotificationsOpen?: boolean;
  onOpenMessages: () => void;
  isMessagesOpen?: boolean;
  onUpgradeTier: () => void;
  onLogout?: () => void;
  onOpenSwitchAccount?: () => void;
  onOpenLeftDrawer?: () => void;
  onOpenRightDrawer?: () => void;
  notifications?: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  conversations?: Conversation[];
  messages?: Message[];
  onSendMessage?: (conversationId: string, text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  unreadNotificationsCount,
  unreadMessagesCount,
  escrowOrdersCount,
  onOpenCreateModal,
  onOpenSellToUs,
  onOpenNotifications,
  isNotificationsOpen = false,
  onOpenMessages,
  isMessagesOpen = false,
  onUpgradeTier,
  onLogout,
  onOpenSwitchAccount,
  onOpenLeftDrawer,
  onOpenRightDrawer,
  notifications = [],
  onMarkAllNotificationsRead,
  conversations = [],
  messages = [],
  onSendMessage
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeNotifFilter, setActiveNotifFilter] = useState<'all' | 'orders' | 'updates'>('all');
  const [mobileChatTab, setMobileChatTab] = useState<'contacts' | 'chat'>('contacts');
  
  // Quick Chat Inside Overlay
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [quickMsgText, setQuickMsgText] = useState('');

  const mainNavScrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft: canNavScrollLeft, canScrollRight: canNavScrollRight } = useScrollOverflow(mainNavScrollRef);

  const scrollMainNav = (direction: 'left' | 'right') => {
    if (mainNavScrollRef.current) {
      const el = mainNavScrollRef.current;
      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const step = 200;

      if (direction === 'right') {
        const targetLeft = Math.min(maxScrollLeft, Math.ceil(el.scrollLeft) + step);
        el.scrollTo({ left: targetLeft, behavior: 'smooth' });
      } else {
        const targetLeft = Math.max(0, Math.floor(el.scrollLeft) - step);
        el.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'new_products', label: '✨ New Products' },
    { id: 'second_hand', label: '🔄 Second-hand & Resale' },
    { id: 'services', label: '🛠️ Services Marketplace' },
    { id: 'rentals', label: '🗝️ Rental Marketplace' },
    { id: 'wholesale_b2b', label: '📦 Wholesale / B2B' },
  ];

  const categoryLabels: Record<string, string> = {
    all: 'All Categories',
    new_products: 'New Products',
    second_hand: 'Second-hand',
    services: 'Services',
    rentals: 'Rentals',
    wholesale_b2b: 'Wholesale B2B'
  };

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsgText.trim()) return;
    const targetConvId = selectedConvId || conversations[0]?.id;
    if (targetConvId && onSendMessage) {
      onSendMessage(targetConvId, quickMsgText);
      setQuickMsgText('');
    }
  };

  const currentConv = conversations.find(c => c.id === (selectedConvId || conversations[0]?.id));
  const activeConvMessages = messages.filter(m => m.conversationId === (selectedConvId || conversations[0]?.id));

  return (
    <header className={`sticky top-0 transition-colors duration-100 ease-out ${isNotificationsOpen || isMessagesOpen || showProfileMenu ? 'z-50 bg-white' : 'z-30 bg-white/95 backdrop-blur-md shadow-xs'}`}>
      <div className="max-w-[1800px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 relative">
          
          {/* Left Brand Container (Menu + Logo + Subtitle) — stays strictly on left */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Hamburger — visible only on < 1300px */}
            <button
              onClick={onOpenLeftDrawer}
              className="max-[1299px]:flex hidden items-center justify-center p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo & Brand */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0">
                B
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">BizSocial</span>
                  <span className="text-[9px] sm:text-[10px] bg-indigo-50 text-indigo-700 px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-indigo-200 hidden xs:inline-block">
                    MARKETPLACE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden min-[426px]:block truncate">Social E-Commerce & B2B Hub</p>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar (visible on > 880px) */}
          <div className="flex-1 max-w-xl relative hidden min-[881px]:flex items-center">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, software SaaS, B2B wholesale, services..."
                className="w-full pl-10 pr-28 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <div className="absolute right-1">
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="text-xs bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
                >
                  <span>{categoryLabels[selectedCategory]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Category Dropdown */}
            {showCategoryMenu && (
              <div className="absolute top-12 right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as MarketplaceCategory | 'all');
                      setShowCategoryMenu(false);
                      if (activeTab !== 'marketplace') setActiveTab('marketplace');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                      selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Offer Action Button */}
            <button
              onClick={onOpenSellToUs}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Handshake className="w-4 h-4" />
              <span>Sell to Us Direct</span>
            </button>

            {/* Create Post / Listing (Square Icon Button) */}
            <button
              onClick={onOpenCreateModal}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0"
              title="Create Post or Listing"
              aria-label="Create Post or Listing"
            >
              <PlusCircle className="w-5 h-5" />
            </button>



            {/* 100% Viewport Edge-to-Edge Full-Screen Blur Overlay (No Animation) */}
            {(isNotificationsOpen || isMessagesOpen || showProfileMenu) && (
              <div 
                onClick={() => {
                  if (isNotificationsOpen) onOpenNotifications();
                  if (isMessagesOpen) onOpenMessages();
                  if (showProfileMenu) setShowProfileMenu(false);
                }}
                className="fixed inset-0 w-screen h-screen z-40 bg-slate-950/70 backdrop-blur-xl cursor-pointer pointer-events-auto"
              />
            )}

            {/* Notifications Button */}
            <div className={`relative ${isNotificationsOpen ? 'z-50' : 'z-10'}`}>
              <button
                onClick={onOpenNotifications}
                className={`p-2.5 rounded-xl transition-all duration-150 ease-out relative ${
                  isNotificationsOpen
                    ? 'z-50 pointer-events-auto bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 ring-4 ring-indigo-400/60 scale-105'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                title="Notifications"
              >
                <Bell className={`w-5 h-5 ${isNotificationsOpen ? 'text-white' : ''}`} />
                {unreadNotificationsCount > 0 && (
                  <span className={`absolute text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none transition-all ${
                    isNotificationsOpen
                      ? 'bg-white text-indigo-700 font-black shadow-xs border border-indigo-200 -top-1 -right-1'
                      : 'bg-rose-500 text-white shadow-xs top-0.5 right-0.5'
                  }`}>
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION OVERLAY: Modern Backdrop Blur Glassmorphism Card */}
              {isNotificationsOpen && (
                <div className="fixed sm:absolute inset-x-3 bottom-3 sm:inset-auto sm:right-0 sm:top-14 w-auto sm:w-[480px] md:w-[520px] max-h-[85vh] bg-slate-900/95 backdrop-blur-2xl border border-white/20 text-white shadow-2xl rounded-3xl p-4 sm:p-5 z-50 pointer-events-auto animate-slide-up-bottom sm:animate-in sm:fade-in sm:zoom-in-95 font-sans text-left overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold">
                        <Bell className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-sm text-white">Notifications</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onMarkAllNotificationsRead && (
                        <button
                          onClick={onMarkAllNotificationsRead}
                          className="text-[11px] text-indigo-300 hover:text-white font-bold transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button 
                        onClick={onOpenNotifications} 
                        className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 mb-3 text-xs">
                    <button
                      onClick={() => setActiveNotifFilter('all')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        activeNotifFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveNotifFilter('orders')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        activeNotifFilter === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Orders & Payouts
                    </button>
                    <button
                      onClick={() => setActiveNotifFilter('updates')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                        activeNotifFilter === 'updates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      System
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-2xl border transition-all text-left ${
                            n.isRead 
                              ? 'bg-white/5 border-white/5 text-slate-300' 
                              : 'bg-indigo-900/40 border-indigo-500/40 text-white shadow-md'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white leading-tight">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-normal">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Button */}
            <div className={`relative ${isMessagesOpen ? 'z-50' : 'z-10'}`}>
              <button
                onClick={onOpenMessages}
                className={`hidden sm:block p-2.5 rounded-xl transition-all duration-150 ease-out relative ${
                  isMessagesOpen
                    ? 'z-50 pointer-events-auto bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 ring-4 ring-indigo-400/60 scale-105'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                title="Messages"
              >
                <MessageSquare className={`w-5 h-5 ${isMessagesOpen ? 'text-white' : ''}`} />
                {unreadMessagesCount > 0 && (
                  <span className={`absolute text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none transition-all ${
                    isMessagesOpen
                      ? 'bg-white text-indigo-700 font-black shadow-xs border border-indigo-200 -top-1 -right-1'
                      : 'bg-rose-500 text-white shadow-xs top-0.5 right-0.5'
                  }`}>
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* MESSAGING OVERLAY: Modern Backdrop Blur Glassmorphism Card with User List + Chat */}
              {isMessagesOpen && (
                <div className="fixed sm:absolute inset-x-0 bottom-0 sm:inset-auto sm:right-0 sm:top-14 w-full sm:w-[560px] md:w-[640px] h-[80vh] sm:h-auto sm:max-h-[520px] bg-slate-900/95 backdrop-blur-2xl border-t sm:border border-white/20 text-white shadow-2xl rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 z-50 pointer-events-auto animate-slide-up-bottom sm:animate-in sm:fade-in sm:zoom-in-95 font-sans text-left flex flex-col">
                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white">Direct Business Chat & Inbox</span>
                        {currentConv && (
                          <span className="text-[10px] text-slate-400 block">Active chat with {currentConv.otherParticipant.name}</span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={onOpenMessages} 
                      className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Tab Switcher Strip (Visible on mobile only < sm) */}
                  <div className="flex sm:hidden bg-slate-950/70 p-1 rounded-xl border border-white/10 mb-3 text-xs shrink-0">
                    <button
                      onClick={() => setMobileChatTab('contacts')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                        mobileChatTab === 'contacts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Contacts ({conversations.length})
                    </button>
                    <button
                      onClick={() => setMobileChatTab('chat')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                        mobileChatTab === 'chat' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>Chat</span>
                      {currentConv && <span className="text-[10px] bg-white/20 px-1.5 rounded-full truncate max-w-[80px]">{currentConv.otherParticipant.name.split(' ')[0]}</span>}
                    </button>
                  </div>

                  {/* Main Grid: Left Users List + Right Chat Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
                    {/* Left: Contact / Users Inbox List (Span 5 on Desktop, visible on mobile when tab='contacts') */}
                    <div className={`sm:col-span-5 flex flex-col gap-1.5 overflow-y-auto pr-1 sm:border-r border-white/10 pb-2 sm:pb-0 shrink-0 ${
                      mobileChatTab === 'contacts' ? 'flex' : 'hidden sm:flex'
                    }`}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 px-1">Active Contacts ({conversations.length})</span>
                      {conversations.map((c) => {
                        const isSelected = (selectedConvId || conversations[0]?.id) === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedConvId(c.id);
                              setMobileChatTab('chat'); // Switch tab automatically to chat on mobile when selecting a contact
                            }}
                            className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all w-full ${
                              isSelected
                                ? 'bg-indigo-600/90 border-indigo-400/80 text-white shadow-md'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img src={c.otherParticipant.avatar} alt={c.otherParticipant.name} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs truncate">{c.otherParticipant.name}</span>
                                <span className="text-[9px] text-slate-400 shrink-0">{c.lastMessageTime}</span>
                              </div>
                              <span className="text-[10px] text-slate-300 truncate block opacity-80">{c.lastMessage}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Active Chat Conversation Box (Span 7 on Desktop, visible on mobile when tab='chat') */}
                    <div className={`sm:col-span-7 flex flex-col min-h-0 flex-1 ${
                      mobileChatTab === 'chat' ? 'flex' : 'hidden sm:flex'
                    }`}>
                      {/* Active Contact Header inside Chat View on mobile */}
                      {currentConv && (
                        <div className="flex sm:hidden items-center justify-between bg-white/5 p-2 rounded-xl mb-2 border border-white/10">
                          <div className="flex items-center gap-2">
                            <img src={currentConv.otherParticipant.avatar} alt={currentConv.otherParticipant.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-bold text-white truncate">{currentConv.otherParticipant.name}</span>
                          </div>
                          <button 
                            onClick={() => setMobileChatTab('contacts')} 
                            className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-600/30 px-2 py-0.5 rounded-lg border border-indigo-400/30"
                          >
                            Switch Contact
                          </button>
                        </div>
                      )}

                      {/* Message History Stream */}
                      <div className="space-y-2 flex-1 overflow-y-auto pr-1 flex flex-col justify-end bg-slate-950/50 p-3 rounded-2xl border border-white/5 mb-2 min-h-0">
                        {activeConvMessages.length === 0 ? (
                          <p className="text-center text-xs text-slate-500 py-4">No messages yet. Send a quote inquiry!</p>
                        ) : (
                          activeConvMessages.map((m) => {
                            const isMe = m.senderId === currentUser.id;
                            return (
                              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-normal ${
                                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                                }`}>
                                  <p>{m.text}</p>
                                  <span className="text-[9px] opacity-70 block text-right mt-1">{m.createdAt}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Quick Message Form Input */}
                      <form onSubmit={handleSendQuickMessage} className="relative flex items-center shrink-0">
                        <input
                          type="text"
                          value={quickMsgText}
                          onChange={(e) => setQuickMsgText(e.target.value)}
                          placeholder="Type a message or price quote..."
                          className="w-full pl-3 pr-10 py-2.5 bg-slate-950/80 border border-white/20 focus:border-indigo-400 text-xs text-white placeholder-slate-400 rounded-xl focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* User Profile Badge & Dropdown Menu */}
            <div className={`relative ${showProfileMenu ? 'z-50' : 'z-10'}`}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 shadow-xs"
                />
                <div className="hidden xl:block text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                    {currentUser.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </div>

              {/* USER PROFILE DROPDOWN MENU */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200/90 rounded-2xl shadow-2xl py-2 z-50 pointer-events-auto animate-in fade-in zoom-in-95 font-sans text-left">
                  {/* Account Header Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.companyName || currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings & Privacy</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('help');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Help & Support</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenSwitchAccount) onOpenSwitchAccount();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span>Switch Account</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile & Tablet Search Bar with Right Drawer Button (visible on <= 880px) */}
        <div className="pt-2 pb-2 border-t border-slate-100 min-[881px]:hidden w-full flex items-stretch gap-2">
          <div className="relative flex-1 flex items-center h-10">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SaaS, B2B wholesale, services..."
              className="w-full h-full pl-10 pr-28 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            <div className="absolute right-1">
              <button
                type="button"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="text-[11px] bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 px-2 py-1 rounded-lg flex items-center gap-1 font-medium transition-colors"
              >
                <span>{categoryLabels[selectedCategory]}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Right Drawer Button (attached to right side of search bar with matching 40px height) */}
          <button
            onClick={onOpenRightDrawer}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-600 transition-colors shrink-0 flex items-center justify-center border border-slate-200/80"
            title="Open Activity & Insights"
            aria-label="Open right sidebar"
          >
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          </button>
        </div>

        {/* Primary View Navigation Tabs */}
        <div className="relative hidden sm:flex items-center border-t border-slate-100/80 pt-2 pb-1.5 w-full min-w-0 overflow-hidden">
          {canNavScrollLeft && (
            <button
              onClick={() => scrollMainNav('left')}
              aria-label="Scroll left"
              className="p-1.5 rounded-full bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/80 shadow-xs transition-all shrink-0 mr-1.5 z-10 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div 
            ref={mainNavScrollRef}
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 no-scrollbar flex-1 min-w-0 max-w-full justify-start sm:justify-center"
          >
            <button
              onClick={() => setActiveTab('feed')}
              title="Social Feed"
              aria-label="Social Feed"
              className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                activeTab === 'feed'
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5 font-bold scale-[1.05]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Newspaper className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'feed' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span className="sr-only">Social Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              title="Marketplace"
              aria-label="Marketplace"
              className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                activeTab === 'marketplace'
                  ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5 font-bold scale-[1.05]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Store className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'marketplace' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span className="sr-only">Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('sell_to_us')}
              title="Sell to Us Direct Offers"
              aria-label="Sell to Us Direct Offers"
              className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                activeTab === 'sell_to_us'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30 scale-[1.05]'
                  : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/80'
              }`}
            >
              <Handshake className={`w-5 h-5 shrink-0 ${activeTab === 'sell_to_us' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="sr-only">Sell to Us Direct Offers</span>
            </button>

            {/* Orders & Escrow Tab */}
            <button
              onClick={() => setActiveTab('orders')}
              title="Orders & Escrow"
              aria-label="Orders & Escrow"
              className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-900/5 font-bold scale-[1.05]'
                  : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50/80'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'orders' ? 'text-amber-600' : 'text-slate-500 group-hover:text-amber-500'}`} />
              {escrowOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[9px] min-w-[16px] h-[16px] flex items-center justify-center px-1 rounded-full border border-white shadow-xs">
                  {escrowOrdersCount}
                </span>
              )}
              <span className="sr-only">Orders & Escrow</span>
            </button>

            {(currentUser.role === 'seller_free' || currentUser.role === 'seller_premium') && (
              <button
                onClick={() => setActiveTab('seller')}
                title="Seller Hub"
                aria-label="Seller Hub"
                className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                  activeTab === 'seller'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5 font-bold scale-[1.05]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'seller' ? 'text-indigo-600' : 'text-slate-500'}`} />
                {currentUser.subscriptionStatus === 'premium' && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1 rounded-full shadow-2xs">PRO</span>
                )}
                <span className="sr-only">Seller Hub</span>
              </button>
            )}

            {currentUser.role === 'procurement' && (
              <button
                onClick={() => setActiveTab('procurement')}
                title="Procurement Buy Desk"
                aria-label="Procurement Buy Desk"
                className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                  activeTab === 'procurement'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold scale-[1.05]'
                    : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                <Handshake className="w-5 h-5 shrink-0" />
                <span className="sr-only">Procurement Buy Desk</span>
              </button>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
              <button
                onClick={() => setActiveTab('admin')}
                title="Admin & Safety Hub"
                aria-label="Admin & Safety Hub"
                className={`p-2 sm:p-2.5 rounded-xl relative group flex items-center justify-center transition-all duration-200 shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-purple-700 text-white shadow-sm font-bold scale-[1.05]'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="sr-only">Admin & Safety Hub</span>
              </button>
            )}

          </div>

          {canNavScrollRight && (
            <button
              onClick={() => scrollMainNav('right')}
              aria-label="Scroll right"
              className="p-1.5 rounded-full bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/80 shadow-xs transition-all shrink-0 ml-1.5 z-10 active:scale-95"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
