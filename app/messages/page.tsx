'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { DirectMessagesView } from '../../src/components/DirectMessagesView';
import { useApp } from '../../src/context/AppContext';

export default function MessagesPage() {
  const {
    currentUser,
    conversations,
    messages,
    activeChatSellerId,
    handleSendMessageInState,
    handleOpenSellerProfile
  } = useApp();

  return (
    <AppShell activeTabOverride="messages">
      <DirectMessagesView
        currentUser={currentUser}
        conversations={conversations}
        messages={messages}
        initialSellerId={activeChatSellerId}
        onSendMessage={handleSendMessageInState}
        onOpenSellerProfile={handleOpenSellerProfile}
      />
    </AppShell>
  );
}
