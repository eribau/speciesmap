import * as d3 from 'd3'
import { feature } from 'topojson'
import { useEffect, useState } from 'react'

import speciesPerCountry from '../public/countries.json'
import speciesPerCountryCode from '../public/countrycodes.json'
import topoJSONdataTemp from '../public/topo.json'

import PopupWindow from './PopupWindow'
import styles from '../styles/Heatmap.module.css'
import Filters from '../components/Filters.js'

// TODO: This page is temporary, heatmap should be included as part of the 
// index.js map. So, this should be implemented into WorldMap.js later.

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
    const [category, setCategory] = useState("")

    const onClick = (d) => {
        console.log(d.target.id)
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
        setCategory(value)
    }
    // Need this for d3 to work with react.
    useEffect( () => {

        const svg = d3.select('svg');

        const projection = d3.geoNaturalEarth1().fitWidth(1600, { type: 'Sphere' });
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
                }

            });

            // Use topojson to get the features from the topoJSONdata that we want
            const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
            
            //console.log(countries);

            svg.selectAll('path').data(countries.features)
            .enter().append('path')
            .attr('d', d => pathGenerator(d))
            .attr('id', d => countryNamesByTopoId[d.id][0]) // <- iso_a2
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

    }, [])
    return (
        <div
          style={{
            width: "100%",
            background: "#212226",
          }}
        >
        <svg width={1600} height={800}>
        </svg>
        {displayBox && <PopupWindow closeWindow={closeWindow} code={code} category={category}/>}
        {dispayFilter && <div className={styles['right']} >
            <Filters onCategoryChanges={onCategoryChanges}/>
        </div>}
        {!dispayFilter &&  <div className={styles['right_min']} onClick={changeFilter}></div>}
        </div>
      )
};

export default HeatMap