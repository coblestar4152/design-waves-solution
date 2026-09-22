import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Upload, Loader2, GripVertical } from 'lucide-react';
import { listPortfolioImages, portfolioImagesApi } from '@/services/db';
import { uploadImage, deleteImageByUrl } from '@/services/storage';
import type { PortfolioImage } from '@/types/database';

export default function PortfolioGalleryManager({ portfolioItemId }: { portfolioItemId: string }) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setImages(await listPortfolioImages(portfolioItemId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioItemId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      let order = images.length;
      for (const file of Array.from(files)) {
        const url = await uploadImage('portfolio', file, `gallery/${portfolioItemId}`);
        await portfolioImagesApi.create({
          portfolio_item_id: portfolioItemId,
          image_url: url,
          display_order: order++,
        });
      }
      toast.success('Image(s) added to gallery');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(img: PortfolioImage) {
    setRemovingId(img.id);
    try {
      await portfolioImagesApi.remove(img.id);
      await deleteImageByUrl('portfolio', img.image_url);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      toast.success('Image removed');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove image');
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <label className="text-xs opacity-70 mb-2 block">Additional Gallery Images</label>

      {loading ? (
        <p className="text-xs opacity-50">Loading gallery…</p>
      ) : (
        <>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-dw overflow-hidden dw-glass">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/50 rounded p-0.5">
                    <GripVertical size={12} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    disabled={removingId === img.id}
                    aria-label="Remove gallery image"
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                  >
                    {removingId === img.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 text-xs opacity-70 hover:opacity-100 transition dw-glass rounded-dw py-3 cursor-pointer">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading…' : 'Add gallery images'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </>
      )}
    </div>
  );
}
