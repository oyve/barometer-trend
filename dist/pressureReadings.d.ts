import { EventEmitter } from 'events';
import * as utils from './utils';
declare class PressureReadings extends EventEmitter {
    pressures: utils.PressureReading[];
    constructor();
    /**
     * Add a pressure reading.
     * @param datetime Timestamp of reading
     * @param pressure Pressure in Pascals
     * @param altitude Altitude above sea level in meters, default = 0
     * @param temperature Temperature in Kelvin, defaults to 15 Celsius degrees
     * @param trueWindDirection True wind direction in degrees
     * @param latitude Latitude in decimal degrees, eg. 45.123
     */
    add(datetime: Date | number | null, pressure: number, altitude?: number | null, temperature?: number | null, trueWindDirection?: number | null, latitude?: number | null): void;
    private removeOldPressures;
    /**
     * Get the last pressure reading.
     * @returns The last pressure reading.
     */
    getLatestPressure(): utils.PressureReading | undefined;
    /**
     * Check if there are any pressure readings.
     * @returns True if there are pressure readings, false otherwise.
     */
    hasPressures(): boolean;
    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear(): void;
}
declare const pressureReadingsAsSingleton: PressureReadings;
export = pressureReadingsAsSingleton;
//# sourceMappingURL=pressureReadings.d.ts.map