// hooks/useTopMerchants.ts
//
// Fetches the "Verified Merchants" list for RightBusinessSidebar. Calls
// GET /api/users once, filters down to seller accounts, excludes the
// current user, and caps at 3 — matching the contract RightBusinessSidebar
// already documents in its comment above `featuredMerchants`.
//
// Adjust the import path below to wherever users-api.ts actually lives.
import { useEffect, useState } from 'react';
import { fetchAllUsers, UsersApiError } from '@/lib/api/users-api';
import type { User } from '../types';

const SELLER_ROLES = new Set(['seller_free', 'seller_premium']);

interface UseTopMerchantsResult {
  merchants: User[];
  isLoading: boolean;
  error: string | null;
}

export function useTopMerchants(currentUserId: string, limit = 3): UseTopMerchantsResult {
  const [merchants, setMerchants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const all = await fetchAllUsers();
        if (cancelled) return;

        const sellers = all.filter(
          (u) => u.id !== currentUserId && SELLER_ROLES.has(u.role ?? '')
        );

        // Prefer sellers; if there aren't 3 yet, pad with any other user
        // (excluding self) so the section isn't empty while the platform
        // is still small.
        const padded =
          sellers.length >= limit
            ? sellers
            : [
                ...sellers,
                ...all.filter(
                  (u) => u.id !== currentUserId && !sellers.some((s) => s.id === u.id)
                ),
              ];

        setMerchants(padded.slice(0, limit));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof UsersApiError ? err.message : 'Failed to load merchants');
        setMerchants([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    if (currentUserId) load();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, limit]);

  return { merchants, isLoading, error };
}