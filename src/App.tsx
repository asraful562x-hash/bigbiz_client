'use client';

import React, { useState, useEffect } from 'react';
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
  PostType
} from './types';

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
  INITIAL_DISPUTES, 
  INITIAL_ANALYTICS 
} from './data/mockData';

import { Header } from './components/Header';
import { FeedView } from './components/FeedView';
import { MarketplaceView } from './components/MarketplaceView';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OrdersView } from './components/OrdersView';
import { SellToUsModal } from './components/SellToUsModal';
import { SellToUsTracker } from './components/SellToUsTracker';
import { CreateListingModal } from './components/CreateListingModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { StoryViewModal } from './components/StoryViewModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SellerProfileModal } from './components/SellerProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginPage } from './components/LoginPage';
import { SettingsPrivacyView } from './components/SettingsPrivacyView';
import { HelpSupportView } from './components/HelpSupportView';
import { LeftBusinessSidebar } from './components/LeftBusinessSidebar';
import { RightBusinessSidebar } from './components/RightBusinessSidebar';
import { CreateQuoteModal } from './components/CreateQuoteModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DirectMessagesView } from './components/DirectMessagesView';
import { SplashScreen } from './components/SplashScreen';

import { 
  Store, 
  Newspaper, 
  Handshake, 
  LayoutDashboard, 
  ShoppingBag, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Bell, 
  UserCheck, 
  TrendingUp, 
  Tag, 
  Building2, 
  DollarSign, 
  Clock, 
  MessageSquare,
  X,
  Menu
} from 'lucide-react';

// ─── Debug / Splash Animation Configuration ──────────────────────────────────────
// When debug = true: Fast dev mode (splash screen dismisses quickly, ~150ms).
// When debug = false: Full animation mode (splash screen plays for at least 1 complete animation cycle, ~1400ms).
export const debug = false;

