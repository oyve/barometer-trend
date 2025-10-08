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

export function minutesFrom(datetime: Date, minutes: number): Date {
    const newDate = new Date(datetime);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
}

export function minutesDifference(datetime1: Date, datetime2: Date): number {
    const difference = Math.abs(new Date(datetime1).getTime() - new Date(datetime2).getTime()) / 60000;
    return difference;
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

export function getAverageValue<T>(readings: T[], selector: (item: T) => number | null | undefined): number | null {
    if (!readings.length) return null;

    const validValues = readings
        .map(selector)
        .filter((v): v is number => typeof v === 'number');

    if (!validValues.length) return null;

    const sum = validValues.reduce((acc, v) => acc + v, 0);
    return sum / validValues.length;
}

export function makeStars(full: number, total: number): string {
    const fullStar = '★';
    const emptyStar = '☆';

    return fullStar.repeat(full) + emptyStar.repeat(total - full);
}

export function getThreeStarRating(percentage: number): string {
    const totalStars = 3;
    const stars: string[] = [];
    let rating = (percentage / 100) * totalStars;
  
    for (let i = 0; i < totalStars; i++) {
      if (rating >= 1) {
        stars.push('★');
      } else if (rating >= 0.5) {
        stars.push('⯨');
      } else {
        stars.push('✩');
      }
      rating -= 1;
    }
  
    return stars.join('');
}

interface DataQualityRating {
    level: number;
    label: string;
    threshold: number;
}

export function getDataQualityRating(percentage: number): DataQualityRating {
    const qualityIntervals: DataQualityRating[] = [
        { level: 1, label: 'poor', threshold: 33 },
        { level: 2, label: 'moderate', threshold: 66 },
        { level: 3, label: 'good', threshold: 100 },
    ];

    const defaultInterval = qualityIntervals[0];

    return qualityIntervals.sort((a, b) => a.threshold - b.threshold).find(i => percentage <= i.threshold) || defaultInterval;
}
