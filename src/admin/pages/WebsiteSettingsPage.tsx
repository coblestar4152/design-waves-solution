import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateSiteSettings } from '@/services/db';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export default function WebsiteSettingsPage() {
  const { settings, refresh, loading } = useSiteData();
  const [form, setForm] = useState({
    site_name: '', short_name: '', footer_text: '', copyright_text: '',
    nav_home: '', nav_portfolio: '', nav_services: '', nav_about: '', nav_reviews: '', nav_contact: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      site_name: settings.site_name,
      short_name: settings.short_name,
      footer_text: settings.footer_text,
      copyright_text: settings.copyright_text,
      nav_home: settings.nav_labels?.home || 'Home',
      nav_portfolio: settings.nav_labels?.portfolio || 'Portfolio',
      nav_services: settings.nav_labels?.services || 'Services',
      nav_about: settings.nav_labels?.about || 'About',
      nav_reviews: settings.nav_labels?.reviews || 'Reviews',
      nav_contact: settings.nav_labels?.contact || 'Contact',
    });
  }, [settings]);

  async function save() {
    setSaving(true);
    try {
      await updateSiteSettings({
        site_name: form.site_name,
        short_name: form.short_name,
        footer_text: form.footer_text,
        copyright_text: form.copyright_text,
        nav_labels: {
          home: form.nav_home, portfolio: form.nav_portfolio, services: form.nav_services,
          about: form.nav_about, reviews: form.nav_reviews, contact: form.nav_contact,
        },
      });
      await refresh();
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  const field = (key: keyof typeof form, label: string, textarea = false) => (
    <div>
      <label className="text-xs opacity-70 mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
      <Card hover={false} className="space-y-4">
        {field('site_name', 'Website Name')}
        {field('short_name', 'Short Brand Name')}
        {field('footer_text', 'Footer Text', true)}
        {field('copyright_text', 'Copyright Text')}
      </Card>

      <Card hover={false} className="space-y-4 mt-5">
        <h2 className="font-semibold">Navigation Labels</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {field('nav_home', 'Home')}
          {field('nav_portfolio', 'Portfolio')}
          {field('nav_services', 'Services')}
          {field('nav_about', 'About')}
          {field('nav_reviews', 'Reviews')}
          {field('nav_contact', 'Contact')}
        </div>
      </Card>

      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
