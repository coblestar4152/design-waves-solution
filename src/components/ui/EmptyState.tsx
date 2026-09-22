export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center py-16 opacity-60">
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
