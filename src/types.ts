export type UserRole = 
  | 'buyer_free'
  | 'buyer_premium'
  | 'buyer' 
  | 'seller_free' 
  | 'seller_premium' 
  | 'admin' 
  | 'moderator' 
  | 'procurement';

export type MarketplaceCategory = 
  | 'new_products' 
  | 'second_hand' 
  | 'services' 
  | 'rentals' 
  | 'wholesale_b2b';

export type ProductCondition = 'new' | 'used' | 'refurbished' | 'service' | 'rental';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  role: UserRole;
  bio: string;
  isVerified: boolean;
  subscriptionStatus: 'free' | 'premium';
  location: string;
  followersCount: number;
  followingCount: number;
  rating: number;
  reviewsCount: number;
  totalSales: number;
  createdAt: string;
  customStorefrontUrl?: string;
  companyName?: string;
  verificationBadgeType?: string;
  trustScore?: number;
  responseRate?: string;
  joinDate?: string;
  customCategories?: string[];
}

export interface ProductOptionItem {
  id: string;
  name: string;
  priceDelta: number; // 0 for non-priceable / included, >0 for extra charge, <0 for discount
  description?: string;
  inStock?: boolean;
  isDefault?: boolean; // Seller wants this selected by default
}

export interface ProductOptionSection {
  id: string;
  title: string; // e.g. "Pizza Size", "Crust Type", "Cheese / Extra Toppings", "Beverage Choice"
  type: 'single' | 'multiple'; // 'single' (radio/pill: choose 1) or 'multiple' (checkboxes: pick many)
  isRequired?: boolean; // Must select at least 1
  minSelections?: number;
  maxSelections?: number;
  items: ProductOptionItem[];
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta?: number; // 0 if same price, or positive/negative offset
  sku?: string;
  stockQty?: number;
  inStock?: boolean;
  isDefault?: boolean;
}

export interface ProductFeature {
  id: string;
  name: string;
  price: number; // additional price added when selected
  description?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  storeCategory?: string;
  condition: ProductCondition;
  price: number;
  originalPrice?: number;
  variants?: ProductVariant[];
  features?: ProductFeature[];
  optionSections?: ProductOptionSection[]; // Custom multi-section modifier builder (e.g. Size, Crust, Add-ons)
  rentalPeriod?: 'per_hour' | 'per_day' | 'per_week' | 'per_month';
  wholesaleMinQty?: number;
  images: string[];
  location: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  isVerifiedSeller: boolean;
  isFeatured: boolean;
  likesCount: number;
  viewsCount: number;
  status: 'active' | 'sold' | 'pending_approval' | 'rejected';
  tags: string[];
  createdAt: string;
  stockQty?: number;
}

export type PostType = 'product' | 'update' | 'deal' | 'reel' | 'announcement' | 'wholesale';

export interface PostMediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  isVerifiedSeller: boolean;
  content: string;
  mediaUrls: string[];
  mediaItems?: PostMediaItem[];
  postType: PostType;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: number;
  promoBadge?: string;
  callToAction?: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: Comment[];
  sharesCount: number;
  hashtags: string[];
  createdAt: string;
}

export interface Story {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  isVerifiedSeller: boolean;
  mediaUrl: string;
  caption?: string;
  expiresAt: string;
  createdAt: string;
  viewCount: number;
}

export type DirectOfferStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'counter_offered' 
  | 'accepted' 
  | 'rejected' 
  | 'auto_listed_public';

export interface OfferStatusHistoryItem {
  status: DirectOfferStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface DirectOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  isPremiumSeller: boolean;
  title: string;
  category: MarketplaceCategory;
  condition: ProductCondition;
  expectedPrice: number;
  counterPrice?: number;
  description: string;
  images: string[];
  location: string;
  status: DirectOfferStatus;
  adminNotes?: string;
  history: OfferStatusHistoryItem[];
  createdAt: string;
  expiresAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  price: number;
  totalAmount: number;
  status: 'escrow_held' | 'shipped' | 'delivered' | 'buyer_confirmed' | 'released' | 'disputed' | 'cancelled';
  escrowStatus: 'held' | 'released' | 'refunded';
  trackingNumber?: string;
  shippingAddress: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachmentUrl?: string;
  listingId?: string;
  offerId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  otherParticipant: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'order' | 'offer_update' | 'price_drop';
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  listingTitle?: string;
  createdAt: string;
}

export interface AnalyticsData {
  views: number;
  clicks: number;
  conversionRate: number;
  totalRevenue: number;
  followerGrowth: { date: string; count: number }[];
  topProducts: { id: string; title: string; views: number; sales: number }[];
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: 'open' | 'under_investigation' | 'resolved_refund' | 'resolved_payout';
  amount: number;
  createdAt: string;
}
