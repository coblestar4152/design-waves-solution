import { useCollection } from '@/hooks/useCollection';
import { socialLinksApi } from '@/services/db';
import type { SocialLink } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { DynamicIcon } from '@/lib/icons';

export default function Contact() {
  const { data: links, loading, error } = useCollection<SocialLink>(() => socialLinksApi.listActive());

  return (
    <section id="contact" className="py-24">
      <div className="dw-container">
        <SectionHeading
          eyebrow="Let's Talk"
          title="Get in Touch"
          description="Reach out on any of these platforms — we usually respond quickly."
        />

        {loading && <LoadingState label="Loading contact options…" />}
        {error === 'not_configured' && <ErrorState message="Connect Supabase to load contact links." />}
        {error && error !== 'not_configured' && <ErrorState message={error} />}
        {!loading && !error && links.length === 0 && (
          <EmptyState title="No contact platforms yet" description="Add platforms from the admin panel." />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dw-glass dw-glow-border dw-card-hover p-5 flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgb(var(--dw-primary-rgb) / 0.12)' }}
              >
                <DynamicIcon name={link.icon} size={20} color="var(--dw-primary)" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{link.platform_name}</p>
                {link.label && <p className="text-xs opacity-60 truncate">{link.label}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
