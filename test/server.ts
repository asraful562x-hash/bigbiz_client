import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
} from "../src/data/mockData";
import { 
  User, 
  Listing, 
  Post, 
  Story, 
  DirectOffer, 
  Order, 
  Message, 
  AppNotification, 
  Review, 
  Dispute 
} from "../src/types";

import { seedDatabaseUsers } from "../server/dbSeeder";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Backend Database Seeding (Runs on startup & migration)
  let users: User[] = seedDatabaseUsers();
  let listings: Listing[] = [...INITIAL_LISTINGS];
  let posts: Post[] = [...INITIAL_POSTS];
  let stories: Story[] = [...INITIAL_STORIES];
  let directOffers: DirectOffer[] = [...INITIAL_DIRECT_OFFERS];
  let orders: Order[] = [...INITIAL_ORDERS];
  let conversations = [...INITIAL_CONVERSATIONS];
  let messages: Message[] = [...INITIAL_MESSAGES];
  let notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];
  let reviews: Review[] = [...INITIAL_REVIEWS];
  let disputes: Dispute[] = [...INITIAL_DISPUTES];
  let analytics = { ...INITIAL_ANALYTICS };

  // =====================================
  // API ROUTES
  // =====================================

  // 1. Users & Profiles
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.get("/api/users/:id", (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.put("/api/users/:id/subscription", (req, res) => {
    const { status } = req.body; // 'free' | 'premium'
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.subscriptionStatus = status;
    if (status === 'premium') {
      user.isVerified = true;
      if (user.role === 'seller_free') {
        user.role = 'seller_premium';
      }
    } else {
      user.isVerified = false;
      if (user.role === 'seller_premium') {
        user.role = 'seller_free';
      }
    }
    res.json(user);
  });

  // 2. Marketplace Listings
  app.get("/api/listings", (req, res) => {
    const { category, condition, search, sellerId, minPrice, maxPrice, status } = req.query;
    let filtered = [...listings];

    if (status) {
      filtered = filtered.filter(l => l.status === status);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter(l => l.category === category);
    }
    if (condition && condition !== 'all') {
      filtered = filtered.filter(l => l.condition === condition);
    }
    if (sellerId) {
      filtered = filtered.filter(l => l.sellerId === sellerId);
    }
    if (minPrice) {
      filtered = filtered.filter(l => l.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(l => l.price <= Number(maxPrice));
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q)) ||
        l.location.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.get("/api/listings/:id", (req, res) => {
    const listing = listings.find(l => l.id === req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    
    // Increment view count
    listing.viewsCount += 1;
    res.json(listing);
  });

  app.post("/api/listings", (req, res) => {
    const { 
      title, 
      description, 
      category, 
      condition, 
      price, 
      originalPrice, 
      rentalPeriod, 
      wholesaleMinQty, 
      images, 
      location, 
      sellerId,
      stockQty,
      tags 
    } = req.body;

    const seller = users.find(u => u.id === sellerId);
    if (!seller) return res.status(400).json({ error: "Invalid seller" });

    // Check limits for Free Seller Tier (Max 5 active listings)
    if (seller.subscriptionStatus === 'free') {
      const activeCount = listings.filter(l => l.sellerId === sellerId && l.status === 'active').length;
      if (activeCount >= 5) {
        return res.status(403).json({ 
          error: "Free tier limit reached (Max 5 active listings). Upgrade to Premium for unlimited listings!" 
        });
      }
    }

    const newListing: Listing = {
      id: `lst_${Date.now()}`,
      title,
      description,
      category,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      rentalPeriod,
      wholesaleMinQty: wholesaleMinQty ? Number(wholesaleMinQty) : undefined,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
      location: location || seller.location || 'Local Business',
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      isVerifiedSeller: seller.isVerified,
      isFeatured: seller.subscriptionStatus === 'premium',
      likesCount: 0,
      viewsCount: 1,
      status: 'active',
      tags: tags || ['smallbusiness'],
      createdAt: new Date().toISOString().split('T')[0],
      stockQty: stockQty ? Number(stockQty) : 1
    };

    listings.unshift(newListing);

    // Also auto-create a social feed post for this new listing
    const newPost: Post = {
      id: `post_auto_${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      isVerifiedSeller: seller.isVerified,
      content: `📦 NEW ARRIVAL: ${newListing.title}! Now available in our store starting at $${newListing.price.toFixed(2)}.`,
      mediaUrls: newListing.images,
      postType: 'product',
      listingId: newListing.id,
      listingTitle: newListing.title,
      listingPrice: newListing.price,
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: ['#newarrival', `#${newListing.category}`, '#smallbiz'],
      createdAt: 'Just now'
    };
    posts.unshift(newPost);

    res.status(201).json(newListing);
  });

  // 3. Social Feed & Posts
  app.get("/api/posts", (req, res) => {
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { sellerId, content, mediaUrls, postType, listingId, hashtags } = req.body;
    const seller = users.find(u => u.id === sellerId);
    if (!seller) return res.status(400).json({ error: "Invalid user" });

    let linkedListing = undefined;
    if (listingId) {
      linkedListing = listings.find(l => l.id === listingId);
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      isVerifiedSeller: seller.isVerified,
      content,
      mediaUrls: mediaUrls || [],
      postType: postType || 'update',
      listingId: linkedListing?.id,
      listingTitle: linkedListing?.title,
      listingPrice: linkedListing?.price,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      hashtags: hashtags || ['#bizsocial'],
      createdAt: 'Just now'
    };

    posts.unshift(newPost);
    res.status(201).json(newPost);
  });

  app.post("/api/posts/:id/like", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.isLiked) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.isLiked = false;
    } else {
      post.likesCount += 1;
      post.isLiked = true;
    }

    res.json({ likesCount: post.likesCount, isLiked: post.isLiked });
  });

  app.post("/api/posts/:id/comment", (req, res) => {
    const { userId, text } = req.body;
    const post = posts.find(p => p.id === req.params.id);
    const user = users.find(u => u.id === userId);

    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!user) return res.status(400).json({ error: "Invalid user" });

    const newComment = {
      id: `c_${Date.now()}`,
      postId: post.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      createdAt: 'Just now'
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount += 1;

    res.status(201).json(newComment);
  });

  // 4. Stories
  app.get("/api/stories", (req, res) => {
    res.json(stories);
  });

  app.post("/api/stories", (req, res) => {
    const { sellerId, mediaUrl, caption } = req.body;
    const seller = users.find(u => u.id === sellerId);
    if (!seller) return res.status(400).json({ error: "Invalid seller" });

    const newStory: Story = {
      id: `str_${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      isVerifiedSeller: seller.isVerified,
      mediaUrl,
      caption,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: 'Just now',
      viewCount: 1
    };

    stories.unshift(newStory);
    res.status(201).json(newStory);
  });

  // 5. "Sell to Us" Direct Offer System
  app.get("/api/direct-offers", (req, res) => {
    const { sellerId } = req.query;
    if (sellerId) {
      return res.json(directOffers.filter(o => o.sellerId === sellerId));
    }
    // Return all offers for Procurement Team view (sorted by premium priority)
    const sorted = [...directOffers].sort((a, b) => (b.isPremiumSeller ? 1 : 0) - (a.isPremiumSeller ? 1 : 0));
    res.json(sorted);
  });

  app.post("/api/direct-offers", (req, res) => {
    const { sellerId, title, category, condition, expectedPrice, description, images, location } = req.body;
    const seller = users.find(u => u.id === sellerId);
    if (!seller) return res.status(400).json({ error: "Invalid seller" });

    const isPremium = seller.subscriptionStatus === 'premium';
    const nowISO = new Date().toISOString();

    const newOffer: DirectOffer = {
      id: `off_${Date.now().toString().slice(-4)}`,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      isPremiumSeller: isPremium,
      title,
      category,
      condition,
      expectedPrice: Number(expectedPrice),
      description,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'],
      location: location || seller.location,
      status: 'submitted',
      adminNotes: isPremium ? '⭐ High Priority Review (Premium Seller)' : 'Standard Procurement Queue',
      history: [
        {
          status: 'submitted',
          timestamp: nowISO,
          note: isPremium ? 'Submitted via Priority Premium Queue' : 'Submitted to Procurement Queue'
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    directOffers.unshift(newOffer);

    // Notify procurement team
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'usr_procurement_1',
      type: 'offer_update',
      title: isPremium ? '⚡ Priority "Sell to Us" Submission' : 'New "Sell to Us" Submission',
      body: `${seller.name} submitted offer "${title}" for $${expectedPrice}`,
      isRead: false,
      createdAt: 'Just now'
    });

    res.status(201).json(newOffer);
  });

  app.put("/api/direct-offers/:id/status", (req, res) => {
    const { status, counterPrice, adminNotes, note } = req.body;
    const offer = directOffers.find(o => o.id === req.params.id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    offer.status = status;
    if (counterPrice) offer.counterPrice = Number(counterPrice);
    if (adminNotes) offer.adminNotes = adminNotes;

    const nowISO = new Date().toISOString();
    offer.history.push({
      status,
      timestamp: nowISO,
      note: note || `Offer status updated to ${status}`,
      updatedBy: 'BizSocial Procurement Team'
    });

    // Notify Seller
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: offer.sellerId,
      type: 'offer_update',
      title: `Direct Offer Status: ${status.replace('_', ' ').toUpperCase()}`,
      body: `Your offer for "${offer.title}" was updated to ${status}.`,
      isRead: false,
      createdAt: 'Just now'
    });

    res.json(offer);
  });

  // Auto-list rejected or expired offer to public marketplace
  app.post("/api/direct-offers/:id/auto-list", (req, res) => {
    const offer = directOffers.find(o => o.id === req.params.id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    const newListing: Listing = {
      id: `lst_autolist_${Date.now()}`,
      title: offer.title,
      description: offer.description,
      category: offer.category,
      condition: offer.condition,
      price: offer.counterPrice || offer.expectedPrice,
      images: offer.images,
      location: offer.location,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      sellerAvatar: offer.sellerAvatar,
      isVerifiedSeller: offer.isPremiumSeller,
      isFeatured: offer.isPremiumSeller,
      likesCount: 0,
      viewsCount: 1,
      status: 'active',
      tags: ['publiclisting', offer.category],
      createdAt: new Date().toISOString().split('T')[0]
    };

    listings.unshift(newListing);

    offer.status = 'auto_listed_public';
    offer.history.push({
      status: 'auto_listed_public',
      timestamp: new Date().toISOString(),
      note: 'Item automatically listed on public marketplace.'
    });

    res.status(201).json({ offer, listing: newListing });
  });

  // 6. Orders & Escrow
  app.get("/api/orders", (req, res) => {
    const { userId, role } = req.query;
    let filtered = [...orders];
    if (userId) {
      if (role === 'seller_free' || role === 'seller_premium') {
        filtered = filtered.filter(o => o.sellerId === userId);
      } else {
        filtered = filtered.filter(o => o.buyerId === userId);
      }
    }
    res.json(filtered);
  });

  app.post("/api/orders", (req, res) => {
    const { buyerId, listingId, shippingAddress } = req.body;
    const buyer = users.find(u => u.id === buyerId);
    const listing = listings.find(l => l.id === listingId);

    if (!buyer || !listing) return res.status(400).json({ error: "Invalid buyer or listing" });

    const totalAmount = listing.price + 4.50; // Shipping & Escrow processing fee
    const newOrder: Order = {
      id: `ord_${Date.now().toString().slice(-4)}`,
      buyerId: buyer.id,
      buyerName: buyer.name,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      price: listing.price,
      totalAmount,
      status: 'escrow_held',
      escrowStatus: 'held',
      shippingAddress: shippingAddress || buyer.location,
      createdAt: new Date().toISOString().split('T')[0]
    };

    orders.unshift(newOrder);

    // Notify seller
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: listing.sellerId,
      type: 'order',
      title: '🎉 New Order Received (Escrow Held)',
      body: `${buyer.name} purchased "${listing.title}" for $${totalAmount.toFixed(2)}. Funds are safely held in Escrow until delivery confirmation.`,
      isRead: false,
      createdAt: 'Just now'
    });

    res.status(201).json(newOrder);
  });

  app.put("/api/orders/:id/confirm-receipt", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = 'buyer_confirmed';
    order.escrowStatus = 'released';

    // Notify Seller that escrow funds were released
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: order.sellerId,
      type: 'order',
      title: '💰 Escrow Payment Released!',
      body: `Buyer confirmed receipt for order #${order.id}. $${order.price.toFixed(2)} transferred to your wallet.`,
      isRead: false,
      createdAt: 'Just now'
    });

    res.json(order);
  });

  // 7. Messaging
  app.get("/api/conversations", (req, res) => {
    res.json(conversations);
  });

  app.get("/api/messages/:convId", (req, res) => {
    const msgs = messages.filter(m => m.conversationId === req.params.convId);
    res.json(msgs);
  });

  app.post("/api/messages", (req, res) => {
    const { conversationId, senderId, text } = req.body;
    const sender = users.find(u => u.id === senderId);
    if (!sender) return res.status(400).json({ error: "Invalid sender" });

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      text,
      isRead: false,
      createdAt: 'Just now'
    };

    messages.push(newMsg);

    // Update conversation last message
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageTime = 'Just now';
    }

    res.status(201).json(newMsg);
  });

  // 8. Notifications
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.put("/api/notifications/:id/read", (req, res) => {
    const notif = notifications.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  });

  // 9. Reviews
  app.get("/api/reviews", (req, res) => {
    const { sellerId } = req.query;
    if (sellerId) {
      return res.json(reviews.filter(r => r.sellerId === sellerId));
    }
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { sellerId, buyerId, rating, comment, photoUrl, listingTitle } = req.body;
    const buyer = users.find(u => u.id === buyerId);
    if (!buyer) return res.status(400).json({ error: "Invalid buyer" });

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      sellerId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerAvatar: buyer.avatar,
      rating: Number(rating),
      comment,
      photoUrl,
      listingTitle,
      createdAt: new Date().toISOString().split('T')[0]
    };

    reviews.unshift(newRev);
    res.status(201).json(newRev);
  });

  // 10. Bulk Upload (CSV Import simulation for Premium Sellers)
  app.post("/api/bulk-upload", (req, res) => {
    const { sellerId, csvRows } = req.body;
    const seller = users.find(u => u.id === sellerId);
    if (!seller) return res.status(400).json({ error: "Invalid seller" });

    if (seller.subscriptionStatus !== 'premium') {
      return res.status(403).json({ error: "Bulk CSV upload is exclusively available for Premium Tier sellers." });
    }

    const createdListings: Listing[] = [];
    if (Array.isArray(csvRows)) {
      csvRows.forEach((row, idx) => {
        const item: Listing = {
          id: `lst_bulk_${Date.now()}_${idx}`,
          title: row.title || `Bulk Upload Item #${idx + 1}`,
          description: row.description || 'Imported via CSV bulk upload tool.',
          category: row.category || 'new_products',
          condition: row.condition || 'new',
          price: Number(row.price) || 29.99,
          images: row.image ? [row.image] : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
          location: seller.location,
          sellerId: seller.id,
          sellerName: seller.name,
          sellerAvatar: seller.avatar,
          isVerifiedSeller: true,
          isFeatured: true,
          likesCount: 0,
          viewsCount: 1,
          status: 'active',
          tags: ['bulkupload', 'wholesale'],
          createdAt: new Date().toISOString().split('T')[0]
        };
        listings.unshift(item);
        createdListings.push(item);
      });
    }

    res.json({ message: `Successfully imported ${createdListings.length} products!`, createdListings });
  });

  // 11. Analytics & Admin Disputes
  app.get("/api/analytics", (req, res) => {
    res.json(analytics);
  });

  app.get("/api/disputes", (req, res) => {
    res.json(disputes);
  });

  app.put("/api/disputes/:id", (req, res) => {
    const { status } = req.body;
    const disp = disputes.find(d => d.id === req.params.id);
    if (!disp) return res.status(404).json({ error: "Dispute not found" });
    disp.status = status;
    res.json(disp);
  });

  // =====================================
  // VITE & STATIC SERVING
  // =====================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BizSocial Marketplace Server listening on http://localhost:${PORT}`);
  });
}

startServer();
