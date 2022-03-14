import Layout from '../components/Layout.js'
import styles from '../styles/about.module.css'

const About = () => {
   return (
      <Layout>

         <div style={{ textAlign: "center" }}>
      
            <div className={styles.test}> 
            <div className={styles.About}> 

            <h1 className={styles.h2}>About the project</h1>

            <p className={styles.p}>Our mission for this project is to visualise and educate people
               about species whose classification ranges from near vulnerable to completely extinct.
               This is an interactive map that can be used by anyone that wants to learn about species
               at risk based on their location, cause (threats), red list category and kingdom.
               It can also serve as a primary source for wildlife conservationists,
               who could potentially find areas and species that require action for
               biodiversity conservation. All data that was used in this project was
               provided by the International Union for Conservation <a href='https://www.iucnredlist.org/#:~:text=The%20IUCN%20Red%20List%20is,resources%20we%20need%20to%20survive.'> IUCN.</a> </p>
               </div>
               
               <div className={styles.img2}> 
               <img src="/images/iucnChart.jpg" width="700" 
     height="477" ></img>
               </div>

               </div>

            <div className={styles.container}>
               <h1 className={styles.h1}> The team </h1>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Bau.png"></img>
                  <p className={styles.pTeam}> <b>Erik Bauer</b>
                     <br></br>
                     <a href='mailto: ebauer@kth.se'> ebauer@kth.se</a>
                     <p className={styles.pTeam}>Backend</p>
                     <p className={styles.pTeam}>Frontend</p>
                     <p className={styles.pTeam}>UX</p>
                  </p>
               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Chu.png"></img>
                  <p className={styles.pTeam}> <b>Anna Chuprina</b>
                     <br></br>
                     <a href='mailto: chuprina@kth.se'> chuprina@kth.se</a>
                     <p className={styles.pTeam}>Backend</p>
                     <p className={styles.pTeam}>Frontend</p>
                     <p className={styles.pTeam}>UX</p>
                  </p>

               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Pop.png"></img>
                  <p className={styles.pTeam}> <b>Victoria Popova </b>
                     <br></br>
                     <a href='mailto: vpopova@kth.se'> vpopova@kth.se</a>
                     <p className={styles.pTeam}>User Testing</p>
                     <p className={styles.pTeam}>Frontend</p>
                     <p className={styles.pTeam}>UX</p>
                  </p>

               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Sto.png"></img>
                  <p className={styles.pTeam}> <b>Erik Stolpe</b>
                     <br></br>
                     <a href='mailto: estolpe@kth.se'> estolpe@kth.se</a>
                     <p className={styles.pTeam}>Backend</p>
                     <p className={styles.pTeam}>Frontend</p>
                     <p className={styles.pTeam}>&nbsp;</p>
                  </p>
               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Sun.png"></img>
                  <p className={styles.pTeam}> <b> Isak Sundström </b>
                     <br></br>
                     <a href='isaksun@kth.se'> isaksun@kth.se</a>
                     <p className={styles.pTeam}>Backend</p>
                     <p className={styles.pTeam}>Frontend</p>
                     <p className={styles.pTeam}>&nbsp;</p>
                  </p>

               </div>


            </div>
         </div>
      </Layout>
   )
}

export default About