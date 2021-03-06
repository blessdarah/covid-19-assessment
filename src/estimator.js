/* eslint-disable linebreak-style */

// in coming data sample
/*
  const covidData = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 4,
      avgDailyIncomePopulation: 0.73
    },
    periodType: 'days',
    timeToElapse: 38,
    reportedCases: 2747,
    population: 92931687,
    totalHospitalBeds: 678874
  };
*/
/* Estimate future cases */
const estimateFutureCases = (data, currentInfectedCases) => {
  let factor = 0;
  let days = 0;
  // console.log("Time to ellapse: ", typeof data.timeToElapse);
  switch (data.periodType) {
    default:
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
  }
  const exponent = 2 ** factor;
  const estimate = currentInfectedCases * exponent;
  return {
    days,
    estimate
  };
};

// get x% of total
// Get the beds needed over time
const bedsNeededOverTime = (severeCases, availableBeds) => availableBeds - severeCases;

// Estimate money lose in the long run
const estimateMoneyLose = (estimatedCases, regionalData) => {
  const {
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation
  } = regionalData;
  const totalInfectedIncomePop = estimatedCases.estimate * avgDailyIncomePopulation
    * avgDailyIncomeInUSD;
    // console.log('total: ', typeof totalInfectedIncomePop);
  const result = Math.trunc(totalInfectedIncomePop / estimatedCases.days, 10);
  // console.log('Result: ', typeof result);
  return Number(result);
};

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
  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime);

  // Severe impact cases:
  severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  // TASK: Determine number of available beds for severe cases by 35%
  const availableHostpitalBeds = data.totalHospitalBeds - Math.trunc(
    0.65 * data.totalHospitalBeds
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
  // TASK: Determine 5% of infections by requested time
  // Impact cases:
  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);

  // Severe impact cases:
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );

  // TASK: Determine 2% of infections by requested time
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  // TASK: Estimate money the economy is going to lose over this period
  impact.dollarsInFlight = estimateMoneyLose(impactEstimate, data.region);

  // estimate dollars in fligt for severeCases
  severeImpact.dollarsInFlight = estimateMoneyLose(
    severeImpactEstimate, data.region
  );

  // console.log(impact);
  // console.log(severeImpact);
  return {
    data,
    impact,
    severeImpact
  };
};

// covid19ImpactEstimator(covidData);
export default covid19ImpactEstimator;
