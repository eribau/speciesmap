import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';

const { Title, Text } = Typography;

function Filters(props){
    //const [category, setCategory] = useState("");
   /* const [checkedArray, setCheckedArray] = useState({
        threats: [],
        category: [],
        kingdom: [],
    });*/
    const [category, setCategory] = useState([])
    const [threats, setThreats] = useState([])
    const [kingdom, setKingdom] = useState([])

    function onChange_Category(checkedValues) {
        console.log('checked = ', checkedValues);
        setCategory(checkedValues)
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
    }
    function onChange_Threats(checkedValues) {
        console.log('checked = ', checkedValues);
        setThreats(checkedValues)
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
    }
    function onChange_Kingdom(checkedValues) {
        console.log('checked = ', checkedValues);
        setKingdom(checkedValues)
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
        { label: 'Residential and commercial development', value: 'Residential and commercial development'},
        { label: 'Agriculture and aquaculture', value: 'Agriculture and aquaculture' },
        { label: 'Energy production and mining', value: 'Energy production and mining' },
        { label: 'Transportation and service corridors', value: 'Transportation and service corridors' },
        { label: 'Biological resource use', value: 'Biological resource use' },
        { label: 'Human intrusions and disturbance', value: 'Human intrusions and disturbance' },
        { label: 'Natural system modification', value: 'Natural system modification' },
        { label: 'Invasive and other problematic species, genes and diseases', value: 'Invasive and other problematic species, genes and diseases' },
        { label: 'Pollution', value: 'Pollution' },
        { label: 'Geological events', value: 'Geological events' },
        { label: 'Climate change and severe weather', value: 'Climate change and severe weather' },
        { label: 'Other', value: 'Other' },
    ];

    const options_kingdom = [
        { label: 'Fungi', value: 'FUNGI'},
        { label: 'Plantae', value: 'PLANTAE'},
        { label: 'Animalia', value: 'ANIMALIA'},
        { label: 'Chromista', value: 'CHROMISTA'},
    ];
    return (
        <div className={styles["filters"]}>
            
            <Title level={2}>Filters</Title>
            <Text strong>Select Red list category</Text>
            <div className={styles["category"]}>
                <Checkbox.Group options={options_redList} onChange={onChange_Category}/>
            </div>
            <Text strong>Select threats</Text>
            <div className={styles["category_threats"]}>
                <Checkbox.Group options={options_threats} onChange={onChange_Threats}/>
            </div>
            <Text strong>Select kingdom</Text>
            <div className={styles["category"]}>
                <Checkbox.Group options={options_kingdom} onChange={onChange_Kingdom}/>
            </div>
        </div>
    )
}

export default Filters