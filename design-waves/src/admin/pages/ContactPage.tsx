import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { socialLinksApi } from '@/services/db';
import type { SocialLink } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { DynamicIcon } from '@/lib/icons';

const empty: Partial<SocialLink> = { platform_name: '', url: '', icon: 'link', label: '', active: true, display_order: 0 };

const ICON_OPTIONS = ['whatsapp', 'discord', 'mail', 'instagram', 'youtube', 'telegram', 'facebook', 'twitter', 'tiktok', 'linkedin', 'behance', 'github', 'link'];

export default function ContactPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [toDelete, setToDelete] = useState<SocialLink | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await socialLinksApi.listAll());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.platform_name || !editing?.url) return toast.error('Platform name and URL are required');
    setBusy(true);
    try {
      if (editing.id) {
        await socialLinksApi.update(editing.id, editing);
      } else {
        await socialLinksApi.create({ ...empty, ...editing, display_order: items.length + 1 });
      }
      toast.success('Contact platform saved');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await socialLinksApi.remove(toDelete.id);
      toast.success('Deleted');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact / Social Links</h1>
        <Button onClick={() => setEditing({ ...empty })} icon={<Plus size={16} />}>Add Platform</Button>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? (
        <EmptyState title="No contact platforms yet" description="Add WhatsApp, Discord, Gmail, or any custom platform." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((l) => (
            <Card key={l.id} hover={false} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}>
                <DynamicIcon name={l.icon} size={18} color="var(--dw-primary)" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{l.platform_name}</p>
                <p className="text-xs opacity-50 truncate">{l.url}</p>
              </div>
              <div className="flex flex-col gap-1 items-end shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${l.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 opacity-60'}`}>
                  {l.active ? 'Active' : 'Hidden'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(l)} aria-label={`Edit ${l.platform_name}`}><Pencil size={14} /></button>
                  <button onClick={() => setToDelete(l)} aria-label={`Delete ${l.platform_name}`} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Platform' : 'Add Platform'}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="text-xs opacity-70 mb-1 block">Platform Name</label>
              <input value={editing.platform_name || ''} onChange={(e) => setEditing((s) => ({ ...s, platform_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">URL</label>
              <input value={editing.url || ''} onChange={(e) => setEditing((s) => ({ ...s, url: e.target.value }))} placeholder="https:// or mailto: or wa.me link"
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Icon</label>
              <select value={editing.icon || 'link'} onChange={(e) => setEditing((s) => ({ ...s, icon: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Label (optional, e.g. username)</label>
              <input value={editing.label || ''} onChange={(e) => setEditing((s) => ({ ...s, label: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))} /> Visible on site</label>
            <Button onClick={save} disabled={busy} className="w-full justify-center">{busy ? 'Saving…' : 'Save Platform'}</Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!toDelete} description={`Delete "${toDelete?.platform_name}"?`} onCancel={() => setToDelete(null)} onConfirm={remove} loading={busy} />
    </div>
  );
}
