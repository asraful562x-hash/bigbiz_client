import { useCallback, useEffect, useState } from 'react';

export type NetworkStatus = 'none' | 'pending_sent' | 'pending_received' | 'connected';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bigbiz-backend.onrender.com/api';

interface StatusResponse {
  status: NetworkStatus;
  request_id?: number;
}

export function useNetworkStatus(currentUserId: string, targetUserId: string) {
  const [status, setStatus] = useState<NetworkStatus>('none');
  const [requestId, setRequestId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    try {
      const res = await fetch(`${API_BASE}/network/status/${currentUserId}/${targetUserId}`);
      const data: StatusResponse = await res.json();
      setStatus(data.status);
      setRequestId(data.request_id ?? null);
    } catch {
      // network hiccup — leave last-known status in place rather than reset to 'none'
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [refresh]);

  const sendRequest = useCallback(async () => {
    const prev = status;
    setStatus('pending_sent'); // optimistic
    try {
      const res = await fetch(`${API_BASE}/network/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: currentUserId, receiver_id: targetUserId }),
      });
      if (!res.ok) {
        // e.g. 409 already connected, or already pending — resync from server truth
        await refresh();
        return;
      }
      const data = await res.json();
      if (data.connected) {
        setStatus('connected');
      } else {
        await refresh();
      }
    } catch {
      setStatus(prev); // roll back optimistic update on failure
    }
  }, [currentUserId, targetUserId, status, refresh]);

  const acceptRequest = useCallback(async () => {
    if (!requestId) return;
    const prev = status;
    setStatus('connected'); // optimistic
    try {
      const res = await fetch(`${API_BASE}/network/accept/${requestId}`, { method: 'POST' });
      if (!res.ok) {
        setStatus(prev);
        return;
      }
      await refresh();
    } catch {
      setStatus(prev);
    }
  }, [requestId, status, refresh]);

  const rejectRequest = useCallback(async () => {
    if (!requestId) return;
    const prev = status;
    setStatus('none'); // optimistic
    try {
      const res = await fetch(`${API_BASE}/network/reject/${requestId}`, { method: 'POST' });
      if (!res.ok) {
        setStatus(prev);
        return;
      }
      await refresh();
    } catch {
      setStatus(prev);
    }
  }, [requestId, status, refresh]);

  return { status, requestId, isLoading, sendRequest, acceptRequest, rejectRequest, refresh };
}