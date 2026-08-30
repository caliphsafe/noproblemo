-- NO PROBLEMO 43 BUILD — Supabase/Postgres schema
create extension if not exists pgcrypto;

create type public.fulfillment_status as enum ('new','accepted','cooking','ready','picked_up','cancelled');
create type public.payment_status as enum ('unpaid','paid');
create type public.order_source as enum ('web','phone','walk_in','admin');
create type public.pickup_type as enum ('asap','scheduled');
create type public.modifier_selection_type as enum ('single','multiple');

create table public.admin_users(
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.menu_categories(
  id uuid primary key default gen_random_uuid(), name text not null unique, description text not null default '',
  sort_order int not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.menu_items(
  id uuid primary key default gen_random_uuid(), category_id uuid not null references public.menu_categories(id),
  name text not null, description text not null default '', price_cents int not null check(price_cents>=0),
  active boolean not null default true, sold_out boolean not null default false, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.modifier_groups(
  id uuid primary key default gen_random_uuid(), name text not null, selection_type modifier_selection_type not null default 'multiple',
  required boolean not null default false, min_select int not null default 0, max_select int, sort_order int not null default 0, active boolean not null default true
);
create table public.modifier_options(
  id uuid primary key default gen_random_uuid(), modifier_group_id uuid not null references public.modifier_groups(id) on delete cascade,
  name text not null, price_cents int not null default 0 check(price_cents>=0), sort_order int not null default 0, active boolean not null default true
);
create table public.menu_item_modifier_groups(
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  modifier_group_id uuid not null references public.modifier_groups(id) on delete cascade,
  sort_order int not null default 0, primary key(menu_item_id,modifier_group_id)
);

create sequence public.daily_order_sequence start 1;
create or replace function public.next_order_number() returns int language plpgsql as $$
declare n int; begin n:=nextval('public.daily_order_sequence'); if n>999 then alter sequence public.daily_order_sequence restart with 1; n:=nextval('public.daily_order_sequence'); end if; return n; end $$;

create table public.orders(
  id uuid primary key default gen_random_uuid(), order_number int not null default public.next_order_number(),
  customer_first_name text not null, customer_last_name text not null default '', customer_public_name text not null,
  phone text not null, pickup_type pickup_type not null default 'asap', pickup_time text,
  customer_notes text not null default '', admin_notes text not null default '', source order_source not null default 'web',
  subtotal_cents int not null check(subtotal_cents>=0), total_cents int not null check(total_cents>=0),
  fulfillment_status fulfillment_status not null default 'new', payment_status payment_status not null default 'unpaid',
  customer_token text not null unique, archived boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index orders_created_idx on public.orders(created_at desc);
create index orders_status_idx on public.orders(fulfillment_status,payment_status);

create table public.order_items(
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id), item_name_snapshot text not null, item_price_cents_snapshot int not null,
  quantity int not null check(quantity between 1 and 100), item_notes text not null default '', line_total_cents int not null check(line_total_cents>=0)
);
create table public.order_item_modifiers(
  id uuid primary key default gen_random_uuid(), order_item_id uuid not null references public.order_items(id) on delete cascade,
  modifier_option_id uuid references public.modifier_options(id), modifier_name_snapshot text not null, modifier_price_cents_snapshot int not null default 0
);
create table public.order_status_history(
  id bigint generated always as identity primary key, order_id uuid not null references public.orders(id) on delete cascade,
  from_status fulfillment_status, to_status fulfillment_status, payment_status payment_status,
  changed_by uuid references auth.users(id), created_at timestamptz not null default now()
);

create table public.restaurant_settings(
  id int primary key check(id=1), public_settings jsonb not null default '{}'::jsonb, private_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.public_restaurant_settings(
  id int primary key check(id=1), settings jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);


create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_users where user_id=auth.uid())
$$;

create or replace function public.sync_public_settings() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.public_restaurant_settings(id,settings,updated_at) values(1,new.public_settings,now()) on conflict(id) do update set settings=excluded.settings,updated_at=now(); return new; end $$;
create trigger trg_sync_public_settings after insert or update of public_settings on public.restaurant_settings for each row execute function public.sync_public_settings();

alter table public.admin_users enable row level security; alter table public.menu_categories enable row level security; alter table public.menu_items enable row level security;
alter table public.modifier_groups enable row level security; alter table public.modifier_options enable row level security; alter table public.menu_item_modifier_groups enable row level security;
alter table public.orders enable row level security; alter table public.order_items enable row level security; alter table public.order_item_modifiers enable row level security; alter table public.order_status_history enable row level security;
alter table public.restaurant_settings enable row level security; alter table public.public_restaurant_settings enable row level security;

create policy "public read categories" on public.menu_categories for select using(active=true);
create policy "public read items" on public.menu_items for select using(active=true);
create policy "public read groups" on public.modifier_groups for select using(active=true);
create policy "public read options" on public.modifier_options for select using(active=true);
create policy "public read menu links" on public.menu_item_modifier_groups for select using(true);
create policy "public read safe settings" on public.public_restaurant_settings for select using(true);

create policy "admin all admin_users" on public.admin_users for all using(public.is_admin()) with check(public.is_admin());
create policy "admin categories" on public.menu_categories for all using(public.is_admin()) with check(public.is_admin());
create policy "admin items" on public.menu_items for all using(public.is_admin()) with check(public.is_admin());
create policy "admin groups" on public.modifier_groups for all using(public.is_admin()) with check(public.is_admin());
create policy "admin options" on public.modifier_options for all using(public.is_admin()) with check(public.is_admin());
create policy "admin links" on public.menu_item_modifier_groups for all using(public.is_admin()) with check(public.is_admin());
create policy "admin orders" on public.orders for all using(public.is_admin()) with check(public.is_admin());
create policy "admin order_items" on public.order_items for all using(public.is_admin()) with check(public.is_admin());
create policy "admin order_mods" on public.order_item_modifiers for all using(public.is_admin()) with check(public.is_admin());
create policy "admin history" on public.order_status_history for all using(public.is_admin()) with check(public.is_admin());
create policy "admin settings" on public.restaurant_settings for all using(public.is_admin()) with check(public.is_admin());

-- Realtime-safe public tables. Run once; ignore duplicate-object errors if already added.
alter publication supabase_realtime add table public.menu_items;
alter publication supabase_realtime add table public.public_restaurant_settings;
