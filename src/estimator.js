/* eslint-disable linebreak-style */

// in coming data sample
// const covidData = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };
const estimateFutureCases = (data, currentInfectedCases) => {
  let factor = 0;
  switch (data.periodType) {
    case 'days':
      factor = Math.trunc(data.timeToElapse / 3);
      break;
      // 7 days * # 28 weeks
    case 'weeks':
      factor = Math.trunc((7 * data.timeToElapse) / 3);
      break;
    case 'months':
      // 30 days * 28 months
      factor = Math.trunc((30 * data.timeToElapse) / 3);
      break;
    default:
      break;
  }
  return currentInfectedCases * (2 ** factor);
};

// get x% of total
const getPercentageFrom = (percentage, totalCases) => Math.trunc((percentage * totalCases) / 100);

// Get the beds needed over time
const bedsNeededOverTime = (severeCases, availableBeds) => availableBeds - severeCases;

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  // reported cases
  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;


  // TASK: Estimate cases for the next n days on impact
  // Impact cases:
  impact.infectionsByRequestedTime = estimateFutureCases(
    data,
    impact.currentlyInfected
  );

  // Severe impact cases:
  severeImpact.infectionsByRequestedTime = estimateFutureCases(
    data,
    severeImpact.currentlyInfected
  );

  // TASK: Get severe cases requiring hospital beds
  // Impact cases:
  impact.severeCasesByRequestedTime = getPercentageFrom(15, impact.infectionsByRequestedTime);

  // Severe impact cases:
  severeImpact.severeCasesByRequestedTime = getPercentageFrom(
    15, severeImpact.infectionsByRequestedTime
  );

  // TASK: Determine number of available beds for severe cases by 35%
  const availableHostpitalBeds = data.totalHospitalBeds - getPercentageFrom(
    65, data.totalHospitalBeds
  );

  // Impact cases:
  impact.hospitalBedsByRequestedTime = bedsNeededOverTime(
    impact.severeCasesByRequestedTime,
    availableHostpitalBeds
  );

  // Severe impact cases:
  severeImpact.hospitalBedsByRequestedTime = bedsNeededOverTime(
    severeImpact.severeCasesByRequestedTime,
    availableHostpitalBeds
  );

  /* Challenge 3: */
  // Determine 5% of infections by requested time
  impact.casesForICUByRequestedTime = getPercentageFrom(5, impact.infectionsByRequestedTime);

  severeImpact.casesForICUByRequestedTime = getPercentageFrom(
    5, severeImpact.infectionsByRequestedTime
  );

  // Determine 2% of infections by requested time
  impact.casesForVentilatorsByRequestedTime = getPercentageFrom(
    2, impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = getPercentageFrom(
    2, severeImpact.infectionsByRequestedTime
  );

  return {
    data,
    impact,
    severeImpact
  };
};

// covid19ImpactEstimator(covidData);
export default covid19ImpactEstimator;
