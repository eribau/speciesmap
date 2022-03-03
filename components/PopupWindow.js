import { useState } from 'react'
import styles from '../styles/PopupWindow.module.css'
import countriesData from "../public/countrycodes.json"
import summary from "../public/summary.json"
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';
import assessmentDataById from '../public/allDataByAssessmentId.json'
import store from '../redux/store'
import convertThreat from '../public/threatCodeToThreatName.json'

const { Text } = Typography;

function PopupWindow(props){
    const {country, code, category} = props
    const [countSpecies, setCount] = useState([]);
    
    let dataStore = store.getState().filteredData.countryCodes;
    if (typeof dataStore === "undefined") dataStore = countriesData;

    function  renderSpecies(ID){
        //const countryData = summary.find(item => (item.assessmentId === ID && category.indexOf(item.filter.category) > -1) || (item.assessmentId === ID && category === "All"))
        const speciesData = assessmentDataById[ID];
        return(
            <>
            {<tr key={ID}>
                <td key={"name" + ID}>{speciesData.commonName=="unknown" ? speciesData.scientificName : speciesData.commonName}</td>
                <td key={"category" + ID}>{speciesData.redlistCategory}</td>
                <td key={"threat" + ID}>{convertThreat[speciesData.threatsList[0]]}</td>
                <td key={"kingdom" + ID}>{speciesData.kingdomName}</td>
            </tr>}
            </>)
    }
    function handleClose(){
        props.closeWindow()
    }
    return (
        <div className={styles["sidebar"]}>
            <img src="https://pic.onlinewebfonts.com/svg/img_185999.png" onClick={handleClose} className={styles["image"]} alt="logo" />
            <h1>{country}</h1>
            <table className={styles["table"]}>
            <tbody>
            {
                dataStore[code].map(renderSpecies)
            }

            {category === "Non" && <Text strong>Please set filters</Text>}
            {countSpecies === 0 && <>Nope</>}
            </tbody>
            </table>
        </div>
    )
}

export default PopupWindow