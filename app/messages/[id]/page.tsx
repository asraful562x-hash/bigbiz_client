'use client';

import React, { use } from 'react';
import { AppShell } from '../../../src/components/AppShell';
import { DirectMessagesView } from '../../../src/components/DirectMessagesView';
import { useApp } from '../../../src/context/AppContext';
import { decodeChatSlug } from '../../../src/utils/routeCrypto';

export default function DirectMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const targetSellerId = resolvedParams?.id ? decodeChatSlug(resolvedParams.id) : null;

  const {
    currentUser,
    conversations,
    messages,
    handleSendMessageInState,
    handleOpenSellerProfile
  } = useApp();

  return (
    <AppShell activeTabOverride="messages">
      <DirectMessagesView
        currentUser={currentUser}
        conversations={conversations}
        messages={messages}
        initialSellerId={targetSellerId}
        onSendMessage={handleSendMessageInState}
        onOpenSellerProfile={handleOpenSellerProfile}
      />
    </AppShell>
  );
}
