const predictionsNorthernHemisphere = require('./prediction_nh.json');

function getPrediction(pressure, windDirection, tendency, trend = null, isNorthernHemisphere = true)
{
	if(windDirection === null || windDirection === undefined) return 'No wind data';

	let quadrant = getQuadrantByCompassDegree(windDirection);

	if(!isNorthernHemisphere) {
		if(quadrant === "NE") quadrant = "NW";
		else if(quadrant === "SE") quadrant = "SW";
		else if(quadrant === "SW") quadrant = "SE";
		else if(quadrant === "NW") quadrant = "NE";
	}

	if(trend !== null && trend === "STEADY") tendency = "STEADY";

	let prediction = predictionsNorthernHemisphere.find((p) => pressure <= p.pressure)["forecast"][tendency][quadrant];

	return prediction || 'N/A';
}

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