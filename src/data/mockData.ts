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

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst_pizza_01',
    title: 'Artisanal Wood-Fired Sourdough Pizza (Custom Made)',
    description: 'Slow-fermented 72-hour organic sourdough crust baked in a 900°F Italian oak-fired brick oven. Customize your size, crust style, gourmet sauces, and premium extra toppings.',
    category: 'new_products',
    storeCategory: 'Artisanal Bakery & Pizzeria',
    condition: 'new',
    price: 18.00,
    originalPrice: 22.00,
    optionSections: [
      {
        id: 'sec_size',
        title: 'Select Pizza Size',
        type: 'single',
        isRequired: true,
        items: [
          { id: 'opt_sz_10', name: '10" Personal Crust (6 Slices)', priceDelta: 0, isDefault: true },
          { id: 'opt_sz_14', name: '14" Medium Crust (8 Slices)', priceDelta: 6.00 },
          { id: 'opt_sz_18', name: '18" Party Size Jumbo (12 Slices)', priceDelta: 12.00 }
        ]
      },
      {
        id: 'sec_crust',
        title: 'Crust Style & Seasoning',
        type: 'single',
        isRequired: true,
        items: [
          { id: 'opt_cr_nap', name: 'Classic Neapolitan (Soft & Airy)', priceDelta: 0, isDefault: true },
          { id: 'opt_cr_garlic', name: 'Garlic Butter Herb Glazed Crust', priceDelta: 1.50 },
          { id: 'opt_cr_cheese', name: 'Mozzarella Stuffed Crust Ring', priceDelta: 3.50 }
        ]
      },
      {
        id: 'sec_toppings',
        title: 'Gourmet Extra Toppings',
        type: 'multiple',
        isRequired: false,
        items: [
          { id: 'opt_top_burrata', name: 'Fresh Creamy Burrata Cheese Ball', priceDelta: 4.50 },
          { id: 'opt_top_truffle', name: 'Black Summer Truffle Oil Drizzle', priceDelta: 3.00 },
          { id: 'opt_top_basil', name: 'Organic Fresh Genovese Basil Leaves', priceDelta: 1.00 },
          { id: 'opt_top_parm', name: 'Aged 24-Month Parmigiano-Reggiano', priceDelta: 2.50 }
        ]
      }
    ],
    variants: [
      { id: 'var_piz_dine', name: 'Dine-In Hot & Fresh', priceDelta: 0, inStock: true, isDefault: true },
      { id: 'var_piz_take', name: 'Takeaway Insulated Box', priceDelta: 1.00, inStock: true },
      { id: 'var_piz_frozen', name: 'Flash-Frozen Bake-at-Home Pack', priceDelta: -2.00, inStock: true }
    ],
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 84,
    viewsCount: 650,
    location: 'Austin, TX',
    stockQty: 25,
    status: 'active',
    tags: ['#pizza', '#sourdough', '#artisanal', '#foodie', '#craftfood'],
    createdAt: '2 hours ago'
  },
  {
    id: 'lst_wood_01',
    title: 'Solid Walnut Executive Standing Desk (Motorized)',
    description: '100% sustainably harvested American black walnut desktop with dual-motor quiet lift mechanism, programmable height presets, and integrated wire management.',
    category: 'new_products',
    storeCategory: 'Ergonomic Desk Gear',
    condition: 'new',
    price: 899.00,
    originalPrice: 1150.00,
    variants: [
      { id: 'var_60', name: '60" x 30" Standard Desktop', priceDelta: 0, inStock: true, isDefault: true },
      { id: 'var_72', name: '72" x 36" Executive Studio Size', priceDelta: 250.00, inStock: true }
    ],
    features: [
      { id: 'feat_power', name: 'Flush-Mount USB-C + AC Power Hub', price: 49.00, description: 'Dual 65W PD ports + 2 surge outlets' },
      { id: 'feat_caster', name: 'Heavy-Duty Locking Polyurethane Casters', price: 29.00, description: 'Smooth 360° floor-safe wheels' }
    ],
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 142,
    viewsCount: 1280,
    location: 'Seattle, WA',
    stockQty: 8,
    status: 'active',
    tags: ['#woodworking', '#standingdesk', '#workfromhome', '#walnut'],
    createdAt: '1 day ago'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    content: 'Just finished unboxing a fresh batch of kiln-dried American Walnut slabs! Check out the grain pattern on this 72" executive standing desk. Available now with Escrow purchase protection.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80'
    ],
    postType: 'product',
    listingId: 'lst_wood_01',
    listingTitle: 'Solid Walnut Executive Standing Desk',
    listingPrice: 899.00,
    likesCount: 148,
    isLiked: false,
    commentsCount: 22,
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        userId: 'usr_buyer_1',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'The walnut finish looks stunning! What is the lead time for shipping to Oregon?',
        createdAt: '1 hour ago'
      }
    ],
    sharesCount: 15,
    hashtags: ['#woodworking', '#standingdesk', '#artisancraft', '#BizSocial'],
    createdAt: '3 hours ago'
  }
];

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
    unreadCount: 1
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
    isRead: false,
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
