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

/**
 * Adjust pressure to sea level using the barometric formula.
 * @param {number} pressure Pressure in Pascals.
 * @param {number} height Altitude in meters.
 * @param {number} temperature Temperature in Kelvin (default: 15°C in Kelvin).
 * @returns {number} Adjusted pressure at sea level.
 */
function adjustPressureToSeaLevel(pressure, height, temperature = toKelvinFromCelsius(15)) {
    if (!Number.isFinite(pressure) || !Number.isFinite(height) || !Number.isFinite(temperature)) {
        throw new Error("Invalid input for pressure, height, or temperature.");
    }

    const tempCelsius = temperature - KELVIN;
    const seaLevelPressure = pressure * Math.pow(1 - (0.0065 * height) / (tempCelsius + 0.0065 * height + KELVIN), -5.257);
    return Math.round(seaLevelPressure);
}

/**
 * Filter pressures recorded since a given number of minutes ago.
 * @param {Array<Object>} pressures Array of pressure readings.
 * @param {number} minutes Minutes from now.
 * @returns {Array<Object>} Filtered pressures.
 */
function getPressuresSince(pressures, minutes) {
    const earlier = minutesFromNow(-Math.abs(minutes));
    return pressures.filter((p) => p.datetime.getTime() >= earlier.getTime());
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
 * Get the pressure closest to a given datetime.
 * @param {Array<Object>} pressures Array of pressure readings.
 * @param {Date} datetime Target datetime.
 * @returns {Object|null} Closest pressure reading or null if none found.
 */
function getPressureClosestTo(pressures, datetime) {
    if (!Array.isArray(pressures) || !(datetime instanceof Date)) {
        throw new Error("Invalid input for pressures or datetime.");
    }

    let previous = null;
    let next = null;

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

    const diffNext = Math.abs(next.datetime.getTime() - datetime.getTime());
    const diffPrevious = Math.abs(previous.datetime.getTime() - datetime.getTime());

    return diffNext < diffPrevious ? next : previous;
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
 * Calculate the average pressure from an array of pressure readings.
 * @param {Array<Object>} pressures Array of pressure readings.
 * @returns {number} Average pressure value.
 */
function getPressureAverage(pressures) {
    if (!Array.isArray(pressures) || pressures.length === 0) {
        throw new Error("Invalid input for pressures.");
    }

    const sum = pressures.reduce((acc, p) => acc + p.calculated.pressureASL, 0);
    return sum / pressures.length;
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
 * Convert Celsius to Kelvin.
 * @param {number} celsius Temperature in Celsius.
 * @returns {number} Temperature in Kelvin.
 */
function toKelvinFromCelsius(celsius) {
    return celsius + KELVIN;
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

const lapseRate = 0.0065;

/**
 * 
 * @param {number} observedTemperature Temperature in Celsius.
 * @param {number} altitude Altitude in meters.
 * @returns 
 */
function getApproxSeaLevelTemperature(observedTemperature, altitude) {
    return observedTemperature + lapseRate * altitude;
}

function calculateDynamicLapseRate(readings, hours = 24) {
    // Filter readings to the last X hours
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalLapseRate = 0;
    let count = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].temperature; // Temperature in Kelvin
        const altitude1 = filteredReadings[i - 1].altitude; // Altitude in meters
        const T2 = filteredReadings[i].temperature; // Temperature in Kelvin
        const altitude2 = filteredReadings[i].altitude; // Altitude in meters

        if (altitude2 !== altitude1) {
            const lapseRate = (T2 - T1) / (altitude2 - altitude1); // K/m
            totalLapseRate += lapseRate;
            count++;
        }
    }

    return count > 0 ? totalLapseRate / count : 0.0065; // Default to standard lapse rate if no data
}

function adjustPressureWithDynamicLapseRate(pressure, altitude, temperature, lapseRate) {
    const g = 9.80665; // Gravitational acceleration (m/s²)
    const R = 287.05; // Specific gas constant for dry air (J/(kg·K))

    if (lapseRate > 0) {
        // Handle temperature inversion
        const Tavg = temperature + (lapseRate * altitude) / 2; // Average temperature
        return pressure * Math.exp((g * altitude) / (R * Tavg));
    } else {
        // Standard formula
        return pressure * Math.pow(1 - (lapseRate * altitude) / temperature, -g / (R * lapseRate));
    }
}

function filterReadingsByTimeRange(readings, hours) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000; // Convert hours to milliseconds
    return readings.filter((reading) => reading.datetime.getTime() >= cutoffTime);
}

function calculateWeightedAverageTemperature(readings, hours = 24) {
    // Filter readings to the last X hours
    const filteredReadings = filterReadingsByTimeRange(readings, hours);

    let totalWeight = 0;
    let weightedSum = 0;

    for (let i = 1; i < filteredReadings.length; i++) {
        const T1 = filteredReadings[i - 1].meta.temperature; // Temperature in Kelvin
        const altitude1 = filteredReadings[i - 1].meta.altitude; // Altitude in meters
        const T2 = filteredReadings[i].meta.temperature; // Temperature in Kelvin
        const altitude2 = filteredReadings[i].meta.altitude; // Altitude in meters

        const weight = Math.abs(altitude2 - altitude1); // Altitude difference as weight
        const averageTemperature = (T1 + T2) / 2;

        weightedSum += averageTemperature * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : readings[0]?.meta.temperature || 288.15; // Default to 15°C in Kelvin if no data
}

function detectTemperatureInversion(T1, altitude1, T2, altitude2) {
    const lapseRate = (T2 - T1) / (altitude2 - altitude1); // K/m
    return lapseRate > 0; // Returns true if inversion is detected
}

function adjustPressureToSeaLevelWithHistoricalData(pressure, altitude, readings, hours = 24) {
    // Calculate dynamic lapse rate using recent readings
    const dynamicLapseRate = calculateDynamicLapseRate(readings, hours);

    // Calculate weighted average temperature using recent readings
    const weightedAverageTemperature = calculateWeightedAverageTemperature(readings, hours);

    // Adjust pressure using the improved formula
    return adjustPressureWithDynamicLapseRate(pressure, altitude, weightedAverageTemperature, dynamicLapseRate);
}

module.exports = {
    isNullOrUndefined,
    minutesFromNow,
    getPressuresSince,
    isSummer,
    adjustPressureToSeaLevel,
    toKelvinFromCelsius,
    getPressureClosestTo,
    getPressuresByPeriod,
    getPressureAverage,
    getDayOfYear,
    get24HourFormat,
    isValidLatitude,
    isNorthernHemisphere,
    getApproxSeaLevelTemperature,
    adjustPressureToSeaLevelWithHistoricalData,
    MINUTES,
    KELVIN,
};