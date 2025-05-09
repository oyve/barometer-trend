//const FrontAnalyzer = require("./predictions/front");

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

function minutesDifference(datetime1, datetime2) {
    let difference = Math.abs(new Date(datetime1) - new Date(datetime2)) / 60000;
    return difference;
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

function getAverageValue(readings, selector) {
    if (!readings.length) return null;

    const validValues = readings
        .map(selector)
        .filter(v => typeof v === 'number');

    if (!validValues.length) return null;

    const sum = validValues.reduce((acc, v) => acc + v, 0);
    return sum / validValues.length;
}

function makeStars(full, total) {
    const fullStar = '★';
    const emptyStar = '☆';

    return fullStar.repeat(full) + emptyStar.repeat(total - full);
}

function getThreeStarRating(percentage) {
    const totalStars = 3;
    const stars = [];
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

function getDataQualityRating(percentage)
{
    const qualityIntervals = [
        { level: 1, label: 'poor', threshold: 33 },
        { level: 2, label: 'moderate', threshold: 66 },
        { level: 3, label: 'good', threshold: 100 },
    ];

    const defaultInterval = qualityIntervals[0];

    return qualityIntervals.sort((a, b) => a.threshold > b.threshold).find(i => percentage >= i.threshold) || defaultInterval;
}

module.exports = {
    isNullOrUndefined,
    minutesFromNow,
    minutesFrom,
    minutesDifference,
    isSummer,
    getDayOfYear,
    get24HourFormat,
    isValidLatitude,
    isNorthernHemisphere,
    getAverageValue,
    makeStars,
    getThreeStarRating,
    getDataQualityRating,
    MINUTES,
    KELVIN,
};