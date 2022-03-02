import * as d3 from 'd3'
import { feature } from 'topojson'
import { useEffect, useState } from 'react'

import speciesPerCountryCode from '../public/countrycodes.json'
import topoJSONdataTemp from '../public/topo.json'
import redListByCountryCode from '../public/redListByCountryCode.json'

import PopupWindow from './PopupWindow'
import styles from '../styles/Heatmap.module.css'
import Filters from '../components/Filters.js'
import { useChartDimensions } from '../utilities/useChartDimensions'

import store from '../redux/store'
import { setFilteredData } from '../redux/slices/filteredData'

// TODO: This page is temporary, heatmap should be included as part of the 
// index.js map. So, this should be implemented into WorldMap.js later.

// TODO: Color gradient legend
// https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient/
// http://bl.ocks.org/nbremer/5cd07f2cb4ad202a9facfbd5d2bc842e

// Blockbuilder.org is very useful for prototyping.

const mouseOver = (d, i) => {
    d3.select('#' + d.target.id)
        .transition()
        .duration(100)
        .attr('opacity', '.5');
};


const mouseLeave = (d, i) => {
    d3.select('#' + d.target.id)
        .transition()
        .duration(150)
        .attr('opacity', '1');
};
const HeatMap = (props) => {
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
    }
    function changeFilter(){
        if (dispayFilter)
            setdispayFilter(false)
        else
            setdispayFilter(true)
    }
    function onCategoryChanges(value){
        console.log(value)
        store.dispatch(setFilteredData(value))
        setCategory(value)

        updateHeatmap(value["category"]);
    }

    const dimensions = {
        'width': 1400,
        'height': 1000,
        'marginTop': 20,
        'marginRight': 10
      }
    
    
       // grab our custom React hook we defined above
       const [ref, dms] = useChartDimensions(dimensions)

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

    // Need this for d3 to work with react.
    useEffect( () => {

        const svg = d3.select('svg');

        const projection = d3.geoNaturalEarth1().fitWidth(dms.width, { type: 'Sphere' });
        const pathGenerator = d3.geoPath().projection(projection);
        // #3d0006 #d43547 #db000f
        const interpolation = d3.interpolate({colors: ["#FFFFFF"]}, {colors: ["#db000f"]});

        // Zoom did not work for some reason
        // const g = svg.append('g');

        // g.append('path')
        // .attr('class', 'sphere')
        // .attr('d', pathGenerator({type: 'Sphere'}));
        
        // svg.call(d3.zoom().on('zoom', () => {
        //     svg.attr('transform', d3.zoomTransform(this));
        //   }));
        // This is how zoom works in d3 7.3, d3.event is not a global anymore.
        svg.call(d3.zoom().on('zoom', (e) => {
            //console.log("zooming or panning");
            console.log(e);
            // this does not work though!
            //svg.attr('transform', transform);
        }));

        // Loading multiple data sets at once
        Promise.all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv')
            //d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json') using local data now
            //d3.tsv('../public/topo.id.info.tsv') how do I get the file to work locally?
            //d3.json('../public/topo.json')
        ]).then(([tsvData, topoJSONdata]) => { // destructuring syntax (packing up multiple values)
            
            //topoJSONdata = topoJSONdataTemp;
            //console.log(topoJSONdata);
            
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
            .append('title').text(d => {
                // d.id is iso_n3, which is what is used to identify each country topology in topo.json
                const countryCode = countryNamesByTopoId[d.id][0]; // <-  [0] is iso_a2
                const countryName = countryNamesByTopoId[d.id][1]; // <-  [1] is country name
                const numSpecies = numSpeciesByCountry[countryCode];
                return countryName + ":" + numSpecies;
            });
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