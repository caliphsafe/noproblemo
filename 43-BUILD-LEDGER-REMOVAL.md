# No Problemo — 43 Build Update: Public Ledger Removed

This update removes the customer-facing public order ledger entirely.

## Customer experience

- The menu is now the dominant desktop and mobile experience.
- Desktop uses the organized chalkboard layout with a vertical category navigator and a compact two-column order/checkout area below.
- Mobile keeps the horizontal, swipeable category navigation and one-category-at-a-time menu browsing.
- The public `TODAY'S ORDERS` / `LIVE ORDERS` board is gone.
- The customer still receives a private order-status section after checkout using the secure customer order token.
- The checkout no longer asks whether the customer's name should appear on a public ledger.
- After checkout the confirmation says the order was received rather than saying it was placed on a public board.

## Backend

- The public ledger API route was removed.
- New web orders no longer populate a public-name/ledger workflow.
- `customer_public_name` remains in the orders table for backward compatibility with existing databases and older admin records; it is no longer exposed publicly.
- `supabase/schema.sql` no longer creates the legacy `public_order_ledger` table or its triggers/policies/realtime publication.
- Existing Supabase projects created from an older build should run `supabase/remove-public-ledger.sql` once.
- Private customer status remains available through `/api/orders/status`.

## Deployment

No new environment variables are required.

For an existing database:

1. Deploy the updated source.
2. Run `supabase/remove-public-ledger.sql` once in the Supabase SQL Editor.
3. Confirm the customer can place an order and see only their private order status.
4. Confirm the admin kitchen still receives the order and can update fulfillment/payment independently.
