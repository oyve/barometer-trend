'use strict'
const front = require('./predictions/front');
const byPressureTrend = require('./predictions/byPressureTrend')
const byPressureTendencyAndWind = require('./predictions/byPressureTendencyAndWind')
const byPressureTrendAndSeason = require('./predictions/byPressureTrendAndSeason')
const beaufort = require('./predictions/beaufort')
const trend = require('./trend');
const utils = require('./utils');

let pressures = [];

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
function clear() {
    pressures = [];
}

function hasPressures() {
    return pressures.length > 0;
}

/**
 * 
 * @param {Date} datetime Timestamp of barometer reading
 * @param {number} pressure Pressure in Pascal
 * @param {number} altitude Altitude above sea level in meters, default = 0
 * @param {number} temperature Temperature, default = 15C
 * @param {number} trueWindDirection True wind direction in degrees
 */
function addPressure(datetime, pressure, altitude = null, temperature = null, trueWindDirection = null) {
    if (trueWindDirection !== null && trueWindDirection === 360) trueWindDirection = 0;
    if (altitude === null) altitude = 0;
    if (temperature === null) temperature = 15 + utils.KELVIN;

    if (altitude > 0) {
        pressure = utils.adjustPressureToSeaLevel(pressure, altitude, temperature);
    }

    pressures.push({
        datetime: datetime,
        value: pressure,
        twd: trueWindDirection
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

function removeOldPressures(threshold) {
    var threshold = utils.minutesFromNow(-utils.MINUTES.THREE_HOURS);
    pressures = pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
}

function getLastPressure() {
    return pressures[pressures.length - 1];
}

/**
 * Get the trend of the barometer
 * @param {boolean} isNorthernHemisphere Located north of equator? Default true.
 * @returns {Array.<Object>}
 */
function getPredictions(isNorthernHemisphere = true) {
    if (pressures.length < 2) return null;

    let lastPressure = getLastPressure();

    var pressureTrend = trend.getTrend(pressures);
    let predictionPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend);
    let predictionFront = front.getFront(pressures);
    let predictionBeaufort = beaufort.getByPressureVariationRatio(pressureTrend.ratio);
    let predictionSeason = byPressureTrendAndSeason.getPrediction(lastPressure.value, pressureTrend.tendency, pressureTrend.trend, utils.isSummer(isNorthernHemisphere))
    let predictionPressureTendencyThresholdAndQuadrant = byPressureTendencyAndWind.getPrediction(lastPressure.value, lastPressure.twd, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere);

    let forecast = {
        trend: pressureTrend,
        indicator: "Please update JSON, see latest documentation",
        predictions: {
            pressureOnly: predictionPressureOnly,
            quadrant: predictionPressureTendencyThresholdAndQuadrant,
            season: predictionSeason,
            beaufort: predictionBeaufort,
            front: predictionFront
        }
    }

    return forecast;
}

module.exports = {
    clear,
    addPressure,
    getPressureCount,
    getPredictions,
    hasPressures
}