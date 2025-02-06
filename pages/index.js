import styles from './index.module.css';
import Link from 'next/link';
 
const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <h1 className={styles.title}>Hoş Geldiniz!</h1>
      <p className={styles.description}>E-ticaret uygulamanıza hoş geldiniz.</p>
      <div className={styles.buttonContainer}>
      <Link href="/products" className={styles.button}>Ürünleri Görüntüle</Link>
      <Link href="/admin" className={styles.button}>Admin Paneline Git</Link>
      </div>
    </div>
  ); 
};

export default Home; 