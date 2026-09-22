import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Settings, Home, Wrench, FolderTree, Images, Info, Star,
  Share2, Palette, Sparkles, ImageIcon, Search, UserCog, Menu, X, LogOut, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  { to: '/admin/home', label: 'Home', icon: Home },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/service-categories', label: 'Service Categories', icon: FolderTree },
  { to: '/admin/portfolio', label: 'Portfolio / Samples', icon: Images },
  { to: '/admin/about', label: 'About', icon: Info },
  { to: '/admin/reviews', label: 'Client Reviews', icon: Star },
  { to: '/admin/contact', label: 'Contact / Social Links', icon: Share2 },
  { to: '/admin/theme', label: 'Theme', icon: Palette },
  { to: '/admin/animations', label: 'Animations', icon: Sparkles },
  { to: '/admin/branding', label: 'Logo / Branding', icon: ImageIcon },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/account', label: 'Admin Account', icon: UserCog },
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-dw text-sm transition ${
      isActive ? 'dw-btn-primary font-semibold' : 'opacity-75 hover:opacity-100 hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--dw-bg)' }}>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 dw-glass flex items-center justify-between px-4 h-14" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <span className="font-bold dw-gradient-text">Design Waves Admin</span>
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </div>

      {/* Sidebar */}
      <aside
        className={`dw-glass w-72 shrink-0 p-4 flex-col gap-1 fixed md:sticky top-0 h-screen overflow-y-auto z-30 transition-transform
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
      >
        <div className="hidden md:block mb-4 px-2">
          <span className="font-bold text-lg dw-gradient-text">Design Waves</span>
          <p className="text-xs opacity-50">Admin Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => linkClass(isActive)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-dw text-sm opacity-75 hover:opacity-100 hover:bg-white/5">
            <ExternalLink size={18} /> View Site
          </a>
          <p className="px-3 text-xs opacity-40 truncate">{user?.email}</p>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-dw text-sm opacity-75 hover:opacity-100 hover:bg-white/5">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 p-4 sm:p-8 pt-20 md:pt-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
