'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { OrdersView } from '../../src/components/OrdersView';
import { useApp } from '../../src/context/AppContext';

export default function OrdersPage() {
  const {
    currentUser,
    orders,
    handleConfirmReceipt,
    handleUpdateOrderStatus,
    handleOpenChat
  } = useApp();

  return (
    <AppShell activeTabOverride="orders">
      <OrdersView
        currentUser={currentUser}
        orders={orders}
        onConfirmReceipt={handleConfirmReceipt}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onOpenChat={handleOpenChat}
      />
    </AppShell>
  );
}
