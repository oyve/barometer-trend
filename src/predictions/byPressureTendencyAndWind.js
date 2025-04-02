const predictionsNorthernHemisphere = require('./prediction_nh.json');

/**
 * Get weather prediction based on pressure, wind direction, tendency, and trend.
 * @param {number} pressure - The pressure value.
 * @param {number} windDirection - The wind direction in degrees.
 * @param {string} tendency - The pressure tendency (e.g., "RISING", "FALLING", "STEADY").
 * @param {string} trend - The pressure trend (optional).
 * @param {boolean} isNorthernHemisphere - True if located in the Northern Hemisphere, false otherwise.
 * @returns {string} The weather prediction.
 */
function getPrediction(pressure, windDirection, tendency, trend = null, isNorthernHemisphere = true) {
    if (windDirection === null || windDirection === undefined) return 'N/A - No true wind data';

    let quadrant = getQuadrantByCompassDegree(windDirection);

    if (!isNorthernHemisphere) {
        quadrant = adjustQuadrantForSouthernHemisphere(quadrant);
    }

    if (trend !== null && trend === "STEADY") tendency = "STEADY";

    try {
        let prediction = predictionsNorthernHemisphere.find((p) => pressure <= p.pressure)["forecast"][tendency][quadrant];
        return prediction || 'N/A';
    } catch (error) {
        console.error("Error in getPrediction: ", error);
        return 'N/A';
    }
}

/**
 * Adjust quadrant for Southern Hemisphere.
 * @param {string} quadrant - The quadrant in the Northern Hemisphere.
 * @returns {string} The adjusted quadrant for the Southern Hemisphere.
 */
function adjustQuadrantForSouthernHemisphere(quadrant) {
    switch (quadrant) {
        case "NE": return "NW";
        case "SE": return "SW";
        case "SW": return "SE";
        case "NW": return "NE";
        default: return quadrant;
    }
}

/**
 * Get quadrant by compass degree.
 * @param {number} degree - The compass degree.
 * @returns {string} The quadrant name.
 */
function getQuadrantByCompassDegree(degree) {
    degree = Math.round(degree);
    if (degree === 360) degree = 0;

    let quadrant = quadrants.find((q) => degree >= q.low && degree <= q.high);
    return quadrant ? quadrant.name : 'Unknown';
}

const quadrants = [
    { name: "NE", low: 0, high: 89 },
    { name: "SE", low: 90, high: 179 },
    { name: "SW", low: 180, high: 269 },
    { name: "NW", low: 270, high: 359 }
];

module.exports = {
    getPrediction,
};