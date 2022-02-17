import * as d3 from 'd3'

// to work with topojson data using d3 we need to convert it to geojson
import { feature } from 'topojson'

import { useEffect } from 'react'

import speciesPerCountry from '../public/countries.json'

import speciesPerCountryCode from '../public/countrycodes.json'

// TODO: This page is temporary, heatmap should be included as part of the 
// index.js map. So, this should be implemented into WorldMap.js later.

// TODO: Simple Mockup Data, need data for each country.

// Blockbuilder.org is very useful for prototyping.

const mouseOver = (d, i) => {
    //console.log(d.target.id);
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

const HeatMap = () => {

    // Need this for d3 to work with react.
    useEffect( () => {

        const svg = d3.select('svg');

        const projection = d3.geoNaturalEarth1().fitWidth(1600, { type: 'Sphere' });
        const pathGenerator = d3.geoPath().projection(projection);

        const interpolation = d3.interpolate({colors: ["#FFFFFF"]}, {colors: ["#d43547"]});
        const maxSpecies = 4293; // Madagaskar, TODO: is hardcoded temporarily

        const getColor = (v) => {
            const scaledValue = v / maxSpecies;
            return interpolation(scaledValue).colors;
        };

        //const g = svg.append('g');

        // g.append('path')
        // .attr('class', 'sphere')
        // .attr('d', pathGenerator({type: 'Sphere'}));
        
        // svg.call(d3.zoom().on('zoom', () => {
        //     g.attr('transform', d3.event.transform);
        //   }));

        // Loading multiple data sets at once
        Promise.all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
            d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
        ]).then(([tsvData, topoJSONdata]) => { // destructuring syntax (packing up multiple values)
            
            const speciesPerCountryJSONdata = speciesPerCountryCode; // ~250 entries
            
            // HEATMAP STUFF
            // Get array of species lengths. DOES NOT WORK
            const numSpeciesByCountry = {};
            // for (let i = 0; i < Object.keys(test).length; i++){
            //     console.log(Object.keys(test)[i]);
            // }
            for (const prop in speciesPerCountryJSONdata){
                // TODO: Match the countries from the RedList data
                // with the countries from the tsv file...
                // Could do this using POSTAL codes, since they are available in both
                // datasets!
                numSpeciesByCountry[prop] = speciesPerCountryJSONdata[prop].length;
            }

            //console.log(numSpeciesByCountry);
            //console.log(speciesPerCountryJSONdata);
            //console.log(tsvData); // 177 entries
            //console.log(topoJSONdata); // 177 countries

            // Construct lookup table for id:s to names.
            const countryNamesByTopoId = {};
            tsvData.forEach(d => {
                // use d.adm0_a3 for ids on the elements, since names have spaces in them
                // consider using POSTAL CODE: .postal
                countryNamesByTopoId[d.iso_n3] = [d.iso_a2, d.name];
            });
            
            // for (const prop in countryNamesByTopoId){
            //     console.log(countryNamesByTopoId[prop][1]);
            // }

            const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
            
            //console.log(countries);

            const paths = svg.selectAll('path').data(countries.features);

            // creates a path element for each datapoint in countries.features
            paths.enter().append('path')
            .attr('d', d => pathGenerator(d))
            .attr('id', d => countryNamesByTopoId[d.id][0]) // <- adm0_a3
            .attr('fill', d => {
                // have this value depend on the number of species in the country as in speciesPerCountryJSONdata
                // for the moment at least
                const currId = countryNamesByTopoId[d.id][0];
                const val = numSpeciesByCountry[currId];
                console.log(currId);
                //const val = Math.random(); 
                //return '' + interpolation(val/maxSpecies).colors;
                return '' + getColor(val);
                //return '' + interpolation(val).colors
            }) 
            .attr('stroke', '#fff')
            .attr('stroke-opacity', '0.5')
            .on('mouseover', mouseOver)
            .on('mouseleave', mouseLeave)
            
            /*.on('mouseover', (d, i) => {
                //console.log(d.target.id);
                d3.select('#' + d.target.id)
                .transition()
                .duration(100)
                .attr('opacity', '.5');
            })
            .on('mouseleave', (d, i) => {
                d3.select('#' + d.target.id)
                .transition()
                .duration(150)
                .attr('opacity', '1');
            })
            */
            .append('title').text(d => countryNamesByTopoId[d.id][1] + ":" + numSpeciesByCountry[countryNamesByTopoId[d.id][0]]) // <- actual country name, d.id is their id in topoJSONdata
        });

        // d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
        // .then(data => {
        //     const countries = feature(data, data.objects.countries);
            
        //     //console.log(countries);

        //     const paths = svg.selectAll('path').data(countries.features);

        //     // creates a path element for each datapoint in countries.features
        //     paths.enter().append('path').attr('d', d => pathGenerator(d))
        //     .attr("fill", "#d43547")
        //     .attr("stroke", "#fff")
        //     .attr("stroke-opacity", "0.5");
    
        // });

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
        </div>
      )
};

export default HeatMap