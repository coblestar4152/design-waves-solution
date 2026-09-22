export default function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-70">
      <div className="animate-spin h-8 w-8 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--dw-primary)' }} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
