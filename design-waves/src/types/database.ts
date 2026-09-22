export interface SiteSettings {
  id: number;
  site_name: string;
  short_name: string;
  browser_title: string;
  meta_description: string;
  favicon_url: string | null;
  logo_url: string | null;
  logo_size: number;
  logo_visible: boolean;
  footer_text: string;
  copyright_text: string;
  nav_labels: Record<string, string>;
  hero_heading: string;
  hero_description: string;
  hero_cta_text: string;
  seo_og_image: string | null;
  updated_at: string;
}

export interface ThemeSettings {
  id: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  background_color_2: string;
  text_color: string;
  card_style: 'glass' | 'solid' | 'outline';
  border_radius: number;
  glow_intensity: number;
  gradient_style: 'linear' | 'radial' | 'conic';
  font_family: string;
  mode: 'dark' | 'light';
  updated_at: string;
}

export interface AnimationSettings {
  id: number;
  animations_enabled: boolean;
  particles_enabled: boolean;
  waves_enabled: boolean;
  hover_effects_enabled: boolean;
  page_transitions_enabled: boolean;
  intensity: number;
  speed: number;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  project_url: string | null;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface PortfolioImage {
  id: string;
  portfolio_item_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface AboutContent {
  id: number;
  heading: string;
  description: string;
  mission: string;
  vision: string;
  image_url: string | null;
  extra_content: string | null;
  updated_at: string;
}

export interface Review {
  id: string;
  client_name: string;
  avatar_url: string | null;
  review_text: string;
  rating: number;
  service_name: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform_name: string;
  url: string;
  icon: string;
  label: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  role: 'admin';
  created_at: string;
}
