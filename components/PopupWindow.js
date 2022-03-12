import { useState } from 'react'
import styles from '../styles/PopupWindow.module.css'
import countriesData from "../public/countrycodes.json"
import summary from "../public/summary.json"
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';
import assessmentDataById from '../public/allDataByAssessmentId.json'
import convertThreat from '../public/threatCodeToThreatName.json'


import store from '../redux/store'
import { setFilteredData } from '../redux/slices/filteredData'
import { setSelectedCountry } from '../redux/slices/selectedCountry'

const { Text, Link } = Typography;

function PopupWindow(props){
    const {category, threat, code, filtersValue, kingdom} = props
    
    //console.log(props.category + " - " +  props.threat + " - " + props.code + " - " + kingdom)
    const [displayAll, setDisplayAll] = useState(false);
    const [allThreats, setAllThreats] = useState(false);
    const [arrayN, setArrayN] = useState("");
    const count = 0;

    let dataStore = store.getState().filteredData.countryCodes;
    if (typeof dataStore === "undefined") dataStore = countriesData;

    //store.dispatch(setFilteredData(filtersValue));
    function moreThreats(e){
        console.log(e.target.key)
        setAllThreats(!allThreats)
        setArrayN(count)
    }

    function  renderSpecies(ID){
        //const countryData = summary.find(item => (item.assessmentId === ID && category.indexOf(item.filter.category) > -1) || (item.assessmentId === ID && category === "All"))
        const speciesData = assessmentDataById[ID];
        //console.log(speciesData.threatsList + " - " + speciesData.threatsList[0])
        
        if (speciesData.redlistCategory === category && (speciesData.threatsList).find(item =>convertThreat[item] == threat) && (kingdom.length === 0 || kingdom.find(item => item == speciesData.kingdomName))){
            count++
            if((count < 20 && !displayAll) || displayAll){
                return(
                    <>
                    <tr key={ID}>
                        <td key={"name" + ID} className={styles["td"]}>
                            <Link href={`https://www.iucnredlist.org/species/${speciesData.internalTaxonId}/${speciesData.assessmentId}`} target="_blank">
                                {speciesData.commonName=="unknown" ? speciesData.scientificName : speciesData.commonName}
                            </Link>
                        </td>
                        <td key={"category" + ID} className={styles["td"]}>{speciesData.redlistCategory}</td>
                        {(speciesData.threatsList.length > 1 && !allThreats) || (speciesData.threatsList.length > 1 && allThreats && arrayN && ID !== arrayN)? //IF number of threats is > 1 && we need to check if we already displaying all threats
                            <td id={ID} key={"threat" + ID} className={styles["threats"]}>
                                <div value="1111" onClick={() => {//Function will allow display all threats && save ID of animal which threats need to be displayed
                                    setAllThreats(true);
                                    setArrayN(ID)
                                }}>
                                {`${convertThreat[speciesData.threatsList[0]]} ...`}
                                </div>
                            </td> : 
                            speciesData.threatsList.length > 1 && allThreats && arrayN && ID === arrayN? //statement to find specific animal which threats should be showed to user
                            <td id={ID} key={"threat" + ID} className={styles["allThreats"]} onClick={() => {
                                setAllThreats(false);
                                setArrayN("")
                            }}>
                                {speciesData.threatsList.map(thr => <div>🔴{convertThreat[thr]}</div>)}
                            </td> :
                            <td key={"threat" + ID} className={styles["td"]}>{convertThreat[speciesData.threatsList[0]]}</td>
                        }
                        <td key={"kingdom" + ID} className={styles["td"]}>{speciesData.kingdomName}</td>
                    </tr>
                    </>)
            }
            else if(count === 20 && !displayAll){
                return(
                    <>
                        <img src='https://cdn-icons-png.flaticon.com/512/512/512142.png' alt="dots" className={styles["dots"]} onClick={handleMore}/>
                    </>)
            }
        }
    }
    function handleClose(){
        props.closeWindow()
    }
    function handleMore(){
        setDisplayAll(true)
    }
    function handleMin(){
        setDisplayAll(false)
    }
    return (
        <div className={styles["popupWindow"]}>
            {displayAll && <img src="https://cdn-icons-png.flaticon.com/512/251/251282.png" onClick={handleMin} className={styles["image_min"]} alt="logo" />}
            <img src="https://cdn-icons-png.flaticon.com/512/251/251319.png" onClick={handleClose} className={styles["image_close"]} alt="logo" />
            <table className={styles["table"]}>
            <tbody>
            <tr key="Header">
                <td key="name" className={styles["name"]}><h3>Name</h3></td>
                <td key="category" className={styles["category"]}><h3>Category</h3></td>
                <td key="threat" className={styles["threat"]}><h3>Threats</h3></td>
                <td key="kingdom" className={styles["kingdom"]}><h3>Kingdom</h3></td>
            </tr>
            {
                dataStore[props.code].map(renderSpecies)
            }
            </tbody>
            </table>
        </div>
    )
}

export default PopupWindow