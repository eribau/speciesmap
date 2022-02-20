import Link from 'next/link'
import styles from '../styles/Layout.module.css'


const Layout = ({children}) => {
   
   return (
      <div>
         <nav className={styles["navbar"]}>
            <h1 className={styles["navitem"]}>
               <Link href="/">
                  <a>Species Map</a>
               </Link>
            </h1>
            <h1 className={styles["navitem"]}>
               {/* This href needs to have the same name as corresponding /pages file. 
               The <Link> element is from Next.js and links the element to the corresponding page (routing).*/}
               <Link href="/heatmaptemp">
                  <a>Species Heat Map (temporary)</a>
               </Link>
            </h1>
            <h2 className={styles["navitem"]}>
               <Link href="/about">
                  <a>About</a>
               </Link>
            </h2>
         </nav>
         {children}
      </div>
   )
}

export default Layout