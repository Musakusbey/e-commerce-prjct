import { createClient } from '@supabase/supabase-js';
import { getProductImage } from '../utils/unsplash.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// .env.local dosyasını yükle
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Supabase bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Türkçe ürün isimlerini İngilizce'ye çevir
function translateProductName(name) {
  const translations = {
    'silgi': 'eraser',
    'kalemtıras': 'pencil sharpener',
    'araba': 'car'
  };
  return translations[name.toLowerCase()] || name;
}

async function updateProductImages() {
  try {
    // Resmi olmayan ürünleri al
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .is('image', null);

    if (error) throw error;

    console.log(`${products.length} ürün için resim güncellenecek...`);

    // Her ürün için resim ekle
    for (const product of products) {
      try {
        const translatedName = translateProductName(product.name);
        const imageUrl = await getProductImage(translatedName);
        
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ image: imageUrl })
            .eq('id', product.id);

          if (updateError) throw updateError;
          console.log(`✓ ${product.name} için resim eklendi`);
        } else {
          console.log(`✗ ${product.name} için resim bulunamadı`);
        }
      } catch (err) {
        console.error(`✗ ${product.name} güncellenirken hata:`, err);
      }

      // API rate limit'e takılmamak için bekle
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('İşlem tamamlandı!');
  } catch (error) {
    console.error('Hata:', error);
  }
}

updateProductImages();
