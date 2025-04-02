const predictionSeasonJSON = require('./prediction_season.json');

function getPrediction(pressure, tendency, trend, isSummer = true) {
	let pressureRange = predictionSeasonJSON.find((p) => pressure < p.pressure);

	if(trend === "STEADY") tendency = "STEADY";
	if(trend === "CHANGING") trend = "RAPIDLY"; //CHANGING does not exist in the weather table, choose the less opportunistic
	if(trend === "QUICKLY") trend = "RAPIDLY"; //QUICKLY does not exist in the weather table

	let prediction = pressureRange.predictions.find((p) => p.tendency === tendency && p.trend === trend);

	return isSummer ? prediction.summer : prediction.winter;
}

module.exports = {
	getPrediction
}