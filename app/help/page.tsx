'use client';

import React from 'react';
import { AppShell } from '../../src/components/AppShell';
import { HelpSupportView } from '../../src/components/HelpSupportView';

export default function HelpPage() {
  return (
    <AppShell activeTabOverride="help" isFullScreen={true}>
      <HelpSupportView />
    </AppShell>
  );
}
