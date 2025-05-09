const regression = require('regression');

const LOW_THRESHOLD = 101000;  // Low pressure threshold (in hPa)
//const NORMAL_THRESHOLD = 101325;  // Normal (average) pressure threshold (in hPa)
const HIGH_THRESHOLD = 101500;  // High pressure threshold (in hPa)

const SYSTEMS = [
    { key: 0, name: "Low", text: "a below-normal", short: "LOW", minThreshold: 0, maxThreshold: LOW_THRESHOLD },
    { key: 1, name: "Normal", text: "normal", short: "NORMAL", minThreshold: LOW_THRESHOLD, maxThreshold: HIGH_THRESHOLD },
    { key: 2, name: "High", text: "an above-normal", short: "HIGH", minThreshold: HIGH_THRESHOLD, maxThreshold: Number.MAX_SAFE_INTEGER }
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
    if(!readings) return null;
    if (readings.length < 2) return null;

    const readingStore = require('../readingStore');
    const points = readings.map((r, i) => [i, readingStore.getPressureByDefaultChoice(r)]);

    const result = regression.linear(points);
    const slope = result.equation[0];
    const lastPressure = points[points.length - 1][1];

    let trendingKey;
    if (slope > 0) {
        trendingKey = lastPressure >= HIGH_THRESHOLD ? 2 :
                      lastPressure >= LOW_THRESHOLD ? 1 : 0;
    } else if (slope < 0) {
        trendingKey = lastPressure <= LOW_THRESHOLD ? 0 :
                      lastPressure <= HIGH_THRESHOLD ? 1 : 2;
    } else {
        trendingKey = 1;
    }

    return SYSTEMS.find(s => s.key === trendingKey);
}

function getDirectionToSystem(system, trueWindDirection, isNorthernHemisphere) {
    if (!system) return null;
    if(!trueWindDirection) return null;

    let degrees = null;
    if(system.key === 0) {
        degrees = isNorthernHemisphere ? trueWindDirection - 90 : trueWindDirection + 90; // Low pressure system is to the left of the wind
    } else if(system.key === 2) {
        degrees = isNorthernHemisphere ? trueWindDirection + 90 : trueWindDirection - 90; // High pressure system is to the right of the wind
    }
    
    return { degrees: degrees };
}

function forecast(latestPressure, pressures) { //}, trueWindDirection, isNorthernHemisphere = true) {
    const currentSystem = getSystemByPressure(latestPressure);
    return {
        current: currentSystem,
        //trueDirection: getDirectionToSystem(currentSystem, trueWindDirection, isNorthernHemisphere),
        trending: getSystemByPressureTrend(pressures),
    }
}

module.exports = {
    forecast,
    getSystemByPressure,
    getSystemByPressureTrend,
    getDirectionToSystem
};