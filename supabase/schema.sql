-- =========================================================
-- VELCOR APPLIANCES — Complete Supabase Schema
-- Run in Supabase SQL Editor (Postgres 17)
-- =========================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- 1. PROFILES (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  estate text,
  building text,
  house_number text,
  town text default 'westlands',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CATEGORIES (room-based + admin extensible)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null,
  room text check (room in ('sitting-room','kitchen','bedroom','dining-room','laundry-cleaning','other')),
  icon text,
  image_url text,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index idx_categories_slug on categories(slug);
create index idx_categories_parent on categories(parent_id);

-- Seed room categories
insert into categories (name, slug, room, icon) values
('Sitting Room','sitting-room','sitting-room','🛋️'),
('Kitchen','kitchen','kitchen','🍳'),
('Bedroom','bedroom','bedroom','🛏️'),
('Dining Room','dining-room','dining-room','🍽️'),
('Laundry & Cleaning','laundry-cleaning','laundry-cleaning','✨')
on conflict (slug) do nothing;

-- 3. PRODUCTS
create table if not exists products (
  id text primary key, -- VEL-XXX or uuid
  name text not null,
  slug text unique not null,
  category_id uuid references categories(id) on delete set null,
  subcategory text,
  brand text not null,
  model text,
  description text,
  price int not null check (price >= 0),
  original_price int check (original_price is null or original_price >= price),
  stock int not null default 0 check (stock >= 0),
  availability text not null default 'In Stock' check (availability in ('In Stock','Low Stock','Out of Stock')),
  featured boolean default false,
  bestseller boolean default false,
  warranty text,
  rating numeric(2,1) default 0 check (rating >=0 and rating <=5),
  reviews_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_products_category on products(category_id);
create index idx_products_featured on products(featured) where featured = true;
create index idx_products_bestseller on products(bestseller) where bestseller = true;
create index idx_products_price on products(price);
create index idx_products_availability on products(availability);

-- 4. PRODUCT_IMAGES
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);
create index idx_product_images_product on product_images(product_id);

-- 5. INVENTORY (denormalized helper + stock ledger)
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id text unique references products(id) on delete cascade,
  quantity int not null default 0,
  low_stock_threshold int default 5,
  updated_at timestamptz default now()
);

-- 6. CARTS
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_token text, -- for guest carts
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint carts_owner check (user_id is not null or guest_token is not null),
  unique(user_id),
  unique(guest_token)
);

-- 7. CART_ITEMS
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  quantity int not null check (quantity > 0),
  price_at_add int not null, -- snapshot
  created_at timestamptz default now(),
  unique(cart_id, product_id)
);
create index idx_cart_items_cart on cart_items(cart_id);

-- 8. ORDERS (Pay After Delivery)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null, -- VEL-YYYY-XXXX
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  -- delivery address
  town text not null,
  estate text not null,
  building text not null,
  house_number text,
  delivery_instructions text,
  -- amounts
  subtotal int not null check (subtotal >=0),
  delivery_fee int not null default 0 check (delivery_fee >=0),
  total int not null check (total >=0),
  -- payment & status
  payment_method text not null default 'Cash on Delivery' check (payment_method = 'Cash on Delivery'),
  payment_status text not null default 'Unpaid' check (payment_status in ('Unpaid','Paid','Payment disputed','Refunded')),
  order_status text not null default 'New Order' check (order_status in ('New Order','Confirmed','Processing','Ready for Delivery','Out for Delivery','Delivered','Cancelled')),
  -- delivery
  delivery_personnel text,
  dispatch_date timestamptz,
  delivery_confirmed_at timestamptz,
  cash_collected int default 0,
  -- meta
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_orders_user on orders(user_id);
create index idx_orders_number on orders(order_number);
create index idx_orders_status on orders(order_status);
create index idx_orders_phone on orders(customer_phone);
create unique index idx_orders_number_unique on orders(order_number);

-- 9. ORDER_ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_name text not null,
  brand text,
  model text,
  quantity int not null check (quantity >0),
  unit_price int not null,
  total_price int not null
);
create index idx_order_items_order on order_items(order_id);

-- 10. DELIVERY_PERSONNEL
create table if not exists delivery_personnel (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  vehicle text, -- Bike KDB 123X etc
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 11. DELIVERIES (tracks each physical delivery)
create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  personnel_id uuid references delivery_personnel(id) on delete set null,
  town text not null,
  estate text not null,
  delivery_fee int not null,
  status text not null default 'Assigned' check (status in ('Assigned','In Transit','Delivered','Failed')),
  dispatch_date timestamptz,
  delivered_at timestamptz,
  delivery_confirmation text, -- signature / OTP
  cash_collected int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_deliveries_order on deliveries(order_id);
create index idx_deliveries_personnel on deliveries(personnel_id);

-- 12. PAYMENT_RECORDS
create table if not exists payment_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  amount int not null,
  payment_method text not null default 'Cash on Delivery',
  payment_status text not null check (payment_status in ('Unpaid','Paid','Payment disputed','Refunded')),
  collected_by uuid references auth.users(id),
  collected_at timestamptz,
  notes text,
  created_at timestamptz default now()
);
create index idx_payment_records_order on payment_records(order_id);

