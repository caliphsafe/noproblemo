-- NO PROBLEMO — remove the legacy public order ledger
-- Run this ONCE in Supabase if your existing project was created with an earlier 43 Build.
-- Customer order status remains available privately through /api/orders/status.

drop trigger if exists trg_ledger_order on public.orders;
drop trigger if exists trg_ledger_item on public.order_items;
drop function if exists public.trg_refresh_order_from_order();
drop function if exists public.trg_refresh_order_from_item();
drop function if exists public.refresh_public_order(uuid);
drop policy if exists "public read ledger" on public.public_order_ledger;
alter publication supabase_realtime drop table if exists public.public_order_ledger;
drop table if exists public.public_order_ledger;
