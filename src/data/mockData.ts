import { 
  User, 
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
  AnalyticsData
} from '../types';

// Essential Minimal Core Users for Client-Side Initial State
export const INITIAL_USERS: User[] = [
  {
    id: 'usr_buyer_1',
    name: 'Elena Rostova',
    username: 'elena_artisan',
    email: 'elena@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    role: 'buyer_free',
    bio: 'Standard Buyer (Free Tier) — Supporter of local small businesses & sustainable crafts. 🌿',
    isVerified: false,
    subscriptionStatus: 'free',
    location: 'Portland, OR',
    followersCount: 142,
    followingCount: 89,
    rating: 4.9,
    reviewsCount: 12,
    totalSales: 0,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr_buyer_premium',
    name: 'Liam Vance (VIP Buyer)',
    username: 'liam_vip_buyer',
    email: 'liam@vancedynamics.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    role: 'buyer_premium',
    companyName: 'Vance Dynamics Corp',
    bio: 'VIP Premium Buyer — Corporate bulk purchasing, priority escrow & wholesale sourcing.',
    isVerified: true,
    verificationBadgeType: 'b2b_verified',
    subscriptionStatus: 'premium',
    location: 'New York, NY',
    followersCount: 890,
    followingCount: 240,
    rating: 5.0,
    reviewsCount: 38,
    totalSales: 0,
    createdAt: '2024-06-20'
  },
  {
    id: 'usr_seller_free',
    name: 'Craft & Clay Pottery',
    username: 'craftandclay',
    email: 'hello@craftandclay.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    role: 'seller_free',
    bio: 'Handcrafted stoneware ceramics & eco-friendly home pottery. Made with love.',
    isVerified: false,
    subscriptionStatus: 'free',
    location: 'Austin, TX',
    followersCount: 680,
    followingCount: 120,
    rating: 4.8,
    reviewsCount: 45,
    totalSales: 112,
    createdAt: '2024-10-01',
    customCategories: ['Ceramics & Mugs', 'Home Planters', 'Dinnerware Collections']
  },
  {
    id: 'usr_seller_premium',
    name: 'Nordic Timber & Tech',
    username: 'nordictimber',
    email: 'sales@nordictimber.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    role: 'seller_premium',
    bio: 'Custom solid wood furniture, ergonomic workspace gear & wholesale lumber supplies.',
    isVerified: true,
    subscriptionStatus: 'premium',
    location: 'Seattle, WA',
    followersCount: 4890,
    followingCount: 310,
    rating: 4.9,
    reviewsCount: 230,
    totalSales: 1450,
    createdAt: '2024-03-12',
    customStorefrontUrl: 'nordic-timber.bizsocial.com',
    customCategories: ['Ergonomic Desk Gear', 'Vintage Furniture', 'Woodworking & Tools', 'Bulk Wholesale Lumber']
  },
  {
    id: 'usr_admin_1',
    name: 'Sarah Chen (Platform Lead)',
    username: 'sarah_admin',
    email: 'admin@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    role: 'admin',
    companyName: 'BizSocial Inc (Admin Team)',
    bio: 'BizSocial Platform Administrator & Merchant Growth Manager.',
    isVerified: true,
    subscriptionStatus: 'premium',
    location: 'San Francisco, CA',
    followersCount: 12500,
    followingCount: 450,
    rating: 5.0,
    reviewsCount: 88,
    totalSales: 0,
    createdAt: '2024-01-01'
  },
  {
    id: 'usr_procurement_1',
    name: 'BizSocial Official Buy Desk',
    username: 'bizsocial_buydesk',
    email: 'procurement@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    role: 'procurement',
    companyName: 'Apex Capital Procurement',
    bio: 'Official direct purchasing division of BizSocial. We buy inventory directly from small businesses!',
    isVerified: true,
    subscriptionStatus: 'premium',
    location: 'HQ Direct Buy Center',
    followersCount: 9800,
    followingCount: 15,
    rating: 5.0,
    reviewsCount: 310,
    totalSales: 890,
    createdAt: '2024-01-01'
  }
];

