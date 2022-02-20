import styles from '../styles/Filters.module.css'
import { useState } from 'react'
import 'antd/dist/antd.css';
import { Typography, Checkbox } from 'antd';

const { Title, Text } = Typography;

function Filters(props){
    //const [category, setCategory] = useState("");
    const [checkedList, setCheckedList] = useState("");
    const [checkAll, setCheckAll] = useState(true);
    if (checkAll)
        props.onCategoryChanges("All")
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        //setCategory(checkedValues)
        props.onCategoryChanges(checkedValues)
        setCheckAll(false);
        setCheckedList(checkedValues)
        if(checkedValues.length < 1)
            props.onCategoryChanges("Non")
    }
    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? options_redList : []);
        setCheckAll(e.target.checked);
        if(e.target.checked)
            props.onCategoryChanges("All")
        else if(!e.target.checked)
            props.onCategoryChanges("Non")
      };
    const options_redList = [
        { label: 'Extinct', value: 'Extinct' },
        { label: 'Extinct in the wild', value: 'Extinct in the wild' },
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
                <Checkbox.Group options={options_redList} onChange={onChange} value={checkedList}/>
                <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                    Check all
                </Checkbox>
            </div>
            
        </div>
    )
}

export default Filters