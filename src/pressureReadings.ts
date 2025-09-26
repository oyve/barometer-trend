import { EventEmitter } from 'events';
import * as utils from './utils';
import * as diurnalrythm from './predictions/diurnalRythm';
import * as globals from './globals';

class PressureReadings extends EventEmitter {
    public pressures: utils.PressureReading[];

    constructor() {
        super();
        this.pressures = [];
    }

    /**
     * Add a pressure reading.
     * @param datetime Timestamp of reading
     * @param pressure Pressure in Pascals
     * @param altitude Altitude above sea level in meters, default = 0
     * @param temperature Temperature in Kelvin, defaults to 15 Celsius degrees
     * @param trueWindDirection True wind direction in degrees
     * @param latitude Latitude in decimal degrees, eg. 45.123
     */
    add(
        datetime: Date | number | null, 
        pressure: number, 
        altitude?: number | null, 
        temperature?: number | null, 
        trueWindDirection?: number | null, 
        latitude?: number | null
    ): void {
        let actualDatetime: Date;
        if(utils.isNullOrUndefined(datetime)) {
            actualDatetime = new Date(Date.now());
        } else if (typeof datetime === 'number') {
            actualDatetime = new Date(datetime);
        } else {
            actualDatetime = datetime as Date;
        }
        
        const actualAltitude = utils.isNullOrUndefined(altitude) ? 0 : altitude!;
        const actualTemperature = utils.isNullOrUndefined(temperature) ? 
            utils.toKelvinFromCelsius(globals.meanSeaLevelTemperature) : temperature!;
        
        let actualWindDirection = trueWindDirection;
        if(!utils.isNullOrUndefined(trueWindDirection) && trueWindDirection === 360) {
            actualWindDirection = 0;
        }

        const ema = 1;
        const pressureASL = utils.adjustPressureToSeaLevel(pressure, actualAltitude, actualTemperature);
        
        const diurnalPressure = (utils.isValidLatitude(latitude || 0) && latitude !== null && latitude !== undefined) ?
            diurnalrythm.correctPressure(pressure, latitude!, actualDatetime).correctedPressure :
            null;

        const diurnalPressureASL = (utils.isValidLatitude(latitude || 0) && latitude !== null && latitude !== undefined) ?
            diurnalrythm.correctPressure(pressureASL, latitude!, actualDatetime).correctedPressure :
            null;

        const reading: utils.PressureReading = {
            datetime: actualDatetime,
            pressure: pressure,
            meta: {
                altitude: actualAltitude,
                temperature: actualTemperature,
                trueWindDirection: actualWindDirection || undefined,
                latitude: latitude || undefined
            },
            calculated: {
                pressureASL: pressureASL,
                diurnalPressure: diurnalPressure || undefined,
                diurnalPressureASL: diurnalPressureASL || undefined,
                EMA: ema
            }
        };

        this.pressures.push(reading);
        this.removeOldPressures();
        this.emit('pressureAdded', reading);
    }

    private removeOldPressures(threshold: Date = utils.minutesFromNow(-globals.keepPressureReadingsFor)): void {
        this.pressures = this.pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
    }

    /**
     * Get the last pressure reading.
     * @returns The last pressure reading.
     */
    getLatestPressure(): utils.PressureReading | undefined {
        return this.pressures[this.pressures.length - 1];
    }

    /**
     * Check if there are any pressure readings.
     * @returns True if there are pressure readings, false otherwise.
     */
    hasPressures(): boolean {
        return this.pressures.length > 0;
    }

    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear(): void {
        this.pressures = [];
    }
}

const pressureReadingsAsSingleton = new PressureReadings();

export = pressureReadingsAsSingleton;