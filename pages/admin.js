import { useState } from 'react';
import { supabase, supabaseAdmin } from '../supabaseClient';
import { useRouter } from 'next/router'; 
import styles from './admin.module.css';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Service role key ile oluşturulan client'ı kullan
      const client = supabaseAdmin || supabase;

      // Gönderilen verileri konsola yazdır
      console.log('Gönderilen Veriler:', {
        name,
        price: parseFloat(price),
        description,
        features,
        imageExists: !!image
      });

      // Resim yükleme
      let imageUrl = '';
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        console.log('Resim Bilgileri:', {
          fileName,
          fileSize: image.size,
          fileType: image.type
        });

        // Resmi Supabase Storage'a yükleme
        const { data: uploadData, error: uploadError } = await client.storage
          .from('product-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Resim Yükleme Hatası:', uploadError);
          throw uploadError;
        }

        // Yüklenen resmin public URL'sini alma
        const { data: { publicUrl } } = client.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log('Resim Public URL:', imageUrl);
      }

      // Özellikleri JSON'a çevirme
      const parsedFeatures = features 
        ? features.split(',').map(feature => feature.trim())
        : [];

      // Ürünü veritabanına ekleme
      const { data, error } = await client
        .from('products')
        .insert([{ 
          name, 
          price: parseFloat(price),
          description,
          features: JSON.stringify(parsedFeatures),
          image_url: imageUrl
        }])
        .select();

      if (error) {
        console.error('Ürün Ekleme Hatası:', error);
        throw error;
      }

      console.log('Eklenen Ürün:', data);

      alert('Ürün başarıyla eklendi!');
      router.push('/products');
    } catch (error) {
      console.error('Toplam Hata:', error);
      alert('Ürün eklenirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Yeni Ürün Ekle</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.input}
          step="0.01"
          min="0"
          required
        />
        <textarea
          placeholder="Ürün açıklaması"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Ürün özellikleri (virgülle ayırın)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className={styles.input}
          title="Özellikleri virgülle ayırarak girin. Örn: Hızlı şarj, Su geçirmez, Çift kamera"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className={styles.input}
          title="Ürün resmi yükleyin"
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
        </button>
      </form>
    </div>
  );
}
