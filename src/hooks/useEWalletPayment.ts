import { useState, useCallback } from 'react';
import { API_CONFIG } from '../config/api.config';
import { decodeProfileSlug } from '../utils/routeCrypto';

export interface PaymentCallbackInfo {
  user_id?: string | number;
  action?: 'upgrade_premium' | 'buy_product' | string;
  product_id?: string | number;
  quantity?: number;
  listing_title?: string;
  [key: string]: unknown;
}

interface GenerateTokenOptions {
  amount: number;
  purpose: string;
  sellerId?: number | string;
  callbackInfo?: PaymentCallbackInfo;
}

interface UseEWalletPaymentReturn {
  isLoading: boolean;
  error: string | null;
  startPayment: (options: GenerateTokenOptions) => Promise<void>;
}

export function useEWalletPayment(): UseEWalletPaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPayment = useCallback(async (options: GenerateTokenOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      let parsedSellerId: number | undefined;
      if (options.sellerId !== undefined && options.sellerId !== null) {
        const rawStr = String(options.sellerId);
        const decoded = decodeProfileSlug(rawStr);
        const num = parseInt(decoded, 10);
        if (!isNaN(num) && num > 0) {
          parsedSellerId = num;
        }
      }

      const endpoint = API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.PAYMENT.GENERATE_TOKEN);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: options.amount,
          purpose: options.purpose,
          seller_id: parsedSellerId,
          callback_info: options.callbackInfo ?? {},
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Payment gateway error');
      }

      const redirectUrl: string = json.redirect_url;
      if (!redirectUrl) {
        throw new Error('No redirect URL returned from payment gateway');
      }

      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(msg);
      console.error('[EWalletPayment]', msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, startPayment };
}
