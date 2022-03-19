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
               about species whose classification ranges from near threatened to completely extinct.
               This is an interactive map that can be used by anyone that wants to learn about species
               at risk based on their location, cause (threats), red list category and kingdom.
               It can also serve as a primary source for wildlife conservationists,
               who could potentially find areas and species that require action for
               biodiversity conservation. All data that was used in this project was
               provided by the International Union for Conservation <a href='https://www.iucnredlist.org/#:~:text=The%20IUCN%20Red%20List%20is,resources%20we%20need%20to%20survive.'> IUCN.</a> 
               <br/>
               <div style={{textAlign:"left"}}>
               <br/>Source code and data: <br/><a href='https://github.com/eribau/speciesmap'>Github</a>
               <br/>
               <br/>Technologies and tools used:
               <br/> 
               <a href='https://reactjs.org/'> React</a>,
               <a href='https://redux.js.org/'> Redux</a>,
               <a href='https://d3js.org/'> D3</a>,
               <a href='https://nextjs.org/'> Next.js</a>,
               <a href='https://vercel.com/'> Vercel</a>, and 
               <a href='https://www.figma.com/'> Figma</a>
               </div>
               </p>
               </div>
               
               <div className={styles.container2}>

               <div className={styles.img2}> 
               <img src="/images/iucnChart.jpg" width="700" height="477" ></img>
               </div>
               <div>
               <h1 className={styles.h1}> Demo video </h1>
               
               <iframe src="https://gdurl.com/ChHV" allowfullscreen width="640" height="360" allow="autoplay"></iframe>
               </div>

               </div>

               </div>

            <div className={styles.container}>
               <h1 className={styles.h1}> The team </h1>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Bau.png"></img>
                  <p className={styles.pTeam}> <b>Erik Bauer</b>
                     <br></br>
                     <a href='mailto: ebauer@kth.se'> ebauer@kth.se</a>
                     <p className={styles.pTeam}>Backend (Next.js)</p>
                     <p className={styles.pTeam}>Frontend (React.js, Redux.js, D3.js)</p>
                     <p className={styles.pTeam}>&nbsp;</p>
                  </p>
               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Chu.png"></img>
                  <p className={styles.pTeam}> <b>Anna Chuprina</b>
                     <br></br>
                     <a href='mailto: chuprina@kth.se'> chuprina@kth.se</a>
                     <p className={styles.pTeam}>Frontend (React.js, Antd, D3.js)</p>
                     <p className={styles.pTeam}>UX (Figma)</p>
                     <p className={styles.pTeam}>&nbsp;</p>
                  </p>

               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Pop.png"></img>
                  <p className={styles.pTeam}> <b>Victoria Popova </b>
                     <br></br>
                     <a href='mailto: vpopova@kth.se'> vpopova@kth.se</a>
                     <p className={styles.pTeam}>User Testing</p>
                     <p className={styles.pTeam}>Frontend (React.js, Antd, D3.js)</p>
                     <p className={styles.pTeam}>UX (Figma)</p>
                  </p>

               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Sto.png"></img>
                  <p className={styles.pTeam}> <b>Erik Stolpe</b>
                     <br></br>
                     <a href='mailto: estolpe@kth.se'> estolpe@kth.se</a>
                     <p className={styles.pTeam}>Data processing (Node.js)</p>
                     <p className={styles.pTeam}>Frontend (React.js, D3.js)</p>
                     <p className={styles.pTeam}>UX (Figma)</p>
                  </p>
               </div>

               <div className={styles.team}>
                  <img className={styles.pics} src="/images/Layer Sun.png"></img>
                  <p className={styles.pTeam}> <b> Isak Sundström </b>
                     <br></br>
                     <a href='isaksun@kth.se'> isaksun@kth.se</a>
                     <p className={styles.pTeam}>Data processing (Python)</p>
                     <p className={styles.pTeam}>Frontend (React.js, D3.js)</p>
                     <p className={styles.pTeam}>&nbsp;</p>
                  </p>

               </div>


            </div>
         </div>
      </Layout>
   )
}

export default About