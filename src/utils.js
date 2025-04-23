// const {humidity} = require('weather-formulas');

const MINUTES = {
    ONE_HOUR: 60,
    THREE_HOURS: 60 * 3,
    FORTYEIGHT_HOURS: 60 * 48,
};

const KELVIN = 273.15;

/**
 * Get a date object adjusted by a given number of minutes.
 * @param {number} minutes Minutes from the current time.
 * @returns {Date} Adjusted date object.
 */
function minutesFromNow(minutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
}

function minutesFrom(datetime, minutes) {
    datetime.setMinutes(datetime.getMinutes() + minutes);
    return now;
}

/**
 * Check if a value is null or undefined.
 * @param {*} value Value to check.
 * @returns {boolean} True if null or undefined, false otherwise.
 */
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

/**
 * Filter pressures within a specific time period.
 * @param {Array<Object>} pressures Array of pressure readings.
 * @param {Date} startTime Start of the period.
 * @param {Date} endTime End of the period.
 * @returns {Array<Object>} Pressures within the period.
 */
function getPressuresByPeriod(pressures, startTime, endTime) {
    if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
        throw new Error("Invalid input for startTime or endTime.");
    }

    return pressures.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
}

/**
 * Determine if the current season is summer.
 * @param {boolean} isNorthernHemisphere True if in the Northern Hemisphere.
 * @returns {boolean} True if summer, false otherwise.
 */
function isSummer(isNorthernHemisphere = true) {
    const month = new Date().getMonth() + 1; // Months are 0-indexed
    const summer = month >= 4 && month <= 9; // April to September
    return isNorthernHemisphere ? summer : !summer;
}

/**
 * Get the day of the year for a given date.
 * @param {Date} date Target date.
 * @returns {number} Day of the year.
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get the 24-hour format hour of a given date.
 * @param {Date} date Target date.
 * @returns {number} Hour in 24-hour format.
 */
function get24HourFormat(date) {
    return date.getHours();
}

/**
 * Validate if a latitude is within valid bounds.
 * @param {number} latitude Latitude in decimal format.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidLatitude(latitude) {
    return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

/**
 * Determine if a latitude is in the Northern Hemisphere.
 * @param {number|null} latitude Latitude in decimal format.
 * @returns {boolean} True if in the Northern Hemisphere, false otherwise.
 */
function isNorthernHemisphere(latitude) {
    if (latitude === null) return true; // Default to Northern Hemisphere
    return latitude > 0;
}

module.exports = {
    isNullOrUndefined,
    minutesFromNow,
    minutesFrom,
    isSummer,
    getPressuresByPeriod,
    getDayOfYear,
    get24HourFormat,
    isValidLatitude,
    isNorthernHemisphere,
    MINUTES,
    KELVIN,
};