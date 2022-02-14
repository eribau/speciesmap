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