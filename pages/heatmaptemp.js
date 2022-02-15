import Layout from '../components/Layout.js'
import styles from '../styles/Home.module.css'

import HeatMap from '../components/HeatMap.js'

const Heatmap = () => {
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

export default Heatmap