import Head   from 'next/head'
import Image  from 'next/image'
import styles from '/styles/Home.module.css'

async function showData(info){
  console.log('Data:', info)
  document.getElementById('results').innerHTML = JSON.stringify(info?.data,null,4)
}

async function getUsers(){
  let resp = await fetch('/api/users')
  let info = await resp.json()
  showData(info)
}

async function getOrganizations(){
  let resp = await fetch('/api/organizations')
  let info = await resp.json()
  showData(info)
}

async function getCollections(){
  let resp = await fetch('/api/collections')
  let info = await resp.json()
  showData(info)
}

async function getArtworks(){
  let resp = await fetch('/api/artworks')
  let info = await resp.json()
  showData(info)
}

async function getOffers(){
  let resp = await fetch('/api/offers')
  let info = await resp.json()
  showData(info)
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Database</title>
        <meta name="description" content="Database for NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.actions}>
          <li className={styles.list}><button className={styles.button} onClick={getUsers}>Get users</button></li>
          <li className={styles.list}><button className={styles.button} onClick={getOrganizations}>Get organizations</button></li>
          <li className={styles.list}><button className={styles.button} onClick={getCollections}>Get collections</button></li>
          <li className={styles.list}><button className={styles.button} onClick={getArtworks}>Get artworks</button></li>
          <li className={styles.list}><button className={styles.button} onClick={getOffers}>Get offers</button></li>
        </div>
        <pre className={styles.results} id="results"></pre>
      </main>

      <footer className={styles.footer}>Powered by Vercel</footer>
    </div>
  )
}
