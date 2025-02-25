'use strict'
const front = require('./predictions/front');
const byPressureTrend = require('./predictions/byPressureTrend');
const byPressureTendencyAndWind = require('./predictions/byPressureTendencyAndWind');
const byPressureTrendAndSeason = require('./predictions/byPressureTrendAndSeason');
const beaufort = require('./predictions/beaufort');
const trend = require('./trend');
const utils = require('./utils');
const history = require('./predictions/history');
const system = require('./predictions/system');

let pressures = [];

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
function clear() {
    pressures = [];
}

/**
 * Check if there are any pressure readings.
 * @returns {boolean} True if there are pressure readings, false otherwise.
 */
function hasPressures() {
    return pressures.length > 0;
}

/**
 * Add a pressure reading.
 * @param {Date} datetime Timestamp of barometer reading
 * @param {number} pressure Pressure in Pascal
 * @param {number} altitude Altitude above sea level in meters, default = 0
 * @param {number} temperature Temperature in Kelvin, defaults to 15 Celsius degrees
 * @param {number} trueWindDirection True wind direction in degrees
 */
function addPressure(datetime, pressure, altitude = null, temperature = null, trueWindDirection = null) {
if (altitude === null) altitude = 0;
    if (temperature === null) temperature = utils.toKelvinFromCelcius(15);
    if (trueWindDirection !== null && trueWindDirection === 360) trueWindDirection = 0;

    let pressureASL = utils.adjustPressureToSeaLevel(pressure, altitude, temperature);

    pressures.push({
        datetime: datetime,
        value: pressureASL,
        meta: {
            value: pressure,
            altitude: altitude,
            temperature: temperature,
            twd: trueWindDirection
        }
    });

    removeOldPressures();
}

/**
 * Get the count of pressure entries. (Mainly for testing purposes)
 * @returns {number} Number of pressure entries
 */
function getPressureCount() {
    return pressures.length;
}

/**
 * Remove old pressure readings.
 * @param {Date} threshold The threshold date to remove old pressures. Defaults to 48 hours ago.
 */
function removeOldPressures(threshold = utils.minutesFromNow(-utils.MINUTES.FORTYEIGHT_HOURS)) {
    pressures = pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
}

/**
 * Get the last pressure reading.
 * @returns {Object} The last pressure reading.
 */
function getLastPressure() {
    return pressures[pressures.length - 1];
}

/**
 * Get all pressure readings.
 * @returns {Array<Object>} All pressure readings.
 */
function getAll() {
    return pressures;
}

/**
 * Get the trend of the barometer.
 * @param {boolean} isNorthernHemisphere Located north of equator? Default true.
 * @returns {Object}
 */
function getPredictions(isNorthernHemisphere = true) {
    if (pressures.length < 2) return null;

    let lastPressure = getLastPressure();

    let pressureTrend = trend.getTrend(pressures);
    let pressureSystem = system.getSystemByPressure(lastPressure.value);
    let pressureHistory = history.getHistoricPressures(pressures);
    let predictionPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend);
    let predictionFront = front.getFront(pressures);
    let predictionBeaufort = beaufort.getByPressureVariationRatio(pressureTrend.ratio);
    let predictionSeason = byPressureTrendAndSeason.getPrediction(lastPressure.value, pressureTrend.tendency, pressureTrend.trend, utils.isSummer(isNorthernHemisphere));
    let predictionPressureTendencyThresholdAndQuadrant = byPressureTendencyAndWind.getPrediction(lastPressure.value, lastPressure.meta.twd, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere);

    let forecast = {
        lastPressure: lastPressure,
        history: pressureHistory,
        trend: pressureTrend,
        system: pressureSystem,
        predictions: {
            pressureOnly: predictionPressureOnly,
            quadrant: predictionPressureTendencyThresholdAndQuadrant,
            season: predictionSeason,
            beaufort: predictionBeaufort,
            front: predictionFront
        }
    };

    return forecast;
};

module.exports = {
    clear,
    addPressure,
    getPressureCount,
    getPredictions,
    hasPressures,
    getAll
};