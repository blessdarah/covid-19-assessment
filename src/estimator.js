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
  let days = 0;
  switch (data.periodType) {
    case 'days':
      days = data.timeToElapse;
      factor = Math.trunc(days / 3);
      break;
      // 7 days * # 28 weeks
    case 'weeks':
      days = 7 * data.timeToElapse;
      factor = Math.trunc(days / 3);
      break;
    case 'months':
      // 30 days * 28 months
      days = 30 * data.timeToElapse;
      factor = Math.trunc(days / 3);
      break;
    default:
      break;
  }
  const estimate = currentInfectedCases * (2 ** factor);
  return { days, estimate };
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
  const impactEstimate = estimateFutureCases(
    data,
    impact.currentlyInfected
  );
  impact.infectionsByRequestedTime = impactEstimate.estimate;

  // Severe impact cases:
  const severeImpactEstimate = estimateFutureCases(
    data,
    severeImpact.currentlyInfected
  );
  severeImpact.infectionsByRequestedTime = severeImpactEstimate.estimate;

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

  // Estimate how much money the economy is like to lose over this period
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  impact.dollarsInFlight = impact.infectionsByRequestedTime * avgDailyIncomePopulation
    * avgDailyIncomeInUSD * impactEstimate.days;

  // estimate dollars in fligt for severeCases
  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation
    * avgDailyIncomeInUSD * severeImpactEstimate.days;
  // console.log('Impact data: ', impact);
  // console.log('Severe impact data: ', severeImpact);
  return {
    data,
    impact,
    severeImpact
  };
};

// covid19ImpactEstimator(covidData);
export default covid19ImpactEstimator;
