'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { LeftBusinessSidebar } from './LeftBusinessSidebar';
import { RightBusinessSidebar } from './RightBusinessSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { LoginPage } from './LoginPage';
import { SplashScreen } from './SplashScreen';
import { OnboardingModal } from './OnboardingModal';
import { ListingDetailModal } from './ListingDetailModal';
import { SellerProfileModal } from './SellerProfileModal';
import { CreateListingModal } from './CreateListingModal';
import { CreatePostModal } from './CreatePostModal';
import { CreateStoryModal } from './CreateStoryModal';
import { CreateQuoteModal } from './CreateQuoteModal';
import { SellToUsModal } from './SellToUsModal';
import { StoryViewModal } from './StoryViewModal';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { UserRole, Order, Message, AppNotification } from '../types';

interface AppShellProps {
  children: React.ReactNode;
  activeTabOverride?: string;
  isFullScreen?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTabOverride,
  isFullScreen: isFullScreenProp,
}) => {
  const {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    isAuthChecking,
    showOnboarding,
    setShowOnboarding,
    isDataLoading,
    users,
    setUsers,
    listings,
    posts,
    stories,
    offers,
    orders,
    setOrders,
    conversations,
    messages,
    setMessages,
    notifications,
    setNotifications,
    reviews,
    activeTab: contextActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showSellToUsModal,
    setShowSellToUsModal,
    showCreateListingModal,
    setShowCreateListingModal,
    showCreatePostModal,
    setShowCreatePostModal,
    showCreateStoryModal,
    setShowCreateStoryModal,
    showCreateQuoteModal,
    setShowCreateQuoteModal,
    showMessagesModal,
    setShowMessagesModal,
    showNotificationsModal,
    showLeftDrawer,
    setShowLeftDrawer,
    showRightDrawer,
    setShowRightDrawer,
    selectedListing,
    selectedStory,
    setSelectedStory,
    selectedSellerId,
    activeChatSellerId,
    unreadNotificationsCount,
    unreadMessagesCount,
    escrowOrdersCount,
    incomingNetworkRequests,
    handleAcceptNetworkRequest,
    handleRejectNetworkRequest,
    handleTabChange,
    handleOpenSellerProfile,
    handleCloseSellerProfile,
    handleOpenListingDetail,
    handleCloseListingDetail,
    handleOpenChat,
    handleToggleMessages,
    handleToggleNotifications,
    handleMarkConversationRead,
    handleMarkAllNotificationsRead,
    handleSendMessageInState,
    handleLogin,
    handleLogout,
    handleUpgradeTier,
    handleLikePost,
    handleCommentPost,
    handleDeletePost,
    handleCreatePost,
    handleCreateStory,
    handleCreateListing,
    handleBuyNowOrder,
    handleSubmitDirectOffer,
  } = useApp();

  const activeTab = activeTabOverride || contextActiveTab;

  // 1. WHILE INITIALIZING/CHECKING AUTH: Render Splash Page (no flash of login screen)
  if (isAuthChecking) {
    return <SplashScreen />;
  }

  // 2. IF NOT LOGGED IN: Render Stunning Business Social Media Login Page!
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const isFullScreenTab = isFullScreenProp ?? (activeTab === 'settings' || activeTab === 'help' || (isAdmin && activeTab === 'admin'));

  return (
    <div className="h-screen overflow-hidden bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      {/* Main Header Component */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        escrowOrdersCount={escrowOrdersCount}
        onOpenCreateModal={() => setShowCreateListingModal(true)}
        onOpenSellToUs={() => handleTabChange('sell_to_us')}
        onOpenNotifications={handleToggleNotifications}
        isNotificationsOpen={showNotificationsModal}
        onOpenMessages={handleToggleMessages}
        isMessagesOpen={showMessagesModal}
        onUpgradeTier={handleUpgradeTier}
        onLogout={handleLogout}
        onOpenProfile={handleOpenSellerProfile}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        conversations={conversations}
        messages={messages}
        onSendMessage={handleSendMessageInState}
        activeConversationId={activeChatSellerId || null}
        onOpenLeftDrawer={() => setShowLeftDrawer(true)}
        onOpenRightDrawer={() => setShowRightDrawer(true)}
        isFullScreen={isFullScreenTab}
        incomingNetworkRequests={incomingNetworkRequests}
        onAcceptNetworkRequest={handleAcceptNetworkRequest}
        onRejectNetworkRequest={handleRejectNetworkRequest}
        onMarkConversationRead={handleMarkConversationRead}
      />

      {/* ── Left Sidebar Drawer (slides in from left on < 1300px) ───────── */}
      <div
        onClick={() => setShowLeftDrawer(false)}
        className={`min-[1300px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showLeftDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`min-[1300px]:hidden fixed top-0 left-0 h-full w-[340px] sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showLeftDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
        <div className="flex-1 overflow-y-auto">
          <LeftBusinessSidebar
            currentUser={currentUser}
            activeTab={activeTab}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { handleOpenSellerProfile(id); setShowLeftDrawer(false); }}
            onOpenSettings={() => { handleTabChange('settings'); setShowLeftDrawer(false); }}
            onOpenCreateModal={() => { setShowCreateListingModal(true); setShowLeftDrawer(false); }}
            onOpenSellToUs={() => { handleTabChange('sell_to_us'); setShowLeftDrawer(false); }}
            onOpenCreateQuote={() => { setShowCreateQuoteModal(true); setShowLeftDrawer(false); }}
            onUpgradeTier={handleUpgradeTier}
          />
        </div>
      </div>

      {/* ── Right Sidebar Drawer (slides in from right on <= 880px) ───────── */}
      <div
        onClick={() => setShowRightDrawer(false)}
        className={`min-[881px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showRightDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`min-[881px]:hidden fixed top-0 right-0 h-full w-[360px] sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showRightDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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
        <div className="flex-1 overflow-y-auto p-4">
          <RightBusinessSidebar
            users={users}
            offers={offers}
            listings={listings}
            activeTab={activeTab}
            currentUser={currentUser}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { handleOpenSellerProfile(id); setShowRightDrawer(false); }}
            onOpenListingDetail={(listing) => { handleOpenListingDetail(listing); setShowRightDrawer(false); }}
            onOpenSellToUs={() => { handleTabChange('sell_to_us'); setShowRightDrawer(false); }}
            onOpenChat={(id) => { handleOpenChat(id); setShowRightDrawer(false); }}
            isLoading={isDataLoading}
          />
        </div>
      </div>

      {/* Page Content Layout */}
      <div className={`flex-1 overflow-hidden w-full mx-auto pt-2 pb-2 h-full ${
        isAdmin && activeTab === 'admin'
          ? 'max-w-full px-0'
          : 'max-w-[1800px] px-2.5 sm:px-6 lg:px-8'
      }`}>
        <div className={`${isFullScreenTab ? 'flex flex-col h-full' : 'flex flex-col min-[881px]:flex-row min-[1300px]:grid min-[1300px]:grid-cols-10 gap-4 sm:gap-5 h-full'}`}>
          {/* LEFT SIDEBAR — hidden on Settings/Help full-screen pages */}
          {!isFullScreenTab && (
            <div className="min-[1300px]:col-span-3 hidden min-[1300px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
              <LeftBusinessSidebar
                currentUser={currentUser}
                activeTab={activeTab}
                onOpenSellerProfile={handleOpenSellerProfile}
                onOpenSettings={() => handleTabChange('settings')}
                onOpenCreateModal={() => setShowCreateListingModal(true)}
                onOpenSellToUs={() => handleTabChange('sell_to_us')}
                onOpenCreateQuote={() => setShowCreateQuoteModal(true)}
                onUpgradeTier={handleUpgradeTier}
              />
            </div>
          )}

          {/* CENTER CONTENT AREA */}
          <main className={`flex-1 min-w-0 min-h-0 h-full sidebar-scroll overflow-y-auto ${
            isFullScreenTab
              ? 'pb-28 sm:pb-8 w-full'
              : 'min-[1300px]:col-span-4 pb-28 sm:pb-16'
          }`}>
            <div key={activeTab} className={`animate-tab-switch h-full ${
              isFullScreenTab
                ? (activeTab === 'admin'
                    ? 'max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8'
                    : 'max-w-5xl mx-auto px-0 sm:px-4')
                : ''
            }`}>
              {children}
            </div>
          </main>

          {/* RIGHT SIDEBAR — hidden on Settings/Help full-screen pages */}
          {!isFullScreenTab && (
            <div className="w-full min-[881px]:w-[400px] min-[1100px]:w-[430px] min-[1300px]:w-auto min-[1300px]:col-span-3 shrink-0 hidden min-[881px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
              <RightBusinessSidebar
                users={users}
                offers={offers}
                listings={listings}
                activeTab={activeTab}
                currentUser={currentUser}
                onOpenSellerProfile={handleOpenSellerProfile}
                onOpenListingDetail={handleOpenListingDetail}
                onOpenSellToUs={() => handleTabChange('sell_to_us')}
                onOpenChat={handleOpenChat}
                isLoading={isDataLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* MODALS & OVERLAYS */}
      {showCreateQuoteModal && (
        <CreateQuoteModal
          currentUser={currentUser}
          users={users}
          onClose={() => setShowCreateQuoteModal(false)}
          onSubmitQuote={(title, amount, clientName, description, targetUserId) => {
            const contractId = `b2b_contract_${Date.now()}`;
            const targetUser = users.find(u => u.id === targetUserId || u.name === clientName) || {
              id: `client_${Date.now()}`,
              name: clientName,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'buyer' as UserRole
            };

            const newContractOrder: Order = {
              id: contractId,
              buyerId: targetUser.id,
              buyerName: clientName,
              sellerId: currentUser.id,
              sellerName: currentUser.name,
              listingId: contractId,
              listingTitle: `[B2B Contract] ${title}`,
              listingImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
              price: amount,
              totalAmount: amount,
              status: 'escrow_held',
              escrowStatus: 'held',
              shippingAddress: description ? `Scope: ${description}` : 'B2B Custom Milestones Escrow Deliverable',
              trackingNumber: `ESCROW-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
              createdAt: 'Just now'
            };
            setOrders(prev => [newContractOrder, ...prev]);

            const quoteMessage: Message = {
              id: `msg_quote_${Date.now()}`,
              conversationId: `conv_${currentUser.id}_${targetUser.id}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: `📋 Formal B2B Escrow Quote Sent: "${title}" for $${amount.toLocaleString()} USD.\n${description ? `\nScope: ${description}` : ''}\n\nFunds will be secured in BizSocial Escrow Vault upon milestone delivery.`,
              isRead: false,
              createdAt: 'Just now'
            };
            setMessages(prev => [...prev, quoteMessage]);

            const newNotification: AppNotification = {
              id: `notif-${Date.now()}`,
              userId: currentUser.id,
              type: 'offer_update',
              title: `B2B Escrow Quote Created for ${clientName}`,
              body: `Contract "${title}" ($${amount.toLocaleString()}) is now active in your Escrow Orders Tracker.`,
              isRead: false,
              createdAt: 'Just now'
            };
            setNotifications(prev => [newNotification, ...prev]);

            handleTabChange('orders');
          }}
        />
      )}

      {/* 1. Listing Detail & Checkout Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          currentUser={currentUser}
          reviews={reviews}
          onClose={handleCloseListingDetail}
          onOpenChat={handleOpenChat}
          onBuyNow={handleBuyNowOrder}
          onOpenSellerProfile={handleOpenSellerProfile}
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
          onAddCategory={(newCat) => {
            setCurrentUser(prev => {
              const updatedCats = Array.from(new Set([...(prev.customCategories || []), newCat]));
              const updatedUser = { ...prev, customCategories: updatedCats };
              try {
                localStorage.setItem('auth_user', JSON.stringify(updatedUser));
              } catch {}
              return updatedUser;
            });
            setUsers(prev => prev.map(u => {
              if (u.id === currentUser.id) {
                return { ...u, customCategories: Array.from(new Set([...(u.customCategories || []), newCat])) };
              }
              return u;
            }));
          }}
          onNavigateToPaymentSettings={() => {
            handleTabChange('settings');
          }}
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
          currentUser={currentUser}
          users={users}
          listings={listings}
          posts={posts}
          reviews={reviews}
          onClose={handleCloseSellerProfile}
          onOpenChat={handleOpenChat}
          onSelectListing={handleOpenListingDetail}
          onDeletePost={handleDeletePost}
          onOpenCreatePost={() => setShowCreatePostModal(true)}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
        />
      )}

      {/* 10. Automatic Onboarding Modal (OAuth & Incomplete Profiles) */}
      {showOnboarding && (
        <OnboardingModal
          initialUser={currentUser}
          onComplete={(updatedUser) => {
            localStorage.setItem(`onboarded_${updatedUser.email}`, 'true');
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setShowOnboarding(false);
          }}
        />
      )}

      {/* ── Mobile Floating AI Chat FAB ── */}
      <div className="fixed bottom-28 right-4 z-40 sm:hidden">
        <button
          onClick={handleToggleMessages}
          className="relative w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-700/50 hover:shadow-indigo-600/60 active:scale-95 transition-all duration-200 border-2 border-white/30 backdrop-blur-md"
          aria-label="Open Direct Chat & AI Support"
          title="Direct Chat & AI Support"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse filter drop-shadow-xs" />
          </div>

          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Android Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        escrowOrdersCount={escrowOrdersCount}
        unreadMessagesCount={unreadMessagesCount}
        onOpenProfile={() => handleOpenSellerProfile(currentUser.id)}
      />
    </div>
  );
};
