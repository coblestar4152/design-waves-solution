import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { serviceCategoriesApi } from '@/services/db';
import type { ServiceCategory } from '@/types/database';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ServiceCategoriesPage() {
  const [items, setItems] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [toDelete, setToDelete] = useState<ServiceCategory | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await serviceCategoriesApi.listAll());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await serviceCategoriesApi.create({ name, slug: slugify(name), display_order: items.length + 1, active: true });
      setName('');
      toast.success('Category added');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(cat: ServiceCategory) {
    await serviceCategoriesApi.update(cat.id, { active: !cat.active });
    load();
  }

  async function remove() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await serviceCategoriesApi.remove(toDelete.id);
      toast.success('Category deleted');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Service Categories</h1>

      <Card hover={false} className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
        />
        <Button onClick={add} disabled={busy} icon={<Plus size={16} />}>Add</Button>
      </Card>

      {loading ? <LoadingState /> : (
        <div className="space-y-2">
          {items.map((cat) => (
            <Card key={cat.id} hover={false} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="opacity-30" />
                <span className="font-medium text-sm">{cat.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs opacity-70">
                  <input type="checkbox" checked={cat.active} onChange={() => toggleActive(cat)} />
                  Active
                </label>
                <button onClick={() => setToDelete(cat)} aria-label={`Delete ${cat.name}`} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete category?"
        description={`Services in "${toDelete?.name}" will remain but lose this category.`}
        onCancel={() => setToDelete(null)}
        onConfirm={remove}
        loading={busy}
      />
    </div>
  );
}
