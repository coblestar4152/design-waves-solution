import { ArrowRight, Sparkles } from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';
import WavesBackground from '@/components/layout/WavesBackground';
import Particles from '@/components/layout/Particles';

export default function Hero() {
  const { settings } = useSiteData();

  return (
    <section id="home" className="relative pt-32 pb-24 overflow-hidden">
      <WavesBackground />
      <Particles />
      <div className="dw-container relative z-10 text-center">
        {settings?.logo_visible && settings?.logo_url && (
          <img
            src={settings.logo_url}
            alt={settings.short_name}
            className="mx-auto mb-6 animate-float"
            style={{ height: (settings.logo_size || 40) * 1.6 }}
          />
        )}
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] dw-glass px-4 py-2 rounded-full opacity-80 mb-6">
          <Sparkles size={14} /> Creative Agency & Digital Studio
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight dw-gradient-text max-w-4xl mx-auto">
          {settings?.hero_heading || "We Design the Wave of What's Next"}
        </h1>
        <p className="mt-6 max-w-xl mx-auto opacity-75 text-base sm:text-lg">
          {settings?.hero_description ||
            'Editable placeholder: describe your creative studio here from the admin panel.'}
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#portfolio" className="dw-btn dw-btn-primary dw-glow">
            {settings?.hero_cta_text || 'View Our Work'} <ArrowRight size={18} />
          </a>
          <a href="#contact" className="dw-btn dw-btn-outline">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
