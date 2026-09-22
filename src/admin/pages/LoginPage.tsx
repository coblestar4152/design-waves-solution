import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user && isAdmin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) setError(err);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="dw-glass dw-glow-border p-8 w-full max-w-sm">
        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}>
          <Lock size={20} color="var(--dw-primary)" />
        </div>
        <h1 className="text-xl font-bold mb-1">Admin Sign In</h1>
        <p className="text-sm opacity-60 mb-6">Design Waves Solution dashboard</p>

        {!isSupabaseConfigured && (
          <p className="text-sm text-amber-400 mb-4">Supabase isn't configured yet — set your env vars first.</p>
        )}

        <label className="text-xs opacity-70 mb-1 block">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
        />
        <label className="text-xs opacity-70 mb-1 block">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]"
        />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <Button type="submit" disabled={submitting || !isSupabaseConfigured} className="w-full justify-center">
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
