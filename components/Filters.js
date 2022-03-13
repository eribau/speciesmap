import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';
import { setFilterThreats, setFilterCategory, setFilterKingdom } from '../redux/slices/filterSetting';
import store from '../redux/store';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

function Filters(props){
    //const [category, setCategory] = useState("");
   /* const [checkedArray, setCheckedArray] = useState({
        threats: [],
        category: [],
        kingdom: [],
    });*/
    // const [category, setCategory] = useState([])
    // const [threats, setThreats] = useState([])
    // const [kingdom, setKingdom] = useState([])

    const category = useSelector((state) => state.filterSetting.category)
    const threats = useSelector((state) => state.filterSetting.threats)
    const kingdom = useSelector((state) => state.filterSetting.kingdom)

    function onChange_Category(checkedValues) {
        console.log('checked = ', checkedValues);
        store.dispatch(setFilterCategory(checkedValues))
        // setCategory(checkedValues)
        props.onCategoryChanges({
            threats: threats,
            category: checkedValues,
            kingdom: kingdom,
        })
        if(checkedValues.length < 1)
            props.onCategoryChanges({
                threats: threats,
                category: [],
                kingdom: kingdom,
            })  
        
        console.log({
            threats: threats,
            category: [],
            kingdom: kingdom,
        })    
    }
    function onChange_Threats(checkedValues) {
        console.log('checked = ', checkedValues);
        store.dispatch(setFilterThreats(checkedValues))
        // setThreats(checkedValues)
        props.onCategoryChanges({
            threats: checkedValues,
            category: category,
            kingdom: kingdom,
        })
        if(checkedValues.length < 1)
            props.onCategoryChanges({
                threats: [],
                category: category,
                kingdom: kingdom,
        })
        console.log({
            threats: [],
            category: category,
            kingdom: kingdom,
        })      
    }
    function onChange_Kingdom(checkedValues) {
        console.log('checked = ', checkedValues);
        store.dispatch(setFilterKingdom(checkedValues))
        // setKingdom(checkedValues)
        props.onCategoryChanges({
            threats: threats,
            category: category,
            kingdom: checkedValues,
        })
        if(checkedValues.length < 1)
            props.onCategoryChanges({
                threats: threats,
                category: category,
                kingdom: [],
            })  
        console.log({
            threats: threats,
            category: category,
            kingdom: [],
        }) 
    }
    const options_redList = [
        { label: 'Extinct', value: 'Extinct'},
        { label: 'Extinct in the Wild', value: 'Extinct in the Wild' },
        { label: 'Critically Endangered', value: 'Critically Endangered' },
        { label: 'Endangered', value: 'Endangered' },
        { label: 'Vulnerable', value: 'Vulnerable' },
        { label: 'Near Threatened', value: 'Near Threatened' },
    ];

    const options_threats = [
        { label: 'Residential and commercial development', value: '1'},
        { label: 'Agriculture and aquaculture', value: '2' },
        { label: 'Energy production and mining', value: '3' },
        { label: 'Transportation and service corridors', value: '4' },
        { label: 'Biological resource use', value: '5' },
        { label: 'Human intrusions and disturbance', value: '6' },
        { label: 'Natural system modification', value: '7' },
        { label: 'Invasive and other problematic species, genes and diseases', value: '8' },
        { label: 'Pollution', value: '9' },
        { label: 'Geological events', value: '10' },
        { label: 'Climate change and severe weather', value: '11' },
        { label: 'Other', value: '12' },
    ];

    const options_kingdom = [
        { label: 'Fungi', value: 'FUNGI'},
        { label: 'Plantae', value: 'PLANTAE'},
        { label: 'Animalia', value: 'ANIMALIA'},
        { label: 'Chromista', value: 'CHROMISTA'},
    ];
    return (
        <div className={styles["filters"]}>
            
            <Title level={2} className={styles["text"]}>Filters</Title>
            <div className={styles["category"]}>
                <Text strong className={styles["text"]}>Select Red List categories</Text>
                <Checkbox.Group onChange={onChange_Category}>
                    <Checkbox value="Extinct" className={styles["text"]}>Extinct</Checkbox>
                    <Checkbox value='Extinct in the Wild' className={styles["text"]}>Extinct in the Wild</Checkbox>
                    <Checkbox value='Critically Endangered' className={styles["text"]}>Critically Endangered</Checkbox>
                    <Checkbox value='Endangered' className={styles["text"]}>Endangered</Checkbox>
                    <Checkbox value='Vulnerable' className={styles["text"]}>Vulnerable</Checkbox>
                    <Checkbox value='Near Threatened' className={styles["text"]}>Near Threatened</Checkbox>
                </Checkbox.Group>
            </div>
            <div className={styles["category_threats"]}>
            <Text strong className={styles["text"]}>Select threats</Text>
                <Checkbox.Group onChange={onChange_Threats}>
                    <Checkbox value="1" className={styles["text"]}>Residential and commercial development</Checkbox>
                    <Checkbox value='2' className={styles["text"]}>Agriculture and aquaculture</Checkbox>
                    <Checkbox value='3' className={styles["text"]}>Energy production and mining</Checkbox>
                    <Checkbox value='4' className={styles["text"]}>Transportation and service corridors</Checkbox>
                    <Checkbox value='5' className={styles["text"]}>Biological resource use</Checkbox>
                    <Checkbox value='6' className={styles["text"]}>Human intrusions and disturbance</Checkbox>
                    <Checkbox value='7' className={styles["text"]}>Natural system modification</Checkbox>
                    <Checkbox value='8' className={styles["text"]}>Invasive and other problematic species, genes and diseases</Checkbox>
                    <Checkbox value='9' className={styles["text"]}>Pollution</Checkbox>
                    <Checkbox value='10' className={styles["text"]}>Geological events</Checkbox>
                    <Checkbox value='11' className={styles["text"]}>Climate change and severe weather</Checkbox>
                    <Checkbox value='12' className={styles["text"]}>Other</Checkbox>
                </Checkbox.Group>
            </div>
            <div className={styles["kingdom"]}>
            <Text strong className={styles["text"]}>Select kingdoms</Text>
                <Checkbox.Group onChange={onChange_Kingdom}>
                    <Checkbox value="FUNGI" className={styles["text"]}>Fungi</Checkbox>
                    <Checkbox value='PLANTAE' className={styles["text"]}>Plantae</Checkbox>
                    <Checkbox value='ANIMALIA' className={styles["text"]}>Animalia</Checkbox>
                    <Checkbox value='CHROMISTA' className={styles["text"]}>Chromista</Checkbox>
                </Checkbox.Group>
            </div>
        </div>
    )
}

export default Filters