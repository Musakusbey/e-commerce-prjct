import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './admin.module.css';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Resmi Supabase'e yükleme fonksiyonu
  const uploadImage = async (file) => {
    if (!file) {
      alert('⚠️ Lütfen bir resim dosyası seçin.');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log(`📤 Resim yükleniyor: ${fileName}`);

      // Supabase'e resmi yükleme
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        console.error('🚨 Resim yükleme hatası:', error.message);
        alert(`🚨 Resim yükleme hatası: ${error.message}`);
        return null;
      }

      // Resmin public URL’sini alma
      const { data: urlData } = await supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        alert('❌ Resim URL’si alınamadı.');
        return null;
      }

      console.log('✅ Resim başarıyla yüklendi:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      console.error('🚨 Upload işlemi sırasında hata:', err);
      return null;
    }
  };

  // Ürünü ekleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          alert('❌ Resim yüklenemedi, lütfen tekrar deneyin.');
          setLoading(false);
          return;
        }
      }

      // Özellikleri JSON formatına dönüştür
      const featureList = features.split(',').map(f => f.trim());

      const { error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          price: parseFloat(price),
          description,
          features: JSON.stringify(featureList),
          image_url: imageUrl
        }]);

      if (error) throw error;

      alert('✅ Ürün başarıyla eklendi!');
      router.push('/products');
    } catch (error) {
      alert('🚨 Ürün eklenirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Yeni Ürün Ekle</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="Ürün adı" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
        <input type="number" placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} className={styles.input} step="0.01" min="0" required />
        <textarea placeholder="Ürün açıklaması" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} rows="4" />
        <input type="text" placeholder="Özellikler (virgülle ayır)" value={features} onChange={(e) => setFeatures(e.target.value)} className={styles.input} />
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.input} />
        <button type="submit" className={styles.button} disabled={loading}> {loading ? 'Ekleniyor...' : 'Ürün Ekle'} </button>
      </form>
    </div>
  );
}
   