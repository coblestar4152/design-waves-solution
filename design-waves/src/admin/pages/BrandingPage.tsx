import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateSiteSettings } from '@/services/db';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';

export default function BrandingPage() {
  const { settings, refresh, loading } = useSiteData();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(40);
  const [logoVisible, setLogoVisible] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setLogoUrl(settings.logo_url);
    setFaviconUrl(settings.favicon_url);
    setLogoSize(settings.logo_size);
    setLogoVisible(settings.logo_visible);
  }, [settings]);

  async function save() {
    setSaving(true);
    try {
      await updateSiteSettings({ logo_url: logoUrl, favicon_url: faviconUrl, logo_size: logoSize, logo_visible: logoVisible });
      await refresh();
      toast.success('Branding saved — reflected across the site');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Logo / Branding</h1>

      <Card hover={false} className="space-y-4">
        <div>
          <label className="text-xs opacity-70 mb-1 block">Logo</label>
          <ImageUpload bucket="logos" value={logoUrl} onChange={setLogoUrl} folder="logo" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Favicon</label>
          <ImageUpload bucket="logos" value={faviconUrl} onChange={setFaviconUrl} folder="favicon" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Logo Height: {logoSize}px</label>
          <input type="range" min={24} max={80} value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={logoVisible} onChange={(e) => setLogoVisible(e.target.checked)} />
          Show logo in navigation and hero
        </label>
      </Card>

      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
