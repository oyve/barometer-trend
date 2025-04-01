const EventEmitter = require('events');
const utils = require('./utils');
const diurnalrythm = require('./predictions/diurnalRythm');

let meanTemperature = 15; //celcius

class PressureReadings extends EventEmitter {
    constructor() {
        super();
        this.pressures = [];
    }

    /**
     * Add a pressure reading.
     * @param {Date} datetime Timestamp of reading
     * @param {number} pressure Pressure in Pascals
     * @param {number} altitude Altitude above sea level in meters, default = 0
     * @param {number} temperature Temperature in Kelvin, defaults to 15 Celsius degrees
     * @param {number} trueWindDirection True wind direction in degrees
     * @param {number} latitude Latitude in decimal degrees, eg. 45.123
     */
    add(datetime, pressure, altitude, temperature, trueWindDirection, latitude) {
        if(datetime === null) datetime = Date.now();
        if (altitude === null) altitude = 0;
        if (temperature === null) temperature = utils.toKelvinFromCelcius(meanTemperature);
        if (trueWindDirection !== null && trueWindDirection === 360) trueWindDirection = 0;

        const ema = 1;
        const pressureASL = utils.adjustPressureToSeaLevel(pressure, altitude, temperature);
        const diurnalPressure = 0;

        const reading = {
            datetime: datetime,
            pressure: pressure,
            meta: {
                altitude: altitude,
                temperature: temperature,
                trueWindDirection: trueWindDirection,
                latitude: latitude
            },
            calculated: {
                pressureASL: pressureASL,
                diurnalPressure: diurnalPressure,
                EMA: ema
            },
            pressureCalculated: () => { return reading.calculated.pressureASL + reading.calculated.diurnalPressure; }
        };

        this.#removeOldPressures();

        this.pressures.push(reading);
        
        this.emit('pressureAdded', reading);
    }

    #removeOldPressures(threshold = utils.minutesFromNow(-utils.MINUTES.FORTYEIGHT_HOURS)) {
        this.pressures = this.pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
    }

    /**
     * Get the last pressure reading.
     * @returns {Object} The last pressure reading.
     */
    getLatestPressure() {
        return this.pressures[this.pressures.length - 1];
    }

    /**
     * Check if there are any pressure readings.
     * @returns {boolean} True if there are pressure readings, false otherwise.
     */
    hasPressures() {
        return this.pressures.length > 0;
    }

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear() {
        this.pressures = [];
    }
}

const pressureReadingsAsSingleton = new PressureReadings();

module.exports = pressureReadingsAsSingleton;