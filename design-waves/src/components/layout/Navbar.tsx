import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';

const DEFAULT_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { settings } = useSiteData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLabels = settings?.nav_labels ?? {};
  const items = DEFAULT_NAV.map((n) => ({
    ...n,
    label: navLabels[n.href.replace('#', '')] || n.label,
  }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors ${scrolled ? 'dw-glass' : 'bg-transparent'}`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <nav className="dw-container flex items-center justify-between h-16">
        <a href="#home" className="flex items-center gap-2 font-extrabold text-lg">
          {settings?.logo_visible && settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings?.short_name || 'Logo'}
              style={{ height: settings.logo_size || 40 }}
              className="w-auto"
            />
          ) : (
            <span className="dw-gradient-text">{settings?.short_name || 'Design Waves'}</span>
          )}
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="opacity-80 hover:opacity-100 transition">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="hidden md:inline-flex dw-btn dw-btn-primary text-sm">
          Get in Touch
        </a>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden dw-glass mx-4 mb-4 rounded-dw p-4">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {items.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block py-1">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
