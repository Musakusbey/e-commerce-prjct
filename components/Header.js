import Link from 'next/link';
import PropTypes from 'prop-types'; // ✅ ESLint için prop validation eklendi
import styles from './Header.module.css';

const Header = ({ cartItemCount = 0 }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          E-Ticaret
        </Link>
        
        <div className={styles.links}>
          <Link href="/products" className={styles.link}>
            Ürünler
          </Link>
          <Link href="/admin" className={styles.link}>
            Admin Panel
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            Sepet
            {cartItemCount > 0 && (
              <span className={styles.badge}>{cartItemCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

// ✅ ESLint için prop validation eklendi
Header.propTypes = {
  cartItemCount: PropTypes.number,
};

export default Header;
    