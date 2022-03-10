import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';

const { Title, Text } = Typography;

function Filter_Kingdom(props){
    //const [category, setCategory] = useState("");
   /* const [checkedArray, setCheckedArray] = useState({
        threats: [],
        category: [],
        kingdom: [],
    });*/
    const [kingdom, setKingdom] = useState([])

    function onChange_Kingdom(checkedValues) {
        console.log('checked = ', checkedValues);
        setKingdom(checkedValues)  
        props.onKingdomChanges(checkedValues)
    }
   

    const options_kingdom = [
        { label: 'Fungi', value: 'FUNGI'},
        { label: 'Plantae', value: 'PLANTAE'},
        { label: 'Animalia', value: 'ANIMALIA'},
        { label: 'Chromista', value: 'CHROMISTA'},
    ];
    return (
        <div className={styles["filters"]}>
            
            <Title level={4}>Select kingdoms</Title>
            <div className={styles["category"]}>
                <Checkbox.Group options={options_kingdom} onChange={onChange_Kingdom}/>
            </div>
        </div>
    )
}

export default Filter_Kingdom