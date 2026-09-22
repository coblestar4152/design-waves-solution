import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSiteData } from '@/hooks/useSiteData';
import { updateThemeSettings } from '@/services/db';
import type { ThemeSettings } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

const DEFAULTS = {
  primary_color: '#00d9ff', secondary_color: '#9b5cff', accent_color: '#ff2e9e',
  background_color: '#0a0a16', background_color_2: '#12122a', text_color: '#f2f2fa',
};

export default function ThemePage() {
  const { theme, refresh, loading } = useSiteData();
  const [form, setForm] = useState<Partial<ThemeSettings>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (theme) setForm(theme); }, [theme]);

  async function save() {
    setSaving(true);
    try {
      await updateThemeSettings(form);
      await refresh();
      toast.success('Theme saved and applied');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    setForm((f) => ({ ...f, ...DEFAULTS }));
    toast('Defaults loaded — click Save to apply');
  }

  if (loading || !form) return <LoadingState />;

  const colorField = (key: keyof ThemeSettings, label: string) => (
    <div>
      <label className="text-xs opacity-70 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={(form[key] as string) || '#000000'} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-10 h-10 rounded-dw bg-transparent border border-white/10 cursor-pointer" />
        <input value={(form[key] as string) || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="flex-1 px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Theme Settings</h1>
        <Button variant="outline" onClick={resetDefaults}>Reset to Design Waves Defaults</Button>
      </div>

      <Card hover={false} className="space-y-4">
        <h2 className="font-semibold text-sm opacity-80">Colors</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {colorField('primary_color', 'Primary (Neon Blue)')}
          {colorField('secondary_color', 'Secondary (Electric Purple)')}
          {colorField('accent_color', 'Accent (Pink/Magenta)')}
          {colorField('text_color', 'Text Color')}
          {colorField('background_color', 'Background')}
          {colorField('background_color_2', 'Background (Secondary)')}
        </div>
      </Card>

      <Card hover={false} className="space-y-4 mt-5">
        <h2 className="font-semibold text-sm opacity-80">Style</h2>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Card Style</label>
          <select value={form.card_style || 'glass'} onChange={(e) => setForm((f) => ({ ...f, card_style: e.target.value as ThemeSettings['card_style'] }))}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
            <option value="glass">Glassmorphism</option>
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Border Radius: {form.border_radius ?? 16}px</label>
          <input type="range" min={0} max={32} value={form.border_radius ?? 16} onChange={(e) => setForm((f) => ({ ...f, border_radius: Number(e.target.value) }))} className="w-full" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Glow Intensity: {form.glow_intensity ?? 18}px</label>
          <input type="range" min={0} max={40} value={form.glow_intensity ?? 18} onChange={(e) => setForm((f) => ({ ...f, glow_intensity: Number(e.target.value) }))} className="w-full" />
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Gradient Style</label>
          <select value={form.gradient_style || 'linear'} onChange={(e) => setForm((f) => ({ ...f, gradient_style: e.target.value as ThemeSettings['gradient_style'] }))}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
            <option value="conic">Conic</option>
          </select>
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Font Family</label>
          <select value={form.font_family || 'Poppins'} onChange={(e) => setForm((f) => ({ ...f, font_family: e.target.value }))}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
            <option value="Poppins">Poppins (default)</option>
            <option value="Inter">Inter</option>
          </select>
        </div>
        <div>
          <label className="text-xs opacity-70 mb-1 block">Mode</label>
          <select value={form.mode || 'dark'} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as ThemeSettings['mode'] }))}
            className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </Card>

      <Button onClick={save} disabled={saving} className="mt-6">{saving ? 'Saving…' : 'Save & Apply Theme'}</Button>
    </div>
  );
}
