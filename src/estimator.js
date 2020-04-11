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
const estimateFutureCases = (data, currentInfectedCases) => {
  let factor = null;
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
      return 0;
  }

  return currentInfectedCases * (2 ** factor);
};

// get x% of total
const getPercentageFrom = (percentage, totalCases) => Math.trunc((percentage * totalCases) / 100);

// Get the beds needed over time
const bedsNeededOverTime = (severeCases, availableBeds) => {
  if (severeCases < availableBeds) {
    return availableBeds;
  }

  return severeCases - availableBeds;
};


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
  impact.serverCasesByRequestedTime = getPercentageFrom(15, impact.infectionsByRequestedTime);

  // Severe impact cases:
  severeImpact.serverCasesByRequestedTime = getPercentageFrom(
    15, severeImpact.infectionsByRequestedTime
  );


  // TASK: Determine number of available beds for severe cases
  const availableHostpitalBeds = getPercentageFrom(35, data.totalHospitalBeds);

  // Impact cases:
  impact.hospitalBedsByRequestedTime = bedsNeededOverTime(
    impact.serverCasesByRequestedTime,
    availableHostpitalBeds
  );

  // Severe impact cases:
  severeImpact.hospitalBedsByRequestedTime = bedsNeededOverTime(
    severeImpact.serverCasesByRequestedTime,
    availableHostpitalBeds
  );

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
