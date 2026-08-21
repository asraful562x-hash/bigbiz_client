'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  UserRole,
  Listing,
  Post,
  Story,
  DirectOffer,
  Order,
  Conversation,
  Message,
  AppNotification,
  Review,
  Dispute,
  MarketplaceCategory,
  ProductCondition,
  DirectOfferStatus,
  PostType,
  Comment as AppComment,
  ProductVariant,
  ProductOptionSection
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_DIRECT_OFFERS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_DISPUTES
} from '../data/mockData';

import {
  encodeProfileSlug,
  encodeProductSlug,
  encodeChatSlug,
  decodeProfileSlug,
  decodeChatSlug
} from '../utils/routeCrypto';

import {
  createOrGetConversation,
  fetchConversations,
  fetchMessages,
  sendMessageToBackend,
  markThreadRead
} from '../../lib/api/chat-api';

import { API_CONFIG } from '../config/api.config';
import { useEWalletPayment } from '../hooks/useEWalletPayment';
import { useIncomingNetworkRequests } from '../hooks/useIncomingNetworkRequests';

export const mapRoleNameToUserRole = (roleName?: string): UserRole => {
  if (!roleName) return 'seller_premium';
  const r = roleName.toLowerCase();
  if (r === 'seller_free') return 'seller_free';
  if (r.includes('seller') || r.includes('merchant') || r.includes('vendor')) return 'seller_premium';
  if (r === 'buyer_premium' || r.includes('vip')) return 'buyer_premium';
  if (r.includes('buyer')) return 'buyer_free';
  if (r === 'admin' || r === 'superadmin') return 'admin';
  if (r === 'moderator') return 'moderator';
  if (r === 'procurement') return 'procurement';
  return 'seller_premium';
};

export const debug = false;

export interface AppContextType {
  // Auth & User State
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthChecking: boolean;
  showOnboarding: boolean;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  isDataLoading: boolean;
  setIsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;

