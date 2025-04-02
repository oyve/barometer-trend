const EventEmitter = require('events');
const utils = require('./utils');
const diurnalrythm = require('./predictions/diurnalRythm');
const globals = require('./globals')

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
        if(utils.isNullOrUndefined(datetime)) datetime = Date.now();
        if(utils.isNullOrUndefined(altitude)) altitude = 0;
        if(utils.isNullOrUndefined(temperature)) temperature = utils.toKelvinFromCelsius(globals.meanSeaLevelTemperature);
        if(!utils.isNullOrUndefined(trueWindDirection) && trueWindDirection === 360) trueWindDirection = 0;

        const ema = 1;
        const pressureASL = utils.adjustPressureToSeaLevel(pressure, altitude, temperature);
        //const pressureASL = utils.adjustPressureToSeaLevelWithHistoricalData(pressure, altitude, this.pressures, datetime);
        
        const diurnalPressure = utils.isValidLatitude(latitude) ?
            diurnalrythm.correctPressure(pressure, latitude, datetime).correctedPressure :
            null;

        const diurnalPressureASL = utils.isValidLatitude(latitude) ?
            diurnalrythm.correctPressure(pressureASL, latitude, datetime).correctedPressure :
            null;

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
                diurnalPressureASL: diurnalPressureASL,
                EMA: ema
            }
        };

        this.pressures.push(reading);
        this.#removeOldPressures();
        this.emit('pressureAdded', reading);
    }

    #removeOldPressures(threshold = utils.minutesFromNow(-globals.keepPressureReadingsFor)) {
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

    getPressureByDefault(useDiurnal = false) {
        const pressure = this.getLatestPressure();
        useDiurnal ? pressure.calculated.diurnalPressureASL : pressure.calculated.pressureASL;
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