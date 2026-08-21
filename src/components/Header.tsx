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
  SlidersHorizontal,
  Bot,
  RefreshCw
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
  onOpenProfile?: (userId: string) => void;
  onOpenLeftDrawer?: () => void;
  onOpenRightDrawer?: () => void;
  notifications?: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  conversations?: Conversation[];
  messages?: Message[];
  onSendMessage?: (conversationId: string, text: string) => void;
  activeConversationId?: string | null;
  /** When true (e.g. Settings / Help), hides nav tabs and sidebars — full screen mode */
  isFullScreen?: boolean;
  incomingNetworkRequests?: Array<{ id: number; sender_id: string; receiver_id: string; create_date_time: string }>;
  onAcceptNetworkRequest?: (requestId: number) => void;
  onRejectNetworkRequest?: (requestId: number) => void;
  onMarkConversationRead?: (conversationId: string) => void;
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
  onOpenProfile,
  onOpenLeftDrawer,
  onOpenRightDrawer,
  notifications = [],
  onMarkAllNotificationsRead,
  conversations = [],
  messages = [],
  onSendMessage,
  activeConversationId,
  isFullScreen = false,
  incomingNetworkRequests = [],
  onAcceptNetworkRequest,
  onRejectNetworkRequest,
  onMarkConversationRead,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeNotifFilter, setActiveNotifFilter] = useState<'all' | 'orders' | 'updates'>('all');
  const [mobileChatTab, setMobileChatTab] = useState<'contacts' | 'chat'>('contacts');
  
  // Quick Chat Inside Overlay
  const [selectedConvId, setSelectedConvId] = useState<string | null>(activeConversationId || conversations[0]?.id || null);
  const [quickMsgText, setQuickMsgText] = useState('');

  // Ref to track which convId we already marked read — prevents infinite loops
  const lastMarkedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
      setMobileChatTab('chat');
      setOverlayChatTab('users');
      // Only call mark-read if this is a newly-selected conversation
      if (onMarkConversationRead && lastMarkedRef.current !== activeConversationId) {
        lastMarkedRef.current = activeConversationId;
        onMarkConversationRead(activeConversationId);
      }
    } else if (conversations.length > 0 && (!selectedConvId || !conversations.some(c => c.id === selectedConvId))) {
      setSelectedConvId(conversations[0].id);
    }
  // onMarkConversationRead is stable (useCallback) — safe to include
  }, [activeConversationId, conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  // When the message panel opens, mark the currently selected conv as read (once)
  const prevIsOpenRef = React.useRef(false);
  React.useEffect(() => {
    const justOpened = isMessagesOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isMessagesOpen;
    if (justOpened && selectedConvId && onMarkConversationRead && lastMarkedRef.current !== selectedConvId) {
      lastMarkedRef.current = selectedConvId;
      onMarkConversationRead(selectedConvId);
    }
  }, [isMessagesOpen, selectedConvId, onMarkConversationRead]);
  
  // Overlay Mode: 'users' vs 'bot'
  const [overlayChatTab, setOverlayChatTab] = useState<'users' | 'bot'>('users');
  const [overlayBotMessages, setOverlayBotMessages] = useState<Array<{ id: string; role: 'user' | 'bot'; text: string; time: string; followUps?: string[] }>>([
    {
      id: 'welcome',
      role: 'bot',
      text: "≡ƒæï **Hi there! I'm BizBot AI**, your 24/7 business assistant.\n\nI can help you with account issues, creating listings, orders, escrow, payments, and platform rules. How can I help you today?",
      time: 'Just now',
      followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing']
    }
  ]);
  const [overlayBotInput, setOverlayBotInput] = useState('');
  const [isOverlayBotTyping, setIsOverlayBotTyping] = useState(false);

  const handleSendOverlayBot = (textToSend?: string) => {
    const text = textToSend || overlayBotInput;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOverlayBotMessages(prev => [...prev, userMsg]);
    setOverlayBotInput('');
    setIsOverlayBotTyping(true);

    const lower = text.toLowerCase();
    setTimeout(() => {
      let reply = "I'm not sure about that, but our human support desk is always here to help! Reach us at support@bizsocial.com.";
      let followUps = ['Login & Account', 'Orders & Escrow', 'Payments & Billing'];

      if (lower.includes('login') || lower.includes('password') || lower.includes('access')) {
        reply = "**Login Assistance:**\nΓÇó Verify your registered email.\nΓÇó Use 'Forgot Password' on the login card to reset credentials.\nΓÇó OAuth logins bypass passwords securely.\nΓÇó Contact support@bizsocial.com if locked.";
        followUps = ['How do I change email?', 'I need MFA help'];
      } else if (lower.includes('order') || lower.includes('escrow') || lower.includes('buy')) {
        reply = "**Escrow Protection:**\nΓÇó Funds are held in neutral escrow until delivery confirmation.\nΓÇó Track live milestones under Orders & Escrow.\nΓÇó 100% money-back guarantee for disputed orders.";
        followUps = ['How do I confirm delivery?', 'Raise an order dispute'];
      } else if (lower.includes('listing') || lower.includes('sell') || lower.includes('product')) {
        reply = "**Creating a Listing:**\nΓÇó Click the **∩╝ï button** at the top right.\nΓÇó Choose category (B2B, Goods, Services, Rentals).\nΓÇó Set price, stock, and upload images to publish instantly.";
        followUps = ['How to get verified?', 'Listing pricing tips'];
      } else if (lower.includes('payment') || lower.includes('billing') || lower.includes('fee') || lower.includes('refund')) {
        reply = "**Payments & Billing:**\nΓÇó 3% seller fee on successful sales.\nΓÇó Payouts processed in 24ΓÇô48 hours via Bank Transfer or Card.\nΓÇó Refunds processed in 5ΓÇô7 days.";
        followUps = ['View my invoices', 'Upgrade subscription'];
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('help')) {
        reply = "≡ƒæï **Hello!** I am BizBot AI. Pick a topic or type any question below to get instant answers!";
      }

      setOverlayBotMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps
        }
      ]);
      setIsOverlayBotTyping(false);
    }, 800);
  };

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
    { id: 'new_products', label: 'Γ£¿ New Products' },
    { id: 'second_hand', label: '≡ƒöä Second-hand & Resale' },
    { id: 'services', label: '≡ƒ¢á∩╕Å Services Marketplace' },
    { id: 'rentals', label: '≡ƒù¥∩╕Å Rental Marketplace' },
    { id: 'wholesale_b2b', label: '≡ƒôª Wholesale / B2B' },
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
          
          {/* Left Brand Container (Menu + Logo + Subtitle) ΓÇö stays strictly on left */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* In full-screen mode show a back arrow; otherwise hamburger */}
            {isFullScreen ? (
              <button
                onClick={() => setActiveTab('feed')}
                className="flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shrink-0 group"
                aria-label="Back to Feed"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={onOpenLeftDrawer}
                className="max-[1299px]:flex hidden items-center justify-center p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo & Brand */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0">
                B
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">BizSocial</span>
                  {isFullScreen ? (
                    <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-500 px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-slate-200 hidden xs:inline-block">
                      {activeTab === 'settings' ? 'PROFILE' : 'HELP'}
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] bg-indigo-50 text-indigo-700 px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-indigo-200 hidden xs:inline-block">
                      MARKETPLACE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 hidden min-[426px]:block truncate">
                  {isFullScreen
                    ? activeTab === 'settings'
                      ? 'Profile & Settings'
                      : 'Help Center & Support'
                    : 'Social E-Commerce & B2B Hub'}
                </p>
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
            
            {/* Direct Offer Action Button ΓÇö hide for admin */}
            {currentUser.role !== 'admin' && currentUser.role !== 'moderator' && (
              <button
                onClick={onOpenSellToUs}
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Handshake className="w-4 h-4" />
                <span>Sell to Us Direct</span>
              </button>
            )}

            {/* Admin Private Badge ΓÇö shown instead for admin roles */}
            {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
              <button
                onClick={() => setActiveTab('admin')}
                className="hidden lg:flex items-center gap-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-700/50 text-purple-300 font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Mission Control</span>
              </button>
            )}

            {/* Create Post / Listing ΓÇö hide for admin */}
            {currentUser.role !== 'admin' && currentUser.role !== 'moderator' && (
              <button
                onClick={onOpenCreateModal}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0"
                title="Create Post or Listing"
                aria-label="Create Post or Listing"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}



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
                    {/* Incoming Connection Requests */}
                    {(activeNotifFilter === 'all' || activeNotifFilter === 'updates') && incomingNetworkRequests && incomingNetworkRequests.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {incomingNetworkRequests.map((req) => (
                          <div
                            key={req.id}
                            className="p-3 rounded-2xl border bg-indigo-950/70 border-indigo-500/50 text-white shadow-md text-left"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-300" /> Connection Request
                              </h4>
                              <span className="text-[10px] text-slate-400">Just now</span>
                            </div>
                            <p className="text-[11px] text-slate-200 mt-1 leading-normal">
                              User #{req.sender_id} requested to connect with your business network.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => onAcceptNetworkRequest?.(req.id)}
                                className="flex-1 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => onRejectNetworkRequest?.(req.id)}
                                className="py-1 px-2.5 bg-white/10 hover:bg-rose-600/60 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(() => {
                      const filteredNotifications = notifications.filter(n => {
                        if (activeNotifFilter === 'all') return true;
                        if (activeNotifFilter === 'orders') return n.type === 'order' || n.type === 'offer_update';
                        return n.type !== 'order' && n.type !== 'offer_update';
                      });

                      if (filteredNotifications.length === 0 && (!incomingNetworkRequests || incomingNetworkRequests.length === 0 || activeNotifFilter === 'orders')) {
                        return (
                          <div className="text-center py-8 text-slate-400 text-xs">
                            No notifications in this tab.
                          </div>
                        );
                      }

                      return filteredNotifications.map((n) => (
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
                      ));
                    })()}
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
                <div className="relative flex items-center justify-center group">
                  <MessageSquare className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isMessagesOpen ? 'text-white' : ''}`} />
                  <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse filter drop-shadow-xs" />
                </div>
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

              {/* MESSAGING OVERLAY: Modern Backdrop Blur Glassmorphism Card with User List + Chat + BizBot AI */}
              {isMessagesOpen && (
                <div className="fixed sm:absolute inset-x-0 bottom-0 sm:inset-auto sm:right-0 sm:top-14 w-full sm:w-[680px] md:w-[760px] lg:w-[820px] h-[85vh] sm:h-[600px] bg-slate-900/95 backdrop-blur-2xl border-t sm:border border-white/20 text-white shadow-2xl rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 z-50 pointer-events-auto animate-slide-up-bottom sm:animate-in sm:fade-in sm:zoom-in-95 font-sans text-left flex flex-col">
                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-white">Direct Business Chat & Inbox</span>
                        {overlayChatTab === 'users' && currentConv && (
                          <span className="text-[10px] text-slate-400 block">Active chat with {currentConv.otherParticipant.name}</span>
                        )}
                        {overlayChatTab === 'bot' && (
                          <span className="text-[10px] text-purple-300 block">24/7 Automated Business AI Assistant</span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={onOpenMessages} 
                      className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ── Main Tab Switcher Strip: Segmented Modern Glassmorphism ── */}
                  <div className="grid grid-cols-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-3 text-xs shrink-0 shadow-inner backdrop-blur-md gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOverlayChatTab('users')}
                      className={`py-2 px-3 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 ${
                        overlayChatTab === 'users'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40 scale-[1.01]'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>User Chats</span>
                      <span className="px-1.5 py-0.2 text-[10px] font-black bg-white/20 text-white rounded-full">
                        {conversations.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOverlayChatTab('bot')}
                      className={`py-2 px-3 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 ${
                        overlayChatTab === 'bot'
                          ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/40 scale-[1.01]'
                          : 'text-slate-400 hover:text-purple-300 hover:bg-white/5 font-semibold'
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <Bot className="w-4 h-4 text-purple-200" />
                        <Sparkles className="w-2 h-2 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <span>BizBot AI</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-black bg-purple-400/20 text-purple-200 rounded-full border border-purple-400/30">
                        24/7
                      </span>
                    </button>
                  </div>

                  {/* ── TAB 1: User Chats Grid ── */}
                  {overlayChatTab === 'users' && (
                    <>
                      {/* Main Grid: Left Users List + Right Chat Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
                        {/* Left: Contact / Users Inbox List */}
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
                                  setMobileChatTab('chat');
                                  // Reset so the ref-guard allows marking this new selection
                                  lastMarkedRef.current = c.id;
                                  onMarkConversationRead?.(c.id);
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

                        {/* Right: Active Chat Conversation Box */}
                        <div className={`sm:col-span-7 flex flex-col min-h-0 flex-1 ${
                          mobileChatTab === 'chat' ? 'flex' : 'hidden sm:flex'
                        }`}>
                          {/* Active Contact Header inside Chat View on mobile */}
                          {currentConv && (
                            <div className="flex sm:hidden items-center justify-between bg-white/10 p-2.5 rounded-2xl mb-2.5 border border-white/15 shadow-sm shrink-0">
                              <button
                                type="button"
                                onClick={() => setMobileChatTab('contacts')}
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/40 px-2.5 py-1 rounded-xl border border-indigo-400/40 active:scale-95 transition-all"
                              >
                                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                                <span>Contacts</span>
                              </button>
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={currentConv.otherParticipant.avatar} alt={currentConv.otherParticipant.name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                                <span className="text-xs font-bold text-white truncate max-w-[120px]">{currentConv.otherParticipant.name}</span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 animate-pulse" />
                              </div>
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
                    </>
                  )}

                  {/* ΓöÇΓöÇ TAB 2: BizBot AI Chat Tab ΓöÇΓöÇ */}
                  {overlayChatTab === 'bot' && (
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Bot Message History Stream */}
                      <div className="space-y-3 flex-1 overflow-y-auto pr-1 bg-slate-950/50 p-3.5 rounded-2xl border border-white/5 mb-2 min-h-0">
                        {overlayBotMessages.map((bm) => (
                          <div key={bm.id} className={`flex flex-col gap-1 ${bm.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {bm.role === 'bot' && (
                              <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-bold px-1">
                                <Bot className="w-3 h-3" />
                                <span>BizBot AI</span>
                              </div>
                            )}
                            <div className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                              bm.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-white/10'
                            }`}>
                              <p className="whitespace-pre-line">{bm.text}</p>
                              <span className="text-[9px] opacity-60 block text-right mt-1">{bm.time}</span>
                            </div>

                            {/* Bot follow-up suggestions */}
                            {bm.role === 'bot' && bm.followUps && (
                              <div className="flex flex-wrap gap-1 mt-1 max-w-[90%]">
                                {bm.followUps.map((fu) => (
                                  <button
                                    key={fu}
                                    type="button"
                                    onClick={() => handleSendOverlayBot(fu)}
                                    className="text-[10px] bg-white/10 hover:bg-purple-600/50 border border-white/15 text-purple-200 font-bold px-2 py-0.5 rounded-full transition-all active:scale-95"
                                  >
                                    {fu}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {isOverlayBotTyping && (
                          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-2 rounded-2xl text-xs text-purple-300 w-fit">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-[10px] ml-1">BizBot is thinking...</span>
                          </div>
                        )}
                      </div>

                      {/* Bot Quick Message Form Input */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendOverlayBot();
                        }}
                        className="relative flex items-center shrink-0"
                      >
                        <input
                          type="text"
                          value={overlayBotInput}
                          onChange={(e) => setOverlayBotInput(e.target.value)}
                          placeholder="Ask BizBot about orders, verification, fees, listings..."
                          className="w-full pl-3 pr-10 py-2.5 bg-slate-950/80 border border-white/20 focus:border-purple-400 text-xs text-white placeholder-slate-400 rounded-xl focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={!overlayBotInput.trim() || isOverlayBotTyping}
                          className="absolute right-1.5 p-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-lg transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}
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
                    {onOpenProfile && (
                      <button
                        onClick={() => {
                          onOpenProfile(currentUser.id);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span>View My Profile & Posts</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
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

        {/* Mobile & Tablet Search Bar with Right Drawer Button (visible on <= 880px, hidden in full-screen) */}
        <div className={`pt-2 pb-2 border-t border-slate-100 min-[881px]:hidden w-full flex items-stretch gap-2 ${isFullScreen ? 'hidden' : ''}`}>
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

        {/* Primary View Navigation Tabs ΓÇö hidden on full-screen pages */}
        <div className={`relative sm:flex items-center border-t border-slate-100/80 pt-2 pb-1.5 w-full min-w-0 overflow-hidden ${isFullScreen ? 'hidden' : 'hidden sm:flex'}`}>
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
