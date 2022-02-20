import Link from 'next/link'
import styles from '../styles/Layout.module.css'
import 'antd/dist/antd.css';
import { Typography } from 'antd';

const { Text } = Typography;


const Layout = ({children}) => {
   
   return (
      <div>
         <nav className={styles["navbar"]}>
            <h1 className={styles["navitem"]}>
               <Link href="/">
                  <a><Text>Species Map</Text></a>
               </Link>
            </h1>
            <h1 className={styles["navitem"]}>
               {/* This href needs to have the same name as corresponding /pages file. 
               The <Link> element is from Next.js and links the element to the corresponding page (routing).*/}
               <Link href="/heatmaptemp">
                  <a><Text>Species Heat Map (temporary)</Text></a>
               </Link>
            </h1>
            <h2 className={styles["navitem"]}>
               <Link href="/about">
                  <a><Text>About</Text></a>
               </Link>
            </h2>
         </nav>
         {children}
      </div>
   )
}

export default Layout