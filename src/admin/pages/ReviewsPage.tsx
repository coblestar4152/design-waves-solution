import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { reviewsApi } from '@/services/db';
import type { Review } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUpload from '@/components/ui/ImageUpload';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

const empty: Partial<Review> = {
  client_name: '', avatar_url: null, review_text: '', rating: 5, service_name: '', active: true, display_order: 0,
};

export default function ReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await reviewsApi.listAll());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.client_name || !editing?.review_text) return toast.error('Name and review text are required');
    setBusy(true);
    try {
      if (editing.id) {
        await reviewsApi.update(editing.id, editing);
      } else {
        await reviewsApi.create({ ...empty, ...editing, display_order: items.length + 1 });
      }
      toast.success('Review saved');
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
      await reviewsApi.remove(toDelete.id);
      toast.success('Review deleted');
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
        <h1 className="text-2xl font-bold">Client Reviews</h1>
        <Button onClick={() => setEditing({ ...empty })} icon={<Plus size={16} />}>Add Review</Button>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? (
        <EmptyState title="No reviews yet" description="Add real client reviews as they come in." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <Card key={r.id} hover={false} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.client_name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">{r.client_name.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{r.client_name}</p>
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill={i < r.rating ? 'var(--dw-primary)' : 'none'} color="var(--dw-primary)" />
                  ))}</div>
                </div>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full shrink-0 ${r.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 opacity-60'}`}>
                  {r.active ? 'Shown' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs opacity-60 line-clamp-3">{r.review_text}</p>
              <div className="flex gap-2 mt-auto pt-2">
                <Button variant="outline" onClick={() => setEditing(r)} icon={<Pencil size={14} />} className="flex-1 justify-center">Edit</Button>
                <button onClick={() => setToDelete(r)} aria-label={`Delete review from ${r.client_name}`} className="text-red-400 hover:text-red-300 px-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Review' : 'Add Review'}>
        {editing && (
          <div className="space-y-4">
            <ImageUpload bucket="reviews" value={editing.avatar_url ?? null} onChange={(url) => setEditing((s) => ({ ...s, avatar_url: url }))} folder="avatars" />
            <div>
              <label className="text-xs opacity-70 mb-1 block">Client Name</label>
              <input value={editing.client_name || ''} onChange={(e) => setEditing((s) => ({ ...s, client_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Service (optional)</label>
              <input value={editing.service_name || ''} onChange={(e) => setEditing((s) => ({ ...s, service_name: e.target.value }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Rating</label>
              <select value={editing.rating ?? 5} onChange={(e) => setEditing((s) => ({ ...s, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs opacity-70 mb-1 block">Review Text</label>
              <textarea value={editing.review_text || ''} onChange={(e) => setEditing((s) => ({ ...s, review_text: e.target.value }))} rows={4}
                className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing((s) => ({ ...s, active: e.target.checked }))} /> Visible on site</label>
            <Button onClick={save} disabled={busy} className="w-full justify-center">{busy ? 'Saving…' : 'Save Review'}</Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!toDelete} description={`Delete the review from "${toDelete?.client_name}"?`} onCancel={() => setToDelete(null)} onConfirm={remove} loading={busy} />
    </div>
  );
}
