import { EventEmitter } from 'events';
import * as utils from './utils';
import * as diurnalrythm from './predictions/diurnalRythm';
import globals = require('./globals');
import EMA = require('./EMA');
import { pressure as pressureFormulas, temperature as temperatureFormulas } from 'weather-formulas';
import { Reading, ReadingMeta } from './types';

const oneHourAgo = Date.now() - 60 * 60 * 1000;
const MINUTES_SPACING = 2;
const sortOlderToNewer = (a: Reading, b: Reading) => a.datetime.getTime() - b.datetime.getTime();

class ReadingStore extends EventEmitter {
    public readings: Reading[];

    constructor() {
        super();
        this.readings = [];
    }

    /**
     * 
     * @param timestamp Timestamp of barometer reading
     * @param pressure Pressure in Pascal
     * @param meta Meta data object containing altitude, temperature, humidity, trueWindDirection and latitude
     */
    add(timestamp: Date | null | undefined, pressure: number, meta: Partial<ReadingMeta> = {}): Reading | undefined {
        if(utils.isNullOrUndefined(timestamp)) timestamp = new Date();

        if(!globals.ignoreFlagInTesting && timestamp! < utils.minutesFromNow(-globals.keepPressureReadingsFor)) {
            return; //ignore readings older than 48 hours
        }
        if(this.getAll().find(r => r.datetime.getTime() === timestamp!.getTime())) {
            return; //ignore duplicate readings
        }

        const completeMeta: ReadingMeta = {
            altitude: 0,
            temperature: null,
            humidity: null,
            trueWindDirection: null,
            trueWindSpeed: null,
            latitude: null,   
            ...meta //override defaults
        };

        if(utils.isNullOrUndefined(completeMeta.altitude)) completeMeta.altitude = 0;
        if(utils.isNullOrUndefined(completeMeta.temperature)) completeMeta.temperature = temperatureFormulas.celciusToKelvin(globals.meanSeaLevelTemperature);
        if(!utils.isNullOrUndefined(completeMeta.trueWindDirection) && completeMeta.trueWindDirection === 360) completeMeta.trueWindDirection = 0;

        const smoothing = this.smoothPressure(pressure);
        pressure = smoothing.smoothed && smoothing.smoothed !== pressure ? smoothing.smoothed : pressure;
        
        const pressureASL = completeMeta.altitude > 0 ? Math.round(pressureFormulas.adjustPressureToSeaLevelSimple(pressure, completeMeta.altitude, completeMeta.temperature!)) : pressure;
        
        const diurnalPressure = utils.isValidLatitude(completeMeta.latitude!)  ?
            diurnalrythm.correctPressure(pressure, completeMeta.latitude!, timestamp!).correctedPressure :
            pressure; //default to pressure

        const diurnalPressureASL = utils.isValidLatitude(completeMeta.latitude!) ?
            diurnalrythm.correctPressure(pressureASL, completeMeta.latitude!, timestamp!).correctedPressure :
            pressureASL; //default to pressure ASL

        const reading: Reading = {
            datetime: timestamp!,
            pressure: pressure,
            meta: completeMeta,
            calculated: {
                smoothed: smoothing.correction,
                pressureASL: pressureASL, //defaults to pressure if not ASL
                diurnalPressure: diurnalPressure, //defaults to pressure if not diurnal
                diurnalPressureASL: diurnalPressureASL //default to pressure ASL if not diurnal
            },
            originalPressure: () => pressure + smoothing.correction
        };

        this.readings.push(reading);
        this.removeOldPressures();
        this.readings.sort(sortOlderToNewer);
        this.emit('pressureAdded', reading);
        return reading;
    }

    private smoothPressure(pressure: number): { pressure: number; smoothed: number | null; correction: number } {
        //only apply if we already have more than 3 readings the last hour
        if (globals.applySmoothing) {
            const recentReadings = this.getAll().filter(
                reading => new Date(reading.datetime).getTime() >= oneHourAgo
            );
        
            if (recentReadings.length > 3) {
                const toSmoothen = [...recentReadings.map(r => r.pressure), pressure];
                const smoothed = EMA.process(toSmoothen);
                const pressureSmoothed = smoothed[smoothed.length - 1];

                return { pressure: pressure, smoothed: pressureSmoothed, correction: pressureSmoothed - pressure };
            }
        }

        return { pressure: pressure, smoothed: null, correction: 0 };
    }

    private removeOldPressures(threshold: Date = utils.minutesFromNow(-globals.keepPressureReadingsFor)): void {
        if(!globals.ignoreFlagInTesting) {
            this.readings = this.readings.filter((p) => p.datetime.getTime() >= threshold.getTime());
        }
    }

