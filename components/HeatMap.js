import * as d3 from 'd3'
import { feature } from 'topojson'
import { useEffect, useState } from 'react'

import assessmentsByCountryCode from '../public/countrycodes.json'
import topoJSONdata from '../public/topo.json'
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
    const [dispayFilter, setdispayFilter] = useState(false);
    const [category, setCategory] = useState({threats: [],
                                            category: [],
                                            kingdom: []
                                        }); //Selected values for red list catrgory

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

        updateHeatmap();
    }

    ///- PopupWindow & Filtering -///


    /// Heatmap ///
    const dimensions = {
        'width': 1400,
        'height': 1000,
        'marginTop': 20,
        'marginRight': 10
    };

    const [ref, dms] = useChartDimensions(dimensions);

    const heatmapInterpolationColors = {lowest: '#ffffff', highest: '#db000f'};
    const topologyStroke = {color: '#212226', opacity: '1', width: '0.5'};

    const interpolation = d3.interpolate(
        {colors: [heatmapInterpolationColors.lowest]}, 
        {colors: [heatmapInterpolationColors.highest]}
        );
    
    // Could not get country name, instead create an object to get country name when text creates in the tooptip
    // Create dictionary for relating a topology data with respective country
    // The topology file (topo.json) has property "id", which is
    // iso_n3. To get country code (iso_a2), and name, of a country with the
    // specified iso_n3, we use the topoInfoByISOn3.json file.  
    const countryNamesByIdInTopoJSON = {};
    const countryNameByIso_a2 = {};    
    countryDataByISOn3.forEach(d => {
        countryNamesByIdInTopoJSON[d.iso_n3] = {
            code: d.iso_a2,
            name: d.name
        }
        countryNameByIso_a2[d.iso_a2] = d.name;
    });
    // Use topojson to get the features from the topoJSONdata that we want
    // Converts to GeoJSON
    const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
    //console.log(countries);

    function updateHeatmap() {
        
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

            if (newColor == "rgb(0, 0, 0)") {
                newColor = "rgb(128, 128, 128)";
                currElem.style("fill", newColor);
            }
            
            currElem.attr('fill', newColor);
        });

        // Update the gradient legend
        d3.select('#legend-text-start')
        .text("0")
        
        let legendStop = d3.select('#legend-text-stop');
        let currentValueLegendStop = legendStop.text(); // for some reason I have to do this

        legendStop
        .transition()
        .duration(200)
        .tween("text", function() {
            let i = d3.interpolate(currentValueLegendStop, maxSpecies);
            return function(t) { this.textContent = Math.round(i(t)) };
        });

        let totalSpecies = 0;
        for (const prop in filteredAssessmentsPerCountry) {
            totalSpecies += filteredAssessmentsPerCountry[prop].length;
        }

        let totalSpeciesText = d3.select("#total-species-text");
        let currentValueTotalText = totalSpeciesText.text().split(":")[1];

        totalSpeciesText
        .transition()
        .duration(200)
        .tween("text", function() {
            let i = d3.interpolate(currentValueTotalText, totalSpecies);
            return function(t) { this.textContent = "Species count: " + Math.round(i(t)) };   
        });
    }
    
    // const getTooltipContent = (country_iso_a2, country_name) => {
    function getTooltipContent(country_iso_a2) {
        // Had to change since functions called inside of the 
        // useEffect() doesn't update their dependent variables
        // resulting in the tooltips number of filtered species not
        // updating. Now getting the number from the global state.
        let filteredSpecies = store.getState().filteredData.countryCodes[country_iso_a2];
        
        const species = assessmentsByCountryCode[country_iso_a2];
        const countryName = countryNameByIso_a2[country_iso_a2];
        
        if (typeof species === 'undefined') {
            // means its kosovo, n.cyprus or somaliland
            species = [];
        }

        // if the filteredData.countryCodes for some reason is undefined
        // or its kosovo somaliland or n cyprus
        if (typeof filteredSpecies === 'undefined') {
            filteredSpecies = species;
        }
        
        return countryName + ": " + filteredSpecies.length + " of " + species.length;
        // return countryName + "<br>Redlisted species: " + numSpecies;
    };


    useEffect( () => {

        // Create tooltip
        // https://www.d3-graph-gallery.com/graph/bubblemap_tooltip.html 
        
        var Tooltip = d3.select("#world_map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

        const onClick = (d) => {
            setCountry(countryNameByIso_a2[d.target.id])
            setCode(d.target.id);
            setDisplay(true);
        };
    
        function mouseOver(d) {
            d3.select(this)
            .attr('opacity', '.5');
            
            Tooltip.html(getTooltipContent(d.target.id))
            // Tooltip.html(getTooltipContent(d.target.id, d.target.name))
            .style("opacity", 1);
        };
        
        function mouseLeave(d) {
            d3.select(this)
            .attr('opacity', '1');
            
            Tooltip
            .style("opacity", 0)
        };

        function mouseMove(d) { //prevent the tooltip from taking over mouse events
            Tooltip
            .style("left", (d.clientX + 10) + "px")  // d.pageX
            .style("top", (d.clientY - 30) + "px"); // d.pageY
        };


        // Heatmap
        const svg = d3.select('svg');

        var layerHeatmap = svg.append('g');
        layerHeatmap.attr('id', 'layerHeatmap');

        var layerGradient = svg.append('g');
        layerGradient.attr('id', 'layerGradient');

        const projection = d3.geoNaturalEarth1().fitWidth(dms.width, { type: 'Sphere' });
        const pathGenerator = d3.geoPath().projection(projection);
    
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
        .attr('stroke-width', topologyStroke.width)
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave)
        .on('mousemove', mouseMove)
        .on('click', onClick);

        /// Gradient Legend ///
        //Append a defs (for definition) element to your SVG
        var defs = layerGradient.append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient");
        
        linearGradient
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
        .style("fill", "url(#linear-gradient)");
        
        // Add text
        let legendTextStart = layerGradient.append("text");
        legendTextStart
        .attr("id", "legend-text-start")
        .text("0")
        .attr("transform", "translate(30, 30)")
        .style("fill", "#ffffff")
        .attr("font-size", dms.height*0.025 + "");

        let legendTextStop = layerGradient.append("text");
        legendTextStop
        .attr("id", "legend-text-stop")
        .text("0")
        .attr("transform", "translate(30, 490)")
        .style("fill", "#ffffff")
        .attr("font-size", dms.height*0.025 + "");

        let totalSpeciesText = layerGradient.append("text");
        totalSpeciesText
        .attr("id", "total-species-text")
        .text("Species count: 4000")
        .attr("transform", "translate(30, 600)")
        .style("fill", "#ffffff")
        .attr("font-size", dms.height*0.025 + "");

        ///- Gradient Legend -///

        /// Zoom and Pan ///
        // https://bl.ocks.org/mbostock/4987520
        let zoomedIn = false;
        let allowZoomOnClick = false;
        let centeredOn = null;
        //Zoom anywhere on the svg

        let zoom = d3.zoom()
        .scaleExtent([0.89, 8])
        .translateExtent([[0, 0], [dms.width + dms.width*0.1, dms.height + dms.height*0.1]])
        .on('zoom', handleZoom);

        // Attach the on zoom event to the svg
        svg.call(zoom);

        function handleZoom(e) {
            // Move and hide tooltip to top left corner so you
            // don't accidentally mark the text in it
            // or try to scroll while hovering over it.
            Tooltip
            .style("opacity", 0)
            .style("left", 0 + "px")
            .style("top", 0 + "px")
            .html("");

            d3.selectAll("path")
            .attr("transform", e.transform)

            let scale = e.transform.k;
            d3.selectAll("path")
            .attr("stroke-width", topologyStroke.width / scale + "");
        }
        
        // Click only on countries
        // https://observablehq.com/@d3/d3-interpolatezoom
        layerHeatmap.on("click", handleClickToZoom);

        function handleClickToZoom(e) {
            if (!allowZoomOnClick) return;
            const selectedPathElem = e.path[0];

            function resetZoomAndPan() {
                d3.selectAll("path")
                .call(zoom.translateTo, 0.5*dms.width, 0.5*dms.height)
                .call(zoom.scaleTo, 1);
            }
            function zoomToOrOutOfCountry() {
                resetZoomAndPan();

                // if zoomed in to a country and we click it again
                if (zoomedIn && centeredOn === selectedPathElem) {
                    console.log("zooming out from:");
                    console.log(selectedPathElem.getAttribute("id"));
                    zoomedIn = false;
                    centeredOn = null;

                // if zoomed in to a country and we click another country
                } else if (centeredOn !== selectedPathElem) {
                    console.log("zooming in to:");
                    console.log(selectedPathElem.getAttribute("id"));
                    let bbox = selectedPathElem.getBBox();
                    var centroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
                    console.log(centroid);
                    d3.selectAll("path")
                    .call(zoom.scaleTo, 6)
                    .call(zoom.translateTo, centroid[0], centroid[1]);
                    
                    centeredOn = selectedPathElem;
                    zoomedIn = true;
                }

            }
            zoomToOrOutOfCountry(); 
        }

        function onClickZoom(e) {
            if (!allowZoomOnClick) return;

            var width = dimensions.width;
            var height = dimensions.height;
            var x, y, k;
            let d=e.path[0];
            if (!zoomedIn) {
              var bbox = d.getBBox();
              var centroid = [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
              console.log(centroid);
              x = centroid[0];
              y = centroid[1];
              k = 6;
              zoomedIn = true;
            } else {
              x = width / 2;
              y = height / 2;
              k = 1;
              zoomedIn = false;
            }
            
            d3.selectAll("path")
            .transition()
            .duration(750)
            .attr(
            "transform", 
            "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")"
            );
          
        }

        ///- Zoom and Pan -///

        // Run update to fill in the heatmap colors
        updateHeatmap();

    }, [])
    return (
        <div
          id={ "world_map" } //
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