const data = require('./allDataByAssessmentId.json');
const assessmentsByCountryCode = require('./countrycodes.json');


// test filtering time


function myFilter(threats, category, kingdom) {

    let result = {};

    // Apply each filter for each assessment within each country
    // For each country
    for (const countryCode in assessmentsByCountryCode) {
        const assessments = assessmentsByCountryCode[countryCode];

        // For each assessment
        const filtered_assessments = assessments.filter(e => {

            // Get the data for the current assessment
            const assessmentData = data[e];

            // For each filter

            // filter by threat
            for (const prop in threats) {
                const threat = threats[prop];

                // if the threat does not exist, don't include
                if (assessmentData.threatsList.indexOf(threat) == -1) {
                    return false;
                }
            }

            
            // filter by category
            if (assessmentData.redlistCategory != category) {
                return false;
            }

            // filter by kingdom
            if (assessmentData.kingdomName != kingdom) {
                return false;
            }

            return true;

        });
        
        result[countryCode] = filtered_assessments;

    }

    return result;
}


/// TEST PERFORMANCE ///

const startTime = performance.now();

const finalData = myFilter(["5"], "Critically Endangered", "ANIMALIA");

const endTime = performance.now();

console.log(`Call to filter took ${endTime - startTime} milliseconds`);

/// TEST PERFORMANCE ///

const fs = require('fs');

const outJSON = JSON.stringify(finalData, null, 2);

fs.writeFile("filter_test.json", outJSON, (err) => {
    if (err) {
        throw err;
    }
    console.log('JSON saved.');
});
