# BizSocial — Developer Documentation

## Overview

**BizSocial** is a full-featured Social E-Commerce & B2B Hub web application built with **Next.js 16.3.0** (Turbopack), **React**, **TypeScript**, and **Tailwind CSS**. It supports multi-role users (buyers, sellers, admins, procurement officers), an Escrow-secured marketplace, social feed, B2B procurement, direct messaging, and a rich analytics dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.0 (Turbopack) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS (utility-first) |
| Icons | lucide-react |
| State | React `useState` / `useEffect` (no Redux) |
| Data | In-memory mock data (`src/data/mockData.ts`) |
| Build | `npm run build` → static export |
| Dev Server | `npm run dev` |

---

## Project Structure

```
E:\project\new_project\
├── src\
│   ├── App.tsx                        # Root layout, global state, routing logic
│   ├── main.tsx                       # React entry point
│   ├── index.css                      # Global CSS (custom scrollbars, animations)
│   ├── types.ts                       # All TypeScript interfaces & types
│   ├── data\
│   │   └── mockData.ts                # All seed/mock data (users, listings, posts, etc.)
│   ├── hooks\
│   │   └── useScrollOverflow.ts       # Custom hook for scroll overflow detection
│   └── components\
│       ├── Header.tsx                 # Top navigation bar (search, tabs, drawers)
│       ├── LoginPage.tsx              # Auth page (sign in / register)
│       ├── LeftBusinessSidebar.tsx    # Left sidebar (profile, tools, quick links)
│       ├── RightBusinessSidebar.tsx   # Right sidebar (RFQs, live market insights)
│       ├── MobileBottomNav.tsx        # Bottom navigation bar for mobile
│       ├── RoleSwitcher.tsx           # Switch between user roles
│       ├── FeedView.tsx               # Social feed (posts, stories, listings)
│       ├── MarketplaceView.tsx        # Product & service catalog with filters
│       ├── SellerDashboard.tsx        # Seller analytics, listings, earnings
│       ├── ProcurementDashboard.tsx   # B2B procurement officer view
│       ├── AdminDashboard.tsx         # Platform admin panel (disputes, users)
│       ├── OrdersView.tsx             # Buyer/seller order tracking
│       ├── SellToUsTracker.tsx        # Track direct "Sell to Us" offers
│       ├── SettingsPrivacyView.tsx    # Account settings & privacy
│       ├── HelpSupportView.tsx        # Help center / FAQ
│       ├── ListingDetailModal.tsx     # Product detail + Buy via Escrow modal
│       ├── SellerProfileModal.tsx     # Public seller profile popup
│       ├── CreateListingModal.tsx     # Create new product/service listing
│       ├── CreatePostModal.tsx        # Create social feed post
│       ├── CreateStoryModal.tsx       # Create 24h story
│       ├── CreateQuoteModal.tsx       # Create B2B quote/RFQ
│       ├── SellToUsModal.tsx          # Submit direct sell-to-us offer
│       ├── DirectMessagesModal.tsx    # Real-time chat & DM interface
│       ├── StoryViewModal.tsx         # View a story fullscreen
│       └── SwitchAccountModal.tsx     # Switch between multiple accounts
├── DEVELOPMENT.md                     # This file
├── prompt.txt                         # AI assistant context prompt
├── AGENTS.md                          # Next.js agent rules (auto-generated)
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Core Types (`src/types.ts`)

| Type | Description |
|---|---|
| `User` | Platform user with role, subscription, rating, company info |
| `UserRole` | `buyer`, `seller_free`, `seller_premium`, `admin`, `moderator`, `procurement` |
| `Listing` | Product/service listing with images, price, category, condition |
| `MarketplaceCategory` | `new_products`, `second_hand`, `services`, `rentals`, `wholesale_b2b` |
| `ProductCondition` | `new`, `used`, `refurbished`, `service`, `rental` |
| `Post` | Social feed post with media, likes, comments |
| `Story` | 24h ephemeral story |
| `DirectOffer` | Sell-to-us offer from seller to platform |
| `Order` | Escrow-protected purchase order |
| `Message` / `Conversation` | DM system |
| `AppNotification` | In-app push notification |
| `Review` | Buyer review for seller |
| `Dispute` | Escrow dispute case |
| `AnalyticsData` | Seller analytics (views, revenue, top products) |

---

## App State (`src/App.tsx`)

All global state lives in `App.tsx` using React `useState`:

| State Variable | Purpose |
|---|---|
| `currentUser` | Active logged-in user |
| `isLoggedIn` | Auth gate toggle |
| `activeTab` | Current view: `feed`, `marketplace`, `seller`, `orders`, `procurement`, `admin`, `settings`, `help`, `sell_to_us` |
| `showLeftDrawer` | Left sidebar drawer open state |
| `showRightDrawer` | Right sidebar drawer open state |
| `listings`, `posts`, `stories`, `offers`, `orders` | Main data collections |
| `selectedListing` | Opens `ListingDetailModal` |
| `selectedSellerId` | Opens `SellerProfileModal` |
| `showCreateListingModal`, `showSellToUsModal`, etc. | Modal open/close states |

---

## Responsive Layout Breakpoints

The layout uses a **3-tier breakpoint system** managed in `App.tsx`:

| Breakpoint | Layout |
|---|---|
| `< 881px` (mobile) | Single column. Left sidebar → left drawer. Right sidebar → right drawer. Search bar breaks to full-width bottom row. |
| `881px – 1299px` (tablet) | 2-column flex layout. Main content: `flex-1 min-w-0`. Right sidebar: fixed `w-[400px]` / `w-[430px]`. Left sidebar hidden (drawer). |
| `≥ 1300px` (desktop) | 10-column CSS grid: Left (3) / Center (4) / Right (3). All three panels visible. |

### Key Tailwind Breakpoint Classes Used
```
min-[881px]:  — tablet+ (search & right sidebar threshold)
min-[1300px]: — desktop (left sidebar + full 10-col grid)
min-[426px]:  — small phone (hide "Social E-Commerce & B2B Hub" subtitle)
```

---

## Drawer System

Two slide-in drawers are managed in `App.tsx`:

### Left Drawer (Menu / Left Sidebar)
- **Trigger**: `☰` Menu button in `Header.tsx` (visible `< 1300px`)
- **State**: `showLeftDrawer` / `setShowLeftDrawer`
- **Width**: `w-[340px] sm:w-96`
- **Content**: `<LeftBusinessSidebar isInDrawer={true} />`

### Right Drawer (Activity & Insights)
- **Trigger**: `SlidersHorizontal` button next to mobile search bar (visible `≤ 880px`)
- **State**: `showRightDrawer` / `setShowRightDrawer`
- **Width**: `w-[360px] sm:w-[420px]`
- **Content**: `<RightBusinessSidebar isInDrawer={true} />`

### `isInDrawer` Prop
Both sidebars accept `isInDrawer?: boolean`. When `true`:
- All rounded corners become `rounded-none` (sharp edges)
- Inner cards and buttons strip `rounded-*` classes

---

## Header (`src/components/Header.tsx`)

### Props
```ts
onOpenLeftDrawer: () => void
onOpenRightDrawer: () => void
// + all search, tab, modal, notification props
```

### Layout Modes
| Width | Behavior |
|---|---|
| `> 880px` | Logo + inline search bar + action icons in single row |
| `≤ 880px` | Logo row on top; full-width search bar with right drawer button drops to second row |
| `≤ 425px` | "Social E-Commerce & B2B Hub" subtitle hidden |

### Create Button
- Square icon-only button (`w-9 h-9 sm:w-10 sm:h-10 rounded-xl`) with `PlusCircle` icon
- No text label

---

## Navigation Tabs (`activeTab`)

| Tab Key | Component Rendered | Who Can See |
|---|---|---|
| `feed` | `FeedView` | All |
| `marketplace` | `MarketplaceView` | All |
| `seller` | `SellerDashboard` | Sellers |
| `orders` | `OrdersView` | Buyers & Sellers |
| `sell_to_us` | `SellToUsTracker` | Sellers |
| `procurement` | `ProcurementDashboard` | Procurement role |
| `admin` | `AdminDashboard` | Admin/Moderator |
| `settings` | `SettingsPrivacyView` | All |
| `help` | `HelpSupportView` | All |

---

## Modals

| Modal Component | Trigger |
|---|---|
| `ListingDetailModal` | Click any listing card |
| `SellerProfileModal` | Click seller name/avatar |
| `CreateListingModal` | Create button → "New Listing" |
| `CreatePostModal` | Create button → "New Post" |
| `CreateStoryModal` | Story upload button in feed |
| `StoryViewModal` | Click a story avatar |
| `SellToUsModal` | "Sell to Us" button |
| `CreateQuoteModal` | "Create Quote" in left sidebar |
| `DirectMessagesModal` | Message icon in header |
| `SwitchAccountModal` | Switch account in profile menu |

---

## Escrow Flow

1. User clicks **"Buy via Escrow"** on a listing → opens `ListingDetailModal`
2. Clicks **"Buy Now via Escrow"** → opens checkout sub-modal inside the same modal
3. User fills shipping address → submits → `onBuyNow(listing, shippingAddress)` called
4. Order created with `status: 'escrow_held'` and `escrowStatus: 'held'`
5. Order tracked in `OrdersView`; escrow released on buyer confirmation

---

## Sell to Us Flow

1. Seller submits offer via `SellToUsModal`
2. Offer appears in `SellToUsTracker` with status `submitted`
3. Admin reviews in `ProcurementDashboard` → can accept, reject, or counter-offer
4. Seller can accept counter or auto-list publicly

---

## Mock Data (`src/data/mockData.ts`)

All initial data exported as constants:
- `INITIAL_USERS` — 6 demo users (buyer, seller free, seller premium, admin, procurement, moderator)
- `INITIAL_LISTINGS` — ~20 product/service listings
- `INITIAL_POSTS` — Social feed posts
- `INITIAL_STORIES` — 24h stories
- `INITIAL_DIRECT_OFFERS` — Sell-to-us offers
- `INITIAL_ORDERS` — Purchase orders
- `INITIAL_CONVERSATIONS` / `INITIAL_MESSAGES` — Chat data
- `INITIAL_NOTIFICATIONS` — App notifications
- `INITIAL_REVIEWS` — Seller reviews
- `INITIAL_DISPUTES` — Escrow disputes
- `INITIAL_ANALYTICS` — Dashboard analytics

---

## Login Page (`src/components/LoginPage.tsx`)

### Mobile Layout Order
1. **Hero text** (badge + h1 + description) — top
2. **Login/Register card** (`max-w-lg` centered) — middle
3. **Feature grid cards** + trust stats — bottom

### Desktop Layout
- Left column: Hero text + feature grid + trust stats
- Right column: Login card

### Demo Login
- 4 quick-access demo accounts shown in the login card
- "Instant Demo Access" button in header (desktop)

---

## Development Commands

```bash
# Start development server
npm run dev

