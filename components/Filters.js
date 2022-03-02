import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';

const { Title, Text } = Typography;

function Filters(props){
    //const [category, setCategory] = useState("");
    const [checkedArray, setCheckedArray] = useState({
        threats: [],
        category: [],
        kingdom: [],
    });
    const [checkAll, setCheckAll] = useState(true);
    if (checkAll)
        props.onCategoryChanges("All")
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        /*setCheckedArray({
            threats: [],
            category: checkedValues,
            kingdom: [],
        })*/
        props.onCategoryChanges({
            threats: [],
            category: checkedValues,
            kingdom: [],
        })
        if(checkedValues.length < 1)
            props.onCategoryChanges({
                threats: [],
                category: ['Extinct', 'Extinct in the Wild', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened'],
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
    return (
        <div className={styles["filters"]}>
            
            <Title level={2}>Filters</Title>
            <Text strong>Select Red list category</Text>
            <div className={styles["category"]}>
                <Checkbox.Group options={options_redList} onChange={onChange} defaultValue={['Extinct', 'Extinct in the Wild', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened']}/>
            </div>
            
        </div>
    )
}

export default Filters