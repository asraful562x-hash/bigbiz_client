'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { SellToUsTracker } from '../../src/components/SellToUsTracker';
import { useApp } from '../../src/context/AppContext';

export default function SellToUsPage() {
  const {
    currentUser,
    offers,
    setShowSellToUsModal,
    handleAcceptCounterOffer,
    handleAutoListPublic
  } = useApp();

  return (
    <AppShell activeTabOverride="sell_to_us">
      <SellToUsTracker
        currentUser={currentUser}
        offers={offers}
        onOpenNewOfferModal={() => setShowSellToUsModal(true)}
        onAcceptCounter={handleAcceptCounterOffer}
        onAutoListPublic={handleAutoListPublic}
      />
    </AppShell>
  );
}
