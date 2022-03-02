import { useState } from 'react'
import styles from '../styles/PopupWindow.module.css'
import countriesData from "../public/countrycodes.json"
import summary from "../public/summary.json"
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';

const { Text } = Typography;

function PopupWindow(props){
    const {country, code, category} = props
    const [countSpecies, setCount] = useState([]);
    function  renderSpecies(ID){
        const countryData = summary.find(item => (item.assessmentId === ID && category.indexOf(item.filter.category) > -1) || (item.assessmentId === ID && category === "All"))
        return(
            <>
            {countryData && category && <tr key={ID}>
                <td key={ID}>{ID} </td>
                <td key={"name" + ID}>{countryData.scientificName}</td>
                <td key={"category" + ID}>{countryData.redlistCategory}</td>
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
            {category !== "Non" && Object.keys(countriesData).map(key => {
                if(key === code){
                    //return countriesData[key].map(renderSpecies)
                }})
            }
            {category === "Non" && <Text strong>Please set filters</Text>}
            {countSpecies === 0 && <>Nope</>}
            </tbody>
            </table>
        </div>
    )
}

export default PopupWindow