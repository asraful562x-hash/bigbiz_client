'use client';

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { FeedView } from './components/FeedView';
import { MarketplaceView } from './components/MarketplaceView';
import { SettingsPrivacyView } from './components/SettingsPrivacyView';
import { OrdersView } from './components/OrdersView';
import { SellerDashboard } from './components/SellerDashboard';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { HelpSupportView } from './components/HelpSupportView';
import { SellToUsTracker } from './components/SellToUsTracker';
import { DirectMessagesView } from './components/DirectMessagesView';
import { INITIAL_ANALYTICS } from './data/mockData';

function AppContent() {
  const {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    listings,
    posts,
    stories,
    offers,
    orders,
    conversations,
    messages,
    disputes,
    activeTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeChatSellerId,
    setShowCreateListingModal,
    setShowCreatePostModal,
    setShowCreateStoryModal,
    setShowSellToUsModal,
    setSelectedStory,
    handleLikePost,
    handleCommentPost,
    handleDeletePost,
    handleOpenListingDetail,
    handleOpenSellerProfile,
    handleOpenChat,
    handleSendMessageInState,
    handleConfirmReceipt,
    handleUpdateOrderStatus,
    handleAcceptCounterOffer,
    handleAutoListPublic,
    handleUpdateOfferStatus,
    handleUpdateDisputeStatus,
    handleToggleUserVerification,
    handleUpdateUserRole,
    handleDeleteListing,
    handleToggleUserBan,
    handleUpgradeTier,
    handleTabChange,
    isDataLoading,
  } = useApp();

  return (
    <AppShell>
      {activeTab === 'settings' && (
        <SettingsPrivacyView 
          currentUser={currentUser} 
          allUsers={users}
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
          onSelectListing={handleOpenListingDetail}
          onOpenCreatePost={() => setShowCreatePostModal(true)}
          onOpenCreateStory={() => setShowCreateStoryModal(true)}
          onViewStory={(s) => setSelectedStory(s)}
          onOpenSellerProfile={handleOpenSellerProfile}
          onDeletePost={handleDeletePost}
          isLoading={isDataLoading}
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
          onSelectListing={handleOpenListingDetail}
          onOpenSellToUs={() => handleTabChange('sell_to_us')}
          onOpenSellerProfile={handleOpenSellerProfile}
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

      {(activeTab === 'seller' || activeTab === 'dashboard') && (
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
          onConfirmReceipt={handleConfirmReceipt}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onOpenChat={handleOpenChat}
        />
      )}

      {activeTab === 'messages' && (
        <DirectMessagesView
          currentUser={currentUser}
          conversations={conversations}
          messages={messages}
          initialSellerId={activeChatSellerId}
          onSendMessage={handleSendMessageInState}
          onOpenSellerProfile={handleOpenSellerProfile}
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
          posts={posts}
          onUpdateDisputeStatus={handleUpdateDisputeStatus}
          onToggleUserVerification={handleToggleUserVerification}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteListing={handleDeleteListing}
          onDeletePost={handleDeletePost}
          onToggleUserBan={handleToggleUserBan}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
