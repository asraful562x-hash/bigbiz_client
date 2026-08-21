'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { SettingsPrivacyView } from '../../src/components/SettingsPrivacyView';
import { useApp } from '../../src/context/AppContext';

export default function SettingsPage() {
  const {
    currentUser,
    setCurrentUser,
    users,
    setUsers
  } = useApp();

  return (
    <AppShell activeTabOverride="settings" isFullScreen={true}>
      <SettingsPrivacyView
        currentUser={currentUser}
        allUsers={users}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        }}
      />
    </AppShell>
  );
}
