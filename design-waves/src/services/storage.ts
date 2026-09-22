import { supabase, BUCKETS } from '@/lib/supabase';

export async function uploadImage(
  bucket: keyof typeof BUCKETS,
  file: File,
  folder = ''
): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${folder ? folder + '/' : ''}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKETS[bucket]).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImageByUrl(bucket: keyof typeof BUCKETS, publicUrl: string): Promise<void> {
  const marker = `/${BUCKETS[bucket]}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.substring(idx + marker.length).split('?')[0];
  await supabase.storage.from(BUCKETS[bucket]).remove([path]);
}
