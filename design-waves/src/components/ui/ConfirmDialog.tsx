import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open, title = 'Are you sure?', description, onCancel, onConfirm, loading,
}: { open: boolean; title?: string; description?: string; onCancel: () => void; onConfirm: () => void; loading?: boolean }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      {description && <p className="text-sm opacity-70 mb-5">{description}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting…' : 'Delete'}</Button>
      </div>
    </Modal>
  );
}
