import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAboutContent, updateAboutContent } from '@/services/db';
import type { AboutContent } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAboutContent().then(setAbout).finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!about) return;
    setSaving(true);
    try {
      const updated = await updateAboutContent({
        heading: about.heading, description: about.description, mission: about.mission,
        vision: about.vision, image_url: about.image_url, extra_content: about.extra_content,
      });
      setAbout(updated);
      toast.success('About content saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !about) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">About Section</h1>
      <Card hover={false} className="space-y-4">
        <ImageUpload bucket="about" value={about.image_url} onChange={(url) => setAbout((a) => a && { ...a, image_url: url })} />
        <div>
          <label className="text-xs opacity-70 mb-1 block">Heading</label>
          <input value={about.heading} onChange={(e) => setAbout((a) => a && { ...a, heading: e.target.value })}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Description</label>
          <textarea value={about.description} onChange={(e) => setAbout((a) => a && { ...a, description: e.target.value })} rows={4}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs opacity-70 mb-1 block">Mission</label>
            <textarea value={about.mission} onChange={(e) => setAbout((a) => a && { ...a, mission: e.target.value })} rows={3}
              className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          </div>
          <div>
            <label className="text-xs opacity-70 mb-1 block">Vision</label>
            <textarea value={about.vision} onChange={(e) => setAbout((a) => a && { ...a, vision: e.target.value })} rows={3}
              className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          </div>
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Additional Content (optional)</label>
          <textarea value={about.extra_content || ''} onChange={(e) => setAbout((a) => a && { ...a, extra_content: e.target.value })} rows={3}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
        </div>
      </Card>
      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
