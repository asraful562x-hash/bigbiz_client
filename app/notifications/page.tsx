'use client';

import React, { useEffect } from 'react';
import { AppShell } from '../../src/components/AppShell';
import { FeedView } from '../../src/components/FeedView';
import { useApp } from '../../src/context/AppContext';

export default function NotificationsPage() {
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
    setShowNotificationsModal
  } = useApp();

  useEffect(() => {
    setShowNotificationsModal(true);
  }, [setShowNotificationsModal]);

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
