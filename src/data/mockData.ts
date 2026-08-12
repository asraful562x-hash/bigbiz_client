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

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_buyer_1',
    name: 'Elena Rostova',
    username: 'elena_artisan',
    email: 'elena@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    role: 'buyer',
    bio: 'Avid supporter of local small businesses & sustainable crafts. 🌿',
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
    createdAt: '2024-10-01'
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
    customStorefrontUrl: 'nordic-timber.bizsocial.com'
  },
  {
    id: 'usr_admin_1',
    name: 'Sarah Chen (Platform Lead)',
    username: 'sarah_admin',
    email: 'admin@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
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
    id: 'usr_moderator_1',
    name: 'Marcus Vance (Trust & Safety)',
    username: 'marcus_mod',
    email: 'mod@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'moderator',
    bio: 'Community guidelines enforcement & dispute resolution specialist.',
    isVerified: true,
    subscriptionStatus: 'premium',
    location: 'Chicago, IL',
    followersCount: 3100,
    followingCount: 200,
    rating: 4.95,
    reviewsCount: 40,
    totalSales: 0,
    createdAt: '2024-02-15'
  },
  {
    id: 'usr_procurement_1',
    name: 'BizSocial Official Buy Desk',
    username: 'bizsocial_buydesk',
    email: 'procurement@bizsocial.com',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    role: 'procurement',
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
  // 1. New Products
  {
    id: 'lst_101',
    title: 'Handmade Stoneware Ceramic Coffee Mug (12oz)',
    description: 'Ergonomic matte white stoneware coffee cup fired at 2200°F. Dishwasher and microwave safe.',
    category: 'new_products',
    condition: 'new',
    price: 34.00,
    originalPrice: 42.00,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Austin, TX',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: false,
    isFeatured: true,
    likesCount: 84,
    viewsCount: 620,
    status: 'active',
    tags: ['handmade', 'ceramics', 'coffee', 'kitchen'],
    createdAt: '2026-08-01',
    stockQty: 18
  },
  {
    id: 'lst_102',
    title: 'Walnut Wood MagSafe Floating Desk Stand',
    description: 'Crafted from 100% sustainable American Black Walnut with brass accent feet. Fits all phone sizes.',
    category: 'new_products',
    condition: 'new',
    price: 89.00,
    originalPrice: 110.00,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Seattle, WA',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 245,
    viewsCount: 1840,
    status: 'active',
    tags: ['woodworking', 'magsafe', 'desksetup', 'minimalist'],
    createdAt: '2026-08-05',
    stockQty: 35
  },

  // 2. Second-hand/Used
  {
    id: 'lst_201',
    title: 'Refurbished Vintage Leather Chesterfield Armchair',
    description: 'Restored 1980s cognac brown full-grain leather armchair. Conditioned with organic beeswax emulsion.',
    category: 'second_hand',
    condition: 'refurbished',
    price: 450.00,
    originalPrice: 1200.00,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Portland, OR',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: false,
    likesCount: 112,
    viewsCount: 930,
    status: 'active',
    tags: ['vintage', 'leather', 'furniture', 'refurbished'],
    createdAt: '2026-08-03',
    stockQty: 1
  },
  {
    id: 'lst_202',
    title: 'Pre-owned Fujifilm x100V Digital Camera (Silver)',
    description: 'Excellent condition with only 1,200 shutter actuations. Comes with original leather strap, lens hood, and 2 batteries.',
    category: 'second_hand',
    condition: 'used',
    price: 1250.00,
    originalPrice: 1599.00,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Austin, TX',
    sellerId: 'usr_buyer_1',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: false,
    isFeatured: false,
    likesCount: 198,
    viewsCount: 1420,
    status: 'active',
    tags: ['fujifilm', 'camera', 'photography', 'secondhand'],
    createdAt: '2026-08-07',
    stockQty: 1
  },

  // 3. Services Marketplace
  {
    id: 'lst_301',
    title: 'Custom Brand Identity & Web Design Package',
    description: 'Complete visual identity overhaul for small business owners including logo suite, typography rules, color palette & Figma layout.',
    category: 'services',
    condition: 'service',
    price: 650.00,
    images: [
      'https://images.unsplash.com/photo-1542744094-3a31727202b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Remote / Nationwide',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 310,
    viewsCount: 2100,
    status: 'active',
    tags: ['branding', 'freelance', 'webdesign', 'services'],
    createdAt: '2026-07-28'
  },

  // 4. Rental Marketplace
  {
    id: 'lst_401',
    title: 'Professional Commercial Woodworking Table Saw & Router Kit',
    description: 'Heavy duty SawStop 3HP Cabinet Saw available for daily or weekly shop rental. Ideal for local contractors & hobbyists.',
    category: 'rentals',
    condition: 'rental',
    price: 75.00,
    rentalPeriod: 'per_day',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Seattle, WA',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 67,
    viewsCount: 510,
    status: 'active',
    tags: ['tools', 'rental', 'woodworking', 'seattle'],
    createdAt: '2026-08-04'
  },

  // 5. Wholesale / B2B Section
  {
    id: 'lst_501',
    title: 'B2B Wholesale Raw Walnut & Oak Timber Plank Bundle (50 Board Feet)',
    description: 'Kiln-dried 4/4 select grade American Walnut planks for furniture makers & boutique carpenters. Bulk discount pricing.',
    category: 'wholesale_b2b',
    condition: 'new',
    price: 480.00,
    wholesaleMinQty: 2,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Seattle, WA Warehouse',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    isFeatured: true,
    likesCount: 142,
    viewsCount: 1100,
    status: 'active',
    tags: ['wholesale', 'b2b', 'lumber', 'timber', 'rawmaterials'],
    createdAt: '2026-08-02',
    stockQty: 50
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    content: 'Fresh out of the oil bath! Our brand new Walnut MagSafe Floating Desk Stands are officially back in stock! Each piece features unique grain patterns harvested from local sustainable timber. 🪵⚡️',
    mediaUrls: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    postType: 'product',
    listingId: 'lst_102',
    listingTitle: 'Walnut Wood MagSafe Floating Desk Stand',
    listingPrice: 89.00,
    likesCount: 342,
    isLiked: false,
    commentsCount: 28,
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        userId: 'usr_buyer_1',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Does this hold the iPhone 15 Pro Max securely in landscape mode?',
        createdAt: '2 hours ago'
      },
      {
        id: 'c2',
        postId: 'post_1',
        userId: 'usr_seller_premium',
        userName: 'Nordic Timber & Tech',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Yes Elena! It uses N52 neodymium magnet rings for ultra strong grip in both orientations.',
        createdAt: '1 hour ago'
      }
    ],
    sharesCount: 14,
    hashtags: ['#woodworking', '#desksetup', '#handmade', '#smallbiz'],
    createdAt: '3 hours ago'
  },
  {
    id: 'post_2',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: false,
    content: 'Kiln opening morning is always like Christmas! Opening up batch #42 of stoneware espresso cups. Which color glaze is your favorite? ☕️🎨',
    mediaUrls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80'
    ],
    postType: 'product',
    listingId: 'lst_101',
    listingTitle: 'Handmade Stoneware Ceramic Coffee Mug',
    listingPrice: 34.00,
    likesCount: 189,
    isLiked: true,
    commentsCount: 12,
    comments: [],
    sharesCount: 5,
    hashtags: ['#ceramics', '#pottery', '#coffee', '#artisan'],
    createdAt: '6 hours ago'
  },
  {
    id: 'post_3',
    sellerId: 'usr_procurement_1',
    sellerName: 'BizSocial Official Buy Desk',
    sellerAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    content: '📢 SMALL BUSINESS OWNERS: Looking for instant cashflow? Use our "Sell to Us" direct offer feature! Submit your surplus inventory or equipment directly to our procurement team for 24-48hr buyout offers.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
    ],
    postType: 'update',
    likesCount: 512,
    isLiked: false,
    commentsCount: 42,
    comments: [],
    sharesCount: 88,
    hashtags: ['#SellToUs', '#B2B', '#SmallBusinessSupport', '#Cashflow'],
    createdAt: '1 day ago'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'str_1',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: true,
    mediaUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    caption: 'Behind the scenes in our woodworking workshop today! 🪚',
    expiresAt: '2026-08-11T12:00:00Z',
    createdAt: '2 hours ago',
    viewCount: 184
  },
  {
    id: 'str_2',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isVerifiedSeller: false,
    mediaUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    caption: 'Glaze testing on fresh clay bodies 🏺✨',
    expiresAt: '2026-08-11T16:00:00Z',
    createdAt: '5 hours ago',
    viewCount: 96
  }
];

