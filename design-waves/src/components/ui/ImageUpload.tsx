import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '@/services/storage';
import type { BUCKETS } from '@/lib/supabase';

export default function ImageUpload({
  bucket, value, onChange, folder,
}: { bucket: keyof typeof BUCKETS; value: string | null; onChange: (url: string | null) => void; folder?: string }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadImage(bucket, file, folder);
      onChange(url);
      toast.success('Image uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-36 rounded-dw overflow-hidden dw-glass">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 rounded-dw dw-glass flex flex-col items-center justify-center gap-2 text-sm opacity-70 hover:opacity-100 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
          {loading ? 'Uploading…' : 'Click to upload image'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
