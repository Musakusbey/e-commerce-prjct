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
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    alert('Ürün sepete eklendi!');
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => { 
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingDot}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="asc">Fiyat: Düşükten Yükseğe</option>
          <option value="desc">Fiyat: Yüksekten Düşüğe</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className={styles.productImage} 
              />
            )}
            <div className={styles.cardContent}>
              <h3>{product.name}</h3>
              <p className={styles.price}>{product.price.toFixed(2)} TL</p>
              
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}
              
              {product.features && (
                <div className={styles.features}>
                  <h4>Özellikler:</h4>
                  <ul>
                    {JSON.parse(product.features).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className={styles.addToCartButton}
            >
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
