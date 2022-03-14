import Layout from '../components/Layout.js'
import styles from '../styles/about.module.css'


const Help = () => {
   return (
      <Layout>
     
    

     
     <div className={styles.bkg}>

      <div className={styles.container3}>
         <div style={{textAlign: "center",
      }}>
            <h1 className={styles.h2}>How it works</h1>
            <p className={styles.pHelp}>
Here is a brief list of functionalities that will help you with exploring and understanding the contents of this application.

<h3 className={styles.h3}>Interpreting the heat map:</h3>

In the beginning you get introduced to a heat map visualising a distribution of all species for each country. The more intense a colour of a country is, the higher the amount of species at risk it contains. 

<h3 className={styles.h3}>Filters:</h3>

It is possible to change the species shown by using the filter function found on the right hand side, making it possible to filter among species based on their IUCN’s red 
list categories, threats that species are exposed to and four different kingdoms. 

<h3 className={styles.h3}>Hover:</h3>
By hovering over a country you get a glimpse of the total number of species based on the chosen filters. 

<h3 className={styles.h3}>Details on demand:</h3>

If you wish to further explore the species within a country, clicking on a country will navigate you to a more detailed view, containing a stacked bar chart as well as filter options. The stacked bar chart has the amount of species on the y-axis, threats (one per bar, 12 in total) on the x-axis. The sub-bars within a bar represent the red list categories. Hovering over a sub-bar allows you to see the exact number of species for that sub-bar.

<h3 className={styles.h3}>Navigation:</h3>Basic navigation through the map is done by pan and zoom.
</p>
         </div> 
         </div>
         </div>

      </Layout>
   )
}

export default Help
