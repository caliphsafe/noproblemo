# No Problemo — content ownership

## Website content (GitHub only)
Home, About, Contact, all design, static copy, brand assets and food/restaurant photography live in the repository. Do not edit them through Sheets or Apps Script.

## CMS (Google Sheets + Apps Script)
Keep these sheets:
- `Menu_Categories` — category name, description, order, active status.
- `Menu_Items` — items, descriptions, prices, category, availability.
- `Restaurant_Settings` — **store hours only**. Use `key` and `value` rows such as `hours_monday` → `11am–8pm`; `hours_tuesday` through `hours_sunday`. If your existing hours rows use a different naming convention, migrate their values into these keys. Do not overwrite other configuration before backing it up.
- `Events` — event date, title, artists, description, publication status, ticket link and `flyer_file_id`.

The admin at `/admin/cms` exposes only these four datasets. Event flyers upload to the configured Drive flyer folder. Never put the Apps Script secret in browser code.

## Retired tabs
`Site_Content`, `Media`, `Event_Artists`, `Modifier_Groups`, `Modifier_Options`, and `Menu_Item_Modifiers` are not used by the current public pages or simplified admin. **Do not delete yet**: make a copy of the workbook first and check whether any older tools still rely on them. You may hide them in Sheets after confirming.

## Apps Script
Keep the existing deployment and Script Properties. The website's API now allowlists only the four active datasets for admin operations; no Apps Script changes are required to make that restriction effective. As defense in depth, after checking other consumers, narrow the Apps Script public/action allowlists to the same active datasets and keep the image/upload actions used for event flyers. Do not delete the Drive folders or regenerate secrets.

## Hours
The site reads `hours_monday`, `hours_tuesday`, `hours_wednesday`, `hours_thursday`, `hours_friday`, `hours_saturday`, `hours_sunday` (and common aliases) from `Restaurant_Settings`. Missing hours show a call-to-confirm message rather than an invented schedule.

## Deployment
Commits to `main` trigger Vercel through the existing Git integration. Verify the build and test Menu, Events, Visit and /admin/cms after deploy.
