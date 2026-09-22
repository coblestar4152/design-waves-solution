import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { portfolioItemsApi, portfolioCategoriesApi } from '@/services/db';
import type { PortfolioItem, PortfolioCategory } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import PortfolioGalleryManager from '@/components/admin/PortfolioGalleryManager';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const empty: Partial<PortfolioItem> = {
  title: '', description: '', cover_image_url: null, video_url: '', project_url: '',
  category_id: null, featured: false, active: true, display_order: 0,
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortfolioItem> | null>(null);
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [newCat, setNewCat] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [i, c] = await Promise.all([portfolioItemsApi.listAll(), portfolioCategoriesApi.listAll()]);
      setItems(i);
      setCategories(c);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.title) return toast.error('Title is required');
    setBusy(true);
    try {
      if (editing.id) {
        await portfolioItemsApi.update(editing.id, editing);
        toast.success('Portfolio item saved');
        setEditing(null);
      } else {
        const created = await portfolioItemsApi.create({ ...empty, ...editing, display_order: items.length + 1 });
        toast.success('Portfolio item created — you can now add gallery images');
        setEditing(created);
      }
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
      await portfolioItemsApi.remove(toDelete.id);
      toast.success('Deleted');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  async function addCategory() {
    if (!newCat.trim()) return;
    await portfolioCategoriesApi.create({ name: newCat, slug: slugify(newCat), display_order: categories.length + 1, active: true });
    setNewCat('');
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Portfolio / Samples</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCatModal(true)} icon={<Tag size={16} />}>Categories</Button>
          <Button onClick={() => setEditing({ ...empty })} icon={<Plus size={16} />}>Add Item</Button>
        </div>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? (
        <EmptyState title="No portfolio items yet" description="Add your first sample to showcase your work." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Card key={p.id} hover={false} className="flex flex-col gap-2">
              {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} className="w-full h-32 object-cover rounded-dw" />}
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm">{p.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${p.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 opacity-60'}`}>
                  {p.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs opacity-50">{categories.find((c) => c.id === p.category_id)?.name || 'Uncategorized'}</p>
              <div className="flex gap-2 mt-auto pt-2">
                <Button variant="outline" onClick={() => setEditing(p)} icon={<Pencil size={14} />} className="flex-1 justify-center">Edit</Button>
                <button onClick={() => setToDelete(p)} aria-label={`Delete ${p.title}`} className="text-red-400 hover:text-red-300 px-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Portfolio Item' : 'Add Portfolio Item'}>
        {editing && (
          <div className="space-y-4">
            <ImageUpload bucket="portfolio" value={editing.cover_image_url ?? null} onChange={(url) => setEditing((s) => ({ ...s, cover_image_url: url }))} folder="covers" />
            <div>
              <label className="text-xs opacity-70 mb-1 block">Title</label>
              <input value={editing.title || ''} onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
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
              <label className="text-xs opacity-70 mb-1 block">Description</label>
              <textarea value={editing.description || ''} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} rows={3}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Video URL (embeddable, optional)</label>
              <input value={editing.video_url || ''} onChange={(e) => setEditing((s) => ({ ...s, video_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">External Project URL (optional)</label>
              <input value={editing.project_url || ''} onChange={(e) => setEditing((s) => ({ ...s, project_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing((s) => ({ ...s, featured: e.target.checked }))} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))} /> Active</label>
            </div>

            {editing.id ? (
              <PortfolioGalleryManager portfolioItemId={editing.id} />
            ) : (
              <p className="text-xs opacity-50 dw-glass rounded-dw p-3">
                Save this item first, then reopen it to add extra gallery images.
              </p>
            )}

            <Button onClick={save} disabled={busy} className="w-full justify-center">{busy ? 'Saving…' : 'Save Item'}</Button>
          </div>
        )}
      </Modal>

      <Modal open={catModal} onClose={() => setCatModal(false)} title="Portfolio Categories">
        <div className="flex gap-2 mb-4">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category"
            className="flex-1 px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          <Button onClick={addCategory} icon={<Plus size={16} />}>Add</Button>
        </div>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
              <span>{c.name}</span>
              <button
                onClick={async () => { await portfolioCategoriesApi.remove(c.id); load(); }}
                className="text-red-400 hover:text-red-300"
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmDialog open={!!toDelete} description={`Delete "${toDelete?.title}"? This can't be undone.`} onCancel={() => setToDelete(null)} onConfirm={remove} loading={busy} />
    </div>
  );
}
