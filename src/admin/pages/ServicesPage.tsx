import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { servicesApi, serviceCategoriesApi } from '@/services/db';
import type { Service, ServiceCategory } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

const empty: Partial<Service> = {
  name: '', description: '', image_url: null, icon: '', category_id: null,
  featured: false, active: true, display_order: 0,
};

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([servicesApi.listAll(), serviceCategoriesApi.listAll()]);
      setItems(s);
      setCategories(c);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.name) return toast.error('Name is required');
    setBusy(true);
    try {
      if (editing.id) {
        await servicesApi.update(editing.id, editing);
      } else {
        await servicesApi.create({ ...empty, ...editing, display_order: items.length + 1 });
      }
      toast.success('Service saved');
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
      await servicesApi.remove(toDelete.id);
      toast.success('Service deleted');
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
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setEditing({ ...empty })} icon={<Plus size={16} />}>Add Service</Button>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? (
        <EmptyState title="No services yet" description="Add your first service to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
            <Card key={s.id} hover={false} className="flex flex-col gap-2">
              {s.image_url && <img src={s.image_url} alt={s.name} className="w-full h-28 object-cover rounded-dw" />}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    {s.name} {s.featured && <Star size={12} fill="var(--dw-accent)" color="var(--dw-accent)" />}
                  </p>
                  <p className="text-xs opacity-50">{categories.find((c) => c.id === s.category_id)?.name || 'Uncategorized'}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 opacity-60'}`}>
                  {s.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              {s.description && <p className="text-xs opacity-60 line-clamp-2">{s.description}</p>}
              <div className="flex gap-2 mt-auto pt-2">
                <Button variant="outline" onClick={() => setEditing(s)} icon={<Pencil size={14} />} className="flex-1 justify-center">Edit</Button>
                <button onClick={() => setToDelete(s)} aria-label={`Delete ${s.name}`} className="text-red-400 hover:text-red-300 px-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Service' : 'Add Service'}>
        {editing && (
          <div className="space-y-4">
            <ImageUpload bucket="services" value={editing.image_url ?? null} onChange={(url) => setEditing((s) => ({ ...s, image_url: url }))} folder="services" />
            <div>
              <label className="text-xs opacity-70 mb-1 block">Name</label>
              <input value={editing.name || ''} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Category</label>
              <select value={editing.category_id || ''} onChange={(e) => setEditing((s) => ({ ...s, category_id: e.target.value || null }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
                <option value="">Uncategorized</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Icon name (lucide, e.g. "Palette")</label>
              <input value={editing.icon || ''} onChange={(e) => setEditing((s) => ({ ...s, icon: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Description</label>
              <textarea value={editing.description || ''} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing((s) => ({ ...s, featured: e.target.checked }))} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))} /> Active</label>
            </div>
            <Button onClick={save} disabled={busy} className="w-full justify-center">{busy ? 'Saving…' : 'Save Service'}</Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!toDelete} description={`Delete "${toDelete?.name}"? This can't be undone.`} onCancel={() => setToDelete(null)} onConfirm={remove} loading={busy} />
    </div>
  );
}
