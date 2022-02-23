import Layout from '../components/Layout.js'
import HeatMap from '../components/HeatMap.js'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <div className={styles['center']}>
        <div className={styles['margins']}>
          <HeatMap/>
        </div>
      </div>
    </Layout>
  )
}