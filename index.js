'use strict'
const byPressureTrend = require('./src/predictions/byPressureTrend');
const byPressureTendencyAndWind = require('./src/predictions/byPressureTendencyAndWind');
const byPressureTrendAndSeason = require('./src/predictions/byPressureTrendAndSeason');
const beaufort = require('./src/predictions/beaufort');
const utils = require('./src/utils');
//const history = require('./src/predictions/history');
const system = require('./src/predictions/system');
const readingStore = require('./src/readingStore');
const barometerLabel = require('./src/predictions/label');
const trend = require('./src/trend');
const forecastText = require('./src/predictions/forecastText');
const FrontAnalyzer = require('./src/predictions/front');

let latitude = null;

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
function clear() {
    readingStore.clear();
}

/**
 * 
 * @param {Date} datetime Timestamp of barometer reading
 * @param {number} pressure Pressure in Pascal
 * @param {Array} meta Meta data object containing altitude, temperature, humidity, trueWindDirection and latitude
 */
function addPressure(datetime, pressure, meta = {}) {
    return readingStore.add(datetime, pressure, meta);
}

/**
 * @returns True or false
 */
function hasPressures() {
    return readingStore.hasPressures();
}

/**
 * Get latitude
 * @returns {number} Returns latitude, null if not set
 */
function getLatitude()
{
    return this.latitude;
}

/**
 * Set latitude as a decimal number, i.e. 45.123
 * @param {number} latitude Latitude in decimal format, i.e. 45.123
 * @returns {boolean} true or false if set after validation
 */
function setLatitude(latitude) {
    if(utils.isValidLatitude(latitude)) {
        this.latitude = latitude;
        return true;
    }

    return false;
}

/**
 * Get the trend and forecastof the barometer.
 * If latitude is set it will determine northern|southern hemisphere (default: northern)
 * @returns {Object}
 */
function getForecast() {
    if (latitude === null) return null; // Latitude not set
    getForecast(utils.isNorthernHemisphere(latitude));
}

function getForecastAsync() {
    return new Promise((resolve, reject) => {
        try {    
            const forecast = getForecast();
            resolve(forecast);
        }
        catch (error) {
            reject(error);
        }
    });
}

async function getForecastAsync(isNorthernHemisphere = true) {
    return new Promise((resolve, reject) => {
        try {    
            const forecast = getForecast(isNorthernHemisphere);
            resolve(forecast);
        }
        catch (error) {
            reject(error);
        }
    });
}

/**
 * Get the trend and forecast of the barometer.
 * @param {boolean} isNorthernHemisphere Located north of equator? Default true.
 * @returns {Object}
 */
function getForecast(isNorthernHemisphere = true) {
    if (readingStore.readings.length < 2) return null;

    const last10Minutes = readingStore.getAllLastMinutes(10);

    const trendAnalyzer = new trend.TrendAnalyzer();
    const frontAnalyzer = new FrontAnalyzer();

    let pressureTrend = trendAnalyzer.forecast();
    if (pressureTrend === null) return null;

    let pressureSystems = system.forecast(readingStore.getPressureByDefaultChoice(), readingStore.getPressuresSince(-60)); //, utils.getAverageValue(last10Minutes, r => r.meta?.trueWindDirection), isNorthernHemisphere);
    let forecastPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend.key);
    let forecastFront = frontAnalyzer.forecast();
    let beaufortForecast = beaufort.forecast(pressureTrend.ratio, utils.getAverageValue(last10Minutes, r => r.meta?.truewindSpeed));
    let forecastByPressureAndSeason = byPressureTrendAndSeason.getPrediction(readingStore.getPressureByDefaultChoice(), pressureTrend.tendency, pressureTrend.trend.key, utils.isSummer(isNorthernHemisphere));
    let forecastPressureTendencyThresholdAndQuadrant = byPressureTendencyAndWind.getPrediction(readingStore.getPressureByDefaultChoice(), readingStore.getLatestReading().meta.trueWindDirection, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere);
    //let pressureHistory = history.getHistoricPressures();
    let labels = barometerLabel.getBarometerLabel(readingStore.getPressureByDefaultChoice());

    let forecast = {
        pressure: readingStore.getLatestReading(),
        trend: pressureTrend,
        models: {
            pressureOnly: forecastPressureOnly,
            quadrant: forecastPressureTendencyThresholdAndQuadrant,
            season: forecastByPressureAndSeason,
            beaufort: beaufortForecast,
            front: forecastFront,
            pressureSystem: pressureSystems,
            label: labels
        },
        dataQuality: readingStore.getDataQuality(),
        forecastMinutes: getForecastMinutes()
    };

    if(forecast != null) {
        let textForecast = forecastText.forecast(forecast);
        forecast.models.forecastText = textForecast;
    }

    return forecast;
}

function getForecastMinutes() {
    let first = readingStore.getFirstReading()
    if(first === null) return 0;
    const diffMs = Math.abs(new Date() - first); // difference in milliseconds
    return Math.floor(diffMs / 60000);
}

function getBarometerUpdates() {
    if(readingStore.count() < 1) return null;
    
    return barometerLabel.getBarometerLabel(readingStore.getPressureByDefaultChoice());
}

/**
 * Change altitude for all existing readings
 * @param {number} altitude Altitude
 */
function changeAltitude(altitude) {
    readingStore.getAll().forEach(r => r.meta.altitude = altitude);
}

module.exports = {
    clear,
    hasPressures,
    addPressure,
    getForecast,
    getBarometerUpdates,
    getLatitude,
    setLatitude,
    getForecastAsync,
    changeAltitude
};
