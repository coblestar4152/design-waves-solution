import { supabase } from '@/lib/supabase';
import type {
  SiteSettings, ThemeSettings, AnimationSettings, ServiceCategory, Service,
  PortfolioCategory, PortfolioItem, PortfolioImage, AboutContent, Review,
  SocialLink,
} from '@/types/database';

// ---------- Singletons ----------
export async function getSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as SiteSettings;
}
export async function updateSiteSettings(patch: Partial<SiteSettings>) {
  const { data, error } = await supabase.from('site_settings').update(patch).eq('id', 1).select().single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function getThemeSettings() {
  const { data, error } = await supabase.from('theme_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as ThemeSettings;
}
export async function updateThemeSettings(patch: Partial<ThemeSettings>) {
  const { data, error } = await supabase.from('theme_settings').update(patch).eq('id', 1).select().single();
  if (error) throw error;
  return data as ThemeSettings;
}

export async function getAnimationSettings() {
  const { data, error } = await supabase.from('animation_settings').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as AnimationSettings;
}
export async function updateAnimationSettings(patch: Partial<AnimationSettings>) {
  const { data, error } = await supabase.from('animation_settings').update(patch).eq('id', 1).select().single();
  if (error) throw error;
  return data as AnimationSettings;
}

export async function getAboutContent() {
  const { data, error } = await supabase.from('about_content').select('*').eq('id', 1).single();
  if (error) throw error;
  return data as AboutContent;
}
export async function updateAboutContent(patch: Partial<AboutContent>) {
  const { data, error } = await supabase.from('about_content').update(patch).eq('id', 1).select().single();
  if (error) throw error;
  return data as AboutContent;
}

// ---------- Generic collection helpers ----------
function collection<T>(table: string) {
  return {
    async listAll(): Promise<T[]> {
      const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return data as T[];
    },
    async listActive(): Promise<T[]> {
      const { data, error } = await supabase
        .from(table).select('*').eq('active', true).order('display_order', { ascending: true });
      if (error) throw error;
      return data as T[];
    },
    async create(payload: Partial<T>): Promise<T> {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return data as T;
    },
    async update(id: string, payload: Partial<T>): Promise<T> {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data as T;
    },
    async remove(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const serviceCategoriesApi = collection<ServiceCategory>('service_categories');
export const servicesApi = collection<Service>('services');
export const portfolioCategoriesApi = collection<PortfolioCategory>('portfolio_categories');
export const portfolioItemsApi = collection<PortfolioItem>('portfolio_items');
export const portfolioImagesApi = collection<PortfolioImage>('portfolio_images');
export const reviewsApi = collection<Review>('reviews');
export const socialLinksApi = collection<SocialLink>('social_links');

export async function listPortfolioImages(portfolioItemId: string) {
  const { data, error } = await supabase
    .from('portfolio_images').select('*').eq('portfolio_item_id', portfolioItemId)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data as PortfolioImage[];
}
