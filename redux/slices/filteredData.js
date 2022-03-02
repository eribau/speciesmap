import speciesData from "../../public/allDataByAssessmentId.json"
import countryCodes from "../../public/countrycodes.json"

const initialState = {
   countryCodes,
}

export const setFilteredData = filteredData => {
   return {
      type: 'filteredData/setData',
      payload: filteredData,
   }
}


function myFilter(filters) {

   console.log("Test")

   const threats = filters["threats"];
   const categories = filters["category"];
   const kingdoms = filters["kingdom"];

   if (!threats.length && !categories.length && !kingdoms.length) {
       return countryCodes;
   }

   let result = {};

   // Apply each filter for each assessment within each country
   // For each country
   for (const countryCode in countryCodes) {
       const assessments = countryCodes[countryCode];

       // For each assessment
       const filtered_assessments = assessments.filter(e => {

           // Get the data for the current assessment
           const assessmentData = speciesData[e];

           // For each filter

           // filter by threat
           for (const prop in threats) {
               const threat = threats[prop];

               // if the threat does not exist, don't include
               if (assessmentData.threatsList.indexOf(threat) != -1) {
                   return true;
               }
           }

           
           for (const prop in categories) {
               const category = categories[prop];

               if (assessmentData.redlistCategory == category) {
                   return true;
               }
           }

           for (const prop in kingdoms) {
               const kingdom = kingdoms[prop];

               if (assessmentData.redlistCategory == kingdom) {
                   return true;
               }
           }

           return false;

       });
       
       result[countryCode] = filtered_assessments;

   }

   return result;
}

const filteredData = (state = initialState, action) => {
   switch(action.type) {
      case 'filteredData/setData':
         return {
            countryCodes: myFilter(action.payload)
         }
      default:
         return state
   }
}

export default filteredData