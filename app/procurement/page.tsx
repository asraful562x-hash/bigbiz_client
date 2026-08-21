'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { ProcurementDashboard } from '../../src/components/ProcurementDashboard';
import { useApp } from '../../src/context/AppContext';

export default function ProcurementPage() {
  const {
    currentUser,
    offers,
    handleUpdateOfferStatus
  } = useApp();

  return (
    <AppShell activeTabOverride="procurement">
      <ProcurementDashboard
        currentUser={currentUser}
        offers={offers}
        onUpdateOfferStatus={handleUpdateOfferStatus}
      />
    </AppShell>
  );
}
