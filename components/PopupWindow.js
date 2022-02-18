import styles from '../styles/PopupWindow.module.css'
import countriesData from "../public/countrycodes.json"
import summaru from "../public/summary.json"

function PopupWindow(props){
    const {country, code} = props 
    function  renderSpecies(ID){
        const countryData = summaru.find(item => item.assessmentId === ID)
        return(
            <tr key={ID}>
                <td key={ID}>{ID} </td>
                <td key="name">{countryData.scientificName}</td>
                <td key="category">{countryData.redlistCategory}</td>
            </tr>)
    }
    function handleClose(){
        props.closeWindow()
    }
    return (
        <div className={styles["sidebar"]}>
            <img src="https://cdn-icons.flaticon.com/png/512/2961/premium/2961937.png?token=exp=1645043728~hmac=44e1cc5f25b98bc53a5b691816b2b222" onClick={handleClose} className={styles["image"]} alt="logo" />
            <h1>{country}</h1>
            <table className={styles["table"]}>
            <tbody>
            {Object.keys(countriesData).map(key => {
                if(key === code){
                    return countriesData[key].map(renderSpecies)
                }})
            }
            </tbody>
            </table>
        </div>
    )
}

export default PopupWindow