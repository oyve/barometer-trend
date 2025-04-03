const EventEmitter = require('events');
const utils = require('./utils');
const diurnalrythm = require('./predictions/diurnalRythm');
const globals = require('./globals')

// (async () => {
//     const weatherFormulas = await import('weather-formulas');
//     const { pressure } = weatherFormulas;
//     pressure.adjustPressureToSeaLevelAdvanced()
// })();
  
class ReadingStore extends EventEmitter {
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
        if(utils.isNullOrUndefined(datetime)) datetime = new Date();
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
        this.pressures.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()); //oldest to newest
        this.emit('pressureAdded', reading);
    }

    #removeOldPressures(threshold = utils.minutesFromNow(-globals.keepPressureReadingsFor)) {
        if(!globals.ignoreFlagInTesting) {
            this.pressures = this.pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
        }
    }

    /**
     * Get the last pressure reading.
     * @returns {Object} The last pressure reading.
     */
    getLatestReading() {
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
     * The lastest pressure by the default global choice of using Adjust To Sea Level and/or applying Diurnal Rythm corrections
     * @returns The lastest pressure
     */
    getLatestPressureByDefaultChoice() {
        if(!this.hasPressures()) return null;

        return this.getReadingPressureByDefaultChoice(this.getLatestReading());
    }

    getReadingPressureByDefaultChoice(reading) {
        let result = null;

        if(globals.applyAdjustToSeaLevel) {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressureASL : reading?.calculated?.pressureASL;
        } else {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressure : reading.pressure;
        }

        return result;
    }

    getAll() {
        return this.pressures;
    }

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear() {
        this.pressures = [];
    }
}

const readingStoreAsSingleton = new ReadingStore();

module.exports = readingStoreAsSingleton;