import * as d3 from 'd3'
import { feature } from 'topojson'
import { useEffect, useState } from 'react'

import speciesPerCountryCode from '../public/countrycodes.json'
import topoJSONdataTemp from '../public/topo.json'
import redListByCountryCode from '../public/redListByCountryCode.json'
import tsvData from '../public/topoInfoByISOn3.json'

import PopupWindow from './PopupWindow'
import styles from '../styles/Heatmap.module.css'
import Filters from '../components/Filters.js'
import { useChartDimensions } from '../utilities/useChartDimensions'

import store from '../redux/store'
import { setFilteredData } from '../redux/slices/filteredData'

const mouseOver = (d, i) => {
    d3.select('#' + d.target.id)
        .attr('opacity', '.5');
};


const mouseLeave = (d, i) => {
    d3.select('#' + d.target.id)
        .attr('opacity', '1');
};
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
        setCode(d.target.id)
        setDisplay(true)
    };

    const closeWindow = () => {
        setDisplay(false)
    };

    function changeFilter(){
        if (dispayFilter)
            setdispayFilter(false)
        else
            setdispayFilter(true)
    }

    function onCategoryChanges(value){
        store.dispatch(setFilteredData(value))
        setCategory(value)

        updateHeatmap(value["category"]);
    }

    /// PopupWindow & Filtering ///


    function updateHeatmap(checked){
        const interpolation = d3.interpolate({colors: ["#FFFFFF"]}, {colors: ["#db000f"]});
        console.log("Mine:");
        console.log(checked);
        if (checked == "All" || checked == null) {
            checked = ["Extinct", "Extinct in the Wild", "Critically Endangered", "Endangered", "Vulnerable", "Near Threatened"];
        }

        console.log(store.getState())
        let maxSpeciesAggregated = 0;
        let numSpeciesByCountryAggregate = {};
        for (const code in redListByCountryCode) {
            let numSpecies = 0;
            for (const e in checked) {
                const val = checked[e];
                numSpecies += redListByCountryCode[code][val];
            }
            if (numSpecies > maxSpeciesAggregated) {
                maxSpeciesAggregated = numSpecies;
            }
            
            numSpeciesByCountryAggregate[code] = numSpecies;
        }
        
        const getColor = (v) => {
            const scaledValue = v / maxSpeciesAggregated;
            return interpolation(scaledValue).colors;
        };

        const svg = d3.select('svg');
        const paths = svg.selectChildren('path');
        paths.each(function(d) {
            // Works, nice...
            let currElem = d3.select(this);
            const currId = currElem.attr('id');
            const numSpecies = numSpeciesByCountryAggregate[currId];
            const newColor = getColor(numSpecies);
            //console.log(newColor);
            currElem.attr('fill', newColor);
            
            currElem.selectChild('title').text(() => {
                const countryName = currElem.attr("name");
                const numSpecies = numSpeciesByCountryAggregate[currId];
                return countryName + ":" + numSpecies;
            });
            //console.log(d3.select(this).attr("id"));
        });

        d3.select("rect").selectChild("title").text("0 - " + maxSpeciesAggregated);
    }

    /// Heatmap ///
    const dimensions = {
        'width': 1400,
        'height': 1000,
        'marginTop': 20,
        'marginRight': 10
      }

    const [ref, dms] = useChartDimensions(dimensions)

    useEffect( () => {

        const svg = d3.select('svg');

        const projection = d3.geoNaturalEarth1().fitWidth(dms.width, { type: 'Sphere' });
        const pathGenerator = d3.geoPath().projection(projection);
        // #3d0006 #d43547 #db000f
        const interpolation = d3.interpolate({colors: ["#FFFFFF"]}, {colors: ["#db000f"]});
        var centered = false;
            
        // Testing with local data, seems to work, TODO: clean up code when both files work locally...
        topoJSONdata = topoJSONdataTemp;
            
        //console.log(topoJSONdataTemp);

        const speciesPerCountryJSONdata = speciesPerCountryCode; // ~250 entries
            
        // HEATMAP STUFF
        // Get array of species lengths.
        const numSpeciesByCountry = {};

        let maxSpecies = 0;
        for (const prop in speciesPerCountryJSONdata){
            const numSpecies = speciesPerCountryJSONdata[prop].length;
            if (numSpecies > maxSpecies){
                maxSpecies = numSpecies;
            }
            // prop is country code iso_a2
            numSpeciesByCountry[prop] = numSpecies;
        }
        const getColor = (v) => {
            const scaledValue = v / maxSpecies;
            return interpolation(scaledValue).colors;
        };

        //console.log(numSpeciesByCountry);
        //console.log(speciesPerCountryJSONdata); // 250 entries
        //console.log(tsvData); // 177 entries
        //console.log(topoJSONdata); // 177 countries
        // Construct lookup table for id:s to names.
        // That is, from iso_n3 to: country name, and iso_a2
        const countryNamesByTopoId = {};
        tsvData.forEach(d => {

            // TODO: just edit the data later, these if statements are temporary?
            // Some countries do not have an iso_n3 or iso_a2 code. 
            if (d.iso_a2 == "-99"){
                console.log(d.name);
                console.log(d.iso_n3);
                // I have set the ids in the topo.json file to
                // Kosovo:101, Somaliland:102, N.Cyprus:103
                // If we want to remove the ifs, then we need to edit in the tsv file as well
                // but then we need to use it locally first.
                if (d.name == "Somaliland"){
                    countryNamesByTopoId["102"] = ["AAB", d.name]; // self proclaimed, I set it to "AAB"
                } else if (d.name == "Kosovo") {
                    countryNamesByTopoId["101"] = ["XK", d.name]; // XK is the official one for Kosovo
                } else if (d.name == "N. Cyprus"){
                    countryNamesByTopoId["103"] = ["ABB", d.name]; // self proclaimed, I set it to "ABB"
                }
            }
            else{
                countryNamesByTopoId[d.iso_n3] = [d.iso_a2, d.name];
                //console.log( countryNamesByTopoId[d.iso_n3][1])
            }

        });

        // Use topojson to get the features from the topoJSONdata that we want
        const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
        
        //console.log(countries);
        svg.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('d', d => pathGenerator(d))
        .attr('id', d => countryNamesByTopoId[d.id][0]) // <- iso_a2
        .attr('name', d => countryNamesByTopoId[d.id][1]) // <- name
        .attr('fill', d => {
            const countryCode = countryNamesByTopoId[d.id][0];
            const numSpecies = numSpeciesByCountry[countryCode];
            return '' + getColor(numSpecies);
        }) 
        .attr('stroke', '#212226')
        .attr('stroke-opacity', '0.25')
        .on('mouseover', mouseOver)
        .on('mouseleave', mouseLeave)
        .on('click', onClick)
        .lower()
        .append('title').text(d => {
            // d.id is iso_n3, which is what is used to identify each country topology in topo.json
            const countryCode = countryNamesByTopoId[d.id][0]; // <-  [0] is iso_a2
            const countryName = countryNamesByTopoId[d.id][1]; // <-  [1] is country name
            const numSpecies = numSpeciesByCountry[countryCode];
            return countryName + ":" + numSpecies;
        });
        

                // svg.call(d3.zoom().on('zoom', () => {
        //     svg.attr('transform', d3.zoomTransform(this));
        //   }));
        // This is how zoom works in d3 7.3, d3.event is not a global anymore.
        var k_global = 1;
        svg.call(d3.zoom().on('zoom', (e) => {
            //console.log("zooming or panning");
            
            //e.transform.k = Math.max(e.transform.k, 0.8); //clamp
            //e.transform.k = Math.min(e.transform.k, 10);
            // to remove the jittering, 
            // only apply scale transform if k <= 0.8
            if (centered) {
                svg.selectAll("path")
                .transition()
                .duration("300")
                .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + e.transform.k + ")");    
                centered = false;
            } else {
                svg.selectAll("path")
                .attr("transform", e.transform);
            }
            k_global = e.transform.k;
            //console.log(e.transform);
            // this does not work though!
            //svg.attr('transform', transform);
        }));
        //https://bl.ocks.org/mbostock/2206590
        
        svg.on("click", function(e) {
            //console.log(e.path[0]);
            // e.transform.k = 1.3;
            // svg.selectAll("path")
            // .transition()
            // .duration(1000)
            // .attr("transform", e.transform);
            //"translate(" + e.x*0.1 + "," + e.y*0.1 + ")" + " scale(1.2)")
            var width = 1400;
            var height = 900;
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
            
            
            svg.selectAll("path")
            .transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
                //.style("stroke-width", 1.5 / k + "px");
          
        });
                       //Append a defs (for definition) element to your SVG
        var defs = svg.append("defs");

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
        svg.append("rect")
        .attr("width", 20)
        .attr("height", 500)
        .style("fill", "url(#linear-gradient)")
        .append("title").text("0 - 4293");

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
        <svg width={1600} height={800}>
        </svg>
        {displayBox && <PopupWindow country={country} closeWindow={closeWindow} code={code} category={category}/>}
        <div className={styles['right']} >
            <Filters onCategoryChanges={onCategoryChanges}/>
            <img src="https://cdn.icon-icons.com/icons2/3247/PNG/512/angle_down_icon_199563.png" alt="arrow" className={styles['arrow']} rotate="90" onClick={changeFilter}/>
        </div>
        <div className={styles['right_min']}>
                <img src="https://cdn.icon-icons.com/icons2/3247/PNG/512/angle_down_icon_199563.png" alt="arrow" className={styles['arrow_min']} rotate="90" onClick={changeFilter}/>
            </div>
        </div>
      )
};

export default HeatMap