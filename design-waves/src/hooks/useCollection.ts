import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useCollection<T>(fetcher: () => Promise<T[]>, deps: unknown[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured) {
      setError('not_configured');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetcher()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'unknown_error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
