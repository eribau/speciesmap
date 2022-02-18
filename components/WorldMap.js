import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import countryShapes from '../public/countries.geo.json'
import { useChartDimensions } from '../utilities/useChartDimensions'
import PopupWindow from './PopupWindow'

const mouseOver = (d) => {
  d3.select('#' + d.target.id)
    .attr('fill', '#970e13')
}

const mouseLeave = (d) => {
  d3.select('#' + d.target.id)
    .attr('fill', '#f94346')
}

const WorldMap = () => {

  const [displayBox, setDisplay] = useState(false);
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");

  const onClick = (d) => {
      setCode(d.target.__data__.properties.ISO_A2)
      setDisplay(true)
      setCountry(d.target.value)
  };
  const closeWindow = () => {
      setDisplay(false)
  }

  const dimensions = {
    'width': 1400,
    'height': 1000,
    'marginTop': 20,
    'marginRight': 10
  }


   // grab our custom React hook we defined above
   const [ref, dms] = useChartDimensions(dimensions)

   // this is the definition for the whole Earth
   const sphere = { type: "Sphere" }

   const projectionFunction = d3.geoNaturalEarth1

   const projection = projectionFunction()
     .fitWidth(dms.width, sphere)

   const pathGenerator = d3.geoPath(projection)

   // size the svg to fit the height of the map
   const [
     [x0, y0],
     [x1, y1]
   ] = pathGenerator.bounds(sphere)

   const height = y1

  useEffect(() => {
    const svg = d3.select(ref.current)
    
    svg.append('g')
      .append('path')
      .attr('d', pathGenerator(sphere))
      .attr('fill', '#f2f2f7')

    svg.append('g')
      .append('path')
      .attr('d', pathGenerator(d3.geoGraticule10()))
      .attr('stroke', '#fff')
      .attr('fill', 'none')

    svg.append("g")
      .selectAll("path")
      .data(countryShapes.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", pathGenerator)
      // set the color of each country
      .attr("fill", '#f94346')
      .attr("stroke", '#fff')
      .attr('id', (d) => {
        return d.properties.ADMIN
      })
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("click", onClick)
  }, [])

   return (
     <div
       style={{
         width: "100%",
       }}
     >
       <svg width={dms.width} height={height} ref={ref}>
       </svg>
       {displayBox && <PopupWindow country={country} closeWindow={closeWindow} code={code}/>}
     </div>
   )
 }

 export default WorldMap