const EventEmitter = require('events');
const utils = require('./utils');
const diurnalrythm = require('./predictions/diurnalRythm');
const globals = require('./globals');
const EMA = require('./EMA');
const {pressure: pressureFormulas, temperature: temperatureFormulas, humidity} = require('weather-formulas');

const oneHourAgo = Date.now() - 60 * 60 * 1000;

class ReadingStore extends EventEmitter {
    constructor() {
        super();
        this.readings = [];
    }

    /**
     * 
     * @param {Date} datetime Timestamp of barometer reading
     * @param {number} pressure Pressure in Pascal
     * @param {Array} meta Meta data object containing altitude, temperature, humidity, trueWindDirection and latitude
     */
    add(datetime, pressure, meta = {}) {
        
        meta = {
            altitude: 0,
            temperature: null,
            humidity: null,
            trueWindDirection: null,
            latitude: null,
            ...meta
        }

        if(utils.isNullOrUndefined(datetime)) datetime = new Date();
        if(utils.isNullOrUndefined(meta.altitude)) meta.altitude = 0;
        if(utils.isNullOrUndefined(meta.temperature)) meta.temperature = temperatureFormulas.celciusToKelvin(globals.meanSeaLevelTemperature);
        if(!utils.isNullOrUndefined(meta.trueWindDirection) && meta.trueWindDirection === 360) meta.trueWindDirection = 0;

        const smoothing = this.#smoothPressure(pressure);
        pressure = smoothing !== null && smoothing.smoothed && smoothing.smoothed !== pressure ? smoothing.smoothed : pressure;
        
        const pressureASL = meta.altitude > 0 ? Math.round(pressureFormulas.adjustPressureToSeaLevelSimple(pressure, meta.altitude, meta.temperature)) : pressure;
        
        const diurnalPressure = utils.isValidLatitude(meta.latitude) ?
            diurnalrythm.correctPressure(pressure, meta.latitude, datetime).correctedPressure :
            pressure; //default to pressure

        const diurnalPressureASL = utils.isValidLatitude(meta.latitude) ?
            diurnalrythm.correctPressure(pressureASL, meta.latitude, datetime).correctedPressure :
            pressureASL; //default to pressure ASL

        const reading = {
            datetime: datetime,
            pressure: pressure,
            meta: {
                altitude: meta.altitude,
                temperature: meta.temperature,
                humidity: meta.humidity,
                trueWindDirection: meta.trueWindDirection,
                latitude: meta.latitude
            },
            calculated: {
                smoothingCorrrection: smoothing?.correction || 0,
                pressureASL: pressureASL, //defaults to pressure if not ASL
                diurnalPressure: diurnalPressure, //defaults to pressure if not diurnal
                diurnalPressureASL: diurnalPressureASL //default to pressure ASL if not diurnal
            },
            originalPressure: () => pressure + calculated.smoothingCorrrection
        };

        this.readings.push(reading);
        this.#removeOldPressures();
        this.readings.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()); //oldest to newest
        this.emit('pressureAdded', reading);
    }

    #smoothPressure(pressure) {
        //only apply if we already have more than 3 readings the last hour
        if (globals.applySmoothing) {
            const oneHourAgo = Date.now() - 60 * 60 * 1000;
            const recentReadings = this.getAll().filter(
                reading => new Date(reading.datetime).getTime() >= oneHourAgo
            );
        
            if (recentReadings.length > 3) {
                const toSmoothen = [...recentReadings.map(r => r.pressure), pressure];
                const smoothed = EMA.process(toSmoothen);
                let pressureSmoothed = smoothed[smoothed.length - 1];

                return { pressure: pressure, smoothed: pressureSmoothed, correction: pressureSmoothed - pressure };
            }

            return { pressure: pressure, smoothed: null, correction: 0 };
        }

        return null;
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

        //if(globals.applyAdjustToSeaLevel) {
        if(reading.meta.altitude > 0) {
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