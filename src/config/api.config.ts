/**
 * Centralized API & Server Configuration
 * 
 * Defines all backend URLs, endpoints, gateways, and environment fallbacks.
 * Use this module instead of hardcoding API paths across components.
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bigbiz-backend.onrender.com/api',
  SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://bigbiz-backend.onrender.com',
  CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || 'https://bigbiz-client.vercel.app',

  // Payment & External Gateways
  EWALLET_GATEWAY_URL: process.env.NEXT_PUBLIC_EWALLET_GATEWAY_URL || 'https://lyren-client.vercel.app',
  CHAIN_HOOK_GATEWAY_URL: process.env.NEXT_PUBLIC_CHAIN_HOOK_GATEWAY_URL || 'https://chain-hook-backend-evj9.vercel.app',

  // Media / CDN
  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bigbiz',
    UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'bizsocial_posts',
  },

  // API Endpoints Map
  ENDPOINTS: {
    // Auth & Users
    AUTH: {
      ME: '/users/me',
      LOGIN: '/users/login',
      LOGOUT: '/users/logout',
      REGISTER: '/users/register',
      OAUTH_GOOGLE: '/auth/google',
    },
    USERS: {
      LIST: '/users',
      DETAIL: (id: string | number) => `/users/${id}`,
      UPDATE_PROFILE: (id: string | number) => `/users/${id}`,
    },

    // Feed & Social Posts
    POSTS: {
      LIST: '/posts',
      CREATE: '/posts',
      DETAIL: (id: string | number) => `/posts/${id}`,
      DELETE: (id: string | number) => `/posts/${id}`,
      REACT: (id: string | number) => `/posts/${id}/react`,
      COMMENTS: (id: string | number) => `/posts/${id}/comments`,
      UPLOAD_MEDIA: '/posts/upload',
      RESET_ALL: '/posts/reset-all',
    },

    // Marketplace Products
    PRODUCTS: {
      LIST: '/products',
      CREATE: '/products',
      DETAIL: (id: string | number) => `/products/${id}`,
      UPDATE: (id: string | number) => `/products/${id}`,
      DELETE: (id: string | number) => `/products/${id}`,
    },

    // Direct Messaging & Inboxes
    INBOX: {
      LIST: (userId: string | number) => `/inbox/${userId}`,
      CREATE: '/inbox',
      MESSAGES: (inboxId: string | number) => `/messages/${inboxId}`,
      SEND_MESSAGE: '/messages',
      MARK_THREAD_READ: (inboxId: string | number) => `/messages/inbox/${inboxId}/read`,
      MARK_MESSAGE_READ: (msgId: string | number) => `/messages/${msgId}/read`,
    },

    // B2B Network Connections
    NETWORK: {
      REQUEST: '/network/request',
      INCOMING: (userId: string | number) => `/network/requests/${userId}`,
      ACCEPT: (requestId: string | number) => `/network/accept/${requestId}`,
      REJECT: (requestId: string | number) => `/network/reject/${requestId}`,
    },

    // Payment Platform & Gateway
    PAYMENT: {
      GENERATE_TOKEN: '/payment/generate-token',
      SELLER_SETTINGS: (sellerId: string | number) => `/payment/settings/${sellerId}`,
      SAVE_SELLER_SETTINGS: '/payment/settings',
      CALLBACK: '/payment/callback',
    },

    // Escrow Orders & Buy Desk
    ORDERS: {
      LIST: '/orders',
      USER_ORDERS: (userId: string | number) => `/orders/${userId}`,
      CONFIRM_RECEIPT: (orderId: string | number) => `/orders/${orderId}/confirm`,
      CREATE: '/orders',
      DETAIL: (id: string | number) => `/orders/${id}`,
      UPDATE_STATUS: (id: string | number) => `/orders/${id}/status`,
      RELEASE_ESCROW: (id: string | number) => `/orders/${id}/release-escrow`,
    },
  },

  // Helper method to resolve full endpoint URL
  resolveUrl: (endpoint: string): string => {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bigbiz-backend.onrender.com/api').replace(/\/+$/, '');
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.substring(4);
    }
    return `${cleanBase}${cleanEndpoint}`;
  }
};

export default API_CONFIG;
