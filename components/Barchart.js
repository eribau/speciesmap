import React, {Component, useState, useEffect} from 'react';
import * as d3 from "d3";

import { feature } from 'topojson'

import assessmentsByCountryCode from '../public/countrycodes.json'
import countryDataByISOn3 from '../public/topoInfoByISOn3.json'
import redListByCountryCode from '../public/redListByCountryCode.json'
//import threatCodeToThreatName from '.../public/threatCodeToThreatName.json'
import allDataByAssessmentId from '../public/allDataByAssessmentId.json'
import stylesHeatmap from '../styles/Heatmap.module.css'
import stylesBarchart from '../styles/Barchart.module.css'
import Filters from '../components/Filters.js'
import Filter_Kingdom from '../components/Filter_Kingdom'
import { useChartDimensions } from '../utilities/useChartDimensions'

import PopupWindow from './PopupWindow'

import store from '../redux/store'
import { setFilteredData } from '../redux/slices/filteredData'





const Barchart = (props) => {
        ///////

    const [displayBox, setDisplay] = useState(false);
    const [code, setCode] = useState("");
    const [threat, setThreat] = useState("");
    const [category, setCategory] = useState("");
    const [kingdom, setKingdom] = useState("");
    const [filtersValue, setFiltersValue] = useState("");

    function onKingdomChanges(value){
        const filter = {
            threats: store.getState().filterSetting.threats,
            category: store.getState().filterSetting.category,
            kingdom: value
        }
        store.dispatch(setFilteredData(filter));
        setKingdom(value);

        //updateHeatmap();
    }

    function getDataTemplate(){
        var data = []
        
        
        const groups = [
            "Residential and commercial development"
           ,"Agriculture and aquaculture"
           ,"Energy production and mining"
           ,"Transportation and service corridors"
           ,"Biological resource use"
           ,"Human intrusions and disturbance"
           ,"Natural system modification"
           ,"Invasive and other problematic species, genes and diseases"
           ,"Pollution"
           ,"Geological events"
           ,"Climate change and severe weather"
           ,"Other"
        ];
        
        var template = {"group": 'serial killers', 
        "Extinct": '12', 
        "Extinct in the Wild": '3', 
        "Critically Endangered": '11', 
        "Endangered": '2',
        "Vulnerable": '3', 
        "Near Threatened": '9', 
        "Lower Risk/conservation dependent": '6', 
        "Lower Risk/near threatened": '11'
        }
        
        for (var i = 0; i < 12; i++) {
            template.group = JSON.parse(JSON.stringify(groups[i]));
            data.push(JSON.parse(JSON.stringify(template)));
        };
        
        data.columns = ["group", "Extinct", "Extinct in the Wild", "Critically Endangered", "Endangered", 
            "Vulnerable", "Near Threatened", "Lower Risk/conservation dependent", "Lower Risk/near threatened"];

        return data;
    }

    function getChartContent(country_iso_a2) {
        //console.log(store.getState().selectedCountry.country);
        // Had to change since functions called inside of the 
        // useEffect() doesn't update their dependent variables
        // resulting in the tooltips number of filtered species not
        // updating. Now getting the number from the global state.

        let filteredSpecies = store.getState().filteredData.countryCodes[country_iso_a2];
        
        var species = assessmentsByCountryCode[country_iso_a2];
        
        if (typeof species === 'undefined') {
            // means its kosovo, n.cyprus or somaliland
            species = [];
        }

        // if the filteredData.countryCodes for some reason is undefined
        // or its kosovo somaliland or n cyprus
        if (typeof filteredSpecies === 'undefined') {
            filteredSpecies = species;
        }
        //console.log(species);

        var data = getDataTemplate();
        //console.log(data)

        const groups = [
            "Residential and commercial development"
           ,"Agriculture and aquaculture"
           ,"Energy production and mining"
           ,"Transportation and service corridors"
           ,"Biological resource use"
           ,"Human intrusions and disturbance"
           ,"Natural system modification"
           ,"Invasive and other problematic species, genes and diseases"
           ,"Pollution"
           ,"Geological events"
           ,"Climate change and severe weather"
           ,"Other"
        ];

        var threatlist = [  [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]
                            ];

        var redlistList = ["Extinct", "Extinct in the Wild", "Critically Endangered", "Endangered", 
            "Vulnerable", "Near Threatened", "Lower Risk/conservation dependent", "Lower Risk/near threatened"];

        for(let i = 0; i < filteredSpecies.length; i++){
            var ass_id = filteredSpecies[i];
            for(let j = 0; j < 12; j++){
                for(let k = 0; k < 8; k++){
                    // had to change from the "in" keyword, it didn't do what you would expect it to do
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
                    // and j to j+1 since threat indices are from 1 to 12
                    if( (allDataByAssessmentId[ass_id].threatsList.indexOf((j+1).toString()) != -1) && 
                        (redlistList[k] == allDataByAssessmentId[ass_id].redlistCategory) ) {
                        threatlist[j][k]++;
                    }
                }
            }
        }
        

        for (var i = 0; i < 12; i++) {
            data[i] = 
            {"group": groups[i], 
            "Extinct": threatlist[i][0].toString(), 
            "Extinct in the Wild": threatlist[i][1].toString(), 
            "Critically Endangered": threatlist[i][2].toString(), 
            "Endangered": threatlist[i][3].toString(),
            "Vulnerable": threatlist[i][4].toString(), 
            "Near Threatened": threatlist[i][5].toString(), 
            "Lower Risk/conservation dependent": threatlist[i][6].toString(), 
            "Lower Risk/near threatened": threatlist[i][7].toString()
            };
        };

        console.log(data);

        return data;
        // return countryName + "<br>Redlisted species: " + numSpecies;
    };

    const closeWindow = () => {
        setDisplay(false);
    };

    useEffect( () => {

        var tooltip = d3.select("#barchart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            tooltip
            .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
            .style("opacity", 1)
            
        }

        const mousemove = function(d) { //prevent the tooltip from taking over mouse events
            //console.log(d);
            tooltip
            .style("left", d.pageX + 10 + "px")       // d.pageX
            .style("top", d.pageY - 30 + "px");        // d.pageY
        };

        const mouseleave = function(event, d) {
            tooltip
            .style("opacity", 0)
        }
        const onClick = function(event, d) {
            //const subgroupName = d3.select(this.parentNode).datum().key;
            setCategory(d3.select(this.parentNode).datum().key)
            setFiltersValue({
                threats: [d.data.group],
                category: [d3.select(this.parentNode).datum().key],
                kingdom: [],
            })
            setThreat(d.data.group)
            setDisplay(true)
        }

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 30, bottom: 250, left: 50},
        width = window.screen.width - margin.left - margin.right,
        height = window.screen.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

        // Parse the Data
        const storedCountryId = store.getState().selectedCountry.country;
        setCode(store.getState().selectedCountry.country)
        const data = getChartContent(storedCountryId);

        //console.log(data.columns);
        //data[0].group = "babassba";



        const subgroups = data.columns.slice(1)
        //console.log(subgroups);

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = data.map(d => d.group)
        //groups = n;

        // Add X axis
        const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

        let upperBound = store.getState().filteredData.countryCodes[storedCountryId].length;
        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, upperBound])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#660000','#990000','#cc0000', '#e06666', '#ea9999', '#f4cccc', '#ffe0e0', '#eeeeee'])

        //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
        .keys(subgroups)
        (data)

        // ----------------
        // Create a tooltip
        // ----------------
        

        // Show the bars
        svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
            .attr("x", d =>  x(d.data.group))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())
            .attr("stroke", "grey")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", onClick)

        


    }, [])
    return( 
    <div>
        
        {displayBox && <PopupWindow closeWindow={closeWindow} code={code} category={category} threat={threat} filtersValue={filtersValue} kingdom={kingdom}/>}
        <div id={"barchart"} className={stylesBarchart['barchart']}></div>
        <div className={stylesBarchart['finter_kingdom']} >
            <Filter_Kingdom onKingdomChanges={onKingdomChanges}/>
        </div>
    </div>
    )
}
          
      
export default Barchart;


/*<div className={stylesHeatmap['right']} >
            <Filters />
        </div>*/


/* 
const data = [12, 5, 6, 6, 9, 10];
var w = 700;
var h = 300;


const svg = d3.select("body")
.append("svg")
.attr("width", w)
.attr("height", h)
.style("margin-left", 200);
                
svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 70)
    .attr("y", (d, i) => h - 10 * d)
    .attr("width", 65)
    .attr("height", (d, i) => d * 10)
    .attr("fill", "green")
    */

