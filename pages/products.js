import { useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient';
import styles from './products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');  

  useEffect(() => {   
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      console.log('Gelen ürün verisi:', data);

      const processedProducts = data.map(product => ({
        ...product,
        features: product.features ? JSON.parse(product.features) : [], // JSON parse ile format düzeltildi
        image_url: product.image_url || 'https://via.placeholder.com/280x280'
      }));

      console.log('İşlenmiş ürünler:', processedProducts);

      setProducts(processedProducts);
    } catch (error) {
      console.error('🚨 Ürünleri çekerken hata oluştu:', error);
      alert('Ürünler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('✅ Ürün sepete eklendi!');
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={styles.sortSelect}>
          <option value="asc">Fiyat: Düşükten Yükseğe</option>
          <option value="desc">Fiyat: Yüksekten Düşüğe</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <img src={product.image_url} alt={product.name} className={styles.productImage} />
            <div className={styles.cardContent}>
              <h3>{product.name}</h3>
              <p className={styles.price}>{product.price.toFixed(2)} TL</p>
              <p>{product.description}</p>
              <ul>
                {product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index}>✅ {feature}</li>
                  ))
                ) : (
                  <li>⚠️ Özellik belirtilmemiş.</li>
                )}
              </ul>
            </div>
            <button onClick={() => addToCart(product)} className={styles.addToCartButton}>Sepete Ekle</button>  
          </div>
        ))}
      </div>
    </div>
  );
}
       