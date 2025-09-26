export interface PressureReading {
    datetime: Date;
    pressure: number;
    calculated: {
        pressureASL: number;
        diurnalPressure?: number;
        diurnalPressureASL?: number;
        EMA: number;
    };
    meta: {
        altitude?: number;
        temperature?: number;
        trueWindDirection?: number;
        latitude?: number;
    };
}
export declare const MINUTES: {
    ONE_HOUR: number;
    THREE_HOURS: number;
    FORTYEIGHT_HOURS: number;
};
export declare const KELVIN = 273.15;
/**
 * Get a date object adjusted by a given number of minutes.
 * @param minutes Minutes from the current time.
 * @returns Adjusted date object.
 */
export declare function minutesFromNow(minutes: number): Date;
/**
 * Adjust pressure to sea level using the barometric formula.
 * @param pressure Pressure in Pascals.
 * @param height Altitude in meters.
 * @param temperature Temperature in Kelvin (default: 15°C in Kelvin).
 * @returns Adjusted pressure at sea level.
 */
export declare function adjustPressureToSeaLevel(pressure: number, height: number, temperature?: number): number;
/**
 * Filter pressures recorded since a given number of minutes ago.
 * @param pressures Array of pressure readings.
 * @param minutes Minutes from now.
 * @returns Filtered pressures.
 */
export declare function getPressuresSince(pressures: PressureReading[], minutes: number): PressureReading[];
/**
 * Check if a value is null or undefined.
 * @param value Value to check.
 * @returns True if null or undefined, false otherwise.
 */
export declare function isNullOrUndefined(value: any): value is null | undefined;
/**
 * Get the pressure closest to a given datetime.
 * @param pressures Array of pressure readings.
 * @param datetime Target datetime.
 * @returns Closest pressure reading or null if none found.
 */
export declare function getPressureClosestTo(pressures: PressureReading[], datetime: Date): PressureReading | null;
/**
 * Filter pressures within a specific time period.
 * @param pressures Array of pressure readings.
 * @param startTime Start of the period.
 * @param endTime End of the period.
 * @returns Pressures within the period.
 */
export declare function getPressuresByPeriod(pressures: PressureReading[], startTime: Date, endTime: Date): PressureReading[];
/**
 * Calculate the average pressure from an array of pressure readings.
 * @param pressures Array of pressure readings.
 * @returns Average pressure value.
 */
export declare function getPressureAverage(pressures: PressureReading[]): number;
/**
 * Determine if the current season is summer.
 * @param isNorthernHemisphere True if in the Northern Hemisphere.
 * @returns True if summer, false otherwise.
 */
export declare function isSummer(isNorthernHemisphere?: boolean): boolean;
/**
 * Convert Celsius to Kelvin.
 * @param celsius Temperature in Celsius.
 * @returns Temperature in Kelvin.
 */
export declare function toKelvinFromCelsius(celsius: number): number;
/**
 * Get the day of the year for a given date.
 * @param date Target date.
 * @returns Day of the year.
 */
export declare function getDayOfYear(date: Date): number;
/**
 * Get the 24-hour format hour of a given date.
 * @param date Target date.
 * @returns Hour in 24-hour format.
 */
export declare function get24HourFormat(date: Date): number;
/**
 * Validate if a latitude is within valid bounds.
 * @param latitude Latitude in decimal format.
 * @returns True if valid, false otherwise.
 */
export declare function isValidLatitude(latitude: number): boolean;
/**
 * Determine if a latitude is in the Northern Hemisphere.
 * @param latitude Latitude in decimal format.
 * @returns True if in the Northern Hemisphere, false otherwise.
 */
export declare function isNorthernHemisphere(latitude: number | null): boolean;
//# sourceMappingURL=utils.d.ts.map