export default function App() {
  // Authentication State — STRICT AUTH GUARD & Splash Screen Handling
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // App Global State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[2]); // Default fallback
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

  // View Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels State
  const [showSellToUsModal, setShowSellToUsModal] = useState<boolean>(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState<boolean>(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState<boolean>(false);
  const [showMessagesModal, setShowMessagesModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showCreateQuoteModal, setShowCreateQuoteModal] = useState<boolean>(false);
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [activeChatSellerId, setActiveChatSellerId] = useState<string | null>(null);

  // Unread Counters
  const unreadNotificationsCount = notifications.filter(n => !n.isRead && n.userId === currentUser.id).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const escrowOrdersCount = orders.filter(o => o.escrowStatus === 'held').length;

  // Helper to read a cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Helper to check if user has completed basic onboarding (name, email, and company if merchant)
  const isUserProfileComplete = (user: User | null | undefined): boolean => {
    if (!user) return false;
    
    // Required: Name and Email must not be null/empty
    const hasValidName = Boolean(user.name && user.name.trim().length > 0 && user.name !== 'undefined');
    const hasValidEmail = Boolean(user.email && user.email.includes('@'));
    
    // For business seller accounts: companyName is required if role is seller
    const isSeller = user.role === 'seller_free' || user.role === 'seller_premium';
    const hasValidCompany = isSeller ? Boolean(user.companyName && user.companyName.trim().length > 0 && user.companyName !== 'undefined') : true;

    // If name, email, or company (for seller) is missing/null/empty => return false (show onboarding)
    return Boolean(hasValidName && hasValidEmail && hasValidCompany);
  };

  // Helper to save auth tokens to both localStorage and cookie
  const saveAuthSession = (user: User, token?: string) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
    localStorage.setItem('auth_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);

    // Onboarding is shown ONLY IF necessary profile columns/fields are missing
    if (!isUserProfileComplete(user)) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  };

  // Helper to map backend Post model from /api/posts to frontend Post interface
  const mapBackendPostToFrontend = (bp: any, allUsers: User[], currentLoggedInUser?: User): Post => {
    const authorUser = allUsers.find(u => u.id === String(bp.user_id) || u.email === bp.user?.email) || (
      bp.user ? {
        id: String(bp.user.id),
        name: bp.user.full_name || 'Business Member',
        username: bp.user.email ? bp.user.email.split('@')[0] : 'member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        isVerified: true,
      } : null
    );

    const isCurrent = currentLoggedInUser && (
      String(bp.user_id) === String(currentLoggedInUser.id) ||
      bp.user?.email === currentLoggedInUser.email ||
      String(bp.user_id) === '1' ||
      String(bp.user_id) === '2'
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

    return {
      id: String(bp.id),
      sellerId: isCurrent && currentLoggedInUser ? currentLoggedInUser.id : String(bp.user_id || '1'),
      sellerName: isCurrent && currentLoggedInUser ? currentLoggedInUser.name : (authorUser?.name || bp.user?.full_name || 'Business Member'),
      sellerAvatar: isCurrent && currentLoggedInUser ? currentLoggedInUser.avatar : (authorUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
      isVerifiedSeller: authorUser?.isVerified ?? true,
      content: bp.caption || bp.content || '',
      mediaUrls,
      mediaItems,
      postType: (bp.post_format as PostType) || 'update',
      listingId: bp.listing_id,
      promoBadge: bp.promo_badge,
      callToAction: bp.call_to_action,
      likesCount: bp.reacts ? bp.reacts.length : (bp.likes_count || 0),
      isLiked: false,
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

  // Function to fetch live posts from backend database and merge with demo posts
  const fetchBackendPosts = async (allUsers: User[] = users, currentLoggedInUser: User = currentUser) => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const json = await res.json();
        const rawPosts = json.data || (Array.isArray(json) ? json : []);
        if (Array.isArray(rawPosts) && rawPosts.length > 0) {
          const mappedBackendPosts = rawPosts.map((bp: any) => mapBackendPostToFrontend(bp, allUsers, currentLoggedInUser));
          
          setPosts(prev => {
            // Keep existing demo posts, but place newly fetched backend posts at the top
            const existingIds = new Set(mappedBackendPosts.map(p => p.id));
            const remainingDemoPosts = prev.filter(p => !existingIds.has(p.id));
            return [...mappedBackendPosts, ...remainingDemoPosts];
          });
          return;
        }
      }
    } catch (err) {
      console.warn('[PostSync] Backend /api/posts fetch error:', err);
    }

    // Fallback: check localStorage for saved user posts
    try {
      const cached = localStorage.getItem('bizsocial_saved_posts');
      if (cached) {
        const cachedPosts: Post[] = JSON.parse(cached);
        if (Array.isArray(cachedPosts) && cachedPosts.length > 0) {
          setPosts(prev => {
            const cachedIds = new Set(cachedPosts.map(p => p.id));
            const filtered = prev.filter(p => !cachedIds.has(p.id));
            return [...cachedPosts, ...filtered];
          });
        }
      }
    } catch (e) {
      console.warn('[PostSync] localStorage cache read error:', e);
    }
  };

  // Handlers
  const handleLogin = (user: User, token?: string) => {
    saveAuthSession(user, token);
    setActiveTab('feed');
    fetchBackendPosts(users, user);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    setIsLoggedIn(false);
    setShowOnboarding(false);
    setActiveTab('feed');
  };

  // Auth Guard & URL / OAuth callback checking on mount
  useEffect(() => {
    // 1. Detect OAuth Login callback redirect from Go backend
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
          role: (() => {
            if (roleType === 'buyer_premium') return 'buyer_premium';
            if (roleType === 'buyer_free' || roleType === 'buyer') return 'buyer_free';
            if (roleType === 'seller_free') return 'seller_free';
            if (roleType === 'seller_premium' || roleType === 'seller') return 'seller_premium';
            if (roleType === 'admin') return 'admin';
            if (roleType === 'moderator') return 'moderator';
            if (roleType === 'procurement') return 'procurement';
            return 'buyer_free' as UserRole;
          })(),
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
        // Clean URL params without page reload
        window.history.replaceState({}, document.title, window.location.pathname);
        const splashDelay = debug ? 150 : 1400;
        setTimeout(() => setIsAuthChecking(false), splashDelay);
        return;
      }
    }

    // 2. Dual-Storage Auth Verification: Check localStorage OR Cookie
    const storedToken = localStorage.getItem('auth_token') || getCookie('auth_token');
    const storedUserStr = localStorage.getItem('auth_user');

    // Dynamic Backend Database Sync — fetch live users, then cross-check stored session
    fetch('/api/users')
      .then(res => res.ok ? res.json() : null)
      .then((data: User[] | null) => {
        const liveUsers: User[] = Array.isArray(data) && data.length > 0 ? data : INITIAL_USERS;
        setUsers(liveUsers);

        if (storedToken && storedUserStr) {
          try {
            const storedUser: User = JSON.parse(storedUserStr);

            // Check if session is valid (OAuth user, registered user with token, or valid demo user)
            const isOAuthSession = Boolean(storedUser.id?.startsWith('oauth-') || storedToken?.startsWith('oauth_') || storedToken?.length > 20);
            const isDemoUser = Boolean(storedUser.id?.startsWith('usr_'));
            const userStillExists = liveUsers.some(u => u.id === storedUser.id || u.email === storedUser.email);

            if (isDemoUser && !userStillExists) {
              console.warn(`[Auth] Demo user '${storedUser.id}' no longer in DB — logging out.`);
              handleLogout();
              return;
            }

            // Valid session (OAuth or existing user)
            setCurrentUser(storedUser);
            setIsLoggedIn(true);

            // Add OAuth user to live user list if not already present
            if (!userStillExists) {
              setUsers(prev => [storedUser, ...prev]);
            }

            // Show onboarding only if required profile columns are missing
            setShowOnboarding(!isUserProfileComplete(storedUser));
          } catch {
            console.error('Failed to parse stored user session');
            handleLogout();
          }
        } else {
          setIsLoggedIn(false);
        }
        // Fetch live posts from PostgreSQL backend
        fetchBackendPosts(liveUsers, storedUserStr ? JSON.parse(storedUserStr) : undefined);
      })
      .catch(() => {
        // Backend offline — restore session from localStorage without DB cross-check
        if (storedToken && storedUserStr) {
          try {
            const storedUser: User = JSON.parse(storedUserStr);
            setCurrentUser(storedUser);
            setIsLoggedIn(true);
            setShowOnboarding(!isUserProfileComplete(storedUser));
            fetchBackendPosts(INITIAL_USERS, storedUser);
          } catch {
            handleLogout();
          }
        } else {
          setIsLoggedIn(false);
        }
      });

    const splashDelay = debug ? 150 : 1400;
    setTimeout(() => setIsAuthChecking(false), splashDelay);
  }, []);

  const handleUpgradeTier = () => {
    const updatedUser: User = {
      ...currentUser,
      role: 'seller_premium',
      subscriptionStatus: 'premium'
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    // Add confirmation notification
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

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  const handleCommentPost = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
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
    setActiveTab('sell_to_us');
  };

  const handleCreateListing = (listingData: Partial<Listing>) => {
    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      category: listingData.category || 'new_products',
      storeCategory: listingData.storeCategory || 'General Collection',
      condition: listingData.condition || 'new',
      price: listingData.price || 99,
      originalPrice: listingData.originalPrice,
      variants: listingData.variants,
      features: listingData.features,
      optionSections: listingData.optionSections,
      rentalPeriod: listingData.rentalPeriod,
      wholesaleMinQty: listingData.wholesaleMinQty,
      images: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      location: listingData.location || currentUser.location || 'New York, USA',
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

    setListings(prev => [newListing, ...prev]);
    setShowCreateListingModal(false);
  };

  const handleCreatePost = async (postData: Partial<Post>) => {
    // Resolve tagged listing details if listingId is provided
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

    // Optimistic UI update
    setPosts(prev => {
      const updated = [newPost, ...prev];
      try {
        const userOnlyPosts = updated.filter(p => p.sellerId === currentUser.id);
        localStorage.setItem('bizsocial_saved_posts', JSON.stringify(userOnlyPosts));
      } catch (e) {
        console.warn('localStorage post cache error:', e);
      }
      return updated;
    });
    setShowCreatePostModal(false);

    // Persist to PostgreSQL backend via Go /api/posts endpoint
    try {
      const numUserId = parseInt(currentUser.id.replace(/\D/g, ''), 10) || 1;
      const mediaPayload = (postData.mediaItems || []).map(m => ({
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
          setPosts(prev => {
            const replaced = prev.map(p => p.id === newPost.id ? backendPost : p);
            try {
              const userOnlyPosts = replaced.filter(p => p.sellerId === currentUser.id);
              localStorage.setItem('bizsocial_saved_posts', JSON.stringify(userOnlyPosts));
            } catch {}
            return replaced;
          });
        }
      }
    } catch (err) {
      console.warn('Backend /api/posts endpoint offline or unreachable:', err);
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

  const handleOpenChat = (sellerId: string) => {
    setActiveChatSellerId(sellerId);
    setShowMessagesModal(true);
  };

  const handleBuyNowOrder = (
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
    const variantText = selectedOptions?.variant?.name ? ` [${selectedOptions.variant.name}]` : '';
    const featuresText = selectedOptions?.selectedFeatures && selectedOptions.selectedFeatures.length > 0 
      ? ` + (${selectedOptions.selectedFeatures.map(f => f.name).join(', ')})` 
      : '';

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      listingId: listing.id,
      listingTitle: `${listing.title} (x${qty})${variantText}${featuresText}`,
      listingImage: listing.images[0],
      price: finalPrice / qty,
      totalAmount: finalPrice + 4.50,
      status: 'escrow_held',
      escrowStatus: 'held',
      trackingNumber: `TRK${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingAddress: shippingAddress || '123 Business Way, Suite 400, NY',
      createdAt: 'Just now'
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedListing(null);
    setActiveTab('orders');
  };

  const handleConfirmReceipt = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'buyer_confirmed',
          escrowStatus: 'released'
        };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetOrder?.sellerId || currentUser.id,
      type: 'order',
      title: 'Escrow Payout Released! 🎉',
      body: `Buyer confirmed receipt for order #${orderId}. Funds of $${targetOrder?.totalAmount.toFixed(2) || '0.00'} have been released to your payout balance.`,
      isRead: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
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
    // In a real app this would flag the user as banned in the database.
    // For the demo, we just log it — a production implementation would
    // add a `isBanned` flag to the User type and filter them from listings/posts.
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

  const handleSendMessageInState = (convId: string, text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      isRead: true,
      createdAt: 'Just now'
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, lastMessage: text, lastMessageTime: 'Just now' } : c));
  };

  // 1. WHILE INITIALIZING/CHECKING AUTH: Render Splash Page (no flash of login screen)
  if (isAuthChecking) {
    return <SplashScreen />;
  }

  // 2. IF NOT LOGGED IN: Render Stunning Business Social Media Login Page!
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Full-screen pages (Settings & Help) hide sidebars and nav tabs
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const isFullScreenTab = activeTab === 'settings' || activeTab === 'help' || (isAdmin && activeTab === 'admin');

  return (
    <div className="h-screen overflow-hidden bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      
      {/* Main Header Component */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={unreadMessagesCount}
        escrowOrdersCount={escrowOrdersCount}
        onOpenCreateModal={() => setShowCreateListingModal(true)}
        onOpenSellToUs={() => setShowSellToUsModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(prev => !prev)}
        isNotificationsOpen={showNotificationsModal}
        onOpenMessages={() => setShowMessagesModal(prev => !prev)}
        isMessagesOpen={showMessagesModal}
        onUpgradeTier={handleUpgradeTier}
        onLogout={handleLogout}
        onOpenProfile={(id) => setSelectedSellerId(id)}
        notifications={notifications}
        onMarkAllNotificationsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
        conversations={conversations}
        messages={messages}
        onSendMessage={handleSendMessageInState}
        onOpenLeftDrawer={() => setShowLeftDrawer(true)}
        onOpenRightDrawer={() => setShowRightDrawer(true)}
        isFullScreen={isFullScreenTab}
      />

      {/* ── Left Sidebar Drawer (slides in from left on < 1300px) ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setShowLeftDrawer(false)}
        className={`min-[1300px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showLeftDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Drawer Panel */}
      <div
        className={`min-[1300px]:hidden fixed top-0 left-0 h-full w-[340px] sm:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showLeftDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-md">
              B
            </div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">BizSocial</span>
          </div>
          <button
            onClick={() => setShowLeftDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Drawer Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <LeftBusinessSidebar
            currentUser={currentUser}
            activeTab={activeTab}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { setSelectedSellerId(id); setShowLeftDrawer(false); }}
            onOpenSettings={() => { setActiveTab('settings'); setShowLeftDrawer(false); }}
            onOpenCreateModal={() => { setShowCreateListingModal(true); setShowLeftDrawer(false); }}
            onOpenSellToUs={() => { setShowSellToUsModal(true); setShowLeftDrawer(false); }}
            onOpenCreateQuote={() => { setShowCreateQuoteModal(true); setShowLeftDrawer(false); }}
            onUpgradeTier={handleUpgradeTier}
          />
        </div>
      </div>

      {/* ── Right Sidebar Drawer (slides in from right on <= 880px) ───────── */}
      {/* Backdrop */}
      <div
        onClick={() => setShowRightDrawer(false)}
        className={`min-[881px]:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          showRightDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* Right Drawer Panel */}
      <div
        className={`min-[881px]:hidden fixed top-0 right-0 h-full w-[360px] sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          showRightDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <span className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Market Insights & Activity
          </span>
          <button
            onClick={() => setShowRightDrawer(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close activity sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Drawer Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <RightBusinessSidebar
            users={users}
            offers={offers}
            listings={listings}
            activeTab={activeTab}
            currentUser={currentUser}
            isInDrawer={true}
            onOpenSellerProfile={(id) => { setSelectedSellerId(id); setShowRightDrawer(false); }}
            onOpenListingDetail={(listing) => { setSelectedListing(listing); setShowRightDrawer(false); }}
            onOpenSellToUs={() => { setShowSellToUsModal(true); setShowRightDrawer(false); }}
            onOpenChat={(id) => { handleOpenChat(id); setShowRightDrawer(false); }}
          />
        </div>
      </div>

      {/* Page Content Layout */}
        <div className={`flex-1 overflow-hidden w-full mx-auto pt-2 pb-2 h-full ${
          isAdmin && activeTab === 'admin'
            ? 'max-w-full px-0'
            : 'max-w-[1800px] px-2.5 sm:px-6 lg:px-8'
        }`}>
          <div className={`${isFullScreenTab ? 'flex flex-col h-full' : 'flex flex-col min-[881px]:flex-row min-[1300px]:grid min-[1300px]:grid-cols-10 gap-4 sm:gap-5 h-full'}`}>
            
            {/* LEFT SIDEBAR — hidden on Settings/Help full-screen pages */}
            {!isFullScreenTab && (
              <div className="min-[1300px]:col-span-3 hidden min-[1300px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
                <LeftBusinessSidebar
                  currentUser={currentUser}
                  activeTab={activeTab}
                  onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                  onOpenSettings={() => setActiveTab('settings')}
                  onOpenCreateModal={() => setShowCreateListingModal(true)}
                  onOpenSellToUs={() => setShowSellToUsModal(true)}
                  onOpenCreateQuote={() => setShowCreateQuoteModal(true)}
                  onUpgradeTier={handleUpgradeTier}
                />
              </div>
            )}

            {/* CENTER CONTENT AREA */}
            <main className={`flex-1 min-w-0 min-h-0 h-full sidebar-scroll overflow-y-auto ${
              isFullScreenTab
                ? 'pb-8 w-full'
                : 'min-[1300px]:col-span-4 pb-16'
            }`}>
              
              {/* Tab content — animated on every switch */}
              <div key={activeTab} className={`animate-tab-switch h-full ${
                isFullScreenTab
                  ? (activeTab === 'admin'
                      ? 'max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8'
                      : 'max-w-5xl mx-auto px-0 sm:px-4')
                  : ''
              }`}>

                {activeTab === 'settings' && (
                  <SettingsPrivacyView 
                    currentUser={currentUser} 
                    allUsers={users}
                    onUpdateUser={(updated) => {
                      setCurrentUser(updated);
                      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                    }}
                  />
                )}

                {activeTab === 'help' && (
                  <HelpSupportView />
                )}

                {activeTab === 'feed' && (
                  <FeedView
                    currentUser={currentUser}
                    posts={posts}
                    stories={stories}
                    listings={listings}
                    onLikePost={handleLikePost}
                    onCommentPost={handleCommentPost}
                    onSelectListing={(l) => setSelectedListing(l)}
                    onOpenCreatePost={() => setShowCreatePostModal(true)}
                    onOpenCreateStory={() => setShowCreateStoryModal(true)}
                    onViewStory={(s) => setSelectedStory(s)}
                    onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                  />
                )}

                {activeTab === 'marketplace' && (
                  <MarketplaceView
                    currentUser={currentUser}
                    listings={listings}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectListing={(l) => setSelectedListing(l)}
                    onOpenSellToUs={() => setShowSellToUsModal(true)}
                    onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                  />
                )}

                {activeTab === 'sell_to_us' && (
                  <SellToUsTracker
                    currentUser={currentUser}
                    offers={offers}
                    onOpenNewOfferModal={() => setShowSellToUsModal(true)}
                    onAcceptCounter={handleAcceptCounterOffer}
                    onAutoListPublic={handleAutoListPublic}
                  />
                )}

                {activeTab === 'seller' && (
                  <SellerDashboard
                    currentUser={currentUser}
                    listings={listings}
                    orders={orders}
                    analytics={INITIAL_ANALYTICS}
                    onOpenCreateListing={() => setShowCreateListingModal(true)}
                    onUpgradeTier={handleUpgradeTier}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersView
                    currentUser={currentUser}
                    orders={orders}
                    onConfirmReceipt={handleConfirmReceipt}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onOpenChat={handleOpenChat}
                  />
                )}

                {activeTab === 'messages' && (
                  <DirectMessagesView
                    currentUser={currentUser}
                    conversations={conversations}
                    messages={messages}
                    initialSellerId={activeChatSellerId}
                    onSendMessage={handleSendMessageInState}
                    onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                  />
                )}

                {activeTab === 'procurement' && (
                  <ProcurementDashboard
                    currentUser={currentUser}
                    offers={offers}
                    onUpdateOfferStatus={handleUpdateOfferStatus}
                  />
                )}

                {activeTab === 'admin' && (
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
                )}

              </div>

            </main>

            {/* RIGHT SIDEBAR — hidden on Settings/Help full-screen pages */}
            {!isFullScreenTab && (
              <div className="w-full min-[881px]:w-[400px] min-[1100px]:w-[430px] min-[1300px]:w-auto min-[1300px]:col-span-3 shrink-0 hidden min-[881px]:block sidebar-scroll h-full pb-12 overflow-y-auto">
                <RightBusinessSidebar
                  users={users}
                  offers={offers}
                  listings={listings}
                  activeTab={activeTab}
                  currentUser={currentUser}
                  onOpenSellerProfile={(id) => setSelectedSellerId(id)}
                  onOpenListingDetail={(listing) => setSelectedListing(listing)}
                  onOpenSellToUs={() => setShowSellToUsModal(true)}
                  onOpenChat={handleOpenChat}
                />
              </div>
            )}


          </div>
        </div>

      {/* MODALS & OVERLAYS */}
      {showCreateQuoteModal && (
        <CreateQuoteModal
          currentUser={currentUser}
          users={users}
          onClose={() => setShowCreateQuoteModal(false)}
          onSubmitQuote={(title, amount, clientName, description, targetUserId) => {
            const contractId = `b2b_contract_${Date.now()}`;
            const targetUser = users.find(u => u.id === targetUserId || u.name === clientName) || {
              id: `client_${Date.now()}`,
              name: clientName,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'buyer' as UserRole
            };

            // 1. Create a real Escrow Order entry
            const newContractOrder: Order = {
              id: contractId,
              buyerId: targetUser.id,
              buyerName: clientName,
              sellerId: currentUser.id,
              sellerName: currentUser.name,
              listingId: contractId,
              listingTitle: `[B2B Contract] ${title}`,
              listingImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
              price: amount,
              totalAmount: amount,
              status: 'escrow_held',
              escrowStatus: 'held',
              shippingAddress: description ? `Scope: ${description}` : 'B2B Custom Milestones Escrow Deliverable',
              trackingNumber: `ESCROW-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
              createdAt: 'Just now'
            };
            setOrders(prev => [newContractOrder, ...prev]);

            // 2. Dispatch a message to the client thread
            const quoteMessage: Message = {
              id: `msg_quote_${Date.now()}`,
              conversationId: `conv_${currentUser.id}_${targetUser.id}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: `📋 Formal B2B Escrow Quote Sent: "${title}" for $${amount.toLocaleString()} USD.\n${description ? `\nScope: ${description}` : ''}\n\nFunds will be secured in BizSocial Escrow Vault upon milestone delivery.`,
              isRead: false,
              createdAt: 'Just now'
            };
            setMessages(prev => [...prev, quoteMessage]);

            // 3. Add Activity Notification
            const newNotification: AppNotification = {
              id: `notif-${Date.now()}`,
              userId: currentUser.id,
              type: 'offer_update',
              title: `B2B Escrow Quote Created for ${clientName}`,
              body: `Contract "${title}" ($${amount.toLocaleString()}) is now active in your Escrow Orders Tracker.`,
              isRead: false,
              createdAt: 'Just now'
            };
            setNotifications(prev => [newNotification, ...prev]);

            // 4. Navigate to Orders Tracker so the user sees the live contract
            setActiveTab('orders');
          }}
        />
      )}

      {/* 1. Listing Detail & Checkout Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          currentUser={currentUser}
          reviews={reviews}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleOpenChat}
          onBuyNow={handleBuyNowOrder}
          onOpenSellerProfile={(id) => setSelectedSellerId(id)}
        />
      )}

      {/* 2. Direct Offer "Sell to Us" Modal */}
      {showSellToUsModal && (
        <SellToUsModal
          currentUser={currentUser}
          onClose={() => setShowSellToUsModal(false)}
          onSubmitOffer={handleSubmitDirectOffer}
        />
      )}

      {/* 3. Create Listing Modal */}
      {showCreateListingModal && (
        <CreateListingModal
          currentUser={currentUser}
          onClose={() => setShowCreateListingModal(false)}
          onSubmitListing={handleCreateListing}
          onAddCategory={(newCat) => {
            setCurrentUser(prev => {
              const updatedCats = Array.from(new Set([...(prev.customCategories || []), newCat]));
              const updatedUser = { ...prev, customCategories: updatedCats };
              localStorage.setItem('auth_user', JSON.stringify(updatedUser));
              return updatedUser;
            });
            setUsers(prev => prev.map(u => {
              if (u.id === currentUser.id) {
                return { ...u, customCategories: Array.from(new Set([...(u.customCategories || []), newCat])) };
              }
              return u;
            }));
          }}
        />
      )}

      {/* 4. Create Social Feed Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          currentUser={currentUser}
          listings={listings}
          onClose={() => setShowCreatePostModal(false)}
          onSubmitPost={handleCreatePost}
        />
      )}

      {/* 5. Create 24hr Story Modal */}
      {showCreateStoryModal && (
        <CreateStoryModal
          currentUser={currentUser}
          onClose={() => setShowCreateStoryModal(false)}
          onSubmitStory={handleCreateStory}
        />
      )}

      {/* 6. Story Viewer Modal */}
      {selectedStory && (
        <StoryViewModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* 7. Seller Profile Modal */}
      {selectedSellerId && (
        <SellerProfileModal
          sellerId={selectedSellerId}
          currentUser={currentUser}
          users={users}
          listings={listings}
          posts={posts}
          reviews={reviews}
          onClose={() => setSelectedSellerId(null)}
          onOpenChat={handleOpenChat}
          onSelectListing={(l) => {
            setSelectedSellerId(null);
            setSelectedListing(l);
          }}
          onDeletePost={handleDeletePost}
          onOpenCreatePost={() => setShowCreatePostModal(true)}
        />
      )}





      {/* 10. Automatic Onboarding Modal (OAuth & Incomplete Profiles) */}
      {showOnboarding && (
        <OnboardingModal
          initialUser={currentUser}
          onComplete={(updatedUser) => {
            localStorage.setItem(`onboarded_${updatedUser.email}`, 'true');
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setShowOnboarding(false);
          }}
        />
      )}

      {/* ── Mobile Floating AI Chat FAB (Lifted above bottom navigation layer) ── */}
      <div className="fixed bottom-28 right-4 z-40 sm:hidden">
        <button
          onClick={() => setShowMessagesModal(prev => !prev)}
          className="relative w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-700/50 hover:shadow-indigo-600/60 active:scale-95 transition-all duration-200 border-2 border-white/30 backdrop-blur-md"
          aria-label="Open Direct Chat & AI Support"
          title="Direct Chat & AI Support"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse filter drop-shadow-xs" />
          </div>

          {/* Unread badge */}
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Android Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        escrowOrdersCount={escrowOrdersCount}
        unreadMessagesCount={unreadMessagesCount}
        onOpenProfile={() => setSelectedSellerId(currentUser.id)}
      />

    </div>
  );
}
