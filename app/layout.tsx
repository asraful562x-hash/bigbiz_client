import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '../src/store/StoreProvider';
import { AppProvider } from '../src/context/AppContext';

export const metadata: Metadata = {
  title: 'BizSocial - Business Social Media & Commerce Ecosystem',
  description: 'The all-in-one business social platform for product selling, software SaaS licensing, services marketplace & B2B procurement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-100/70 text-slate-900 font-sans min-h-screen" suppressHydrationWarning>
        <StoreProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
