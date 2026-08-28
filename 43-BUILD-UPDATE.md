# No Problemo — 43 Build Update

This update simplifies the customer-facing experience around the two things that matter most: ordering from the menu and seeing the live kitchen ledger.

## What changed

- Compact chalkboard-first layout with the decorative dot overlay removed.
- No Problemo logo reduced to roughly 30% of its previous desktop footprint.
- Menu and live ledger are the primary desktop workspace; the ledger stays visible while browsing the menu.
- Vertical category navigation shows one menu category at a time instead of stacking the entire menu.
- Mobile keeps the same vertical category-navigation concept in a narrow left rail so the item list stays compact.
- Full contextual item names are shown throughout ordering, the public ledger, admin order board, history, and manual-order list. Examples: `Regular Torta`, `Regular Burrito`, `Beef Taco`.
- New orders snapshot the full contextual item name so kitchen tickets stay understandable even if the menu later changes.
- Existing ledger/admin orders are also enriched at the API layer when their original menu item still exists.
- Public checkout now requires the customer to choose whether their name appears on the live ledger. If they choose no, only the order number appears.
- Public ledger now includes safe preparation modifiers such as `ADD: guacamole`, `REMOVE: cheese`, and choice information. Phone numbers, customer notes, and item notes remain private.
- Admin kitchen cards emphasize full item names, additions/removals/modifiers, item notes, and order notes.

## Database note

No new table or column is required for this update. The existing `customer_public_name` field accepts an empty string when the customer opts out of showing their name. The updated APIs enrich item names and modifier group labels server-side.

## Deploy

Upload/commit the contents of this folder over the current project, then redeploy in Vercel. Your existing Supabase environment variables and database remain in place.