export const INITIAL_LISTINGS: Listing[] = [];

export const INITIAL_POSTS: Post[] = [];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'st_1',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    mediaUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    caption: 'Fresh batch of sourdough pies just pulled from the brick oven! 🔥🍕',
    expiresAt: '20 hours',
    createdAt: '4 hours ago',
    viewCount: 238
  }
];

export const INITIAL_DIRECT_OFFERS: DirectOffer[] = [
  {
    id: 'off_101',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isPremiumSeller: false,
    title: 'Surplus Commercial Kiln & Studio Pottery Stock (120 Pcs)',
    category: 'second_hand',
    condition: 'used',
    expectedPrice: 4200.00,
    description: 'Full studio liquidation including Olympic 18" electric kiln and glazed ceramic dinnerware batch.',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Austin, TX',
    status: 'under_review',
    createdAt: 'Yesterday',
    expiresAt: 'In 6 days',
    history: [
      {
        status: 'under_review',
        timestamp: 'Yesterday',
        note: 'Submitted for corporate direct buyout assessment'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98231',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    listingId: 'lst_pizza_01',
    listingTitle: 'Artisanal Wood-Fired Sourdough Pizza (x2)',
    listingImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    price: 18.00,
    totalAmount: 40.50,
    status: 'escrow_held',
    escrowStatus: 'held',
    trackingNumber: 'TRK78392104',
    shippingAddress: '742 Evergreen Terrace, Portland, OR',
    createdAt: '2 hours ago'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participantIds: ['usr_buyer_1', 'usr_seller_premium'],
    otherParticipant: {
      id: 'usr_seller_premium',
      name: 'Nordic Timber & Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'seller_premium'
    },
    lastMessage: 'Your custom walnut desk order has been confirmed with Escrow deposit protection!',
    lastMessageTime: '10:45 AM',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'usr_seller_premium',
    senderName: 'Nordic Timber & Tech',
    text: 'Hello Elena! We received your inquiry regarding custom 72" desktop dimensions.',
    isRead: true,
    createdAt: '10:30 AM'
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'usr_buyer_1',
    senderName: 'Elena Rostova',
    text: 'Awesome! Can we proceed with the Walnut finish and power hub?',
    isRead: true,
    createdAt: '10:38 AM'
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'usr_seller_premium',
    senderName: 'Nordic Timber & Tech',
    text: 'Your custom walnut desk order has been confirmed with Escrow deposit protection!',
    isRead: true,
    createdAt: '10:45 AM'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_buyer_1',
    type: 'order',
    title: 'Escrow Payment Secured 🔒',
    body: 'Funds for Order #ORD-98231 are locked in neutral Escrow. Release payout only after delivery confirmation.',
    isRead: false,
    createdAt: '10 mins ago'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    sellerId: 'usr_seller_free',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Exceptional craftsmanship and swift fulfillment! Escrow transaction was completely seamless.',
    createdAt: '3 days ago'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    orderId: 'ORD-89210',
    buyerName: 'Elena Rostova',
    sellerName: 'Craft & Clay Pottery',
    amount: 140.00,
    reason: 'Ceramic tea set arrived with 2 broken saucers due to carrier transit damage.',
    status: 'open',
    createdAt: '5 hours ago'
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  views: 8940,
  clicks: 1420,
  conversionRate: 4.8,
  totalRevenue: 28450.00,
  followerGrowth: [
    { date: 'Mon', count: 120 },
    { date: 'Wed', count: 240 },
    { date: 'Fri', count: 390 }
  ],
  topProducts: [
    { id: 'lst_wood_01', title: 'Solid Walnut Executive Standing Desk', views: 1280, sales: 8 }
  ]
};