-- 13. REVIEWS
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean default true,
  created_at timestamptz default now()
);
create index idx_reviews_product on reviews(product_id);

-- 14. STOCK_MOVEMENTS (audit trail)
create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  delta int not null, -- negative for deduction, positive for restock
  reason text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index idx_stock_movements_product on stock_movements(product_id);
create index idx_stock_movements_order on stock_movements(order_id);

-- =========================================================
-- FUNCTIONS & TRIGGERS — Safe stock handling
-- =========================================================

-- Sync inventory on product change
create or replace function sync_inventory() returns trigger as $$
begin
  insert into inventory (product_id, quantity) values (new.id, new.stock)
  on conflict (product_id) do update set quantity = excluded.quantity, updated_at = now();
  return new;
end; $$ language plpgsql;
drop trigger if exists trg_sync_inventory on products;
create trigger trg_sync_inventory after insert or update of stock on products for each row execute function sync_inventory();

-- Deduct stock when order is confirmed (not on creation, to allow cancellation)
create or replace function deduct_stock_on_confirm() returns trigger as $$
declare
  item record;
  available int;
begin
  if old.order_status = 'New Order' and new.order_status in ('Confirmed','Processing') then
    for item in select * from order_items where order_id = new.id loop
      select stock into available from products where id = item.product_id for update;
      if available < item.quantity then
        raise exception 'Insufficient stock for product %: available %, requested %', item.product_id, available, item.quantity;
      end if;
      update products set stock = stock - item.quantity,
        availability = case when stock - item.quantity = 0 then 'Out of Stock' when stock - item.quantity < 5 then 'Low Stock' else 'In Stock' end
      where id = item.product_id;
      insert into stock_movements (product_id, order_id, delta, reason) values (item.product_id, new.id, -item.quantity, 'Order confirmed: ' || new.order_number);
    end loop;
  end if;

  -- Restore on cancel
  if old.order_status != 'Cancelled' and new.order_status = 'Cancelled' then
    for item in select * from order_items where order_id = new.id loop
      update products set stock = stock + item.quantity,
        availability = case when stock + item.quantity = 0 then 'Out of Stock' when stock + item.quantity < 5 then 'Low Stock' else 'In Stock' end
      where id = item.product_id;
      insert into stock_movements (product_id, order_id, delta, reason) values (item.product_id, new.id, item.quantity, 'Order cancelled: ' || new.order_number || ' - stock restored');
    end loop;
  end if;

  new.updated_at = now();
  return new;
end; $$ language plpgsql;
drop trigger if exists trg_deduct_stock on orders;
create trigger trg_deduct_stock before update of order_status on orders for each row execute function deduct_stock_on_confirm();

-- Prevent overselling at cart checkout (check before order_items insert)
create or replace function check_stock_before_order_item() returns trigger as $$
declare available int;
begin
  select stock into available from products where id = new.product_id;
  if available < new.quantity then
    raise exception 'Not enough stock for product %', new.product_id;
  end if;
  return new;
end; $$ language plpgsql;
drop trigger if exists trg_check_stock on order_items;
create trigger trg_check_stock before insert on order_items for each row execute function check_stock_before_order_item();

-- Auto-update updated_at
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists trg_touch_profiles on profiles;
create trigger trg_touch_profiles before update on profiles for each row execute function touch_updated_at();
drop trigger if exists trg_touch_products on products;
create trigger trg_touch_products before update on products for each row execute function touch_updated_at();
drop trigger if exists trg_touch_orders on orders;
create trigger trg_touch_orders before update on orders for each row execute function touch_updated_at();

-- =========================================================
-- RLS POLICIES
-- =========================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table inventory enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table deliveries enable row level security;
alter table delivery_personnel enable row level security;
alter table payment_records enable row level security;
alter table reviews enable row level security;
alter table stock_movements enable row level security;

-- Helper: is_admin()
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer;

-- Profiles: users can read/update own, admins all
drop policy if exists "profiles_self_select" on profiles;
create policy "profiles_self_select" on profiles for select using (auth.uid() = id or is_admin());
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles for update using (auth.uid() = id or is_admin());
drop policy if exists "profiles_insert" on profiles;
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);

-- Categories & Products: public read, admin write
drop policy if exists "categories_public_read" on categories;
create policy "categories_public_read" on categories for select using (is_active = true or is_admin());
drop policy if exists "categories_admin_write" on categories;
create policy "categories_admin_write" on categories for all using (is_admin());

drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products for select using (true);
drop policy if exists "products_admin_write" on products;
create policy "products_admin_write" on products for all using (is_admin());

drop policy if exists "product_images_public_read" on product_images;
create policy "product_images_public_read" on product_images for select using (true);
drop policy if exists "product_images_admin_write" on product_images;
create policy "product_images_admin_write" on product_images for all using (is_admin());

-- Inventory: admin only, plus readable for stock checks via function
drop policy if exists "inventory_admin" on inventory;
create policy "inventory_admin" on inventory for all using (is_admin());
drop policy if exists "inventory_public_read" on inventory;
create policy "inventory_public_read" on inventory for select using (true);

-- Carts: owner only
drop policy if exists "carts_owner" on carts;
create policy "carts_owner" on carts for all using (auth.uid() = user_id or is_admin());
drop policy if exists "cart_items_owner" on cart_items;
create policy "cart_items_owner" on cart_items for all using (
  exists (select 1 from carts c where c.id = cart_id and (c.user_id = auth.uid() or is_admin()))
);

-- Orders: users see own, admins see all; users can insert own (guest allowed with phone verification via edge function)
drop policy if exists "orders_select_own" on orders;
create policy "orders_select_own" on orders for select using (auth.uid() = user_id or is_admin() or customer_phone = (auth.jwt() ->> 'phone'));
drop policy if exists "orders_insert" on orders;
create policy "orders_insert" on orders for insert with check (true); -- validated in edge function / trigger; guest allowed
drop policy if exists "orders_update_admin" on orders;
create policy "orders_update_admin" on orders for update using (is_admin());
drop policy if exists "orders_update_own_cancel" on orders;
create policy "orders_update_own_cancel" on orders for update using (auth.uid() = user_id and order_status = 'New Order') with check (order_status = 'Cancelled');

drop policy if exists "order_items_select" on order_items;
create policy "order_items_select" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin()))
);
drop policy if exists "order_items_insert" on order_items;
create policy "order_items_insert" on order_items for insert with check (true);

-- Deliveries: admin only, plus personnel can view assigned
drop policy if exists "deliveries_admin" on deliveries;
create policy "deliveries_admin" on deliveries for all using (is_admin());
drop policy if exists "deliveries_select_own_order" on deliveries;
create policy "deliveries_select_own_order" on deliveries for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);

drop policy if exists "delivery_personnel_admin" on delivery_personnel;
create policy "delivery_personnel_admin" on delivery_personnel for all using (is_admin());
drop policy if exists "delivery_personnel_public_read" on delivery_personnel;
create policy "delivery_personnel_public_read" on delivery_personnel for select using (is_active = true);

-- Payment records: admin only
drop policy if exists "payment_records_admin" on payment_records;
create policy "payment_records_admin" on payment_records for all using (is_admin());

-- Reviews: public read, authenticated create
drop policy if exists "reviews_public_read" on reviews;
create policy "reviews_public_read" on reviews for select using (is_approved = true);
drop policy if exists "reviews_authenticated_insert" on reviews;
create policy "reviews_authenticated_insert" on reviews for insert with check (auth.role() = 'authenticated');

-- Stock movements: admin only
drop policy if exists "stock_movements_admin" on stock_movements;
create policy "stock_movements_admin" on stock_movements for all using (is_admin());

-- =========================================================
-- STORAGE BUCKETS (create via dashboard or SQL)
-- =========================================================
-- Run these in Supabase Dashboard > Storage or via API:
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict (id) do nothing;
-- Policies for storage.objects:
-- create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "Admin upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and is_admin());
-- create policy "Admin delete product images" on storage.objects for delete using (bucket_id = 'product-images' and is_admin());

-- =========================================================
-- SEED: Sample Velcor products
-- =========================================================
insert into products (id, name, slug, subcategory, brand, model, description, price, original_price, stock, availability, featured, bestseller, warranty, rating, reviews_count) values
('VEL-001','Samsung 65" Crystal UHD 4K Smart TV','samsung-65-crystal-uhd-4k-smart-tv','Televisions','Samsung','UA65CU7000','Immerse yourself in stunning 4K clarity with Crystal UHD. Crystal Processor 4K, HDR10+ and Smart Hub.',89900,115000,12,'In Stock',true,true,'2 Years Warranty',4.9,127),
('VEL-004','Hisense 320L No-Frost Refrigerator','hisense-320l-no-frost-refrigerator','Refrigerators','Hisense','REF320DR','Champagne-gold double-door fridge. No-frost, multi-airflow, super cool & super freeze.',68900,null,14,'In Stock',true,true,'3 Years Warranty',4.8,98)
on conflict (id) do nothing;
