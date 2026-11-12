# VELCOR APPLIANCES — Quality for Every Home

Premium, mobile-responsive e-commerce for home appliances. Real online shop — Velcor sells its own stock and handles its own deliveries. **Pay after delivery** — no advance payment.

**Live Preview:** `npm run dev` → http://localhost:3000 (glass nav, champagne-gold + charcoal palette, light/dark)

### Brand & Design
- Palette: **Charcoal #1a1a1e, White #ffffff, Champagne-gold #c9a86a** — elegant, modern, established retailer feel
- Glass-effect navigation & cards, smooth animations, spacious layouts, large product photography
- Professional typography: **Cormorant Garamond** (headings) + **Inter/Manrope** (body)
- Fully responsive (phones/tablets/desktops) + **light/dark mode** toggle
- Consistent branding throughout

### Rooms & Categories (Admin Extensible)
- **Sitting Room:** Televisions, Sound Systems, Home Theatre, Fans, AC, Lamps
- **Kitchen:** Refrigerators, Microwaves, Blenders, Kettles, Air Fryers, Cookers, Toasters, Coffee Makers
- **Bedroom:** Bedroom TVs, Fans, AC, Bedside Lamps, Electric Blankets, Digital Clocks
- **Dining Room:** Water Dispensers, Food Warmers, Coffee Makers, Serving, Lighting
- **Laundry & Cleaning:** Washing Machines, Dryers, Vacuums, Irons, Steam Cleaners
- Admin can add categories/subcategories via `categories` table + UI

### Homepage
Premium nav + logo, search, cart, account access, hero (Quality for Every Home), Shop by Room, Featured, Bestsellers, New Arrivals, Special Offers (champagne block), Why Choose Velcor, Delivery info (own fleet), Testimonials, Newsletter, Footer with contact/social.

### Product Catalogue
Each product: name, unique ID (VEL-001), category/subcategory, **multiple photos** (Supabase Storage), description, brand, model, specs (key/value), price KSh, stock qty, availability (In Stock/Low/Out), featured/bestseller, warranty, date added.  
**Search, sort (price/rating/newest/name), filter by room/brand/price.** Individual product page with gallery, specs, qty, Add to Bag, Buy Now, stock guard.

### Cart
Add/remove, inc/dec qty (capped by stock), prices, subtotal, delivery charges, final total. Prevents ordering > stock. Persists in `localStorage` + Supabase `carts` when logged in.

### Checkout — Pay After Delivery
1. Browse → Add to cart → Checkout
2. Enter full name, phone, email (optional), delivery location, estate, town, building/house, instructions
3. Review order → **Cash on Delivery** (only option)
4. Submit → unique order number `VEL-YYYY-XXXXXX`
5. Confirmation → admin receives order → Velcor arranges own delivery → customer pays after delivery

Displayed everywhere: **"Pay after delivery. Place your order today and pay when your appliances arrive."**  
Payment statuses: Unpaid → Paid → Disputed → Refunded (admin only marks Paid).

### Order Management
Statuses: New Order → Confirmed → Processing → Ready for Delivery → Out for Delivery → Delivered → Cancelled  
Each order holds: number, customer details, products/qty/prices, address, delivery fee, total, payment method/status, order status, dates, delivery notes.  
**Track:** via order number + phone (guest) or account history. Admin can confirm/cancel, update statuses, manage payments, print.

### Own Delivery
Admin dashboard: assign personnel (riders/vans), record locations, set fees **per town** (configurable), update statuses, dispatch dates, confirm delivery, record cash collected. Fees update checkout instantly.

### Customer Accounts
Register, login, logout, profile, saved delivery info (pre-fills checkout), order history, tracking, management. **Guest checkout allowed** — no forced account.

### Admin Dashboard (Secure `/admin`)
Separate login: `admin@velcor.co.ke / Velcor2026!` + Supabase role `admin`.

**Product Management:** Add/edit/delete, multiple photos, price, categories, stock, featured.  
**Order Management:** View all, details, confirm/cancel, status, payment, print.  
**Inventory:** Stock levels, adjustments, movements log, low-stock (<5) & out-of-stock alerts, restock.  
**Deliveries:** Assign, fees, active monitor, confirm, cash collected.  
**Analytics:** Total orders, sales, outstanding (unpaid), completed/pending deliveries, bestsellers, low-stock.

### Tech Stack
React 18 + Vite 5 + JavaScript + Modern CSS (no Tailwind dependency) + Supabase Auth/Postgres/Storage + Vercel.  
Static SPA architecture, RLS-secured, env `VITE_*` only, no service-role keys in frontend.

### Database
`profiles, categories, products, product_images, inventory, carts, cart_items, orders, order_items, deliveries, delivery_personnel, payment_records, reviews, stock_movements`  
Relations, constraints, indexes, RLS, secure stock updates (trigger deducts on Confirm, restores on Cancel), anti-duplicate, anti-oversell. SQL in `supabase/schema.sql` + Storage bucket `product-images`.

### Security
Supabase Auth + role protection + RLS + validation (checkout, stock, phone, email) + protected admin ops + error/loading/empty states + toasts. No button-hiding-only security.

### Run Locally
```bash
npm install
npm run dev
# → http://localhost:3000
```
Add Supabase env to `.env.local` (see `.env.example`), run `supabase/schema.sql` in Supabase SQL Editor, create `product-images` bucket (public), create admin user in Auth and set `profiles.role = 'admin'`.

### Deploy to Vercel
Push to GitHub → Import in Vercel (Vite preset, build `npm run build`, output `dist`). Add env vars. Deploy.

### Demo Accounts
- Customer: `demo@velcor.co.ke / demo123` (or register new, or guest checkout)
- Admin: `admin@velcor.co.ke / Velcor2026!`

© 2026 Velcor Appliances Ltd. Nairobi, Kenya — Quality for Every Home.
