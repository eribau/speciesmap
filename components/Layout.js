import Link from 'next/link'
import styles from '../styles/Layout.module.css'
import 'antd/dist/antd.css';
import { Typography } from 'antd';

const { Text } = Typography;


const Layout = ({children}) => {
   
   return (
      <div>
         <nav className={styles["navbar"]}>
            <h1>
               <Link href="/">
                  <a className={styles["navitem"]}>Species Map</a>
               </Link>
            </h1>
            {/* This href needs to have the same name as corresponding /pages file. 
            The <Link> element is from Next.js and links the element to the corresponding page (routing).*/}
            <h1>
               <Link href="/about">
                  <a className={styles["navitem"]}>About</a>
               </Link>
            </h1>
            <h1>
               <Link href="/help">
                  <a className={styles["navitem"]}>Help</a>
               </Link>
            </h1>

         </nav>
         {children}
      </div>
   )
}

export default Layout