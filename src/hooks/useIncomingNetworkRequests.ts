import { useCallback, useEffect, useState } from 'react';
import { API_CONFIG } from '../config/api.config';
import { encodeProfileSlug } from '../utils/routeCrypto';

export interface IncomingNetworkRequest {
  id: number;
  sender_id: string;
  receiver_id: string;
  create_date_time: string;
}

export function useIncomingNetworkRequests(userId: string) {
  const [requests, setRequests] = useState<IncomingNetworkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const encryptedUserId = encodeProfileSlug(userId);
      const endpoint = API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.NETWORK.INCOMING(encryptedUserId));
      const res = await fetch(endpoint);
      const data = await res.json();
      setRequests(data.data ?? []);
    } catch {
      // keep last-known list on network glitch
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [refresh]);

  const accept = useCallback(async (requestId: number) => {
    const prev = requests;
    setRequests(r => r.filter(x => x.id !== requestId));
    try {
      const endpoint = API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.NETWORK.ACCEPT(requestId));
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) setRequests(prev);
    } catch {
      setRequests(prev);
    }
  }, [requests]);

  const reject = useCallback(async (requestId: number) => {
    const prev = requests;
    setRequests(r => r.filter(x => x.id !== requestId));
    try {
      const endpoint = API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.NETWORK.REJECT(requestId));
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) setRequests(prev);
    } catch {
      setRequests(prev);
    }
  }, [requests]);

  return { requests, isLoading, accept, reject, refresh };
}