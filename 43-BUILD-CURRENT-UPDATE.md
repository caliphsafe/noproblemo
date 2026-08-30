# No Problemo — Current 43 Build Update

## Customer experience

- Removed the public order ledger from the customer-facing experience.
- Removed stale/private order-status display that could show a previous order above the footer.
- Customer ordering now focuses on the chalkboard menu, ticket, and cash-at-pickup checkout.
- Desktop layout is three columns: **Categories / Menu / Your Order + Pickup**.
- Mobile keeps the horizontal swipeable category navigation and stacks the menu and order experience vertically.
- Menu item names use full contextual names such as **Regular Torta**.
- Cart and checkout retain modifier, addition/removal, and item-note details.
- Smaller logo and restrained chalkboard styling remain in place.

## Chalk styling

- Structured boxes remain; the interface is not intentionally scattered.
- Borders and separators use restrained distressed chalk SVGs rather than oversized solid strokes.
- Horizontal rules are approximately 2–3px visually and have small chalk gaps/texture.
- Panels use a thin distressed chalk frame with transparent interior so text never sits on the stroke.

## Supabase

No new database migration is required for the three-column layout or public-ledger removal if the previous removal migration was already completed.

If `public.public_order_ledger` still exists from an older database, run:

`supabase/remove-public-ledger.sql`

The corrected migration safely checks whether the table exists before changing the realtime publication.
