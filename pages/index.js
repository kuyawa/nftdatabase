import Head from 'next/head';
import Image from 'next/image';
import styles from '/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Database</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={() => fetch('api/organizations').then(console.log)}>Get orgs</button>
      </main>

      <footer className={styles.footer}>Powered by Vercel</footer>
    </div>
  );
}
