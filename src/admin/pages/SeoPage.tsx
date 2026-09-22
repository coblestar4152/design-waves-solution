import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateSiteSettings } from '@/services/db';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';

export default function SeoPage() {
  const { settings, refresh, loading } = useSiteData();
  const [browserTitle, setBrowserTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setBrowserTitle(settings.browser_title);
    setMetaDescription(settings.meta_description);
    setOgImage(settings.seo_og_image);
  }, [settings]);

  async function save() {
    setSaving(true);
    try {
      await updateSiteSettings({ browser_title: browserTitle, meta_description: metaDescription, seo_og_image: ogImage });
      await refresh();
      toast.success('SEO settings saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">SEO Settings</h1>
      <Card hover={false} className="space-y-4">
        <div>
          <label className="text-xs opacity-70 mb-1 block">Browser Title</label>
          <input value={browserTitle} onChange={(e) => setBrowserTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Meta Description</label>
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} maxLength={200}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          <p className="text-xs opacity-40 mt-1">{metaDescription.length}/200</p>
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Open Graph / Social Share Image</label>
          <ImageUpload bucket="general" value={ogImage} onChange={setOgImage} folder="seo" />
        </div>
      </Card>
      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
