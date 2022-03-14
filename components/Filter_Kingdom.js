import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';
import store from '../redux/store';
import { setFilterKingdom } from '../redux/slices/filterSetting';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

function Filter_Kingdom(props){
    //const [category, setCategory] = useState("");
   /* const [checkedArray, setCheckedArray] = useState({
        threats: [],
        category: [],
        kingdom: [],
    });*/
    const kingdom = useSelector((state) => state.filterSetting.kingdom)
    // const [kingdom, setKingdom] = useState([])

    function onChange_Kingdom(checkedValues) {
        console.log('checked = ', checkedValues);
        store.dispatch(setFilterKingdom(checkedValues))
        console.log(kingdom)
        //setKingdom(checkedValues)  
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
        <Text strong className={styles["text"]}>Select kingdoms</Text>
            <Checkbox.Group onChange={onChange_Kingdom}>
                <Checkbox value="FUNGI" className={styles["text"]}>Fungi</Checkbox>
                <Checkbox value='PLANTAE' className={styles["text"]}>Plantae</Checkbox>
                <Checkbox value='ANIMALIA' className={styles["text"]}>Animalia</Checkbox>
                <Checkbox value='CHROMISTA' className={styles["text"]}>Chromista</Checkbox>
            </Checkbox.Group>
        </div>
    )
}

export default Filter_Kingdom