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

export const MINUTES = {
    ONE_HOUR: 60,
    THREE_HOURS: 60 * 3,
    FORTYEIGHT_HOURS: 60 * 48,
};

export const KELVIN = 273.15;

/**
 * Get a date object adjusted by a given number of minutes.
 * @param minutes Minutes from the current time.
 * @returns Adjusted date object.
 */
export function minutesFromNow(minutes: number): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}

/**
 * Adjust pressure to sea level using the barometric formula.
 * @param pressure Pressure in Pascals.
 * @param height Altitude in meters.
 * @param temperature Temperature in Kelvin (default: 15°C in Kelvin).
 * @returns Adjusted pressure at sea level.
 */
export function adjustPressureToSeaLevel(pressure: number, height: number, temperature: number = toKelvinFromCelsius(15)): number {
    if (!Number.isFinite(pressure) || !Number.isFinite(height) || !Number.isFinite(temperature)) {
        throw new Error("Invalid input for pressure, height, or temperature.");
    }

    const tempCelsius = temperature - KELVIN;
    const seaLevelPressure = pressure * Math.pow(1 - (0.0065 * height) / (tempCelsius + 0.0065 * height + KELVIN), -5.257);
    return Math.round(seaLevelPressure);
}

/**
 * Filter pressures recorded since a given number of minutes ago.
 * @param pressures Array of pressure readings.
 * @param minutes Minutes from now.
 * @returns Filtered pressures.
 */
export function getPressuresSince(pressures: PressureReading[], minutes: number): PressureReading[] {
    const earlier = minutesFromNow(-Math.abs(minutes));
    return pressures.filter((p) => p.datetime.getTime() >= earlier.getTime());
}

/**
 * Check if a value is null or undefined.
 * @param value Value to check.
 * @returns True if null or undefined, false otherwise.
 */
export function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined;
}

/**
 * Get the pressure closest to a given datetime.
 * @param pressures Array of pressure readings.
 * @param datetime Target datetime.
 * @returns Closest pressure reading or null if none found.
 */
export function getPressureClosestTo(pressures: PressureReading[], datetime: Date): PressureReading | null {
    if (!Array.isArray(pressures) || !(datetime instanceof Date)) {
        throw new Error("Invalid input for pressures or datetime.");
    }

    let previous: PressureReading | null = null;
    let next: PressureReading | null = null;

    for (const p of pressures) {
        if (p.datetime.getTime() <= datetime.getTime()) previous = p;
        if (p.datetime.getTime() >= datetime.getTime()) {
            next = p;
            break;
        }
    }

    if (isNullOrUndefined(next) && isNullOrUndefined(previous)) return null;
    if (isNullOrUndefined(next)) return previous;
    if (isNullOrUndefined(previous)) return next;

    const diffNext = Math.abs(next!.datetime.getTime() - datetime.getTime());
    const diffPrevious = Math.abs(previous!.datetime.getTime() - datetime.getTime());

    return diffNext < diffPrevious ? next! : previous!;
}

/**
 * Filter pressures within a specific time period.
 * @param pressures Array of pressure readings.
 * @param startTime Start of the period.
 * @param endTime End of the period.
 * @returns Pressures within the period.
 */
export function getPressuresByPeriod(pressures: PressureReading[], startTime: Date, endTime: Date): PressureReading[] {
    if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
        throw new Error("Invalid input for startTime or endTime.");
    }

    return pressures.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
}

/**
 * Calculate the average pressure from an array of pressure readings.
 * @param pressures Array of pressure readings.
 * @returns Average pressure value.
 */
export function getPressureAverage(pressures: PressureReading[]): number {
    if (!Array.isArray(pressures) || pressures.length === 0) {
        throw new Error("Invalid input for pressures.");
    }

    const sum = pressures.reduce((acc, p) => acc + p.calculated.pressureASL, 0);
    return sum / pressures.length;
}

/**
 * Determine if the current season is summer.
 * @param isNorthernHemisphere True if in the Northern Hemisphere.
 * @returns True if summer, false otherwise.
 */
export function isSummer(isNorthernHemisphere: boolean = true): boolean {
    const month = new Date().getMonth() + 1; // Months are 0-indexed
    const summer = month >= 4 && month <= 9; // April to September
    return isNorthernHemisphere ? summer : !summer;
}

/**
 * Convert Celsius to Kelvin.
 * @param celsius Temperature in Celsius.
 * @returns Temperature in Kelvin.
 */
export function toKelvinFromCelsius(celsius: number): number {
    return celsius + KELVIN;
}

/**
 * Get the day of the year for a given date.
 * @param date Target date.
 * @returns Day of the year.
 */
export function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get the 24-hour format hour of a given date.
 * @param date Target date.
 * @returns Hour in 24-hour format.
 */
export function get24HourFormat(date: Date): number {
    return date.getHours();
}

/**
 * Validate if a latitude is within valid bounds.
 * @param latitude Latitude in decimal format.
 * @returns True if valid, false otherwise.
 */
export function isValidLatitude(latitude: number): boolean {
    return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

/**
 * Determine if a latitude is in the Northern Hemisphere.
 * @param latitude Latitude in decimal format.
 * @returns True if in the Northern Hemisphere, false otherwise.
 */
export function isNorthernHemisphere(latitude: number | null): boolean {
    if (latitude === null) return true; // Default to Northern Hemisphere
    return latitude > 0;
}