    /**
     * Get the last pressure reading.
     * @returns The last pressure reading.
     */
    getLatestReading(): Reading | undefined {
        return this.readings[this.readings.length - 1];
    }

    getFirstReading(): Reading | null {
        return this.readings.length > 0 ? this.readings[0] : null;
    }

    findReadingBefore(datetime: Date): Reading | null {
        if (!(datetime instanceof Date)) throw new Error("Invalid input for datetime.");
    
        let previous: Reading | null = null;
    
        for (const p of this.readings) {
            if (p.datetime.getTime() < datetime.getTime()) previous = p;
            else break;
        }
    
        return previous;        
    }

    findReadingAfter(datetime: Date): Reading | null {
        if (!(datetime instanceof Date)) throw new Error("Invalid input for datetime.");
    
        let next: Reading | null = null;
    
        for (const p of this.readings) {
            if (p.datetime.getTime() > datetime.getTime()) {
                next = p;
                break;
            }
        }
    
        return next;
    }

    getPressuresByPeriod(startTime: Date, endTime: Date, readings: Reading[] = this.readings): Reading[] {
        if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
            throw new Error("Invalid input for startTime or endTime.");
        }
    
        return readings.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
    }

    /**
     * Get readings since X minutes
     * @param minutes Number of minutes
     * @returns Readings
     */
    getPressuresSince(minutes: number): Reading[] {
        const earlier = utils.minutesFromNow(-Math.abs(minutes));
        return this.readings.filter((p) => p.datetime.getTime() >= earlier.getTime());
    }

    /**
     * Get pressure closest to the given datetime
     * @param datetime Datetime to search
     * @returns Reading
     */
    getPressureClosestTo(datetime: Date): Reading | null {
        if (!(datetime instanceof Date)) throw new Error("Invalid input for datetime.");
    
        let previous: Reading | null = null;
        let next: Reading | null = null;
    
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
    
        const diffNext = Math.abs(next!.datetime.getTime() - datetime.getTime());
        const diffPrevious = Math.abs(previous!.datetime.getTime() - datetime.getTime());
    
        return diffNext < diffPrevious ? next : previous;
    }

    /**
     * Check if there are any pressure readings.
     * @returns True if there are pressure readings, false otherwise.
     */
    hasPressures(): boolean {
        return this.readings.length > 0;
    }

    count(): number {
        return this.readings.length;
    }

    /**
     * Returns the pressure of a reading by global default choices of Adjust To Sea Level and/or applying Diurnal Rythm corrections.
     * @param reading The reading to return pressure of. By default the latest is used.
     * @returns The pressure of the reading
     */
    getPressureByDefaultChoice(reading: Reading | undefined = this.getLatestReading()): number {
        if(reading === null || reading === undefined) throw new Error("Reading cannot be null.")
        let result: number;

        if(reading.meta.altitude > 0) {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressureASL : reading?.calculated?.pressureASL;
        } else {
            result = globals.applyDiurnalRythm ? reading?.calculated?.diurnalPressure : reading.pressure;
        }

        return result;
    }

    getPressureAverageByPeriod(minutes: number = 10, reading: Reading | undefined = this.getLatestReading()): number {
        if (!reading) return 0;
        const readings = this.getPressuresByPeriod(utils.minutesFrom(reading.datetime, -minutes), reading.datetime);
        let sum = 0;
        readings.forEach(r => {
            sum += this.getPressureByDefaultChoice(r);
        });
        return sum / readings.length;
    }

    /**
     * 
     * @returns Returns all pressure readings
     */
    getAll(): Reading[] {
        return [...this.readings].sort(sortOlderToNewer);
    }

    /**
     * 
     * @param minutes Number of minutes to get readings for
     * @returns Readings
     */
    getAllLastMinutes(minutes: number): Reading[] {
        return this.readings.filter((p) => p.datetime.getTime() >= utils.minutesFromNow(-Math.abs(minutes)).getTime());
    }

    /**
     * 
     * @returns Quality in terms of percentage. 100% best.
     */
    getDataQuality(): number {
        let score = 0;
        const start = 180;
        let offset = start;
        const interval = 30;
    
        while(offset > 0) {
            const startPeriod = utils.minutesFromNow(-offset);
            const endPeriod = utils.minutesFromNow(-(offset - interval));
            if(this.getPressuresByPeriod(startPeriod, endPeriod).length >= 1) score++;
            offset -= interval;
        }
    
        const qualityInPercent = score / (start / interval) * 100;
        return qualityInPercent;
    }

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear(): void {
        this.readings = [];
    }
}

const readingStoreAsSingleton = new ReadingStore();

export = readingStoreAsSingleton;
