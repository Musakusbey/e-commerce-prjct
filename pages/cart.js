import { useState, useEffect } from 'react';
import styles from './cart.module.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Sepetteki ürünleri localStorage'dan al
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
    
    // Toplam fiyatı hesapla
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(totalPrice); 
  }, []);
   
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sepetim</h1>
      
      {cartItems.length === 0 ? (
        <p className={styles.empty}>Sepetiniz boş</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <p>{item.price} TL</p>
                </div>
                
                <div className={styles.itemActions}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summary}>
            <div className={styles.total}>
              <span>Toplam:</span>
              <span>{total.toFixed(2)} TL</span>
            </div>
            <button className={styles.checkoutButton}>
              Satın Al
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
  