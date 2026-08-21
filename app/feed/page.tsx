'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { FeedView } from '../../src/components/FeedView';
import { useApp } from '../../src/context/AppContext';

export default function FeedPage() {
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
    isDataLoading
  } = useApp();

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
        isLoading={isDataLoading}
      />
    </AppShell>
  );
}