# Production build (verify before deploying)
npm run build

# Lint
npm run lint
```

---

## Key Design Conventions

- **No Redux** — all state in `App.tsx` via `useState`, passed as props
- **No API calls** — all data is mock/in-memory; replace `mockData.ts` with real API calls
- **Tailwind only** — no inline styles, no CSS modules
- **`isInDrawer` pattern** — pass to sidebar components to strip rounded corners in drawer mode
- **`sidebar-scroll` class** — custom scrollbar styling from `index.css`
- **All modals** use `fixed inset-0 z-50` with backdrop + scroll-safe containers
- **Breakpoint `min-[Xpx]:`** — custom Tailwind breakpoints used for fine-grained control

---

## Common Pitfalls

| Issue | Fix |
|---|---|
| Text overflow in sidebar headers | Add `truncate`, `min-w-0`, `shrink-0` to flex children |
| Modal clipped on mobile | Use `overflow-y-auto` on outer overlay + `min-h-full` wrapper |
| Right sidebar squishing | Use `shrink-0` + fixed `w-[400px]` instead of grid ratios |
| Left sidebar appearing when it should be in drawer | Check `min-[1300px]:block hidden` on sidebar div |
| Search bar button height mismatch | Use `h-10 w-10` fixed size on both input wrapper and button |
