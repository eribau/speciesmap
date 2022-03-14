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
           // Filter logic:
           // threat1 or threat2 or ... or threat_n
           // and
           // category1 or category2 or ... or category_n
           // and
           // kingdom1 or kingdom2 or ... or kingdom_n

           // Get the data for the current assessment
           const assessmentData = speciesData[e];

           // For each filter

            // if none is checked, then include all threats
           let hasThreat = !threats.length ? true : false;
           // filter by threat
           for (const prop in threats) {
               const threat = threats[prop];

               // if the threat does not exist, don't include
               if (assessmentData.threatsList.indexOf(threat) != -1) {
                   hasThreat = true;
               }
           }

           // filter by category
           let hasCategory = !categories.length ? true : false;

           for (const prop in categories) {
               const category = categories[prop];

               if (assessmentData.redlistCategory == category) {
                   hasCategory = true;
               }
           }

           // filture by kingdom
           let hasKingdom = !kingdoms.length ? true : false;

           for (const prop in kingdoms) {
               const kingdom = kingdoms[prop];

               if (assessmentData.kingdomName == kingdom) {
                   hasKingdom = true;
               }
           }

           let isValid = hasThreat && hasCategory && hasKingdom;

           return isValid;

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