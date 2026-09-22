import { useEffect, useState } from 'react';
import { Wrench, Images, Star, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

interface Counts {
  services: number;
  portfolio: number;
  reviews: number;
  links: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const [services, portfolio, reviews, links] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('social_links').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        services: services.count || 0,
        portfolio: portfolio.count || 0,
        reviews: reviews.count || 0,
        links: links.count || 0,
      });
    }
    load();
  }, []);

  const items = [
    { label: 'Services', value: counts?.services, icon: Wrench },
    { label: 'Portfolio Items', value: counts?.portfolio, icon: Images },
    { label: 'Reviews', value: counts?.reviews, icon: Star },
    { label: 'Contact Links', value: counts?.links, icon: Share2 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="opacity-60 text-sm mb-8">{user?.email}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map(({ label, value, icon: Icon }) => (
          <Card key={label} hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-60">{label}</p>
                <p className="text-3xl font-extrabold mt-1">{value ?? '—'}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}>
                <Icon size={18} color="var(--dw-primary)" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card hover={false} className="mt-8">
        <h2 className="font-semibold mb-2">Getting started</h2>
        <ul className="text-sm opacity-70 space-y-1.5 list-disc list-inside">
          <li>Upload your logo under <strong>Logo / Branding</strong>.</li>
          <li>Set your hero headline and description under <strong>Home</strong>.</li>
          <li>Add services, portfolio samples, and reviews from their respective sections.</li>
          <li>Fine-tune colors and effects under <strong>Theme</strong> and <strong>Animations</strong>.</li>
        </ul>
      </Card>
    </div>
  );
}
