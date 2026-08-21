'use client';

import React, { use, useEffect } from 'react';
import { AppShell } from '../../../src/components/AppShell';
import { FeedView } from '../../../src/components/FeedView';
import { useApp } from '../../../src/context/AppContext';
import { decodeProfileSlug } from '../../../src/utils/routeCrypto';

export default function ProfileRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const targetSellerId = resolvedParams?.id ? decodeProfileSlug(resolvedParams.id) : null;

  const {
    currentUser,
    posts,
    stories,
    listings,
    handleLikePost,
    handleCommentPost,
    handleOpenListingDetail,
    setShowCreatePostModal,
    setShowCreateStoryModal,
    setSelectedStory,
    handleOpenSellerProfile,
    handleDeletePost,
    setSelectedSellerId,
  } = useApp();

  useEffect(() => {
    if (targetSellerId) {
      setSelectedSellerId(targetSellerId);
    }
  }, [targetSellerId, setSelectedSellerId]);

  return (
    <AppShell activeTabOverride="feed">
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
      />
    </AppShell>
  );
}
