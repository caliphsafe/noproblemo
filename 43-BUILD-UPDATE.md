# 43 BUILD UPDATE — CHALKBOARD UX PASS

This update pushes the public ordering experience away from conventional web cards and boxes and toward an actual hand-drawn restaurant chalkboard.

## Public experience

- Replaced most straight CSS borders with reusable distressed chalk-stroke SVG rules.
- Removed decorative background dots completely.
- Reduced the logo again for a faster, menu-first first screen.
- Desktop keeps the efficient vertical category navigator.
- Mobile now uses a horizontal, swipeable category rail with previous/next chalk arrows and direct swipe gestures on the menu itself.
- Menu rows use irregular chalk separators instead of clean lines or cards.
- Ledger orders no longer sit inside perfect rectangles; they are separated by rough chalk strokes.
- Checkout fields use chalk underlines instead of standard boxed inputs.
- Radio buttons and checkboxes use hand-drawn marks.
- Buttons are rendered as chalk writing with rough stroke lines instead of conventional button boxes.
- The item customization modal now reads more like an emphasized section of the chalkboard than a floating web card.

## Existing ordering improvements retained

- Full menu item names are preserved across cart, ledger and admin tickets (for example, `Regular Torta`, not simply `Regular`).
- Public ledger still supports the customer's choice to show first name + last initial or order number only.
- Modifier details including additions/removals are preserved for the customer cart, public ledger where safe, and admin kitchen board.
- Admin remains operationally dense while inheriting the chalk visual language.

## Deployment

No new database migration is required for this visual/mobile pass. Replace the project files with this ZIP contents and redeploy through Vercel.
