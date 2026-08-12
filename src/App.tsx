'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Listing, 
  Post, 
  Story, 
  DirectOffer, 
  Order, 
  Conversation, 
  Message, 
  AppNotification, 
  Review, 
  Dispute,
  MarketplaceCategory,
  ProductCondition,
  DirectOfferStatus
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_LISTINGS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_DIRECT_OFFERS, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REVIEWS, 
  INITIAL_DISPUTES, 
  INITIAL_ANALYTICS 
} from './data/mockData';

import { Header } from './components/Header';
import { RoleSwitcher } from './components/RoleSwitcher';
import { FeedView } from './components/FeedView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OrdersView } from './components/OrdersView';
import { SellToUsModal } from './components/SellToUsModal';
import { SellToUsTracker } from './components/SellToUsTracker';
import { CreateListingModal } from './components/CreateListingModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { StoryViewModal } from './components/StoryViewModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SellerProfileModal } from './components/SellerProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginPage } from './components/LoginPage';
import { SettingsPrivacyView } from './components/SettingsPrivacyView';
import { HelpSupportView } from './components/HelpSupportView';
import { SwitchAccountModal } from './components/SwitchAccountModal';
import { LeftBusinessSidebar } from './components/LeftBusinessSidebar';
import { RightBusinessSidebar } from './components/RightBusinessSidebar';
import { CreateQuoteModal } from './components/CreateQuoteModal';

