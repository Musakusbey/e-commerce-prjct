import styles from './index.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <h1 className={styles.title}>Hoş Geldiniz!</h1>
      <p className={styles.description}>E-ticaret uygulamanıza hoş geldiniz.</p>
      <div className={styles.buttonContainer}>
        <a href="/products" className={styles.button}>Ürünleri Görüntüle</a>
        <a href="/admin" className={styles.button}>Admin Paneline Git</a>
      </div>
    </div>
  );
};

export default Home; 