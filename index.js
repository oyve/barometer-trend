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
    const diurnalrythm = require('./src/predictions/diurnalRythm');
    const pressureReadings = require('./src/pressureReadings');

    let pressures = [];
    let isDiurnalEnabled = false;
    let latitude = null;
    let meanTemperature = 15; //celcius

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    function clear() {
        pressureReadings.clear();
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
        // if (altitude === null) altitude = 0;
        // if (temperature === null) temperature = utils.toKelvinFromCelcius(meanTemperature);
        // if (trueWindDirection !== null && trueWindDirection === 360) trueWindDirection = 0;

        // let pressureASL = utils.adjustPressureToSeaLevel(pressure, altitude, temperature);
        // let diurnalPressure = latitude !== null ? diurnalrythm.correctPressure(pressureASL, latitude, datetime) : null;

        // pressures.push({
        //     datetime: datetime,
        //     value: pressureASL,
        //     meta: {
        //         value: pressure,
        //         altitude: altitude,
        //         temperature: temperature,
        //         twd: trueWindDirection,
        //         latitude: latitude,
        //         diurnalPressure: diurnalPressure
        //     }
        // });

        // removeOldPressures();
        pressureReadings.add(datetime, pressure, altitude, temperature, trueWindDirection, latitude);
    }

    /**
     * Get the count of pressure entries. (Mainly for testing purposes)
     * @returns {number} Number of pressure entries
     */
    function getPressureCount() {
        return pressureReadings.pressures.length;
    }

    // /**
    //  * Remove old pressure readings.
    //  * @param {Date} threshold The threshold date to remove old pressures. Defaults to 48 hours ago.
    //  */
    // function removeOldPressures(threshold = utils.minutesFromNow(-utils.MINUTES.FORTYEIGHT_HOURS)) {
    //     pressures = pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
    // }

    // /**
    //  * Get the last pressure reading.
    //  * @returns {Object} The last pressure reading.
    //  */
    // function getLastPressure() {
    //     return pressures[pressures.length - 1];
    // }

    /**
     * Get all pressure readings.
     * @returns {Array<Object>} All pressure readings.
     */
    function getAll() {
        return pressureReadings.pressures;
    }

    /**
     * Get all pressure readings.
     * @returns {Array<Object>} All pressure readings.
     */
    function setIsDiurnalEnabled(isEnabled = false) {
        return isDiurnalEnabled = isEnabled;
    }

    /**
     * Get if diurnal pressure correction is enabled.
     * @returns {boolean} true or false
     */
    function getIsDiurnalEnabled() {
        return isDiurnalEnabled;
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
     * 
     * @returns {number} The mean temperature used in calculations if no temperature is set when adding pressure readings
     */
    function getMeanTemperature() {
        return meanTemperature;
    }

    /**
     * 
     * @param {number} temperature Sets default mean temperature used if temperature is not submitted when adding pressure readings 
     */
    function setMeanTemperature(temperature) {
        meanTemperature = temperature;
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
        if (pressureReadings.pressures.length < 2) return null;

        const latestPressure = pressureReadings.getLatestPressure();
        const allPressures = pressureReadings.pressures;

        let pressureTrend = trend.getTrend(allPressures, getIsDiurnalEnabled());
        let pressureSystem = system.getSystemByPressure(latestPressure.calculated.pressureASL);
        let pressureHistory = history.getHistoricPressures(allPressures);
        let predictionPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend);
        let predictionFront = front.getFront(allPressures);
        let predictionBeaufort = beaufort.getByPressureVariationRatio(pressureTrend.ratio);
        let predictionSeason = byPressureTrendAndSeason.getPrediction(latestPressure.calculated.pressureASL, pressureTrend.tendency, pressureTrend.trend, utils.isSummer(isNorthernHemisphere));
        let predictionPressureTendencyThresholdAndQuadrant = byPressureTendencyAndWind.getPrediction(latestPressure.calculated.pressureASL, latestPressure.meta.trueWindDirection, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere);

        let forecast = {
            lastPressure: latestPressure,
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
        getForecast,
        hasPressures,
        getAll,
        setIsDiurnalEnabled,
        getIsDiurnalEnabled,
        getLatitude,
        setLatitude,
        getMeanTemperature,
        setMeanTemperature
    };