  // Commerce & Content State
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  offers: DirectOffer[];
  setOffers: React.Dispatch<React.SetStateAction<DirectOffer[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  disputes: Dispute[];
  setDisputes: React.Dispatch<React.SetStateAction<Dispute[]>>;

  // Navigation & Filter State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: MarketplaceCategory | 'all';
  setSelectedCategory: React.Dispatch<React.SetStateAction<MarketplaceCategory | 'all'>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  // Modals & Panels State
  showSellToUsModal: boolean;
  setShowSellToUsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateListingModal: boolean;
  setShowCreateListingModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCreatePostModal: boolean;
  setShowCreatePostModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateStoryModal: boolean;
  setShowCreateStoryModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateQuoteModal: boolean;
  setShowCreateQuoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  showMessagesModal: boolean;
  setShowMessagesModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNotificationsModal: boolean;
  setShowNotificationsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLeftDrawer: boolean;
  setShowLeftDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showRightDrawer: boolean;
  setShowRightDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  selectedListing: Listing | null;
  setSelectedListing: React.Dispatch<React.SetStateAction<Listing | null>>;
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  selectedSellerId: string | null;
  setSelectedSellerId: React.Dispatch<React.SetStateAction<string | null>>;
  activeChatSellerId: string | null;
  setActiveChatSellerId: React.Dispatch<React.SetStateAction<string | null>>;

  // Counters
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  escrowOrdersCount: number;

  // Network Requests
  incomingNetworkRequests: any[];
  handleAcceptNetworkRequest: (id: number) => void;
  handleRejectNetworkRequest: (id: number) => void;

  // Actions
  handleTabChange: (newTab: string) => void;
  handleOpenSellerProfile: (sellerId: string) => void;
  handleCloseSellerProfile: () => void;
  handleOpenListingDetail: (listing: Listing) => void;
  handleCloseListingDetail: () => void;
  handleOpenChat: (sellerId?: string) => Promise<void>;
  handleCloseChat: () => void;
  handleToggleMessages: () => void;
  handleToggleNotifications: () => void;
  handleMarkConversationRead: (convId: string) => void;
  handleMarkAllNotificationsRead: () => void;
  handleSendMessageInState: (convId: string, text: string) => void;
  handleLogin: (user: User, token?: string) => void;
  handleLogout: () => void;
  handleUpgradeTier: () => Promise<void>;
  handleLikePost: (postId: string) => Promise<void>;
  handleCommentPost: (postId: string, text: string) => Promise<void>;
  handleDeletePost: (postId: string) => Promise<void>;
  handleCreatePost: (postData: Partial<Post>) => Promise<void>;
  handleCreateStory: (mediaUrl: string, caption?: string) => void;
  handleCreateListing: (listingData: Partial<Listing>) => Promise<void>;
  handleUpdateListing: (listingId: string, updates: Partial<Listing>) => Promise<void>;
  handleDeleteListing: (listingId: string) => Promise<void>;
  handleBuyNowOrder: (listing: Listing, shippingAddress: string, selectedOptions?: any) => Promise<void>;
  handleConfirmReceipt: (orderId: string) => void;
  handleSubmitDirectOffer: (offerData: any) => void;
  handleUpdateOfferStatus: (offerId: string, newStatus: DirectOfferStatus, counterPrice?: number, note?: string) => void;
  handleAcceptCounterOffer: (offerId: string) => void;
  handleAutoListPublic: (offerId: string) => void;
  handleUpdateOrderStatus: (orderId: string, newStatus: Order['status'], newEscrowStatus?: Order['escrowStatus']) => void;
  handleUpdateDisputeStatus: (disputeId: string, status: Dispute['status']) => void;
  handleToggleUserVerification: (userId: string) => void;
  handleUpdateUserRole: (userId: string, newRole: UserRole) => void;
  handleToggleUserBan: (userId: string) => void;
  fetchBackendPosts: (allUsers?: User[], currentLoggedInUser?: User) => Promise<void>;
  fetchBackendProducts: (allUsers?: User[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const isUserProfileComplete = (user: User | null | undefined): boolean => {
  if (!user) return false;
  const hasValidName = Boolean(user.name && user.name.trim().length > 0 && user.name !== 'undefined');
  const hasValidEmail = Boolean(user.email && user.email.includes('@'));
  const isSeller = user.role === 'seller_free' || user.role === 'seller_premium';
  const hasValidCompany = isSeller ? Boolean(user.companyName && user.companyName.trim().length > 0 && user.companyName !== 'undefined') : true;
  return Boolean(hasValidName && hasValidEmail && hasValidCompany);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth_user');
        const token = localStorage.getItem('auth_token');
        return Boolean(stored && token);
      } catch {}
    }
    return false;
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) {
            return {
              ...parsed,
              role: mapRoleNameToUserRole(parsed.role || parsed.role_name),
            };
          }
        }
      } catch {}
    }
    return INITIAL_USERS[2];
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [offers, setOffers] = useState<DirectOffer[]>(INITIAL_DIRECT_OFFERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);

  const [activeTab, setActiveTabState] = useState<string>('feed');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showSellToUsModal, setShowSellToUsModal] = useState<boolean>(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState<boolean>(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState<boolean>(false);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState<boolean>(false);
  const [showMessagesModal, setShowMessagesModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [activeChatSellerId, setActiveChatSellerId] = useState<string | null>(null);

  const { startPayment } = useEWalletPayment();
  const {
    requests: incomingNetworkRequests,
    accept: handleAcceptNetworkRequest,
    reject: handleRejectNetworkRequest,
    refresh: refreshNetworkRequests,
  } = useIncomingNetworkRequests(currentUser.id);

  const unreadNotificationsCount = notifications.filter(
    n => !n.isRead && (n.userId === currentUser.id || !n.userId || n.userId === encodeProfileSlug(currentUser.id))
  ).length + (incomingNetworkRequests?.length || 0);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const escrowOrdersCount = orders.filter(o => o.escrowStatus === 'held').length;

  const handleMarkConversationRead = useCallback((convId: string) => {
    if (!convId) return;
    setConversations(prev => prev.map(c =>
      (c.id === convId || encodeChatSlug(c.id) === encodeChatSlug(convId))
        ? { ...c, unreadCount: 0 }
        : c
    ));
    setMessages(prev => prev.map(m =>
      (m.conversationId === convId || encodeChatSlug(m.conversationId) === encodeChatSlug(convId))
        ? { ...m, isRead: true }
        : m
    ));
    markThreadRead(convId, currentUser.id).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const getBaseTabRoute = (tab: string = activeTab) => {
    switch (tab) {
      case 'marketplace': return '/marketplace';
      case 'settings': return '/settings';
      case 'orders': return '/orders';
      case 'dashboard':
      case 'seller': return '/dashboard';
      case 'procurement': return '/procurement';
      case 'admin': return '/admin';
      case 'help': return '/help';
      case 'sell_to_us': return '/sell-to-us';
      case 'messages': return '/messages';
      case 'feed':
      default: return '/feed';
    }
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTabState(newTab);
    setSelectedSellerId(null);
    setSelectedListing(null);
    setShowMessagesModal(false);
    setShowNotificationsModal(false);
    router.push(getBaseTabRoute(newTab));
  };

  const handleOpenSellerProfile = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    router.push(`/profile/${encodeProfileSlug(sellerId)}`);
  };

  const handleCloseSellerProfile = () => {
    setSelectedSellerId(null);
    router.push(getBaseTabRoute());
  };

  const handleOpenListingDetail = (listing: Listing) => {
    setSelectedListing(listing);
    router.push(`/product/${encodeProductSlug(listing.id)}`);
  };

  const handleCloseListingDetail = () => {
    setSelectedListing(null);
    router.push(getBaseTabRoute());
  };

  const handleOpenChat = async (sellerId?: string) => {
    if (!sellerId) {
      setActiveChatSellerId(null);
      setShowMessagesModal(true);
      return;
    }

    // Accepts both raw ids and u_... slugs — decode is a no-op for raw ids
    const cleanSellerId = decodeProfileSlug(String(sellerId).trim());
    const tempConvId = `conv_${currentUser.id}_${cleanSellerId}`;

    const localUser = users.find(u => String(u.id) === cleanSellerId);
    let userName = localUser?.name || 'Member';
    let userAvatar = localUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${cleanSellerId}`;
    let userRole: UserRole = localUser?.role || 'buyer_free';

    if (!localUser) {
      try {
        const resp = await fetch(`/api/users/${cleanSellerId}`);
        if (resp.ok) {
          const data = await resp.json();
          const u = data?.data || data;
          if (u?.full_name || u?.name) userName = u.full_name || u.name;
          if (u?.avatar) userAvatar = u.avatar;
          if (u?.role_name || u?.role) userRole = mapRoleNameToUserRole(u.role_name || u.role);
        }
      } catch {}
    }

    const existingConv = conversations.find(c =>
      (c.participantIds && c.participantIds.includes(cleanSellerId)) ||
      (c.otherParticipant && String(c.otherParticipant.id) === cleanSellerId)
    );

    const numCurrId = parseInt(String(currentUser.id).replace(/\D/g, ''), 10);
    const numTargetId = parseInt(cleanSellerId.replace(/\D/g, ''), 10);

    let canonicalConvId = existingConv?.id || tempConvId;

    if (numCurrId && numTargetId && numCurrId !== numTargetId) {
      try {
        const backendConv = await createOrGetConversation(String(numCurrId), String(numTargetId), {
          id: cleanSellerId,
          name: userName,
          avatar: userAvatar,
          role: userRole,
        } as unknown as User);

        if (backendConv?.id) {
          // Normalize to the c_... slug so every conversation id in state shares one format
          canonicalConvId = encodeChatSlug(decodeChatSlug(backendConv.id));
          try {
            const threadMsgs = await fetchMessages(canonicalConvId);
            if (threadMsgs && threadMsgs.length > 0) {
              setMessages(prev => {
                const map = new Map<string, Message>();
                prev.forEach(m => map.set(m.id, m));
                threadMsgs.forEach(m => map.set(m.id, m));
                return Array.from(map.values());
              });
            }
          } catch {}
        }
      } catch (err) {
        console.warn('[Chat] Failed to sync inbox with backend:', err);
      }

      try {
        await fetch('/api/network/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: String(numCurrId),
            receiver_id: String(numTargetId),
          }),
        });
      } catch (err) {
        console.warn('[Network] Failed to dispatch network request on chat start:', err);
      }
    }

    const activeConvObj: Conversation = {
      id: canonicalConvId,
      participantIds: [String(currentUser.id), cleanSellerId],
      otherParticipant: {
        id: cleanSellerId,
        name: userName,
        avatar: userAvatar,
        role: userRole,
      } as User,
      lastMessage: existingConv?.lastMessage || 'Conversation started',
      lastMessageTime: existingConv?.lastMessageTime || 'Just now',
      unreadCount: existingConv?.unreadCount || 0,
    };

    setConversations(prev => {
      const canonicalKey = decodeChatSlug(canonicalConvId);
      const sellerKey = decodeProfileSlug(cleanSellerId);
      const filtered = prev.filter(c => {
        if (c.id === tempConvId || c.id === canonicalConvId) return false;
        // decode both sides — state may hold c_.../u_... slugs or raw ids
        if (decodeChatSlug(c.id) === canonicalKey) return false;
        if (c.otherParticipant && decodeProfileSlug(String(c.otherParticipant.id)) === sellerKey) return false;
        return true;
      });
      const deduped = filtered.filter((c, i) =>
        filtered.findIndex(o => decodeChatSlug(o.id) === decodeChatSlug(c.id)) === i
      );
      return [activeConvObj, ...deduped];
    });

    setActiveChatSellerId(canonicalConvId);
    setShowMessagesModal(true);
  };

  const handleCloseChat = () => {
    setShowMessagesModal(false);
    setActiveChatSellerId(null);
  };

  const handleToggleMessages = () => {
    setShowMessagesModal(prev => !prev);
    setShowNotificationsModal(false);
  };

  const handleToggleNotifications = () => {
    setShowNotificationsModal(prev => !prev);
    setShowMessagesModal(false);
  };

  const handleSendMessageInState = async (convId: string, text: string) => {
    const activeConv = conversations.find(c => c.id === convId);
    const receiverId = activeConv?.otherParticipant?.id;

    // Always decode before deriving numeric ids — stripping digits from an
    // encrypted u_... slug previously fabricated phantom inboxes in the backend
    const receiverRaw = receiverId ? decodeProfileSlug(String(receiverId)) : '';
    const numCurrId = parseInt(decodeProfileSlug(String(currentUser.id)).replace(/\D/g, ''), 10) || 0;
    const numTargetId = receiverRaw ? (parseInt(receiverRaw.replace(/\D/g, ''), 10) || 0) : 0;

    // If convId decodes to a numeric inbox id, the thread already exists in the
    // backend — reuse it instead of creating another inbox
    const decodedConvId = decodeChatSlug(convId);
    let numericConvId = /^\d+$/.test(decodedConvId) ? decodedConvId : '';

    if (!numericConvId && numCurrId && numTargetId && numCurrId !== numTargetId) {
      try {
        const backendConv = await createOrGetConversation(
          String(numCurrId),
          String(numTargetId),
          activeConv?.otherParticipant
        );
        if (backendConv?.id) {
          numericConvId = decodeChatSlug(backendConv.id);
        }
      } catch (err) {
        console.warn('[Chat] Failed to resolve backend inbox before sending:', err);
      }
    }

    // UI state uses the c_... slug form; backend calls use the raw numeric id
    const targetConvId = numericConvId ? encodeChatSlug(numericConvId) : convId;
    const targetKey = decodeChatSlug(targetConvId);

    const tempMsgId = `msg_${Date.now()}`;
    const newMsg: Message = {
      id: tempMsgId,
      conversationId: targetConvId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      isRead: true,
      createdAt: 'Just now'
    };

    setMessages(prev => {
      const convKey = decodeChatSlug(convId);
      const updated = prev.map(m =>
        decodeChatSlug(m.conversationId) === convKey ? { ...m, conversationId: targetConvId } : m
      );
      // Drop earlier optimistic copies of this same outgoing text in the thread
      const withoutStaleOptimistic = updated.filter(m =>
        !(m.id.startsWith('msg_') && m.senderId === currentUser.id &&
          m.text === text && decodeChatSlug(m.conversationId) === targetKey)
      );
      return [...withoutStaleOptimistic, newMsg];
    });

    setConversations(prev => {
      const cleanList = prev.map(c => {
        if (decodeChatSlug(c.id) === targetKey) {
          return {
            ...c,
            id: targetConvId,
            lastMessage: text,
            lastMessageTime: 'Just now'
          };
        }
        return c;
      });

      const idx = cleanList.findIndex(c => decodeChatSlug(c.id) === targetKey);
      if (idx !== -1) {
        const [moved] = cleanList.splice(idx, 1);
        return [moved, ...cleanList];
      }
      return cleanList;
    });

    setActiveChatSellerId(targetConvId);

    if (numericConvId && receiverRaw) {
      try {
        const savedBackendMsg = await sendMessageToBackend({
          conversationId: numericConvId,
          senderId: currentUser.id,
          receiverId: receiverRaw,
          text,
        });
        if (savedBackendMsg?.id) {
          const savedId = String(savedBackendMsg.id);
          setMessages(prev => {
            const replaced = prev.map(m =>
              m.id === tempMsgId
                ? { ...m, id: savedId, conversationId: targetConvId, senderId: currentUser.id }
                : m
            );
            // The poller may have already added the saved copy — keep one per id
            const seen = new Set<string>();
            return replaced.filter(m => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            });
          });
        }
      } catch (err) {
        console.warn('[Chat] Failed to persist message to backend:', err);
      }
    }
  };

  const saveAuthSession = (user: User, token?: string) => {
    const cleanUser: User = {
      ...user,
      role: mapRoleNameToUserRole(user.role),
    };
    if (token) {
      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
    try {
      localStorage.setItem('auth_user', JSON.stringify(cleanUser));
    } catch {}
    setCurrentUser(cleanUser);
    setIsLoggedIn(true);

    setUsers(prev => {
      const exists = prev.some(u => u.id === cleanUser.id || u.email === cleanUser.email);
      return exists ? prev.map(u => (u.id === cleanUser.id || u.email === cleanUser.email) ? cleanUser : u) : [cleanUser, ...prev];
    });

    if (!isUserProfileComplete(cleanUser)) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }

    // Immediately load real posts and products from backend upon login (without waiting for reload)
    fetch('/api/users')
      .then(r => r.ok ? r.json() : [])
      .then(uList => {
        let liveUsers = users;
        if (Array.isArray(uList) && uList.length > 0) {
          liveUsers = uList.map((u: any) => ({
            ...u,
            id: String(u.id),
            name: u.full_name || u.name || 'Member',
            role: mapRoleNameToUserRole(u.role_name || u.role),
          }));
          setUsers(liveUsers);
        }
        fetchBackendPosts(liveUsers, cleanUser);
        fetchBackendProducts(liveUsers);
      })
      .catch(() => {
        fetchBackendPosts(users, cleanUser);
        fetchBackendProducts(users);
      });
  };

  const handleLogin = (user: User, token?: string) => {
    saveAuthSession(user, token);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    // Clear the server-set httpOnly auth cookie too
    fetch('/api/users/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setIsLoggedIn(false);
    setShowOnboarding(false);
    router.push('/feed');
  };

  const mapBackendPostToFrontend = (bp: any, allUsers: User[], currentLoggedInUser?: User): Post => {
    const authorUser = allUsers.find(u => u.id === String(bp.user_id) || u.email === bp.user?.email) || (
      bp.user ? {
        id: String(bp.user.id || bp.user_id),
        name: bp.user.full_name || 'Business Member',
        username: bp.user.email ? bp.user.email.split('@')[0] : 'member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        isVerified: true,
      } : null
    );

    const isCurrent = Boolean(currentLoggedInUser) && (
      (Boolean(bp.user_id) && String(bp.user_id) === String(currentLoggedInUser!.id)) ||
      (Boolean(bp.user?.email) && bp.user.email === currentLoggedInUser!.email)
    );

    const mediaUrls: string[] = (bp.media || []).map((m: any) => m.media_url || m.MediaURL || '').filter(Boolean);
    const mediaItems = (bp.media || []).map((m: any) => ({
      url: m.media_url || m.MediaURL || '',
      type: (m.media_type || m.MediaType || 'image') as 'image' | 'video',
    })).filter((m: any) => Boolean(m.url));

    const hashtags: string[] = Array.isArray(bp.hashtags)
      ? bp.hashtags.map((h: any) => (typeof h === 'string' ? (h.startsWith('#') ? h : `#${h}`) : h.tag ? `#${h.tag}` : '#BizSocial'))
      : typeof bp.hashtags === 'string' && bp.hashtags.trim()
      ? bp.hashtags.split(' ').map((t: string) => t.startsWith('#') ? t : `#${t}`)
      : ['#BizSocial'];

    const formattedDate = bp.create_date_time
      ? new Date(bp.create_date_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Just now';

    const likedKey = currentLoggedInUser ? `bizsocial_liked_post_ids_${currentLoggedInUser.id}` : 'bizsocial_liked_post_ids';
    let userLiked = false;
    try {
      const storedLikedIds: string[] = JSON.parse(localStorage.getItem(likedKey) || '[]');
      if (storedLikedIds.includes(String(bp.id))) {
        userLiked = true;
      }
    } catch {}

    if (!userLiked && Array.isArray(bp.reacts) && bp.reacts.length > 0 && currentLoggedInUser) {
      const currentNumId = parseInt(currentLoggedInUser.id.replace(/\D/g, ''), 10) || 0;
      userLiked = bp.reacts.some((r: any) =>
        r.love_react !== false && (
          String(r.user_id) === String(currentLoggedInUser.id) ||
          (r.user?.email && r.user.email === currentLoggedInUser.email) ||
          (currentNumId > 0 && r.user_id === currentNumId)
        )
      );
    }

    const authorId = String(bp.user_id || (authorUser?.id) || '?');
    const authorName = authorUser?.name || bp.user?.full_name || 'Business Member';
    const authorAvatar = (isCurrent && currentLoggedInUser?.avatar)
      ? currentLoggedInUser.avatar
      : (authorUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');

    return {
      id: String(bp.id),
      sellerId: authorId,
      sellerName: authorName,
      sellerAvatar: authorAvatar,
      isVerifiedSeller: authorUser?.isVerified ?? true,
      content: bp.caption || bp.content || '',
      mediaUrls,
      mediaItems,
      postType: (bp.post_format as PostType) || 'update',
      listingId: bp.listing_id,
      promoBadge: bp.promo_badge,
      callToAction: bp.call_to_action,
      likesCount: bp.reacts ? bp.reacts.length : (bp.likes_count || 0),
      isLiked: userLiked,
      commentsCount: bp.comments ? bp.comments.length : (bp.comments_count || 0),
      comments: (bp.comments || []).map((c: any) => ({
        id: String(c.id),
        postId: String(c.post_id),
        userId: String(c.user_id),
        userName: c.user?.full_name || 'Member',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        text: c.comment || '',
        createdAt: c.create_date_time ? new Date(c.create_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
      })),
      sharesCount: bp.shares_count || 0,
      hashtags: hashtags.length > 0 ? hashtags : ['#BizSocial'],
      createdAt: formattedDate,
    };
  };

  const mapBackendProductToListing = (bp: any, allUsers: User[]): Listing => {
    const authorUser = allUsers.find(u => u.id === String(bp.user_id) || u.email === bp.user?.email) || (
      bp.user ? {
        id: String(bp.user.id || bp.user_id),
        name: bp.user.full_name || 'Verified Seller',
        username: bp.user.email ? bp.user.email.split('@')[0] : 'seller',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
      } : null
    );

    const mCat = bp.marketplace_categories?.[0]?.category?.category || 'new_products';
    const uCat = bp.user_categories?.[0]?.category?.category || 'General Collection';

    const optionSections: ProductOptionSection[] = (bp.option_sections || []).map((sec: any) => ({
      id: `sec_${sec.id}`,
      title: sec.name,
      type: (sec.require ? 'single' : 'multiple') as 'single' | 'multiple',
      isRequired: sec.require,
      items: (sec.sub_sections || []).flatMap((sub: any) =>
        (sub.options || []).map((opt: any) => ({
          id: `opt_${opt.id}`,
          name: `${sub.name ? sub.name + ': ' : ''}${opt.name}`,
          priceDelta: opt.price || 0,
          isDefault: opt.is_default,
        }))
      ),
    }));

    const variants: ProductVariant[] = (bp.variants || []).map((v: any) => ({
      id: `var_${v.id}`,
      name: v.name,
      priceDelta: v.price || 0,
      stockQty: v.qty || 1,
      isDefault: v.is_default,
    }));

    const tags = (bp.keywords || []).map((k: any) => k.name ? (k.name.startsWith('#') ? k.name : `#${k.name}`) : '').filter(Boolean);

    let parsedImages: string[] = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'];
    if (bp.images && typeof bp.images === 'string' && bp.images.trim()) {
      try {
        const parsed = JSON.parse(bp.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsedImages = parsed.filter((u: any) => typeof u === 'string' && u.trim());
        }
      } catch {
        if (bp.images.trim().startsWith('http')) {
          parsedImages = [bp.images.trim()];
        }
      }
    } else if (Array.isArray(bp.images) && bp.images.length > 0) {
      parsedImages = bp.images.filter((u: any) => typeof u === 'string' && u.trim());
    }

    const resolvedLocation = authorUser && 'location' in authorUser && authorUser.location ? (authorUser.location as string) : 'New York, USA';

    return {
      id: String(bp.id),
      title: bp.title || 'Untitled Product',
      description: bp.description || '',
      category: mCat as MarketplaceCategory,
      storeCategory: uCat,
      condition: 'new',
      price: bp.price || 0,
      discountPercent: bp.discount_rate > 0 ? bp.discount_rate : undefined,
      variants: variants.length > 0 ? variants : undefined,
      optionSections: optionSections.length > 0 ? optionSections : undefined,
      images: parsedImages,
      location: resolvedLocation,
      sellerId: String(bp.user_id),
      sellerName: authorUser?.name || 'Verified Seller',
      sellerAvatar: authorUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      isVerifiedSeller: authorUser?.isVerified ?? true,
      isFeatured: false,
      likesCount: 0,
      viewsCount: 1,
      status: 'active',
      tags: tags.length > 0 ? tags : ['#business', '#product'],
      createdAt: bp.create_date_time ? new Date(bp.create_date_time).toLocaleDateString() : 'Just now',
      stockQty: 10,
    };
  };

  const fetchBackendProducts = async (allUsers: User[] = users) => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        const rawProducts = json.data || (Array.isArray(json) ? json : []);
        if (Array.isArray(rawProducts) && rawProducts.length > 0) {
          const mappedProducts = rawProducts.map((bp: any) => mapBackendProductToListing(bp, allUsers));
          setListings(prev => {
            const existingIds = new Set(mappedProducts.map((p: Listing) => p.id));
            const remainingDemo = prev.filter(p => !existingIds.has(p.id));
            return [...mappedProducts, ...remainingDemo];
          });
        }
      }
    } catch (err) {
      console.warn('[ProductSync] Backend /api/products fetch error:', err);
    }
  };

  const fetchBackendPosts = async (allUsers: User[] = users, currentLoggedInUser: User = currentUser) => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const json = await res.json();
        const rawPosts = json.data || (Array.isArray(json) ? json : []);
        if (Array.isArray(rawPosts) && rawPosts.length > 0) {
          const mappedBackendPosts = rawPosts.map((bp: any) => mapBackendPostToFrontend(bp, allUsers, currentLoggedInUser));

          setPosts(prev => {
            const existingById = new Map(prev.map(p => [p.id, p]));
            const existingIds = new Set(mappedBackendPosts.map((p: Post) => p.id));
            const remainingDemoPosts = prev.filter(p => !existingIds.has(p.id));

            const mergedBackendPosts = mappedBackendPosts.map((bp: Post) => {
              const existing = existingById.get(bp.id);
              if (!existing) return bp;
              return {
                ...bp,
                mediaUrls: (bp.mediaUrls && bp.mediaUrls.length > 0) ? bp.mediaUrls : (existing.mediaUrls || []),
                mediaItems: (bp.mediaItems && bp.mediaItems.length > 0) ? bp.mediaItems : (existing.mediaItems || []),
              };
            });

            return [...mergedBackendPosts, ...remainingDemoPosts];
          });
        }
      }
    } catch (err) {
      console.warn('[PostSync] Backend /api/posts fetch error:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('auth') === 'success') {
        const token = searchParams.get('token') || `oauth_${Date.now()}`;
        const email = searchParams.get('email') || 'oauth_user@bizsocial.com';
        const name = searchParams.get('name') || email.split('@')[0];
        const companyParam = searchParams.get('company') || '';
        const roleType = searchParams.get('role') || 'buyer';
        const resolvedCompany = (companyParam && companyParam !== 'undefined') ? companyParam : '';

        const oauthUser: User = {
          id: `oauth-${Date.now()}`,
          name: name,
          username: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'business'}`,
          email: email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          role: mapRoleNameToUserRole(roleType),
          bio: resolvedCompany ? `Official account for ${resolvedCompany}` : '',
          isVerified: roleType.includes('premium') || roleType === 'admin' || roleType === 'procurement',
          verificationBadgeType: 'b2b_verified',
          companyName: resolvedCompany,
          rating: 5.0,
          reviewsCount: 0,
          totalSales: 0,
          followersCount: 30,
          followingCount: 15,
          subscriptionStatus: roleType.includes('premium') || roleType === 'admin' || roleType === 'procurement' ? 'premium' : 'free',
          location: '',
          createdAt: 'Just now'
        };

        saveAuthSession(oauthUser, token);
        window.history.replaceState({}, document.title, window.location.pathname);
        const splashDelay = debug ? 150 : 1400;
        setTimeout(() => setIsAuthChecking(false), splashDelay);
        return;
      }
    }

    const storedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const storedUserStr = localStorage.getItem('auth_user');

    if (!storedToken && !storedUserStr) {
      setIsLoggedIn(false);
      const splashDelay = debug ? 150 : 800;
      setTimeout(() => setIsAuthChecking(false), splashDelay);
      return;
    }

    const headers: Record<string, string> = {};
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }

    fetch('/api/users/me', {
      headers,
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const resData = await res.json();
          const serverUserData = resData.data;

          let parsedStoredUser: Partial<User> = {};
          try {
            if (storedUserStr) parsedStoredUser = JSON.parse(storedUserStr);
          } catch {}

          const resolvedRole = mapRoleNameToUserRole(serverUserData.role_name || parsedStoredUser.role);

          const verifiedUser: User = {
            id: String(serverUserData.id),
            name: serverUserData.full_name || parsedStoredUser.name || 'Verified User',
            username: `@${(serverUserData.email || '').split('@')[0] || 'member'}`,
            email: serverUserData.email,
            avatar: parsedStoredUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            role: resolvedRole,
            bio: parsedStoredUser.bio || (serverUserData.company_name ? `Official account for ${serverUserData.company_name}` : ''),
            isVerified: resolvedRole === 'admin' || resolvedRole.includes('premium') || resolvedRole === 'procurement',
            verificationBadgeType: 'b2b_verified',
            companyName: serverUserData.company_name || parsedStoredUser.companyName || '',
            customCategories: parsedStoredUser.customCategories || ['General Collection'],
            rating: parsedStoredUser.rating ?? 5.0,
            reviewsCount: parsedStoredUser.reviewsCount ?? 0,
            totalSales: parsedStoredUser.totalSales ?? 0,
            followersCount: parsedStoredUser.followersCount ?? 30,
            followingCount: parsedStoredUser.followingCount ?? 15,
            subscriptionStatus: resolvedRole.includes('premium') || resolvedRole === 'admin' ? 'premium' : 'free',
            location: parsedStoredUser.location || '',
            createdAt: serverUserData.create_date_time || 'Just now',
          };

          setCurrentUser(verifiedUser);
          setIsLoggedIn(true);
          try {
            localStorage.setItem('auth_user', JSON.stringify(verifiedUser));
          } catch {}

          setShowOnboarding(!isUserProfileComplete(verifiedUser));

          fetch('/api/users')
            .then(uRes => uRes.ok ? uRes.json() : null)
            .then((data: any[] | null) => {
              let liveUsers: User[] = INITIAL_USERS;
              if (Array.isArray(data) && data.length > 0) {
                liveUsers = data.map(u => ({
                  ...u,
                  id: String(u.id),
                  name: u.full_name || u.name || 'Member',
                  role: mapRoleNameToUserRole(u.role_name || u.role),
                }));
              }
              const userInList = liveUsers.some(u => u.id === verifiedUser.id || u.email === verifiedUser.email);
              const finalUsers = userInList
                ? liveUsers.map(u => (u.id === verifiedUser.id || u.email === verifiedUser.email) ? verifiedUser : u)
                : [verifiedUser, ...liveUsers];

              setUsers(finalUsers);
              fetchBackendPosts(finalUsers, verifiedUser);
              fetchBackendProducts(finalUsers);

              fetchConversations(String(verifiedUser.id), finalUsers)
                .then(async (backendConvs) => {
                  if (backendConvs && backendConvs.length > 0) {
                    try {
                      const msgPromises = backendConvs.map(c => fetchMessages(c.id).catch(() => []));
                      const msgsArrays = await Promise.all(msgPromises);
                      const allBackendMsgs = msgsArrays.flat();
                      if (allBackendMsgs.length > 0) {
                        setMessages(prev => {
                          const map = new Map<string, Message>();
                          prev.forEach(m => map.set(m.id, m));
                          allBackendMsgs.forEach(m => map.set(m.id, m));
                          return Array.from(map.values());
                        });
                      }
                    } catch (mErr) {
                      console.warn('[InboxSync] Failed to load messages history:', mErr);
                    }

                    setConversations(backendConvs);
                  }
                })
                .catch(err => {
                  console.warn('[InboxSync] Failed to load conversations from backend:', err);
                });
            })
            .catch(() => {
              fetchBackendPosts(INITIAL_USERS, verifiedUser);
              fetchBackendProducts(INITIAL_USERS);
            });
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          setIsLoggedIn(false);
          setShowOnboarding(false);
        }
      })
      .catch((err) => {
        console.warn('[AuthGuard] Backend offline:', err);
        setIsLoggedIn(false);
        setShowOnboarding(false);
      })
      .finally(() => {
        const splashDelay = debug ? 150 : 800;
        setTimeout(() => setIsAuthChecking(false), splashDelay);
      });
  }, []);

  // ── 15-Second Heartbeat Polling for Messages, Conversations, Notifications & Orders ──
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        // Poll messages & conversations
        const latestConvs = await fetchConversations(currentUser.id, users);

        if (latestConvs && latestConvs.length > 0) {
          const msgPromises = latestConvs.map(c => fetchMessages(c.id).catch(() => []));
          const msgsArrays = await Promise.all(msgPromises);
          const allNewMsgs = msgsArrays.flat();

          if (allNewMsgs.length > 0) {
            setMessages(prev => {
              const map = new Map<string, Message>();
              prev.forEach(m => map.set(m.id, m));
              allNewMsgs.forEach(m => map.set(m.id, m));
              // Drop optimistic msg_* bubbles that now exist as real backend rows
              const backendKeys = new Set(
                Array.from(map.values())
                  .filter(m => /^\d+$/.test(m.id))
                  .map(m => `${decodeChatSlug(m.conversationId)}|${m.senderId}|${m.text}`)
              );
              return Array.from(map.values()).filter(m =>
                m.id.startsWith('msg_')
                  ? !backendKeys.has(`${decodeChatSlug(m.conversationId)}|${m.senderId}|${m.text}`)
                  : true
              );
            });
          }

          setConversations(prev => {
            // Key by decoded inbox id so legacy raw-id rows and c_... rows collapse into one
            const map = new Map<string, Conversation>();
            latestConvs.forEach(c => map.set(decodeChatSlug(c.id), c));
            prev.forEach(c => {
              const key = decodeChatSlug(c.id);
              if (!map.has(key)) map.set(key, c);
            });
            return Array.from(map.values());
          });
        }

        // Poll incoming connection requests & system notifications
        if (refreshNetworkRequests) {
          refreshNetworkRequests();
        }

        // Poll orders from backend (picks up orders created by payment callback)
        try {
          const ordersUrl = API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.ORDERS.USER_ORDERS(encodeProfileSlug(currentUser.id)));
          const ordersRes = await fetch(ordersUrl);
          const ordersJson = await ordersRes.json();
          if (ordersJson.success && Array.isArray(ordersJson.data) && ordersJson.data.length > 0) {
            const backendOrders: Order[] = ordersJson.data.map((o: any) => ({
              id: String(o.id),
              buyerId: String(o.buyer_id),
              buyerName: '',
              sellerId: String(o.seller_id),
              sellerName: '',
              listingId: String(o.product_id || ''),
              listingTitle: o.listing_title || 'Order',
              listingImage: o.listing_image || '',
              price: o.unit_price || 0,
              totalAmount: o.total_amount || 0,
              status: (o.status as Order['status']) || 'escrow_held',
              escrowStatus: (o.escrow_status as Order['escrowStatus']) || 'held',
              trackingNumber: o.tracking_number || '',
              shippingAddress: o.shipping_address || '',
              createdAt: o.create_date_time || 'Just now',
            }));
            setOrders(prev => {
              const map = new Map<string, Order>();
              backendOrders.forEach(o => map.set(o.id, o));
              prev.forEach(o => {
                if (!map.has(o.id)) map.set(o.id, o);
              });
              return Array.from(map.values());
            });
          }
        } catch {
          // silent order poll error
        }
      } catch {
        // silent polling catch
      }
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [isLoggedIn, currentUser?.id, users, refreshNetworkRequests]);

  const handleUpgradeTier = async () => {
    await startPayment({
      amount: 29.00,
      purpose: 'Upgrade to PRO Seller ($29/mo)',
      callbackInfo: {
        user_id: currentUser.id,
        user_email: currentUser.email,
        action: 'upgrade_premium',
        plan: 'seller_premium',
      },
    });

    const updatedUser: User = {
      ...currentUser,
      role: 'seller_premium',
      subscriptionStatus: 'premium',
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: updatedUser.id,
      type: 'order',
      title: '🌟 Upgraded to Seller Premium Tier!',
      body: 'You now enjoy Priority "Sell to Us" queue, Custom Storefront URL, and 0% Escrow Fee perks.',
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLikePost = async (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));

    try {
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;
      const cleanPostId = postId.replace(/\D/g, '') || postId;

      const res = await fetch(`/api/posts/${cleanPostId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: numUserId }),
      });

      if (res.ok) {
        const data = await res.json();
        const finalLiked = typeof data.is_loved === 'boolean' ? data.is_loved : true;
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: finalLiked } : p));

        const likedKey = `bizsocial_liked_post_ids_${currentUser.id}`;
        try {
          const stored: string[] = JSON.parse(localStorage.getItem(likedKey) || '[]');
          let updated: string[];
          if (finalLiked) {
            updated = Array.from(new Set([...stored, String(postId)]));
          } else {
            updated = stored.filter(id => id !== String(postId));
          }
          localStorage.setItem(likedKey, JSON.stringify(updated));
        } catch {}
      }
    } catch (err) {
      console.warn('[Like] Backend react error:', err);
    }
  };

  const handleCommentPost = async (postId: string, text: string) => {
    const tempCommentId = `c_${Date.now()}`;
    const newComment: AppComment = {
      id: tempCommentId,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));

    try {
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;
      const cleanPostId = postId.replace(/\D/g, '') || postId;

      const res = await fetch(`/api/posts/${cleanPostId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: numUserId,
          comment: text,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.id) {
          const realCommentId = String(json.data.id);
          setPosts(prev => prev.map(p => {
            if (p.id === postId && p.comments) {
              return {
                ...p,
                comments: p.comments.map(c => c.id === tempCommentId ? { ...c, id: realCommentId } : c)
              };
            }
            return p;
          }));
        }
      }
    } catch (err) {
      console.warn('[Comment] Backend comment error:', err);
    }
  };

  const handleSubmitDirectOffer = (offerData: {
    title: string;
    category: MarketplaceCategory;
    condition: ProductCondition;
    expectedPrice: number;
    description: string;
    images: string[];
    location: string;
  }) => {
    const newOffer: DirectOffer = {
      id: `offer_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isPremiumSeller: currentUser.role === 'seller_premium',
      title: offerData.title,
      category: offerData.category,
      condition: offerData.condition,
      expectedPrice: offerData.expectedPrice,
      description: offerData.description,
      images: offerData.images.length > 0 ? offerData.images : ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'],
      location: offerData.location,
      status: 'submitted',
      history: [
        {
          status: 'submitted',
          timestamp: 'Just now',
          note: 'Direct offer submitted to Buy Desk queue.'
        }
      ],
      createdAt: 'Just now',
      expiresAt: 'In 7 days'
    };

    setOffers(prev => [newOffer, ...prev]);
    setShowSellToUsModal(false);
    handleTabChange('sell_to_us');
  };

  const handleCreateListing = async (listingData: Partial<Listing>) => {
    const tempId = `listing_${Date.now()}`;
    const newListing: Listing = {
      id: tempId,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      category: listingData.category || 'new_products',
      storeCategory: listingData.storeCategory || 'General Collection',
      condition: 'new',
      price: listingData.price || 99,
      discountPercent: listingData.discountPercent,
      originalPrice: listingData.originalPrice,
      variants: listingData.variants,
      features: listingData.features,
      optionSections: listingData.optionSections,
      rentalPeriod: listingData.rentalPeriod,
      wholesaleMinQty: listingData.wholesaleMinQty,
      images: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      location: currentUser.location || 'New York, USA',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      isFeatured: false,
      likesCount: 0,
      viewsCount: 1,
      status: 'active',
      tags: listingData.tags || ['#business', '#product'],
      createdAt: 'Just now',
      stockQty: listingData.stockQty || 10
    };

    if (newListing.storeCategory && newListing.storeCategory !== 'General Collection') {
      const addedCat = newListing.storeCategory;
      setCurrentUser(prev => {
        const updatedCats = Array.from(new Set([...(prev.customCategories || []), addedCat]));
        const updatedUser = { ...prev, customCategories: updatedCats };
        try {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        } catch {}
        return updatedUser;
      });
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, customCategories: Array.from(new Set([...(u.customCategories || []), addedCat])) };
        }
        return u;
      }));
    }

    setListings(prev => [newListing, ...prev]);
    setShowCreateListingModal(false);

    try {
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;

      const payload = {
        user_id: numUserId,
        title: newListing.title,
        description: newListing.description,
        price: newListing.price,
        discount_rate: newListing.discountPercent || 0,
        images: newListing.images || [],
        marketplace_category: newListing.category,
        store_category: newListing.storeCategory,
        variants: (newListing.variants || []).map(v => ({
          name: v.name,
          price: v.priceDelta || 0,
          qty: v.stockQty || 1,
          is_default: v.isDefault || false,
        })),
        option_sections: (newListing.optionSections || []).map(sec => ({
          name: sec.title,
          require: sec.isRequired || false,
          sub_sections: [
            {
              name: "Standard Choices",
              options: (sec.items || []).map(o => ({
                name: o.name,
                price: o.priceDelta || 0,
                is_default: o.isDefault || false,
              }))
            }
          ]
        })),
        keywords: (newListing.tags || []).map(t => t.replace('#', '').trim()).filter(Boolean)
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.id) {
          const realProduct = mapBackendProductToListing(json.data, users);
          setListings(prev => prev.map(l => l.id === tempId ? { ...realProduct, images: newListing.images } : l));
        }
      }
    } catch (err) {
      console.warn('[ProductCreate] Backend create error:', err);
    }
  };

  const handleCreatePost = async (postData: Partial<Post>) => {
    let taggedTitle = postData.listingTitle;
    let taggedPrice = postData.listingPrice;
    if (postData.listingId && (!taggedTitle || !taggedPrice)) {
      const foundListing = listings.find(l => l.id === postData.listingId);
      if (foundListing) {
        taggedTitle = foundListing.title;
        taggedPrice = foundListing.price;
      }
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      content: postData.content || '',
      mediaUrls: postData.mediaUrls || [],
      mediaItems: postData.mediaItems || (postData.mediaUrls?.map(u => ({ url: u, type: 'image' })) || []),
      postType: postData.postType || 'update',
      listingId: postData.listingId,
      listingTitle: taggedTitle,
      listingPrice: taggedPrice,
      promoBadge: postData.promoBadge,
      callToAction: postData.callToAction,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: postData.hashtags || ['#BizSocial'],
      createdAt: 'Just now'
    };

    setPosts(prev => {
      const updated = [newPost, ...prev];
      try {
        const userOnlyPosts = updated.filter(p => p.sellerId === currentUser.id);
        localStorage.setItem('bizsocial_saved_posts', JSON.stringify(userOnlyPosts));
      } catch (e) {}
      return updated;
    });
    setShowCreatePostModal(false);

    try {
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;

      const resolvedMediaItems = await Promise.all(
        (postData.mediaItems || []).map(async (m) => {
          if (!m.url.startsWith('data:') && m.url.startsWith('http')) {
            return m;
          }
          try {
            const uploadRes = await fetch('/api/posts/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file_input: m.url, media_type: m.type || 'image' }),
            });
            if (uploadRes.ok) {
              const uploadJson = await uploadRes.json();
              if (uploadJson.data?.secure_url || uploadJson.data?.SecureURL) {
                const cdnUrl = uploadJson.data?.secure_url || uploadJson.data?.SecureURL;
                setPosts(prev => prev.map(p =>
                  p.id === newPost.id
                    ? {
                        ...p,
                        mediaUrls: p.mediaUrls.map(u => u === m.url ? cdnUrl : u),
                        mediaItems: (p.mediaItems || []).map(mi => mi.url === m.url ? { ...mi, url: cdnUrl } : mi),
                      }
                    : p
                ));
                return { url: cdnUrl, type: m.type };
              }
            }
          } catch (uploadErr) {}
          return m;
        })
      );

      const mediaPayload = resolvedMediaItems.map(m => ({
        media_url: m.url,
        media_type: m.type || 'image',
      }));

      if (mediaPayload.length === 0 && postData.mediaUrls && postData.mediaUrls.length > 0) {
        postData.mediaUrls.forEach(url => {
          mediaPayload.push({ media_url: url, media_type: 'image' });
        });
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: numUserId,
          caption: postData.content || '',
          media: mediaPayload,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.id) {
          const backendPost = mapBackendPostToFrontend(json.data, users, currentUser);
          const mergedPost: Post = {
            ...backendPost,
            mediaUrls: backendPost.mediaUrls.length > 0 ? backendPost.mediaUrls : newPost.mediaUrls,
            mediaItems: backendPost.mediaItems.length > 0 ? backendPost.mediaItems : newPost.mediaItems,
            sellerName: currentUser.name,
            sellerAvatar: currentUser.avatar,
          };

          setPosts(prev => {
            const replaced = prev.map(p => p.id === newPost.id ? mergedPost : p);
            try {
              const userOnlyPosts = replaced.filter(p => p.sellerId === currentUser.id);
              localStorage.setItem('bizsocial_saved_posts', JSON.stringify(userOnlyPosts));
            } catch {}
            return replaced;
          });
        }
      }
    } catch (err) {
      console.warn('Backend /api/posts endpoint offline:', err);
    }
  };

  const handleCreateStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      isVerifiedSeller: currentUser.isVerified,
      mediaUrl,
      caption,
      expiresAt: '24 hours',
      createdAt: 'Just now',
      viewCount: 1
    };

    setStories(prev => [newStory, ...prev]);
    setShowCreateStoryModal(false);
  };

  const handleBuyNowOrder = async (
    listing: Listing,
    shippingAddress: string,
    selectedOptions?: {
      variant?: any;
      selectedFeatures?: any[];
      quantity?: number;
      finalPrice?: number;
    }
  ) => {
    const qty = selectedOptions?.quantity || 1;
    const finalPrice = selectedOptions?.finalPrice || listing.price;
    const totalAmount = Number((finalPrice + 4.50).toFixed(2));

    // Start payment — backend will create the order row when the callback fires
    await startPayment({
      amount: totalAmount,
      purpose: `Order: ${listing.title} (x${qty})`,
      sellerId: listing.sellerId,
      callbackInfo: {
        user_id: currentUser.id,
        buyer_name: currentUser.name,
        action: 'buy_product',
        listing_id: listing.id,
        listing_title: listing.title,
        seller_id: listing.sellerId,
        quantity: qty,
        final_price: finalPrice,
        shipping_address: shippingAddress || '123 Business Way, Suite 400, NY',
      },
    });

    // Close the listing detail — order will appear after the next polling cycle
    setSelectedListing(null);
    handleTabChange('orders');
  };

  const handleConfirmReceipt = async (orderId: string) => {
    // Optimistic update in UI
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'buyer_confirmed', escrowStatus: 'released' };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);

    // Call backend to persist the escrow release
    try {
      const numericId = orderId.replace(/\D/g, '') || orderId;
      await fetch(
        API_CONFIG.resolveUrl(API_CONFIG.ENDPOINTS.ORDERS.CONFIRM_RECEIPT(numericId)),
        { method: 'PUT' }
      );
    } catch (err) {
      console.warn('[ConfirmReceipt] Backend update failed:', err);
    }

    // Notify seller
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetOrder?.sellerId || currentUser.id,
      type: 'order',
      title: 'Escrow Payout Released! 🎉',
      body: `Buyer confirmed receipt for order #${orderId}. Funds of $${targetOrder?.totalAmount?.toFixed(2) || '0.00'} have been released to your payout balance.`,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDeleteListing = async (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
    try {
      const cleanId = listingId.replace(/\D/g, '') || listingId;
      await fetch(`/api/products/${cleanId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[ProductDelete] Backend delete error:', err);
    }
  };

  const handleUpdateListing = async (listingId: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, ...updates } : l));

    try {
      const cleanId = listingId.replace(/\D/g, '') || listingId;
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;
      const payload = {
        user_id: numUserId,
        title: updates.title,
        description: updates.description,
        price: updates.price,
        discount_rate: updates.discountPercent || 0,
        images: updates.images || [],
        marketplace_category: updates.category,
        store_category: updates.storeCategory,
        variants: (updates.variants || []).map(v => ({
          name: v.name,
          price: v.priceDelta || 0,
          qty: v.stockQty || 1,
          is_default: v.isDefault || false,
        })),
        option_sections: (updates.optionSections || []).map(sec => ({
          name: sec.title,
          require: sec.isRequired || false,
          sub_sections: [
            {
              name: 'Standard Choices',
              options: (sec.items || []).map(o => ({
                name: o.name,
                price: o.priceDelta || 0,
                is_default: o.isDefault || false,
              }))
            }
          ]
        })),
        keywords: (updates.tags || []).map(t => t.replace('#', '').trim()).filter(Boolean)
      };

      const res = await fetch(`/api/products/${cleanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.id) {
          const updated = mapBackendProductToListing(json.data, users);
          setListings(prev => prev.map(l => l.id === listingId ? updated : l));
        }
      }
    } catch (err) {
      console.warn('[ProductUpdate] Backend update error:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts(prev => {
      const remaining = prev.filter(p => p.id !== postId);
      try {
        const userOnlyPosts = remaining.filter(p => p.sellerId === currentUser.id);
        localStorage.setItem('bizsocial_saved_posts', JSON.stringify(userOnlyPosts));
      } catch {}
      return remaining;
    });

    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[PostDelete] Backend delete error:', err);
    }
  };

  const handleToggleUserBan = (userId: string) => {
    console.warn('[Admin] Security sanction applied for user:', userId);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleToggleUserVerification = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
  };

  const handleUpdateDisputeStatus = (disputeId: string, status: Dispute['status']) => {
    setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status } : d));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], newEscrowStatus?: Order['escrowStatus']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          escrowStatus: newEscrowStatus || o.escrowStatus
        };
      }
      return o;
    }));
  };

  const handleUpdateOfferStatus = (offerId: string, newStatus: DirectOfferStatus, counterPrice?: number, note?: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: newStatus,
          counterPrice: counterPrice !== undefined ? counterPrice : o.counterPrice,
          adminNotes: note || o.adminNotes,
          history: [
            ...o.history,
            {
              status: newStatus,
              timestamp: 'Just now',
              note: note || `Status updated to ${newStatus}`
            }
          ]
        };
      }
      return o;
    }));
  };

  const handleAcceptCounterOffer = (offerId: string) => {
    handleUpdateOfferStatus(offerId, 'accepted', undefined, 'Seller accepted Buy Desk counter offer! Payout initiated to escrow.');
  };

  const handleAutoListPublic = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    handleCreateListing({
      title: offer.title,
      description: offer.description,
      category: offer.category,
      condition: offer.condition,
      price: offer.counterPrice || offer.expectedPrice,
      images: offer.images,
      location: offer.location,
      tags: ['#auto_listed', '#sell_to_us_converted']
    });

    handleUpdateOfferStatus(offerId, 'auto_listed_public', undefined, 'Offer converted to public marketplace listing with 0% fee.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        isAuthChecking,
        showOnboarding,
        setShowOnboarding,
        isDataLoading,
        setIsDataLoading,
        users,
        setUsers,
        listings,
        setListings,
        posts,
        setPosts,
        stories,
        setStories,
        offers,
        setOffers,
        orders,
        setOrders,
        conversations,
        setConversations,
        messages,
        setMessages,
        notifications,
        setNotifications,
        reviews,
        setReviews,
        disputes,
        setDisputes,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        showSellToUsModal,
        setShowSellToUsModal,
        showCreateListingModal,
        setShowCreateListingModal,
        showCreatePostModal,
        setShowCreatePostModal,
        showCreateStoryModal,
        setShowCreateStoryModal,
        showCreateQuoteModal,
        setShowCreateQuoteModal,
        showMessagesModal,
        setShowMessagesModal,
        showNotificationsModal,
        setShowNotificationsModal,
        showLeftDrawer,
        setShowLeftDrawer,
        showRightDrawer,
        setShowRightDrawer,
        selectedListing,
        setSelectedListing,
        selectedStory,
        setSelectedStory,
        selectedSellerId,
        setSelectedSellerId,
        activeChatSellerId,
        setActiveChatSellerId,
        unreadNotificationsCount,
        unreadMessagesCount,
        escrowOrdersCount,
        incomingNetworkRequests,
        handleAcceptNetworkRequest,
        handleRejectNetworkRequest,
        handleTabChange,
        handleOpenSellerProfile,
        handleCloseSellerProfile,
        handleOpenListingDetail,
        handleCloseListingDetail,
        handleOpenChat,
        handleCloseChat,
        handleToggleMessages,
        handleToggleNotifications,
        handleMarkConversationRead,
        handleMarkAllNotificationsRead,
        handleSendMessageInState,
        handleLogin,
        handleLogout,
        handleUpgradeTier,
        handleLikePost,
        handleCommentPost,
        handleDeletePost,
        handleCreatePost,
        handleCreateStory,
        handleCreateListing,
        handleUpdateListing,
        handleDeleteListing,
        handleBuyNowOrder,
        handleConfirmReceipt,
        handleSubmitDirectOffer,
        handleUpdateOfferStatus,
        handleAcceptCounterOffer,
        handleAutoListPublic,
        handleUpdateOrderStatus,
        handleUpdateDisputeStatus,
        handleToggleUserVerification,
        handleUpdateUserRole,
        handleToggleUserBan,
        fetchBackendPosts,
        fetchBackendProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
