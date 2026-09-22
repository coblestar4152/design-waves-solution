-- ============================================================
-- Design Waves Solution — Initial Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- profiles: links auth.users to an admin role
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- site_settings: singleton row (id = 1)
-- ------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  site_name text not null default 'Design Waves Solution',
  short_name text not null default 'Design Waves',
  browser_title text not null default 'Design Waves Solution',
  meta_description text not null default 'Creative agency & digital studio portfolio.',
  favicon_url text,
  logo_url text,
  logo_size int not null default 40,
  logo_visible boolean not null default true,
  footer_text text not null default '© Design Waves Solution. All rights reserved.',
  copyright_text text not null default 'Design Waves Solution',
  nav_labels jsonb not null default '{"home":"Home","portfolio":"Portfolio","services":"Services","about":"About","reviews":"Reviews","contact":"Contact"}',
  hero_heading text not null default 'We Design the Wave of What''s Next',
  hero_description text not null default 'Editable placeholder: describe your creative studio here from the admin panel.',
  hero_cta_text text not null default 'View Our Work',
  seo_og_image text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- theme_settings: singleton row (id = 1)
-- ------------------------------------------------------------
create table if not exists theme_settings (
  id int primary key default 1,
  primary_color text not null default '#00d9ff',
  secondary_color text not null default '#9b5cff',
  accent_color text not null default '#ff2e9e',
  background_color text not null default '#0a0a16',
  background_color_2 text not null default '#12122a',
  text_color text not null default '#f2f2fa',
  card_style text not null default 'glass' check (card_style in ('glass','solid','outline')),
  border_radius int not null default 16,
  glow_intensity int not null default 18,
  gradient_style text not null default 'linear' check (gradient_style in ('linear','radial','conic')),
  font_family text not null default 'Poppins',
  mode text not null default 'dark' check (mode in ('dark','light')),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into theme_settings (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- animation_settings: singleton row (id = 1)
-- ------------------------------------------------------------
create table if not exists animation_settings (
  id int primary key default 1,
  animations_enabled boolean not null default true,
  particles_enabled boolean not null default true,
  waves_enabled boolean not null default true,
  hover_effects_enabled boolean not null default true,
  page_transitions_enabled boolean not null default true,
  intensity int not null default 60,
  speed int not null default 50,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into animation_settings (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- service_categories
-- ------------------------------------------------------------
create table if not exists service_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- services
-- ------------------------------------------------------------
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references service_categories(id) on delete set null,
  name text not null,
  description text,
  image_url text,
  icon text,
  featured boolean not null default false,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- portfolio_categories
-- ------------------------------------------------------------
create table if not exists portfolio_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- portfolio_items
-- ------------------------------------------------------------
create table if not exists portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references portfolio_categories(id) on delete set null,
  title text not null,
  description text,
  cover_image_url text,
  video_url text,
  project_url text,
  featured boolean not null default false,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- portfolio_images (extra gallery images per item)
-- ------------------------------------------------------------
create table if not exists portfolio_images (
  id uuid primary key default uuid_generate_v4(),
  portfolio_item_id uuid not null references portfolio_items(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- about_content: singleton row (id = 1)
-- ------------------------------------------------------------
create table if not exists about_content (
  id int primary key default 1,
  heading text not null default 'About Design Waves',
  description text not null default 'Editable placeholder: add your studio''s story from the admin panel.',
  mission text not null default 'Editable placeholder mission statement.',
  vision text not null default 'Editable placeholder vision statement.',
  image_url text,
  extra_content text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into about_content (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- reviews
-- ------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  avatar_url text,
  review_text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  service_name text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- social_links (contact platforms)
-- ------------------------------------------------------------
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform_name text not null,
  url text not null,
  icon text not null default 'link',
  label text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table site_settings enable row level security;
alter table theme_settings enable row level security;
alter table animation_settings enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table portfolio_categories enable row level security;
alter table portfolio_items enable row level security;
alter table portfolio_images enable row level security;
alter table about_content enable row level security;
alter table reviews enable row level security;
alter table social_links enable row level security;

-- Helper: is the current user an admin (has a profiles row)?
-- SECURITY DEFINER lets this function bypass RLS on `profiles` when it queries it,
-- which is what prevents infinite policy recursion (profiles' own write policy
-- calls is_admin(), which must not re-trigger that same policy). `search_path`
-- is pinned explicitly to block search_path-hijacking attacks against
-- SECURITY DEFINER functions (a Postgres/Supabase security-linter best practice).
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

revoke all on function is_admin() from public;
grant execute on function is_admin() to anon, authenticated;

-- profiles: a user can read their own row; only admins manage
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all using (is_admin()) with check (is_admin());

-- Generic pattern for every content table:
--   public can SELECT only active/published rows; admins (via the "_write"
--   policy below, which also covers SELECT) can see everything including
--   drafts/hidden rows. Singleton settings tables have no draft concept,
--   so their "_read" policies stay open to everyone.

create policy "site_settings_read" on site_settings for select using (true);
create policy "site_settings_write" on site_settings for all using (is_admin()) with check (is_admin());

create policy "theme_settings_read" on theme_settings for select using (true);
create policy "theme_settings_write" on theme_settings for all using (is_admin()) with check (is_admin());

create policy "animation_settings_read" on animation_settings for select using (true);
create policy "animation_settings_write" on animation_settings for all using (is_admin()) with check (is_admin());

create policy "service_categories_read" on service_categories for select using (active = true);
create policy "service_categories_write" on service_categories for all using (is_admin()) with check (is_admin());

create policy "services_read" on services for select using (active = true);
create policy "services_write" on services for all using (is_admin()) with check (is_admin());

create policy "portfolio_categories_read" on portfolio_categories for select using (active = true);
create policy "portfolio_categories_write" on portfolio_categories for all using (is_admin()) with check (is_admin());

create policy "portfolio_items_read" on portfolio_items for select using (active = true);
create policy "portfolio_items_write" on portfolio_items for all using (is_admin()) with check (is_admin());

create policy "portfolio_images_read" on portfolio_images for select using (
  exists (
    select 1 from portfolio_items pi
    where pi.id = portfolio_images.portfolio_item_id and pi.active = true
  )
);
create policy "portfolio_images_write" on portfolio_images for all using (is_admin()) with check (is_admin());

create policy "about_content_read" on about_content for select using (true);
create policy "about_content_write" on about_content for all using (is_admin()) with check (is_admin());

create policy "reviews_read" on reviews for select using (active = true);
create policy "reviews_write" on reviews for all using (is_admin()) with check (is_admin());

create policy "social_links_read" on social_links for select using (active = true);
create policy "social_links_write" on social_links for all using (is_admin()) with check (is_admin());

-- ============================================================
-- SEED DATA (service categories/services, contact platforms)
-- ============================================================

insert into service_categories (name, slug, display_order) values
  ('Editing', 'editing', 1),
  ('Minecraft Developer', 'minecraft-developer', 2),
  ('Discord Developer', 'discord-developer', 3),
  ('Other', 'other', 4)
on conflict (slug) do nothing;

insert into services (category_id, name, description, display_order)
select id, v.name, 'Editable placeholder description.', v.ord
from service_categories, (values
  ('Graphic Design', 1), ('Video Editing', 2), ('Photo Editing', 3),
  ('Thumbnail Design', 4), ('Banner Design', 5), ('Logo Design', 6)
) as v(name, ord)
where service_categories.slug = 'editing'
on conflict do nothing;

insert into services (category_id, name, description, display_order)
select id, v.name, 'Editable placeholder description.', v.ord
from service_categories, (values
  ('Minecraft Skins', 1), ('3D Minecraft Animation', 2),
  ('Minecraft Texture Pack', 3), ('Minecraft Server Management', 4)
) as v(name, ord)
where service_categories.slug = 'minecraft-developer'
on conflict do nothing;

insert into services (category_id, name, description, display_order)
select id, v.name, 'Editable placeholder description.', v.ord
from service_categories, (values
  ('Discord Bot Setup', 1), ('Discord Server Management & Assistance', 2)
) as v(name, ord)
where service_categories.slug = 'discord-developer'
on conflict do nothing;

insert into services (category_id, name, description, display_order)
select id, v.name, 'Editable placeholder description.', v.ord
from service_categories, (values
  ('Web Design', 1), ('Technical & Creative Solutions', 2)
) as v(name, ord)
where service_categories.slug = 'other'
on conflict do nothing;

insert into portfolio_categories (name, slug, display_order) values
  ('Graphic Design', 'graphic-design', 1),
  ('Video Editing', 'video-editing', 2),
  ('Photo Editing', 'photo-editing', 3),
  ('Thumbnail', 'thumbnail', 4),
  ('Banner', 'banner', 5),
  ('Logo', 'logo', 6),
  ('Minecraft', 'minecraft', 7),
  ('Discord', 'discord', 8),
  ('Web Design', 'web-design', 9),
  ('Other', 'other', 10)
on conflict (slug) do nothing;

insert into social_links (platform_name, url, icon, label, display_order) values
  ('WhatsApp', 'https://wa.me/10000000000', 'whatsapp', 'Chat on WhatsApp', 1),
  ('Discord', 'https://discord.gg/your-invite', 'discord', 'Join our Discord', 2),
  ('Gmail', 'mailto:contact@example.com', 'mail', 'contact@example.com', 3)
on conflict do nothing;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('logos', 'logos', true, 5242880, array['image/png','image/jpeg','image/webp','image/svg+xml','image/x-icon','image/vnd.microsoft.icon']),
  ('portfolio', 'portfolio', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif']),
  ('services', 'services', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('reviews', 'reviews', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('about', 'about', true, 10485760, array['image/png','image/jpeg','image/webp']),
  ('general', 'general', true, 10485760, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read for all these buckets
create policy "public_read_logos" on storage.objects for select using (bucket_id = 'logos');
create policy "public_read_portfolio" on storage.objects for select using (bucket_id = 'portfolio');
create policy "public_read_services" on storage.objects for select using (bucket_id = 'services');
create policy "public_read_reviews" on storage.objects for select using (bucket_id = 'reviews');
create policy "public_read_about" on storage.objects for select using (bucket_id = 'about');
create policy "public_read_general" on storage.objects for select using (bucket_id = 'general');

-- Admin write access to all buckets
create policy "admin_write_logos" on storage.objects for insert with check (bucket_id = 'logos' and is_admin());
create policy "admin_update_logos" on storage.objects for update using (bucket_id = 'logos' and is_admin());
create policy "admin_delete_logos" on storage.objects for delete using (bucket_id = 'logos' and is_admin());

create policy "admin_write_portfolio" on storage.objects for insert with check (bucket_id = 'portfolio' and is_admin());
create policy "admin_update_portfolio" on storage.objects for update using (bucket_id = 'portfolio' and is_admin());
create policy "admin_delete_portfolio" on storage.objects for delete using (bucket_id = 'portfolio' and is_admin());

create policy "admin_write_services" on storage.objects for insert with check (bucket_id = 'services' and is_admin());
create policy "admin_update_services" on storage.objects for update using (bucket_id = 'services' and is_admin());
create policy "admin_delete_services" on storage.objects for delete using (bucket_id = 'services' and is_admin());

create policy "admin_write_reviews" on storage.objects for insert with check (bucket_id = 'reviews' and is_admin());
create policy "admin_update_reviews" on storage.objects for update using (bucket_id = 'reviews' and is_admin());
create policy "admin_delete_reviews" on storage.objects for delete using (bucket_id = 'reviews' and is_admin());

create policy "admin_write_about" on storage.objects for insert with check (bucket_id = 'about' and is_admin());
create policy "admin_update_about" on storage.objects for update using (bucket_id = 'about' and is_admin());
create policy "admin_delete_about" on storage.objects for delete using (bucket_id = 'about' and is_admin());

create policy "admin_write_general" on storage.objects for insert with check (bucket_id = 'general' and is_admin());
create policy "admin_update_general" on storage.objects for update using (bucket_id = 'general' and is_admin());
create policy "admin_delete_general" on storage.objects for delete using (bucket_id = 'general' and is_admin());
