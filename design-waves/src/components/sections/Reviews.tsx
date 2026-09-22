import { Star } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { reviewsApi } from '@/services/db';
import type { Review } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

export default function Reviews() {
  const { data: reviews, loading, error } = useCollection<Review>(() => reviewsApi.listActive());

  return (
    <section id="reviews" className="py-24">
      <div className="dw-container">
        <SectionHeading eyebrow="Client Feedback" title="What Clients Say" />

        {loading && <LoadingState label="Loading reviews…" />}
        {error === 'not_configured' && <ErrorState message="Connect Supabase to load reviews." />}
        {error && error !== 'not_configured' && <ErrorState message={error} />}
        {!loading && !error && reviews.length === 0 && (
          <EmptyState title="No reviews yet" description="Add client reviews from the admin panel." />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center gap-3 mb-3">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.client_name} loading="lazy" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold dw-gradient-text" style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}>
                    {r.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{r.client_name}</p>
                  {r.service_name && <p className="text-xs opacity-60">{r.service_name}</p>}
                </div>
              </div>
              <div className="flex gap-0.5 mb-2" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < r.rating ? 'var(--dw-primary)' : 'none'} color="var(--dw-primary)" />
                ))}
              </div>
              <p className="text-sm opacity-75">{r.review_text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
