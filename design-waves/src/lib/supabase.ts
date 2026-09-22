import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Design Waves] Supabase is not configured. Copy .env.example to .env and set ' +
      'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY, then restart the dev server.'
  );
}

// Fall back to harmless placeholder values so createClient never throws;
// isSupabaseConfigured is checked by the UI to show a setup message instead of crashing.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
);

export const BUCKETS = {
  logos: 'logos',
  portfolio: 'portfolio',
  services: 'services',
  reviews: 'reviews',
  about: 'about',
  general: 'general',
} as const;

export function publicUrlFor(bucket: keyof typeof BUCKETS, path: string) {
  const { data } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(path);
  return data.publicUrl;
}
