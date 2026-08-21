'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { SellerDashboard } from '../../src/components/SellerDashboard';
import { useApp } from '../../src/context/AppContext';
import { INITIAL_ANALYTICS } from '../../src/data/mockData';

export default function DashboardPage() {
  const {
    currentUser,
    listings,
    orders,
    setShowCreateListingModal,
    handleUpgradeTier
  } = useApp();

  return (
    <AppShell activeTabOverride="dashboard">
      <SellerDashboard
        currentUser={currentUser}
        listings={listings}
        orders={orders}
        analytics={INITIAL_ANALYTICS}
        onOpenCreateListing={() => setShowCreateListingModal(true)}
        onUpgradeTier={handleUpgradeTier}
      />
    </AppShell>
  );
}
