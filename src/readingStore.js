const EventEmitter = require('events');
const utils = require('./utils');
const diurnalrythm = require('./predictions/diurnalRythm');
const globals = require('./globals')

class ReadingStore extends EventEmitter {
    constructor() {
        super();
        this.readings = [];
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
            pressure; //default to avoid nulls

        const diurnalPressureASL = utils.isValidLatitude(latitude) ?
            diurnalrythm.correctPressure(pressureASL, latitude, datetime).correctedPressure :
            pressureASL; //default to

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

        this.readings.push(reading);
        this.#removeOldPressures();
        this.readings.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()); //oldest to newest
        this.emit('pressureAdded', reading);
    }

    #removeOldPressures(threshold = utils.minutesFromNow(-globals.keepPressureReadingsFor)) {
        if(!globals.ignoreFlagInTesting) {
            this.readings = this.readings.filter((p) => p.datetime.getTime() >= threshold.getTime());
        }
    }

    /**
     * Get the last pressure reading.
     * @returns {Object} The last pressure reading.
     */
    getLatestReading() {
        return this.readings[this.readings.length - 1];
    }

    getPressuresByPeriod(startTime, endTime) {
        if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
            throw new Error("Invalid input for startTime or endTime.");
        }
    
        return this.readings.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
    }

    /**
     * Get readings since X minutes
     * @param {number} minutes Number of minutes
     * @returns Readings
     */
    getPressuresSince(minutes) {
        const earlier = utils.minutesFromNow(-Math.abs(minutes));
        return this.readings.filter((p) => p.datetime.getTime() >= earlier.getTime());
    }

    /**
     * Get pressure closest to the given datetime
     * @param {Date} datetime Datetime to search
     * @returns Reading
     */
    getPressureClosestTo(datetime) {
        if (!(datetime instanceof Date)) throw new Error("Invalid input for datetime.");
    
        let previous = null;
        let next = null;
    
        for (const p of this.readings) {
            if (p.datetime.getTime() <= datetime.getTime()) previous = p;
            if (p.datetime.getTime() >= datetime.getTime()) {
                next = p;
                break;
            }
        }
    
        if (utils.isNullOrUndefined(next) && utils.isNullOrUndefined(previous)) return null;
        if (utils.isNullOrUndefined(next)) return previous;
        if (utils.isNullOrUndefined(previous)) return next;
    
        const diffNext = Math.abs(next.datetime.getTime() - datetime.getTime());
        const diffPrevious = Math.abs(previous.datetime.getTime() - datetime.getTime());
    
        return diffNext < diffPrevious ? next : previous;
    }

    /**
     * Check if there are any pressure readings.
     * @returns {boolean} True if there are pressure readings, false otherwise.
     */
    hasPressures() {
        return this.readings.length > 0;
    }

    count() {
        return this.readings.length;
    }

    /**
     * Returns the pressure of a reading by global default choices of Adjust To Sea Level and/or applying Diurnal Rythm corrections.
     * @param {Object} reading The reading to return pressure of. By default the latest is used.
     * @returns The pressure of the reading
     */
    getPressureByDefaultChoice(reading = this.getLatestReading()) {
        if(reading === null) throw new Error("Reading cannot be null.")
        let result = null;

        if(globals.applyAdjustToSeaLevel) {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressureASL : reading?.calculated?.pressureASL;
        } else {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressure : reading.pressure;
        }

        return result;
    }

    getPressureAverageByPeriod(minutes = 10, reading = this.getLatestReading()) {
        let readings = getPressuresByPeriod(reading.datetime, utils.minutesFrom(reading.datetime, -minutes));
        let sum = 0;
        readings.forEach(reading => {
            sum += this.getPressureByDefaultChoice(reading);
        });
        return sum / readings.length;
    }

    /**
     * 
     * @returns Returns all pressure readings
     */
    getAll() {
        return this.readings;
    }

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear() {
        this.readings = [];
    }
}

const readingStoreAsSingleton = new ReadingStore();

module.exports = readingStoreAsSingleton;