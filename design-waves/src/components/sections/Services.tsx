import { useCollection } from '@/hooks/useCollection';
import { servicesApi, serviceCategoriesApi } from '@/services/db';
import type { Service, ServiceCategory } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { DynamicIcon } from '@/lib/icons';

export default function Services() {
  const { data: categories, loading: catLoading } = useCollection<ServiceCategory>(() => serviceCategoriesApi.listActive());
  const { data: services, loading, error } = useCollection<Service>(() => servicesApi.listActive());

  const grouped = categories.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category_id === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="services" className="py-24">
      <div className="dw-container">
        <SectionHeading
          eyebrow="What We Offer"
          title="Our Services"
          description="From creative editing to technical builds — a full toolkit for your project."
        />

        {(loading || catLoading) && <LoadingState label="Loading services…" />}
        {error === 'not_configured' && (
          <ErrorState message="Connect Supabase to load services (see .env.example)." />
        )}
        {error && error !== 'not_configured' && <ErrorState message={error} />}
        {!loading && !catLoading && !error && grouped.length === 0 && (
          <EmptyState title="No services yet" description="Add services from the admin panel." />
        )}

        <div className="space-y-14">
          {grouped.map(({ category, items }) => (
            <div key={category.id}>
              <h3 className="text-lg font-bold mb-5 opacity-90">{category.name}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((s) => (
                  <Card key={s.id} className="flex flex-col gap-3">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} loading="lazy" className="w-full h-32 object-cover rounded-dw" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center dw-glow-border" style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}>
                        <DynamicIcon name={s.icon} size={20} color="var(--dw-primary)" />
                      </div>
                    )}
                    <h4 className="font-semibold">{s.name}</h4>
                    {s.description && <p className="text-sm opacity-70">{s.description}</p>}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