import { 
  Store, 
  Newspaper, 
  Handshake, 
  LayoutDashboard, 
  ShoppingBag, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Bell, 
  UserCheck, 
  TrendingUp, 
  Tag, 
  Building2, 
  DollarSign, 
  Clock, 
  MessageSquare,
  X,
  Menu
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // App Global State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Default to Nordic Timber (Seller Premium)
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [offers, setOffers] = useState<DirectOffer[]>(INITIAL_DIRECT_OFFERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  // View Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels State
  const [showSellToUsModal, setShowSellToUsModal] = useState<boolean>(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState<boolean>(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState<boolean>(false);
  const [showMessagesModal, setShowMessagesModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState<boolean>(false);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState<boolean>(false);
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [activeChatSellerId, setActiveChatSellerId] = useState<string | null>(null);

  // Unread Counters
  const unreadNotificationsCount = notifications.filter(n => !n.isRead && n.userId === currentUser.id).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const escrowOrdersCount = orders.filter(o => o.escrowStatus === 'held').length;

  const [roleToast, setRoleToast] = useState<string | null>(null);

  // Keyboard shortcut (1-6) and URL route (/1, /2, /3, etc.) role switching
  useEffect(() => {
    const handleRoleSelectIndex = (idx: number) => {
      if (idx >= 0 && idx < INITIAL_USERS.length) {
        const targetUser = INITIAL_USERS[idx];
        setCurrentUser(targetUser);

        const roleNames: Record<string, string> = {
          buyer: 'Buyer / Customer',
          seller_free: 'Seller (Free Tier)',
          seller_premium: 'Seller (Premium PRO)',
          admin: 'Platform Admin',
          moderator: 'Moderator / Safety',
          procurement: 'Procurement Buy Desk'
        };

        const toastMsg = `Switched to Role ${idx + 1}: ${roleNames[targetUser.role] || targetUser.role} (${targetUser.name})`;
        setRoleToast(toastMsg);
        setTimeout(() => setRoleToast(null), 3500);
      }
    };

    // Check URL route or hash on load
    const checkUrlRoute = () => {
      const path = window.location.pathname.replace('/', '').trim();
      const hash = window.location.hash.replace('#', '').trim();
      
      const val = parseInt(path || hash, 10);
      if (!isNaN(val) && val >= 1 && val <= INITIAL_USERS.length) {
        handleRoleSelectIndex(val - 1);
      }
    };

    checkUrlRoute();
    window.addEventListener('popstate', checkUrlRoute);
    window.addEventListener('hashchange', checkUrlRoute);

    // Key hits 1, 2, 3, 4, 5, 6
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable) {
          return;
        }
      }

      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        handleRoleSelectIndex(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkUrlRoute);
      window.removeEventListener('hashchange', checkUrlRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('feed');
  };

  const handleSelectRoleUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleUpgradeTier = () => {
    const updatedUser: User = {
      ...currentUser,
      role: 'seller_premium',
      subscriptionStatus: 'premium'
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // Add confirmation notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: updatedUser.id,
      type: 'order',
      title: '🌟 Upgraded to Seller Premium Tier!',
      body: 'You now enjoy Priority "Sell to Us" queue, Custom Storefront URL, and 0% Escrow Fee perks.',
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  const handleCommentPost = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));
  };

  const handleSubmitDirectOffer = (offerData: {
    title: string;
    category: MarketplaceCategory;
    condition: ProductCondition;
    expectedPrice: number;
    description: string;
    images: string[];
    location: string;
  }) => {
    const newOffer: DirectOffer = {
      id: `offer_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isPremiumSeller: currentUser.role === 'seller_premium',
      title: offerData.title,
      category: offerData.category,
      condition: offerData.condition,
      expectedPrice: offerData.expectedPrice,
      description: offerData.description,
      images: offerData.images.length > 0 ? offerData.images : ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'],
      location: offerData.location,
      status: 'submitted',
      history: [
        {
          status: 'submitted',
          timestamp: 'Just now',
          note: 'Direct offer submitted to Buy Desk queue.'
        }
      ],
      createdAt: 'Just now',
      expiresAt: 'In 7 days'
    };

    setOffers(prev => [newOffer, ...prev]);
    setShowSellToUsModal(false);
    setActiveTab('sell_to_us');
  };

  const handleCreateListing = (listingData: Partial<Listing>) => {
    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      category: listingData.category || 'new_products',
      condition: listingData.condition || 'new',
      price: listingData.price || 99,
      originalPrice: listingData.originalPrice,
      images: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      location: listingData.location || currentUser.location || 'New York, USA',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      isFeatured: false,
      likesCount: 0,
      viewsCount: 1,
      status: 'active',
      tags: listingData.tags || ['#business', '#product'],
      createdAt: 'Just now',
      stockQty: listingData.stockQty || 10
    };

    setListings(prev => [newListing, ...prev]);
    setShowCreateListingModal(false);
  };

  const handleCreatePost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      content: postData.content || '',
      mediaUrls: postData.mediaUrls || [],
      postType: postData.postType || 'update',
      listingId: postData.listingId,
      listingTitle: postData.listingTitle,
      listingPrice: postData.listingPrice,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: postData.hashtags || ['#BizSocial'],
      createdAt: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);
    setShowCreatePostModal(false);
  };

  const handleCreateStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      mediaUrl,
      caption,
      expiresAt: '24 hours',
      createdAt: 'Just now',
      viewCount: 1
    };

    setStories(prev => [newStory, ...prev]);
    setShowCreateStoryModal(false);
  };

  const handleOpenChat = (sellerId: string) => {
    setActiveChatSellerId(sellerId);
    setShowMessagesModal(true);
  };

  const handleBuyNowOrder = (listing: Listing, shippingAddress: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      price: listing.price,
      totalAmount: listing.price + 15,
      status: 'escrow_held',
      escrowStatus: 'held',
      trackingNumber: `TRK${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingAddress: shippingAddress || '123 Business Way, Suite 400, NY',
      createdAt: 'Just now'
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedListing(null);
    setActiveTab('orders');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], newEscrowStatus?: Order['escrowStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          escrowStatus: newEscrowStatus || o.escrowStatus
        };
      }
      return o;
    }));
  };

  const handleUpdateOfferStatus = (offerId: string, newStatus: DirectOfferStatus, counterPrice?: number, note?: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: newStatus,
          counterPrice: counterPrice !== undefined ? counterPrice : o.counterPrice,
          adminNotes: note || o.adminNotes,
          history: [
            ...o.history,
            {
              status: newStatus,
              timestamp: 'Just now',
              note: note || `Status updated to ${newStatus}`
            }
          ]
        };
      }
      return o;
    }));
  };

  const handleAcceptCounterOffer = (offerId: string) => {
    handleUpdateOfferStatus(offerId, 'accepted', undefined, 'Seller accepted Buy Desk counter offer! Payout initiated to escrow.');
  };

  const handleAutoListPublic = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    handleCreateListing({
      title: offer.title,
      description: offer.description,
      category: offer.category,
      condition: offer.condition,
      price: offer.counterPrice || offer.expectedPrice,
      images: offer.images,
      location: offer.location,
      tags: ['#auto_listed', '#sell_to_us_converted']
    });

    handleUpdateOfferStatus(offerId, 'auto_listed_public', undefined, 'Offer converted to public marketplace listing with 0% fee.');
  };

  const handleSendMessageInState = (convId: string, text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      isRead: true,
      createdAt: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, lastMessage: text, lastMessageTime: 'Just now' } : c));
  };

  // IF NOT LOGGED IN: Render Stunning Business Social Media Login Page!
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      
      {/* Quick Interactive Role Switcher Bar */}
      <RoleSwitcher
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectRoleUser}
      />

      {/* Main Header Component */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        escrowOrdersCount={escrowOrdersCount}
        onOpenCreateModal={() => setShowCreateListingModal(true)}
        onOpenSellToUs={() => setShowSellToUsModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(prev => !prev)}
        isNotificationsOpen={showNotificationsModal}
        onOpenMessages={() => setShowMessagesModal(prev => !prev)}
        isMessagesOpen={showMessagesModal}
        onUpgradeTier={handleUpgradeTier}
        onLogout={handleLogout}
        onOpenSwitchAccount={() => setShowSwitchAccountModal(true)}
        notifications={notifications}
        onMarkAllNotificationsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
        conversations={conversations}
        messages={messages}
        onSendMessage={handleSendMessageInState}
        onOpenLeftDrawer={() => setShowLeftDrawer(true)}
        onOpenRightDrawer={() => setShowRightDrawer(true)}
      />

      {/* Role Switch Keyboard Shortcut Toast Notification */}
      {roleToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{roleToast}</span>
        </div>
      )}

      {/* ── Left Sidebar Drawer (slides in from left on < 1300px) ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setShowLeftDrawer(false)}
        className={`min-[1300px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showLeftDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Drawer Panel */}
      <div
        className={`min-[1300px]:hidden fixed top-0 left-0 h-full w-[340px] sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showLeftDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-md">
              B
            </div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">BizSocial</span>
          </div>
          <button
            onClick={() => setShowLeftDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Drawer Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <LeftBusinessSidebar
            currentUser={currentUser}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { setSelectedSellerId(id); setShowLeftDrawer(false); }}
            onOpenSettings={() => { setActiveTab('settings'); setShowLeftDrawer(false); }}
            onOpenCreateModal={() => { setShowCreateListingModal(true); setShowLeftDrawer(false); }}
            onOpenSellToUs={() => { setShowSellToUsModal(true); setShowLeftDrawer(false); }}
            onOpenCreateQuote={() => { setShowCreateQuoteModal(true); setShowLeftDrawer(false); }}
            onUpgradeTier={handleUpgradeTier}
          />
        </div>
      </div>

      {/* ── Right Sidebar Drawer (slides in from right on <= 880px) ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setShowRightDrawer(false)}
        className={`min-[881px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showRightDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Right Drawer Panel */}
      <div
        className={`min-[881px]:hidden fixed top-0 right-0 h-full w-[360px] sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showRightDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <span className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Market Insights & Activity
          </span>
          <button
            onClick={() => setShowRightDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close activity sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Drawer Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <RightBusinessSidebar
            users={users}
            offers={offers}
            listings={listings}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { setSelectedSellerId(id); setShowRightDrawer(false); }}
            onOpenListingDetail={(listing) => { setSelectedListing(listing); setShowRightDrawer(false); }}
            onOpenSellToUs={() => { setShowSellToUsModal(true); setShowRightDrawer(false); }}
            onOpenChat={(id) => { handleOpenChat(id); setShowRightDrawer(false); }}
          />
        </div>
      </div>

      {/* Hamburger toggle — now in Header, removed from here */}

      {/* Page Content Layout */}
        <div className="flex-1 overflow-hidden max-w-[1800px] w-full mx-auto px-2.5 sm:px-6 lg:px-8 pt-2 pb-2 h-full">
          <div className="flex flex-col min-[881px]:flex-row min-[1300px]:grid min-[1300px]:grid-cols-10 gap-4 sm:gap-5 h-full">
            
            {/* LEFT SIDEBAR (Span 3 on >= 1300px, hidden below) */}
            <div className="min-[1300px]:col-span-3 hidden min-[1300px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
              <LeftBusinessSidebar
                currentUser={currentUser}
                onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                onOpenSettings={() => setActiveTab('settings')}
                onOpenCreateModal={() => setShowCreateListingModal(true)}
                onOpenSellToUs={() => setShowSellToUsModal(true)}
                onOpenCreateQuote={() => setShowCreateQuoteModal(true)}
                onUpgradeTier={handleUpgradeTier}
              />
            </div>

            {/* CENTER CONTENT AREA (Fills all remaining space smoothly with min-w-0) */}
            <main className="flex-1 min-w-0 min-[1300px]:col-span-4 min-h-0 h-full sidebar-scroll pb-16 overflow-y-auto">
              
              {activeTab === 'settings' && (
                <SettingsPrivacyView 
                  currentUser={currentUser} 
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                  }}
                />
              )}

              {activeTab === 'help' && (
                <HelpSupportView />
              )}

              {activeTab === 'feed' && (
                <FeedView
                  currentUser={currentUser}
                  posts={posts}
                  stories={stories}
                  listings={listings}
                  onLikePost={handleLikePost}
                  onCommentPost={handleCommentPost}
                  onSelectListing={(l) => setSelectedListing(l)}
                  onOpenCreatePost={() => setShowCreatePostModal(true)}
                  onOpenCreateStory={() => setShowCreateStoryModal(true)}
                  onViewStory={(s) => setSelectedStory(s)}
                  onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceView
                  currentUser={currentUser}
                  listings={listings}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSelectListing={(l) => setSelectedListing(l)}
                  onOpenSellToUs={() => setShowSellToUsModal(true)}
                />
              )}

              {activeTab === 'sell_to_us' && (
                <SellToUsTracker
                  currentUser={currentUser}
                  offers={offers}
                  onOpenNewOfferModal={() => setShowSellToUsModal(true)}
                  onAcceptCounter={handleAcceptCounterOffer}
                  onAutoListPublic={handleAutoListPublic}
                />
              )}

              {activeTab === 'seller' && (
                <SellerDashboard
                  currentUser={currentUser}
                  listings={listings}
                  orders={orders}
                  analytics={INITIAL_ANALYTICS}
                  onOpenCreateListing={() => setShowCreateListingModal(true)}
                  onUpgradeTier={handleUpgradeTier}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersView
                  currentUser={currentUser}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onOpenChat={handleOpenChat}
                />
              )}

              {activeTab === 'procurement' && (
                <ProcurementDashboard
                  currentUser={currentUser}
                  offers={offers}
                  onUpdateOfferStatus={handleUpdateOfferStatus}
                />
              )}

              {activeTab === 'admin' && (
                <AdminDashboard
                  currentUser={currentUser}
                  disputes={disputes}
                  users={users}
                  listings={listings}
                  orders={orders}
                />
              )}

            </main>

            {/* RIGHT SIDEBAR (Fixed extra wide stable width 400px/430px, never squished, hidden on <= 880px) */}
            <div className="w-full min-[881px]:w-[400px] min-[1100px]:w-[430px] min-[1300px]:w-auto min-[1300px]:col-span-3 shrink-0 hidden min-[881px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
              <RightBusinessSidebar
                users={users}
                offers={offers}
                listings={listings}
                onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                onOpenListingDetail={(listing) => setSelectedListing(listing)}
                onOpenSellToUs={() => setShowSellToUsModal(true)}
                onOpenChat={handleOpenChat}
              />
            </div>


          </div>
        </div>

      {/* MODALS & OVERLAYS */}
      {showCreateQuoteModal && (
        <CreateQuoteModal
          currentUser={currentUser}
          users={users}
          onClose={() => setShowCreateQuoteModal(false)}
          onSubmitQuote={(title, amount, clientName) => {
            const newNotification: AppNotification = {
              id: `notif-${Date.now()}`,
              userId: currentUser.id,
              type: 'offer_update',
              title: `B2B Quote Dispatched to ${clientName}`,
              body: `Formal contract quote for "${title}" ($${amount.toLocaleString()}) created under Escrow Vault protection.`,
              isRead: false,
              createdAt: 'Just now'
            };
            setNotifications(prev => [newNotification, ...prev]);
          }}
        />
      )}

      {/* 1. Listing Detail & Checkout Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          currentUser={currentUser}
          reviews={reviews}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleOpenChat}
          onBuyNow={handleBuyNowOrder}
        />
      )}

      {/* 2. Direct Offer "Sell to Us" Modal */}
      {showSellToUsModal && (
        <SellToUsModal
          currentUser={currentUser}
          onClose={() => setShowSellToUsModal(false)}
          onSubmitOffer={handleSubmitDirectOffer}
        />
      )}

      {/* 3. Create Listing Modal */}
      {showCreateListingModal && (
        <CreateListingModal
          currentUser={currentUser}
          onClose={() => setShowCreateListingModal(false)}
          onSubmitListing={handleCreateListing}
        />
      )}

      {/* 4. Create Social Feed Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          currentUser={currentUser}
          listings={listings}
          onClose={() => setShowCreatePostModal(false)}
          onSubmitPost={handleCreatePost}
        />
      )}

      {/* 5. Create 24hr Story Modal */}
      {showCreateStoryModal && (
        <CreateStoryModal
          currentUser={currentUser}
          onClose={() => setShowCreateStoryModal(false)}
          onSubmitStory={handleCreateStory}
        />
      )}

      {/* 6. Story Viewer Modal */}
      {selectedStory && (
        <StoryViewModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* 7. Seller Profile Modal */}
      {selectedSellerId && (
        <SellerProfileModal
          sellerId={selectedSellerId}
          users={users}
          listings={listings}
          posts={posts}
          reviews={reviews}
          onClose={() => setSelectedSellerId(null)}
          onOpenChat={handleOpenChat}
          onSelectListing={(l) => {
            setSelectedSellerId(null);
            setSelectedListing(l);
          }}
        />
      )}



      {/* 9. Switch Account Modal */}
      {showSwitchAccountModal && (
        <SwitchAccountModal
          currentUser={currentUser}
          onSelectUser={(u) => handleSelectRoleUser(u)}
          onClose={() => setShowSwitchAccountModal(false)}
        />
      )}

      {/* Floating Chat FAB for Mobile */}
      <div className="fixed bottom-24 right-4 z-40 sm:hidden">
        <button
          onClick={() => setShowMessagesModal(prev => !prev)}
          className="relative bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-3 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ring-4 ring-white"
          title="Open Messages"
        >
          <span className="absolute -inset-0.5 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
          <MessageSquare className="w-5 h-5 text-white" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center border border-white shadow-xs animate-bounce">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Android Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        escrowOrdersCount={escrowOrdersCount}
        onOpenProfile={() => setSelectedSellerId(currentUser.id)}
      />

    </div>
  );
}
