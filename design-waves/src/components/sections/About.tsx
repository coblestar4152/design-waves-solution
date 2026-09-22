import { useEffect, useState } from 'react';
import { getAboutContent } from '@/services/db';
import type { AboutContent } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function About() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('not_configured');
      setLoading(false);
      return;
    }
    getAboutContent()
      .then(setAbout)
      .catch((e) => setError(e instanceof Error ? e.message : 'unknown_error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="about" className="py-24">
      <div className="dw-container">
        <SectionHeading eyebrow="Who We Are" title={about?.heading || 'About Design Waves'} />

        {loading && <LoadingState label="Loading…" />}
        {error === 'not_configured' && <ErrorState message="Connect Supabase to load this section." />}
        {error && error !== 'not_configured' && <ErrorState message={error} />}

        {!loading && !error && about && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {about.image_url && (
              <img src={about.image_url} alt="About Design Waves" loading="lazy" className="rounded-dw w-full dw-glow-border" />
            )}
            <div className={about.image_url ? '' : 'md:col-span-2 max-w-2xl mx-auto text-center'}>
              <p className="opacity-80 leading-relaxed">{about.description}</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Card hover={false}>
                  <h4 className="font-semibold mb-1">Our Mission</h4>
                  <p className="text-sm opacity-70">{about.mission}</p>
                </Card>
                <Card hover={false}>
                  <h4 className="font-semibold mb-1">Our Vision</h4>
                  <p className="text-sm opacity-70">{about.vision}</p>
                </Card>
              </div>
              {about.extra_content && <p className="opacity-70 text-sm mt-6 whitespace-pre-line">{about.extra_content}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
