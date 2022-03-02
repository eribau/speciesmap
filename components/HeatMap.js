import * as d3 from 'd3'
import { feature } from 'topojson'
import { useEffect, useState } from 'react'

import assessmentsByCountryCode from '../public/countrycodes.json'
import topoJSONdata from '../public/topo.json'
import redListByCountryCode from '../public/redListByCountryCode.json'
import countryDataByISOn3 from '../public/topoInfoByISOn3.json'

import PopupWindow from './PopupWindow'
import styles from '../styles/Heatmap.module.css'
import Filters from '../components/Filters.js'
import { useChartDimensions } from '../utilities/useChartDimensions'

import store from '../redux/store'
import { setFilteredData } from '../redux/slices/filteredData'

const HeatMap = (props) => {

    /// PopupWindow & Filtering ///
    const [displayBox, setDisplay] = useState(false);
    const [code, setCode] = useState("");
    const [country, setCountry] = useState("");
    const [dispayFilter, setdispayFilter] = useState(false)
    const [category, setCategory] = useState({threats: [],
                                            category: [],
                                            kingdom: []
                                        }) //Selected values for red list catrgory

    const onClick = (d) => {
        //console.log(d)
        setCountry(((d.target.innerHTML).split(':')[0]).split('>')[1])
        //console.log("d:")
        //console.log(d.target);
        //setCountry(d.target.name);
        setCode(d.target.id);
        setDisplay(true);
    };

    const closeWindow = () => {
        setDisplay(false);
    };

    function changeFilter(){
        if (dispayFilter)
            setdispayFilter(false);
        else
            setdispayFilter(true);
    }

    function onCategoryChanges(value){
        store.dispatch(setFilteredData(value));
        setCategory(value);

        updateHeatmap(value["category"]);
    }

    ///- PopupWindow & Filtering -///


    /// Heatmap ///
    const dimensions = {
        'width': 1400,
        'height': 1000,
        'marginTop': 20,
        'marginRight': 10
    }

    const [ref, dms] = useChartDimensions(dimensions)

    const heatmapInterpolationColors = {lowest: '#ffffff', highest: '#db000f'};
    const topologyStroke = {color: '#212226', opacity: '0.25'};

    const interpolation = d3.interpolate(
        {colors: [heatmapInterpolationColors.lowest]}, 
        {colors: [heatmapInterpolationColors.highest]}
        );

    function mouseOver(d) {
        d3.select(this)
        .attr('opacity', '.5');
    };
    
    
    function mouseLeave(d) {
        d3.select(this)
        .attr('opacity', '1');
    };

    function updateHeatmap(){
        
        let isRelativeHeatmap = false;

        let filteredAssessmentsPerCountry = store.getState().filteredData.countryCodes;

        if (typeof filteredAssessmentsPerCountry === 'undefined') {
            filteredAssessmentsPerCountry = assessmentsByCountryCode;
        }

        // Get number of species that matches the filters for each country
        let maxSpecies = 0;
        let numFilteredSpeciesByCountry = {};
        let numSpeciesByCountry = {};
        for (const countryCode in filteredAssessmentsPerCountry) {
            let numSpecies = filteredAssessmentsPerCountry[countryCode].length;
            numFilteredSpeciesByCountry[countryCode] = numSpecies;

            numSpeciesByCountry[countryCode] = assessmentsByCountryCode[countryCode].length;

            if (numSpecies > maxSpecies) maxSpecies = numSpecies;
        }

        const getColor = (v, countryCode) => {
            let scaledValue = v;
            if (isRelativeHeatmap) {
                numSpeciesByCountry[countryCode] = 
                    numSpeciesByCountry[countryCode] == 0 ? 1 : numSpeciesByCountry[countryCode];
                
                scaledValue /= numSpeciesByCountry[countryCode];
            } else {
                maxSpecies = maxSpecies == 0 ? 1 : maxSpecies;
                scaledValue /= maxSpecies;
            }
            return interpolation(scaledValue).colors;
        };

        // Update the fill color of all path elements
        // based on their number of species which matched the filters
        const paths = d3.selectAll('path');
        
        paths.each(function(d) {

            let currElem = d3.select(this);
            const currId = currElem.attr('id');
            const numSpecies = numFilteredSpeciesByCountry[currId];
            const newColor = getColor(numSpecies, currId);

            currElem.attr('fill', newColor);
            
            currElem.selectChild('title').text(() => {
                const countryName = currElem.attr("name");
                const numSpecies = numFilteredSpeciesByCountry[currId];
                return countryName + ": " + numSpecies + " / " + numSpeciesByCountry[currId];
            });

        });

        // Update the gradient legend
        d3.select('rect').selectChild('title').text("0 - " + maxSpecies);
    }

    useEffect( () => {

        const svg = d3.select('svg');

        var layerHeatmap = svg.append('g');
        layerHeatmap.attr('id', 'layerHeatmap');

        var layerGradient = svg.append('g');
        layerGradient.attr('id', 'layerGradient');

        const projection = d3.geoNaturalEarth1().fitWidth(dms.width, { type: 'Sphere' });
        const pathGenerator = d3.geoPath().projection(projection);
        
        // Create dictionary for relating a topology data with respective country
        // The topology file (topo.json) has property "id", which is
        // iso_n3. To get country code (iso_a2), and name, of a country with the
        // specified iso_n3, we use the topoInfoByISOn3.json file.  
        const countryNamesByIdInTopoJSON = {};
        countryDataByISOn3.forEach(d => {
            countryNamesByIdInTopoJSON[d.iso_n3] = {
                code: d.iso_a2,
                name: d.name
            }
        });

        // Use topojson to get the features from the topoJSONdata that we want
        // Converts to GeoJSON
        const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
        //console.log(countries);
        
        // Draw the topology on the heatmap layer
        layerHeatmap.selectAll('path')
        .data(countries.features) // geopermissible objects (GeoJSON)
        .enter()
        .append('path')
        .attr('d', d => pathGenerator(d)) // Path generator takes a geopermissible object
        .attr('id', d => countryNamesByIdInTopoJSON[d.id].code)
        .attr('name', d => countryNamesByIdInTopoJSON[d.id].name)
        .attr('fill', d => '#ffffff')
        .attr('stroke', topologyStroke.color)
        .attr('stroke-opacity', topologyStroke.opacity)
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave)
        .on('click', onClick)
        .append('title')
        .text(d => 'None');

        /// Gradient Legend ///
        //Append a defs (for definition) element to your SVG
        var defs = layerGradient.append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");
        
        //Vertical gradient
        linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

        //Set the color for the start (0%)
        linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ffffff"); 

        //Set the color for the end (100%)
        linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#db000f"); 

        //Draw the rectangle and fill with gradient
        layerGradient.append("rect")
        .attr("width", 20)
        .attr("height", 500)
        .style("fill", "url(#linear-gradient)")
        .append("title").text("0 - 4293");

        ///- Gradient Legend -///

        /// Zoom and Pan ///
        // https://bl.ocks.org/mbostock/4987520
        var centered = false;
        var allowZoomOnClick = false;
        //Zoom anywhere on the svg
        svg.call(d3.zoom()
        .scaleExtent([1, 6])
        .on('zoom', (e) => {
            
            // If centered on a country, zoom out first
            if (centered) {
                d3.selectAll("path")
                .transition()
                .duration("300")
                .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + e.transform.k + ")");    
                centered = false;

            } else {
                d3.selectAll("path")
                .attr("transform", e.transform)
            }

        }));
        
        // Click only on countries
        // https://observablehq.com/@d3/d3-interpolatezoom
        layerHeatmap.on("click", function(e) {
            if (!allowZoomOnClick) return;

            var width = dimensions.width;
            var height = dimensions.height;
            var x, y, k;
            let d=e.path[0];
            if (!centered) {
              var bbox = d.getBBox();
              var centroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
              console.log(centroid);
              x = centroid[0];
              y = centroid[1];
              k = 6;
              centered = true;
            } else {
              x = width / 2;
              y = height / 2;
              k = 1;
              centered = false;
            }
            
            d3.selectAll("path")
            .transition()
            .duration(750)
            .attr(
            "transform", 
            "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")"
            );
          
        });

        ///- Zoom and Pan -///

        // Run update to fill in the heatmap colors
        updateHeatmap();

    }, [])
    return (
        <div
          style={{
              position: "absolute",
              left: "0px",
              width: "100%",
              background: "#212226",
          }}
        >
        <svg width={1400} height={1000}>
        </svg>
        {displayBox && <PopupWindow country={country} closeWindow={closeWindow} code={code} category={category}/>}
        <div className={styles['right']} >
            <Filters onCategoryChanges={onCategoryChanges}/>
        </div>
        </div>
      )
};

export default HeatMap