const predictionSeasonJSON = require('./prediction_season.json');

function getPrediction(pressure, tendency, trend, isSummer = true) {
	let pressureRange = predictionSeasonJSON.find((p) => pressure < p.pressure);

	if(trend === "STEADY") tendency = "STEADY";

	let prediction = pressureRange.predictions.find((p) => p.tendency === tendency && p.trend === trend);

	return isSummer ? prediction.summer : prediction.winter;
}

module.exports = {
	getPrediction
}