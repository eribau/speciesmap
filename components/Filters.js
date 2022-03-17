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
        { label: 'Lower Risk', value: 'Lower Risk' },
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
            
            <Title className={styles["text"]} level={2}>Filters</Title>
            <div className={styles["category"]}>
                <Text className={styles["text"]} strong>Select Red List categories</Text>
                <Checkbox.Group options={options_redList} onChange={onChange_Category} defaultValue={category}/>
            </div>
            <div className={styles["category_threats"]}>
                <Text className={styles["text"]} strong>Select threats</Text>
                <Checkbox.Group options={options_threats} onChange={onChange_Threats} defaultValue={threats}/>
            </div>
            <div className={styles["category"]}>
                <Text className={styles["text"]} strong>Select kingdoms</Text>
                <Checkbox.Group options={options_kingdom} onChange={onChange_Kingdom} defaultValue={kingdom}/>
            </div>
        </div>
    )
}

export default Filters