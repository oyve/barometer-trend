const EMA = require('../EMA');
const globals = require('../globals');

const LOW_THRESHOLD = 101000;  // Low pressure threshold (in hPa)
//const NORMAL_THRESHOLD = 101325;  // Normal (average) pressure threshold (in hPa)
const HIGH_THRESHOLD = 101500;  // High pressure threshold (in hPa)

const SYSTEMS = [
    { key: 0, name: "Low", short: "LOW", minThreshold: 0, maxThreshold: LOW_THRESHOLD },
    { key: 1, name: "Normal", short: "NORMAL", minThreshold: LOW_THRESHOLD, maxThreshold: HIGH_THRESHOLD },
    { key: 2, name: "High", short: "HIGH", minThreshold: HIGH_THRESHOLD, maxThreshold: Number.MAX_SAFE_INTEGER }
];

/**
 * @description Get the pressure system based on the pressure value.
 * @param {number} pressure - The pressure value in Pascal.
 * @returns {Object} The pressure system (LOW, NORMAL, HIGH).
 */
function getSystemByPressure(pressure) {
    try {
        return SYSTEMS.find(s => pressure > s.minThreshold && pressure <= s.maxThreshold) || systems[0];
    } catch (error) {
        console.error("Error in getSystemByPressure: ", error);
        return null;
    }
}

/**
 * @description Get the pressure system based on the trend of pressure readings.
 * @param {Array} readings Array of pressure readings
 * @returns {Object} The pressure system (LOW, NORMAL, HIGH) based on the trend of the readings.
 */
function getSystemByPressureTrend(readings) {
    if (readings.length < 2) {
        return null;  // Not enough data to determine trend;
    }

    if(globals.applySmoothing) {
        readings = EMA.process(readings);
    }

    const firstPressure = readings[0].pressure;
    const lastPressure = readings[readings.length - 1].pressure;
    const rateOfChange = lastPressure - firstPressure;

    let trendingKey;
    if (rateOfChange > 0) {
        // Pressure is rising
        if (lastPressure >= HIGH_THRESHOLD) {
            trendingKey = 2;
        } else if (lastPressure >= LOW_THRESHOLD) {
            trendingKey = 1;
        } else {
            trendingKey = 0;
        }
    } else if (rateOfChange < 0) {
        // Pressure is falling
        if (lastPressure <= LOW_THRESHOLD) {
            trendingKey = 0;
        } else if (lastPressure <= HIGH_THRESHOLD) {
            trendingKey = 1;
        } else {
            trendingKey = 2;
        }
    } else {
        // Pressure is stable
        trendingKey = 1;
    }

    return SYSTEMS.find(s => s.key === trendingKey);;
}

module.exports = {
    getSystemByPressure,
    getSystemByPressureTrend
};