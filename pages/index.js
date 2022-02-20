import Layout from '../components/Layout.js'
import WorldMap from '../components/WorldMap.js'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <div className={styles['center']}>
        <div className={styles['margins']}>
          <WorldMap/>
        </div>
      </div>
    </Layout>
  )
}