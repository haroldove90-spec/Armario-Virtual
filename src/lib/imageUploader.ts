import { supabase } from './supabase';

/**
 * Compresses an image file locally using Canvas to prevent quota exceeded errors & high memory usage.
 */
export function compressImageFile(file: File, maxDimension = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al procesar formato de imagen'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg
        try {
          const webpUrl = canvas.toDataURL('image/webp', quality);
          if (webpUrl && webpUrl.startsWith('data:image/webp')) {
            resolve(webpUrl);
            return;
          }
        } catch (e) {
          // ignore
        }

        const jpegUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Supabase Storage with local compression fallback.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file) return '';

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `uploads/${Date.now()}_${cleanFileName}`;

  // Attempt upload to Supabase Storage buckets
  const buckets = ['products', 'banner', 'public', 'images'];

  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          console.log(`✅ Imagen subida con éxito a Supabase Storage (bucket: ${bucket}):`, publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn(`Intento de subir a bucket '${bucket}' en Supabase no disponible:`, e);
    }
  }

  // Fallback: local Canvas compression (returns compact ~80KB webp/jpeg string)
  console.log('⚡ Usando compresión local optimizada para imagen...');
  return await compressImageFile(file, 1000, 0.8);
}