export const INITIAL_DIRECT_OFFERS: DirectOffer[] = [
  {
    id: 'off_001',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isPremiumSeller: false,
    title: 'Surplus Kiln Shelves & Refractory Bricks Lot (20 pcs)',
    category: 'second_hand',
    condition: 'used',
    expectedPrice: 280.00,
    description: 'High-alumina cordierite kiln shelves with minor glaze drips. Cleaned and ready for firing.',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Austin, TX',
    status: 'under_review',
    adminNotes: 'Assigned to senior procurement analyst. Inspecting photo condition.',
    history: [
      {
        status: 'submitted',
        timestamp: '2026-08-09T10:00:00Z',
        note: 'Offer submitted by seller.'
      },
      {
        status: 'under_review',
        timestamp: '2026-08-09T11:30:00Z',
        note: 'Procurement team reviewing price & condition.'
      }
    ],
    createdAt: '2026-08-09',
    expiresAt: '2026-08-12'
  },
  {
    id: 'off_002',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isPremiumSeller: true,
    title: 'Bulk Overstock Industrial Router Bits (Set of 15)',
    category: 'wholesale_b2b',
    condition: 'new',
    expectedPrice: 420.00,
    counterPrice: 380.00,
    description: 'Carbide tipped industrial spiral router bits unopened in protective storage cases.',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'
    ],
    location: 'Seattle, WA',
    status: 'counter_offered',
    adminNotes: 'Offered $380 based on standard B2B resale index.',
    history: [
      {
        status: 'submitted',
        timestamp: '2026-08-08T09:00:00Z',
        note: 'Submitted via Priority Premium Queue.'
      },
      {
        status: 'under_review',
        timestamp: '2026-08-08T09:15:00Z',
        note: 'Fast-tracked review.'
      },
      {
        status: 'counter_offered',
        timestamp: '2026-08-08T14:00:00Z',
        note: 'Counter-offer of $380 sent to seller.',
        updatedBy: 'BizSocial Buy Desk'
      }
    ],
    createdAt: '2026-08-08',
    expiresAt: '2026-08-11'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    sellerId: 'usr_seller_free',
    sellerName: 'Craft & Clay Pottery',
    listingId: 'lst_101',
    listingTitle: 'Handmade Stoneware Ceramic Coffee Mug',
    listingImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    price: 34.00,
    totalAmount: 38.50,
    status: 'escrow_held',
    escrowStatus: 'held',
    shippingAddress: '742 Evergreen Terrace, Portland, OR',
    createdAt: '2026-08-08'
  },
  {
    id: 'ord_1002',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    sellerId: 'usr_seller_premium',
    sellerName: 'Nordic Timber & Tech',
    listingId: 'lst_102',
    listingTitle: 'Walnut Wood MagSafe Floating Desk Stand',
    listingImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    price: 89.00,
    totalAmount: 96.00,
    status: 'delivered',
    escrowStatus: 'held',
    trackingNumber: 'UPS-920148109',
    shippingAddress: '742 Evergreen Terrace, Portland, OR',
    createdAt: '2026-08-04'
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
    lastMessage: 'Your custom walnut desk stand order has shipped!',
    lastMessageTime: '10:15 AM',
    unreadCount: 1
  },
  {
    id: 'conv_2',
    participantIds: ['usr_buyer_1', 'usr_seller_free'],
    otherParticipant: {
      id: 'usr_seller_free',
      name: 'Craft & Clay Pottery',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'seller_free'
    },
    lastMessage: 'Is local pickup available in Austin?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    conversationId: 'conv_1',
    senderId: 'usr_buyer_1',
    senderName: 'Elena Rostova',
    text: 'Hi! I just purchased the Walnut MagSafe Stand. Super excited!',
    isRead: true,
    createdAt: 'Yesterday 3:00 PM'
  },
  {
    id: 'm2',
    conversationId: 'conv_1',
    senderId: 'usr_seller_premium',
    senderName: 'Nordic Timber & Tech',
    text: 'Thank you Elena! We are carefully hand-finishing your unit right now with natural mineral oil.',
    isRead: true,
    createdAt: 'Yesterday 3:15 PM'
  },
  {
    id: 'm3',
    conversationId: 'conv_1',
    senderId: 'usr_seller_premium',
    senderName: 'Nordic Timber & Tech',
    text: 'Your custom walnut desk stand order has shipped! Tracking: UPS-920148109 📦',
    isRead: false,
    createdAt: '10:15 AM'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_seller_premium',
    type: 'order',
    title: 'New Escrow Payment Held ($96.00)',
    body: 'Elena Rostova purchased Walnut Wood MagSafe Stand.',
    isRead: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'notif_2',
    userId: 'usr_seller_free',
    type: 'offer_update',
    title: 'Direct Offer Status Updated',
    body: 'Procurement team moved offer off_001 to Under Review.',
    isRead: true,
    createdAt: '1 day ago'
  },
  {
    id: 'notif_3',
    userId: 'usr_buyer_1',
    type: 'price_drop',
    title: 'Price Drop Alert! 📉',
    body: 'Fujifilm x100V is now $1,250.00 (down from $1,350)',
    isRead: false,
    createdAt: '3 hours ago'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    sellerId: 'usr_seller_premium',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Unboxing was a dream! The solid walnut finish is buttery smooth and the MagSafe magnet holds strong even through my thick phone case. Verified real quality craft.',
    photoUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    listingTitle: 'Walnut Wood MagSafe Floating Desk Stand',
    createdAt: '2026-08-06'
  },
  {
    id: 'rev_2',
    sellerId: 'usr_seller_free',
    buyerId: 'usr_buyer_1',
    buyerName: 'Elena Rostova',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The mug holds heat exceptionally well. Beautiful subtle pottery glaze variations!',
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    listingTitle: 'Handmade Stoneware Ceramic Coffee Mug',
    createdAt: '2026-08-02'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_001',
    orderId: 'ord_9021',
    buyerName: 'Alex Mercer',
    sellerName: 'Vintage Thrift Hub',
    reason: 'Item condition not as described - minor chip on rim',
    status: 'under_investigation',
    amount: 65.00,
    createdAt: '2026-08-07'
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  views: 8420,
  clicks: 1940,
  conversionRate: 4.8,
  totalRevenue: 12450.00,
  followerGrowth: [
    { date: 'Aug 1', count: 4200 },
    { date: 'Aug 3', count: 4350 },
    { date: 'Aug 5', count: 4520 },
    { date: 'Aug 7', count: 4710 },
    { date: 'Aug 9', count: 4890 }
  ],
  topProducts: [
    { id: 'lst_102', title: 'Walnut MagSafe Stand', views: 1840, sales: 48 },
    { id: 'lst_501', title: 'Wholesale Walnut Timber', views: 1100, sales: 12 },
    { id: 'lst_301', title: 'Brand Identity Package', views: 2100, sales: 8 }
  ]
};
