export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <p className="font-semibold text-red-400">Something went wrong</p>
      <p className="text-sm opacity-60 mt-1">{message}</p>
    </div>
  );
}
