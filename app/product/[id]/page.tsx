'use client';

import React, { use, useEffect } from 'react';
import { AppShell } from '../../../src/components/AppShell';
import { MarketplaceView } from '../../../src/components/MarketplaceView';
import { useApp } from '../../../src/context/AppContext';
import { decodeProductSlug } from '../../../src/utils/routeCrypto';

export default function ProductRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const targetProductId = resolvedParams?.id ? decodeProductSlug(resolvedParams.id) : null;

  const {
    currentUser,
    listings,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    handleOpenListingDetail,
    handleTabChange,
    handleOpenSellerProfile,
    setSelectedListing
  } = useApp();

  useEffect(() => {
    if (targetProductId && listings.length > 0) {
      const found = listings.find(l =>
        String(l.id) === targetProductId ||
        String(l.id).replace(/\D/g, '') === targetProductId
      );
      if (found) {
        setSelectedListing(found);
      }
    }
  }, [targetProductId, listings, setSelectedListing]);

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
