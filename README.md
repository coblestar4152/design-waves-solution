# Design Waves Solution

A production-ready creative-agency portfolio website with a fully functional, database-backed
admin CMS. Built with React + Vite + TypeScript + Tailwind CSS on the frontend and Supabase
(PostgreSQL, Auth, Storage) as the backend — no custom server required, deployable on Netlify's
free plan.

---

## 1. What you get

- A public site (Home, Portfolio, Services, About, Reviews, Contact) that reads **all** of its
  content from Supabase — nothing important is hardcoded.
- A secure `/admin` dashboard (Supabase Auth) where the site owner can edit every piece of
  content, upload images, and adjust theme/animation settings live.
- A SQL migration that creates the full schema, Row Level Security policies, storage buckets,
  and seed data (your service categories, portfolio categories, and starter contact platforms).

---

## 2. Prerequisites

- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) account
- A free [Netlify](https://netlify.com) account (for deployment)

---

## 3. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose a name, database password, and region. Wait for it to finish provisioning.
3. In the left sidebar, go to **Project Settings → API**. Copy:
   - **Project URL** → this is `VITE_SUPABASE_URL`
   - **anon public** key → this is `VITE_SUPABASE_ANON_KEY`

---

## 4. Run the SQL schema

1. In your Supabase project, open the **SQL Editor**.
2. Open `supabase/migrations/0001_init.sql` from this project, copy its entire contents, paste
   it into a new SQL query, and click **Run**.
3. This creates every table, enables Row Level Security with public-read/admin-write policies,
   creates the storage buckets (`logos`, `portfolio`, `services`, `reviews`, `about`, `general`)
   with public read access, and seeds your service/portfolio categories and starter contact
   platforms (WhatsApp, Discord, Gmail — edit the placeholder URLs from the admin panel once
   you're logged in).

If you ever need to re-run it, the script uses `on conflict do nothing` / `if not exists`
guards, so it's safe to run again.

---

## 5. Create storage buckets (already handled by the SQL script)

The SQL migration creates all required buckets and their policies automatically. You don't need
to create them manually in the Storage UI — just confirm they appear after running the script
(**Storage** tab → you should see `logos`, `portfolio`, `services`, `reviews`, `about`,
`general`, all marked **Public**).

---

## 6. Configure authentication

1. In Supabase, go to **Authentication → Providers** and make sure **Email** is enabled
   (it is by default).
2. Go to **Authentication → Settings** and, for local development, you may want to disable
   "Confirm email" so you can sign in immediately after creating your first user (re-enable it
   for production if you plan to create more admin accounts later).

---

## 7. Create your first admin account

The project deliberately does **not** ship with a hardcoded admin email or password — you
create it yourself, directly in Supabase:

1. In Supabase, go to **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password. Check "Auto Confirm User" if that option is shown.
3. Copy the new user's **UID**.
4. Open the **SQL Editor** again and run:

   ```sql
   insert into profiles (id, email, role)
   values ('PASTE-THE-USER-UID-HERE', 'your-email@example.com', 'admin');
   ```

5. That's it — this row is what grants admin access. Anyone can sign up for a Supabase Auth
   account in theory, but only users with a matching row in `profiles` can read/write admin data
   (enforced by Row Level Security), and only users with a `profiles` row can access `/admin` in
   the app itself.

To add a second admin later, repeat this process with a new user.

---

## 8. Environment variables (local development)

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in the two values from step 3:

   ```text
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

The anon key is safe to expose in frontend code — it only works within the boundaries set by
your Row Level Security policies. **Never** put your Supabase `service_role` key in this file or
anywhere in the frontend.

---

## 9. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin` for the
admin panel. Sign in with the account you created in step 7.

If Supabase isn't configured yet, the site will show a clear "Supabase isn't configured" message
instead of crashing or a blank screen.

---

## 10. Build for production

```bash
npm run build
```

This outputs a static, production-ready bundle to `dist/`. You can preview it locally with
`npm run preview`.

---

## 11. Deploy to Netlify

### Option A — Netlify UI (recommended for first deploy)

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. In Netlify, click **Add new site → Import an existing project** and connect your repo.
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Before deploying, go to **Site settings → Environment variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy site**.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --build --prod
```

(Set the same two environment variables via `netlify env:set` or the Netlify dashboard first.)

The included `netlify.toml` already configures SPA redirects (`/* → /index.html`), so refreshing
`/admin` or any other route in production will not 404.

---

## 12. Project structure

```text
src/
  admin/pages/      # Admin dashboard pages (one per sidebar section)
  components/
    admin/          # Admin-only building blocks (layout, route guard, gallery manager)
    layout/         # Navbar, Footer, animated background
    sections/       # Public page sections (Hero, Services, Portfolio, About, Reviews, Contact)
    ui/             # Shared building blocks (Button, Card, Modal, ImageUpload, etc.)
  hooks/            # useAuth, useSiteData, useCollection
  lib/              # Supabase client, icon helper
  pages/            # HomePage (public site shell)
  services/         # db.ts (CRUD), storage.ts (uploads)
  types/            # TypeScript types matching the SQL schema
supabase/
  migrations/0001_init.sql   # Full schema, RLS policies, storage buckets, seed data
```

---

## 13. Security notes (from the production audit)

- `is_admin()` is a `SECURITY DEFINER` SQL function with an explicit `search_path` pin
  (`public, pg_temp`). This is what lets admin-only RLS policies check admin status without
  triggering infinite recursion against `profiles`' own RLS policy, and the pinned
  `search_path` blocks search-path-hijacking attacks against `SECURITY DEFINER` functions.
- Every content table's public "read" policy only exposes rows where `active = true`
  (or, for `portfolio_images`, where the parent portfolio item is active). Hidden/draft
  content is invisible to anyone querying with the public anon key — including via direct
  REST calls, not just through the app UI. Authenticated admins still see everything, since
  their write policy is permissive and covers `SELECT` too.
- Storage buckets restrict uploads to real image MIME types and set per-bucket file size caps
  (5–10 MB depending on bucket), rather than accepting arbitrary file types.
- The `navigation_items` table from earlier drafts of this schema was removed — it was never
  queried by the app (navigation labels are edited via `site_settings.nav_labels` on the
  Website Settings page instead), so keeping it would have been unused, unmanaged schema.

## 14. Known limitations

- The rich-text fields (About, service/portfolio descriptions) are plain text areas, not a WYSIWYG
  editor — this keeps the stack lightweight and avoids extra dependencies, per the performance
  requirements. Line breaks are preserved where relevant.
- Drag-to-reorder is not implemented for lists (services, portfolio, reviews, links); items are
  ordered by a `display_order` column you can adjust directly in the Supabase table editor if you
  need a specific order beyond insertion order.
- Email/password is the only sign-in method configured. If you want magic links or OAuth
  providers for admin sign-in, enable them in Supabase Auth — the app doesn't need any code
  changes for email/password, but a different provider would need a small update to
  `LoginPage.tsx`.
- Removing or replacing a logo/image from the admin panel clears the database reference
  immediately (so the site stops showing it right away), but the old file itself is not
  deleted from Storage. This is a minor storage-hygiene item, not a functional or security
  issue — you can periodically clear unused files from the Storage tab if it matters to you.

If anything here doesn't match what you need, the closest real, working alternative was chosen
over a fake or non-functional placeholder — see `src/` for the actual implementation.
