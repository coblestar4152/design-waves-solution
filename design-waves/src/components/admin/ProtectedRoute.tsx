import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="dw-glass p-8 max-w-md">
          <h1 className="text-xl font-bold mb-2">Supabase not configured</h1>
          <p className="text-sm opacity-75">
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--dw-primary)' }} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
