/* eslint-disable linebreak-style */
function estimateFutureCases(periodType, currentInfectedCases) {
  let factor;
  switch (periodType) {
    // 7 days * # 28 weeks
    case 'weeks':
      factor = Math.floor((7 * 28) / 3);
      break;
    case 'months':
      // 30 days * 28 months
      factor = Math.floor((30 * 28) / 3);
      break;
    default:
      factor = Math.floor(28 / 3);
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
    data.periodType,
    impact.currentlyInfected
  );
  // Estimate cases for the next 28 days on severe impact
  severeImpact.infectionsByRequestedTime = estimateFutureCases(
    data.periodType,
    severeImpact.currentlyInfected
  );
  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
