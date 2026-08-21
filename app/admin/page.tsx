'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { AdminDashboard } from '../../src/components/AdminDashboard';
import { useApp } from '../../src/context/AppContext';

export default function AdminPage() {
  const {
    currentUser,
    disputes,
    users,
    listings,
    orders,
    posts,
    handleUpdateDisputeStatus,
    handleToggleUserVerification,
    handleUpdateUserRole,
    handleDeleteListing,
    handleDeletePost,
    handleToggleUserBan
  } = useApp();

  return (
    <AppShell activeTabOverride="admin" isFullScreen={true}>
      <AdminDashboard
        currentUser={currentUser}
        disputes={disputes}
        users={users}
        listings={listings}
        orders={orders}
        posts={posts}
        onUpdateDisputeStatus={handleUpdateDisputeStatus}
        onToggleUserVerification={handleToggleUserVerification}
        onUpdateUserRole={handleUpdateUserRole}
        onDeleteListing={handleDeleteListing}
        onDeletePost={handleDeletePost}
        onToggleUserBan={handleToggleUserBan}
      />
    </AppShell>
  );
}
