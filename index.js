    'use strict'
    const front = require('./src/predictions/front');
    const byPressureTrend = require('./src/predictions/byPressureTrend');
    const byPressureTendencyAndWind = require('./src/predictions/byPressureTendencyAndWind');
    const byPressureTrendAndSeason = require('./src/predictions/byPressureTrendAndSeason');
    const beaufort = require('./src/predictions/beaufort');
    const trend = require('./src/trend');
    const utils = require('./src/utils');
    const history = require('./src/predictions/history');
    const system = require('./src/predictions/system');
    const readingStore = require('./src/readingStore');
    const globals = require('./src/globals');

    let latitude = null;

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    function clear() {
        readingStore.clear();
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
        readingStore.add(datetime, pressure, altitude, temperature, trueWindDirection, latitude);
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
     * @deprecated use getForecast instead
     */
    function getPredictions(isNorthernHemisphere = true) {
        console.warn("Warning: deprecated. Use getForecast instead.")
        return this.getForecast(isNorthernHemisphere);
    }

    /**
     * Get the trend and forecastof the barometer.
     * If latitude is set it will determine northern|southern hemisphere (default: northern)
     * @returns {Object}
     */
    function getForecast() {
        return getForecast(utils.isNorthernHemisphere(latitude));
    }

    /**
     * Get the trend and forecast of the barometer.
     * @param {boolean} isNorthernHemisphere Located north of equator? Default true.
     * @returns {Object}
     */
    function getForecast(isNorthernHemisphere = true) {
        if (readingStore.readings.length < 2) return null;

        let all = readingStore.getAll();

        let pressureTrend = trend.getTrend();
        let pressureSystem = system.getSystemByPressure(readingStore.getPressureByDefaultChoice());
        let pressureHistory = history.getHistoricPressures();
        let predictionPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend);
        let predictionFront = front.getFront(all);
        let predictionBeaufort = beaufort.getByPressureVariationRatio(pressureTrend.ratio);
        let predictionSeason = byPressureTrendAndSeason.getPrediction(readingStore.getPressureByDefaultChoice(), pressureTrend.tendency, pressureTrend.trend, utils.isSummer(isNorthernHemisphere));
        let predictionPressureTendencyThresholdAndQuadrant = byPressureTendencyAndWind.getPrediction(readingStore.getPressureByDefaultChoice(), readingStore.getLatestReading().meta.trueWindDirection, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere);

        let forecast = {
            lastPressure: readingStore.getLatestReading(),
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
        hasPressures,
        addPressure,
        getPredictions,
        getForecast,
        getLatitude,
        setLatitude,
    };
