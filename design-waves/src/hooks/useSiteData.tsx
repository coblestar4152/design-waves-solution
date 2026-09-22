import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getSiteSettings, getThemeSettings, getAnimationSettings } from '@/services/db';
import type { SiteSettings, ThemeSettings, AnimationSettings } from '@/types/database';

interface SiteDataState {
  settings: SiteSettings | null;
  theme: ThemeSettings | null;
  animation: AnimationSettings | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataState | undefined>(undefined);

function hexToRgbTuple(hex: string): string {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `${r} ${g} ${b}`;
}

function applyTheme(theme: ThemeSettings) {
  const root = document.documentElement;
  root.style.setProperty('--dw-primary', theme.primary_color);
  root.style.setProperty('--dw-secondary', theme.secondary_color);
  root.style.setProperty('--dw-accent', theme.accent_color);
  root.style.setProperty('--dw-bg', theme.background_color);
  root.style.setProperty('--dw-bg2', theme.background_color_2);
  root.style.setProperty('--dw-text', theme.text_color);
  root.style.setProperty('--dw-radius', `${theme.border_radius}px`);
  root.style.setProperty('--dw-glow', `${theme.glow_intensity}px`);
  root.style.setProperty('--dw-font-family', `'${theme.font_family || 'Poppins'}'`);
  root.setAttribute('data-card-style', theme.card_style || 'glass');
  root.setAttribute('data-gradient-style', theme.gradient_style || 'linear');
  try {
    root.style.setProperty('--dw-primary-rgb', hexToRgbTuple(theme.primary_color));
    root.style.setProperty('--dw-secondary-rgb', hexToRgbTuple(theme.secondary_color));
    root.style.setProperty('--dw-accent-rgb', hexToRgbTuple(theme.accent_color));
  } catch {
    /* ignore malformed color */
  }
  root.classList.toggle('light', theme.mode === 'light');
  root.classList.toggle('dark', theme.mode !== 'light');
}

function applyAnimation(anim: AnimationSettings) {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const on = anim.animations_enabled && !reduced;
  root.classList.toggle('dw-no-anim', !on);
  root.classList.toggle('dw-no-particles', !anim.particles_enabled || reduced);
  root.classList.toggle('dw-no-waves', !anim.waves_enabled || reduced);
  root.classList.toggle('dw-no-hover', !anim.hover_effects_enabled);
  root.classList.toggle('dw-no-transitions', !anim.page_transitions_enabled || reduced);
  root.style.setProperty('--dw-anim-speed', `${Math.max(20, 220 - anim.speed * 2)}ms`);
  root.style.setProperty('--dw-anim-intensity', `${anim.intensity / 100}`);
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [animation, setAnimation] = useState<AnimationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!isSupabaseConfigured) {
      setError('not_configured');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const [s, t, a] = await Promise.all([getSiteSettings(), getThemeSettings(), getAnimationSettings()]);
      setSettings(s);
      setTheme(t);
      setAnimation(a);
      applyTheme(t);
      applyAnimation(a);
      if (s.browser_title) document.title = s.browser_title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && s.meta_description) metaDesc.setAttribute('content', s.meta_description);

      const setMeta = (id: string, content: string) => {
        const el = document.getElementById(id);
        if (el && content) el.setAttribute('content', content);
      };
      setMeta('dw-og-title', s.browser_title || s.site_name);
      setMeta('dw-og-description', s.meta_description);
      setMeta('dw-twitter-title', s.browser_title || s.site_name);
      setMeta('dw-twitter-description', s.meta_description);
      if (s.seo_og_image) {
        setMeta('dw-og-image', s.seo_og_image);
        setMeta('dw-twitter-image', s.seo_og_image);
      }

      if (s.favicon_url) {
        const link = document.getElementById('dw-favicon') as HTMLLinkElement | null;
        if (link) link.href = s.favicon_url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown_error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (!isSupabaseConfigured) return;
    const channel = supabase
      .channel('site-data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'theme_settings' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'animation_settings' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SiteDataContext.Provider value={{ settings, theme, animation, loading, error, refresh: load }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
