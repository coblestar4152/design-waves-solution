import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateSiteSettings } from '@/services/db';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export default function HomeContentPage() {
  const { settings, refresh, loading } = useSiteData();
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [cta, setCta] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setHeading(settings.hero_heading);
    setDescription(settings.hero_description);
    setCta(settings.hero_cta_text);
  }, [settings]);

  async function save() {
    setSaving(true);
    try {
      await updateSiteSettings({ hero_heading: heading, hero_description: description, hero_cta_text: cta });
      await refresh();
      toast.success('Home content saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Home Page Content</h1>
      <Card hover={false} className="space-y-4">
        <div>
          <label className="text-xs opacity-70 mb-1 block">Hero Heading</label>
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
          />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Hero Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
          />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">CTA Button Text</label>
          <input
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
          />
        </div>
      </Card>
      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
