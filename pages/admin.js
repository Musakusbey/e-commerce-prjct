import { useState } from 'react';  
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import styles from './admin.module.css';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          price: parseFloat(price),
        }]);

      if (error) throw error;

      alert('✅ Ürün başarıyla eklendi!');
      router.push('/products');
    } catch (error) {
      // console.warn('⚠️ Hata:', error);  // Eğer hata mesajlarını görmek istersen açabilirsin.
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

// ✅ ESLint için prop-types doğrulaması eklendi
Admin.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  loading: PropTypes.bool,
  router: PropTypes.object.isRequired,
};
  