# No Problemo — Interactive Chalkboard Ordering System

This version intentionally has **no public order ledger**. Customers receive a private order-status view tied to their secure order token; staff see the full operational order board in `/admin`.

A 43 Build for No Problemo, 813 Purchase Street, New Bedford, MA 02740. The public experience is an interactive chalkboard menu with cash-at-pickup ordering, private customer order tracking, and a Supabase-backed kitchen/admin dashboard.

## Included

- Mobile-first one-page chalkboard menu and ordering flow
- Full menu seed transcribed from the current MenuJoy No Problemo menu (MenuJoy page updated March 26, 2026)
- Cash-only checkout — no payment processor
- Server-authoritative pricing in integer cents
- Order snapshots so historical totals do not change when menu prices change
- Private customer order token stored in the browser
- Separate fulfillment and payment states
- Supabase Auth protected `/admin`
- Kitchen columns: New / Cooking / Ready
- Accept, cook, ready, picked-up, paid/unpaid, cancel and archive actions
- Manual phone / walk-in / admin orders
- Menu price, description, active/sold-out and sort-order management
- Modifier price/availability management
- Restaurant hours, wait-time, ordering pause, open override, announcement, phone and address settings
- Supabase Realtime subscriptions for menu/settings with a low-frequency safety refresh
- RLS policies and service-role-only server operations for private order data
- SEO/AEO/GEO metadata, Restaurant schema, sitemap and robots
- Accessibility and reduced-motion support

## Important asset note

`public/logo.png` is the distressed white-chalk logo created for this project.

`public/noprobs.avif` is included as a generated chalkboard-texture fallback so the project runs immediately. If you already have the specific `noprobs.avif` chalkboard image you want to use, replace this file with your final image **using the exact same filename**. No code change is needed.

## 1. Create the Supabase project

1. Go to Supabase and create a new project.
2. In **SQL Editor**, run `supabase/schema.sql` first.
3. Then run `supabase/seed.sql`.
4. Open **Project Settings → API** and copy:
   - Project URL
   - anon/public key
   - service_role key
5. Never expose the service-role key in browser code or commit it to GitHub.

### If the Realtime publication lines report “already member of publication”

That simply means the table is already enabled for Realtime. Do not rerun those individual `ALTER PUBLICATION` statements.

## 2. Create the first admin

1. In Supabase go to **Authentication → Users → Add user**.
2. Create the restaurant owner's email/password account.
3. Copy the newly-created user's UUID.
4. In SQL Editor run:

```sql
insert into public.admin_users(user_id, display_name)
values ('PASTE-AUTH-USER-UUID-HERE', 'No Problemo Admin');
```

5. Visit `/admin` and sign in with that email/password.

Only users present in `admin_users` pass the server admin authorization check.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` for local development and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://YOUR-FINAL-DOMAIN.com
ADMIN_EMAIL=owner@example.com
```

`ADMIN_EMAIL` is documentation/convenience only; authorization is controlled by the `admin_users` table.

## 4. GitHub

This project is designed for the GitHub web workflow.

1. Create a new GitHub repository.
2. Upload every file/folder from this project ZIP.
3. Do not upload `.env.local`.
4. Do not add `package-lock.json`; this 43 Build intentionally excludes it.
5. Commit to `main`.

## 5. Vercel

1. In Vercel choose **Add New → Project**.
2. Import the GitHub repository.
3. Framework should auto-detect as Next.js.
4. Add the four runtime environment variables from step 3 under **Project Settings → Environment Variables**.
5. Deploy.
6. Set `NEXT_PUBLIC_SITE_URL` to the final production URL/domain and redeploy after the domain is attached.

## 6. Custom domain

After attaching the real domain in Vercel:

- Update `NEXT_PUBLIC_SITE_URL` to the canonical `https://...` URL.
- Redeploy.
- Verify `/sitemap.xml` and `/robots.txt`.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools.

## 7. Verify the real restaurant menu before launch

The seed was transcribed from the MenuJoy menu supplied for this project. Before launch, the owner/manager should compare every item, modifier, price and hour against the restaurant's current in-store menu. MenuJoy currently shows Mon–Wed 11–8, Thu–Sat 11–9 and Sunday 12–8, but business-directory data can disagree on Sunday hours, so the restaurant should confirm Sunday directly before production launch.

After launch, Supabase is the authoritative menu source. Routine changes can be made from `/admin` without editing code.

## 8. Production test checklist

Before accepting real orders, test all of these on both iPhone-size mobile and desktop:

1. Add a burrito with modifiers and confirm client total.
2. Submit an order and confirm the database total matches exactly.
5. Refresh the customer's page and confirm the saved token restores order status.
6. Change order New → Cooking → Ready from `/admin`; confirm the customer status changes without manual refresh.
7. Toggle Paid independently of Picked Up.
8. Mark an item Sold Out and confirm customers cannot order it.
9. Pause online ordering and confirm the existing cart remains intact while submission is blocked.
10. Force Closed and Force Open from settings.
11. Change wait time and confirm the public board updates.
12. Create a phone/walk-in order from the admin screen.
13. Cancel an order and verify it remains in order history.
14. Archive an old order and verify it remains stored.
15. Test a failed/malicious request with a fake item price; the server must ignore it and calculate from the database.
16. Test keyboard navigation, focus visibility and reduced-motion mode.

## Security notes

- Public order creation runs through a Next.js server route using the service role; the browser never receives the service-role key.
- The client submits menu-item IDs, modifier-option IDs and quantities — not trusted prices.
- Server code re-fetches menu and modifier prices, checks availability and checks modifier-to-item relationships.
- Private customer details are only exposed through authenticated admin views or a valid private customer token.
- Admin API endpoints validate the Supabase access token and then verify membership in `admin_users`.
- In-memory request limiting is included as a first layer. For a high-volume production rollout, connect Vercel Firewall/Rate Limiting or Upstash Redis so rate limits are durable across serverless instances.
- For SMS notifications, add a dedicated transactional SMS provider later; phone numbers are already captured privately.

## Operational recommendation

Run the system in “staff test mode” for several shifts before advertising online ordering. Have staff practice accepting, cooking, marking ready, taking cash, marking paid and marking picked up. The kitchen workflow matters more than visual polish once real tickets begin arriving.

## File map

- `app/page.tsx` — public ordering page
- `components/OrderingApp.tsx` — menu/cart/checkout/private status experience
- `app/admin/page.tsx` — secure admin entry
- `components/AdminApp.tsx` — kitchen/menu/settings/manual-order dashboard
- `app/api/orders/*` — order creation and private status APIs
- `app/api/admin/*` — protected operations
- `lib/hours.ts` — America/New_York open/closed logic
- `supabase/schema.sql` — production database schema, RLS and realtime publication
- `supabase/seed.sql` — initial No Problemo menu/settings/modifiers
- `public/logo.png` — white chalk logo
- `public/noprobs.avif` — replaceable chalkboard background

## No online payment

The system intentionally has no Stripe, Square or card flow. Every order communicates **PAY CASH AT PICKUP** and payment status is controlled manually by restaurant staff.


### Updating an existing Supabase project

If the project was created from an earlier version that included `public_order_ledger`, run `supabase/remove-public-ledger.sql` once. This removes the legacy public ledger table and triggers without affecting private customer order status or the admin kitchen workflow.
