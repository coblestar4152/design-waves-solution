import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateAnimationSettings } from '@/services/db';
import type { AnimationSettings } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export default function AnimationsPage() {
  const { animation, refresh, loading } = useSiteData();
  const [form, setForm] = useState<Partial<AnimationSettings>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (animation) setForm(animation); }, [animation]);

  async function save() {
    setSaving(true);
    try {
      await updateAnimationSettings(form);
      await refresh();
      toast.success('Animation settings saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  const toggle = (key: keyof AnimationSettings, label: string, description: string) => (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs opacity-50">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
        className="mt-1 w-5 h-5 shrink-0"
      />
    </label>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Animation Settings</h1>
      <p className="text-sm opacity-60 mb-6">
        Visitors with "reduce motion" enabled on their device will always see reduced animation, regardless of these settings.
      </p>

      <Card hover={false}>
        {toggle('animations_enabled', 'Animations', 'Master switch for all motion effects.')}
        {toggle('particles_enabled', 'Particles', 'Floating particle effects in the hero section.')}
        {toggle('waves_enabled', 'Background Waves', 'Animated wave graphics behind the hero.')}
        {toggle('hover_effects_enabled', 'Hover Effects', 'Card lift and button hover interactions.')}
        {toggle('page_transitions_enabled', 'Page Transitions', 'Smooth fade transitions between views.')}
      </Card>

      <Card hover={false} className="mt-5 space-y-4">
        <div>
          <label className="text-xs opacity-70 mb-1 block">Intensity: {form.intensity ?? 60}%</label>
          <input type="range" min={0} max={100} value={form.intensity ?? 60} onChange={(e) => setForm((f) => ({ ...f, intensity: Number(e.target.value) }))} className="w-full" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Speed: {form.speed ?? 50}%</label>
          <input type="range" min={0} max={100} value={form.speed ?? 50} onChange={(e) => setForm((f) => ({ ...f, speed: Number(e.target.value) }))} className="w-full" />
        </div>
      </Card>

      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save Changes'}</Button>
    </div>
  );
}
