-- No Problemo: legacy public order ledger removal.
-- Run once if public_order_ledger still exists in an older deployment.
-- This does NOT remove orders, order_items, modifiers, or private order status.

DROP TRIGGER IF EXISTS trg_ledger_order ON public.orders;
DROP TRIGGER IF EXISTS trg_ledger_item ON public.order_items;

DROP FUNCTION IF EXISTS public.trg_refresh_order_from_order();
DROP FUNCTION IF EXISTS public.trg_refresh_order_from_item();
DROP FUNCTION IF EXISTS public.refresh_public_order(uuid);

DROP POLICY IF EXISTS "public read ledger" ON public.public_order_ledger;

DO $$
BEGIN
  IF to_regclass('public.public_order_ledger') IS NOT NULL THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.public_order_ledger';
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

DROP TABLE IF EXISTS public.public_order_ledger;
