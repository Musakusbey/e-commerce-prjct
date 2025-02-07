import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // ✅ ESLint için prop validation eklendi
import Header from "../components/Header";
import { motion, AnimatePresence } from 'framer-motion';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ff4444',
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h2 style={{ color: '#ff4444', marginBottom: '10px' }}>Bir Hata Oluştu</h2>
      <p style={{ marginBottom: '15px' }}>Üzgünüz, bir şeyler yanlış gitti:</p>
      <pre style={{ 
        color: '#ff4444',
        background: '#fff0f0',
        padding: '10px',
        borderRadius: '4px',
        overflow: 'auto'
      }}>{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Yeniden Dene
      </button>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(updatedCount);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Header cartItemCount={cartItemCount} />
        <Component {...pageProps} onError={setError} />
      </motion.div>
    </AnimatePresence>
  );
}

// ✅ ESLint hatalarını gidermek için prop-types doğrulaması eklendi
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
};

export default MyApp;
  