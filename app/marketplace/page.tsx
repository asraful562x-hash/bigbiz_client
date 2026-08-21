'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { MarketplaceView } from '../../src/components/MarketplaceView';
import { useApp } from '../../src/context/AppContext';

export default function MarketplacePage() {
  const {
    currentUser,
    listings,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleOpenListingDetail,
    handleTabChange,
    handleOpenSellerProfile
  } = useApp();

  return (
    <AppShell activeTabOverride="marketplace">
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
    </AppShell>
  );
}
