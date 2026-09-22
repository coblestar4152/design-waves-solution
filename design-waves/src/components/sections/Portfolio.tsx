import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, PlayCircle, X } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { portfolioItemsApi, portfolioCategoriesApi, listPortfolioImages } from '@/services/db';
import type { PortfolioItem, PortfolioCategory, PortfolioImage } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

export default function Portfolio() {
  const { data: categories } = useCollection<PortfolioCategory>(() => portfolioCategoriesApi.listActive());
  const { data: items, loading, error } = useCollection<PortfolioItem>(() => portfolioItemsApi.listActive());
  const [activeCat, setActiveCat] = useState<string>('all');
  const [preview, setPreview] = useState<PortfolioItem | null>(null);
  const [galleryImages, setGalleryImages] = useState<PortfolioImage[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) {
      setGalleryImages([]);
      return;
    }
    let cancelled = false;
    listPortfolioImages(preview.id)
      .then((imgs) => { if (!cancelled) setGalleryImages(imgs); })
      .catch(() => { if (!cancelled) setGalleryImages([]); });
    return () => { cancelled = true; };
  }, [preview]);

  const filtered = useMemo(
    () => (activeCat === 'all' ? items : items.filter((i) => i.category_id === activeCat)),
    [items, activeCat]
  );

  return (
    <section id="portfolio" className="py-24">
      <div className="dw-container">
        <SectionHeading
          eyebrow="Our Work"
          title="Portfolio & Samples"
          description="A selection of recent projects across design, video, and development."
        />

        {loading && <LoadingState label="Loading portfolio…" />}
        {error === 'not_configured' && <ErrorState message="Connect Supabase to load the portfolio." />}
        {error && error !== 'not_configured' && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-10 dw-scroll-x">
                <button
                  onClick={() => setActiveCat('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                    activeCat === 'all' ? 'dw-btn-primary border-transparent' : 'border-white/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                      activeCat === c.id ? 'dw-btn-primary border-transparent' : 'border-white/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <EmptyState title="No portfolio items yet" description="Add samples from the admin panel." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPreview(item)}
                    className="dw-glass dw-glow-border dw-card-hover text-left overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40 text-sm">No image</div>
                      )}
                      {item.video_url && (
                        <span className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                          <PlayCircle size={16} />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.description && <p className="text-sm opacity-70 mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80" onClick={() => setPreview(null)} />
          <div className="relative dw-glass max-w-2xl w-full max-h-[88vh] overflow-y-auto p-5">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5 z-10"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
            {preview.video_url ? (
              <div className="aspect-video w-full rounded-dw overflow-hidden mb-4">
                <iframe
                  src={preview.video_url}
                  title={preview.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : preview.cover_image_url ? (
              <img src={preview.cover_image_url} alt={preview.title} className="w-full rounded-dw mb-4 max-h-[50vh] object-contain" />
            ) : null}
            <h3 className="text-xl font-bold">{preview.title}</h3>
            {preview.description && <p className="opacity-75 mt-2 text-sm">{preview.description}</p>}

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {galleryImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxImage(img.image_url)}
                    className="aspect-square rounded-dw overflow-hidden dw-glass"
                  >
                    <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  </button>
                ))}
              </div>
            )}

            {preview.project_url && (
              <a
                href={preview.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="dw-btn dw-btn-outline mt-4 inline-flex"
              >
                View Project <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 bg-black/60 rounded-full p-2"
            aria-label="Close image"
          >
            <X size={20} />
          </button>
          <img src={lightboxImage} alt="" className="max-w-full max-h-full object-contain rounded-dw" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
