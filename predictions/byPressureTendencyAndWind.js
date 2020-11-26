const predictionsNorthernHemisphere = require('./prediction_nh.json');
const predictionsSouthernHemisphere = null;

function getPrediction(pressure, windDirection, tendency, trend = null, isNorthernHemisphere = true)
{
	if(windDirection === null || windDirection === undefined) return 'No wind data';

	let predictionsByHemisphere = isNorthernHemisphere ? predictionsNorthernHemisphere : predictionsSouthernHemisphere;
	if(predictionsByHemisphere === null) return 'No predictions for your hemisphere yet';

	let quadrant = getQuadrantByCompassDegree(windDirection);

	if(trend !== null && trend === "STEADY") tendency = "STEADY";

	let prediction = predictionsByHemisphere.find((p) => pressure <= p.pressure)["forecast"][tendency][quadrant];

	return prediction || 'N/A';
}

const precipitation_nh = require('./prediction_nh.json');

function getQuadrantByCompassDegree(degree) {
	degree = Math.round(degree);
	if(degree === 360) degree = 0;

    let quadrant = quadrants.find((q) => degree >= q.low && degree <= q.high);
    return quadrant.name;
}

const quadrants = [
    { name: "NE", low: 0, high: 89 },
    { name: "SE", low: 90, high: 179 },
    { name: "SW", low: 180, high: 269 },
    { name: "NW", low: 270, high: 359 }
]

module.exports = {
	getPrediction,
}