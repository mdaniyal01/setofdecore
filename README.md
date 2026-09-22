# Set of Decore

Home textiles & décor e-commerce platform for the Pakistani market.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + MongoDB/Mongoose + Cloudinary. COD-first checkout, supplier-based procurement workflow, RBAC admin panel.

## Status: Phase 1 — Foundation

What exists so far:
- Project scaffold (Next.js App Router, Tailwind with brand tokens, TypeScript)
- Core Mongoose models: `Product` (with variants + supplier fields kept internal),
  `Category`, `Supplier`, `Customer`, `Order` (server-calculated totals, full status
  history), `AdminUser` (role-based)
- `src/lib/permissions.ts` — role → permission map used for server-side authorization
  on every admin API route (never rely on hiding UI buttons)
- `GET /api/products` — public endpoint that explicitly strips supplier cost /
  internal notes before responding
- Homepage skeleton (hero + category section placeholders)

## Not yet built (upcoming phases)
- Cart, checkout, order creation with server-side price/coupon calculation
- Admin panel UI (dashboard, product/order/supplier CRUD)
- Auth (customer + admin, JWT + bcrypt)
- Cloudinary signed upload flow
- SEO: sitemap.xml, robots.txt, JSON-LD, per-entity metadata
- Reviews, wishlist, coupons, campaigns, bundles
- Procurement + packaging workflow screens

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in real MongoDB Atlas / Cloudinary /
   JWT values (never commit `.env.local`).
3. `npm run dev`

## Security notes
- Supplier cost, internal notes, and cost price are excluded from every
  customer-facing query (see `Product.ts` `INTERNAL_ONLY_FIELDS` and the
  `.select()` exclusion in `api/products/route.ts`). Apply the same pattern to
  every new public endpoint.
- Order totals must always be recalculated server-side from DB prices —
  never trust a total sent from the client (see section 93 of the product spec).
