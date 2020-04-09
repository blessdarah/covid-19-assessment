/* eslint-disable linebreak-style */

// in coming data sample
/*
  {
    region: {
      name: "Africa",
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  }
*/

function estimateFutureCases(data, currentInfectedCases) {
    let factor = null;
    switch (data.periodType) {
        // 7 days * # 28 weeks
        case 'weeks':
            factor = Math.floor((7 * data.timeToElapse) / 3);
            break;
        case 'months':
            // 30 days * 28 months
            factor = Math.floor((30 * data.timeToElapse) / 3);
            break;
        default:
            factor = Math.floor(data.timeToElapse / 3);
            break;
    }

    return currentInfectedCases * 2 ** factor;
}

const covid19ImpactEstimator = (data) => {
    const impact = {};
    const severeImpact = {};
    // reported cases
    impact.currentlyInfected = data.reportedCases * 10;
    severeImpact.currentlyInfected = data.reportedCases * 50;
    // Estimate cases for the next 28 days on impact
    impact.infectionsByRequestedTime = estimateFutureCases(
        data,
        impact.currentlyInfected
    );
    // Estimate cases for the next 28 days on severe impact
    severeImpact.infectionsByRequestedTime = estimateFutureCases(
        data,
        severeImpact.currentlyInfected
    );
    return {
        data,
        impact,
        severeImpact
    };
};

export default covid19ImpactEstimator;