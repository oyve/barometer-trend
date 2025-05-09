const utils = require('../utils');
const system = require('./system');

// Function to calculate seasonal adjustment based on solar declination
function calculateSolarDeclination(dayOfYear) {
    const epsilon = 23.44 * Math.PI / 180; // Earth's axial tilt in radians
    const omega = (2 * Math.PI / 365) * (dayOfYear - 81); // Earth’s orbital angle
    return epsilon * Math.sin(omega); // Solar declination in radians
}

/**
 * Get seasonal adjustment factor based on day of the year and latitude.
 * @param {number} dayOfYear - Day of the year (1-365).
 * @param {number} latitude - Latitude in decimal degrees.
 * @returns {number} Seasonal adjustment factor.
 */
function getSeasonalAdjustment(dayOfYear, latitude) {
    const declination = calculateSolarDeclination(dayOfYear);
    const angle = Math.asin(Math.sin(latitude * Math.PI / 180) * Math.sin(declination));
    const adjustmentFactor = 1 + 0.25 * Math.sin(angle); // Increased modulation for better accuracy
    return Math.max(0.8, Math.min(1.2, adjustmentFactor)); // Clamp the adjustment factor to avoid extreme values
}

// Diurnal pressure data with base amplitudes and adjusted 4-peak cycle (6-hour periodicity)
const diurnalPressureData = {
    tropics: { latRange: [0, 23.5], baseAmplitude: 350, peakTimes: [4, 10, 16, 22] },
    subtropics: { latRange: [23.5, 30], baseAmplitude: 250, peakTimes: [5, 11, 17, 23] },
    midLatitudes: { latRange: [30, 60], baseAmplitude: 150, peakTimes: [6, 12, 18, 0] },
    highMidLatitudes: { latRange: [60, 70], baseAmplitude: 100, peakTimes: [7, 13, 19, 1] },
    polar: { latRange: [70, 90], baseAmplitude: 50, peakTimes: [8, 14, 20, 2] },
};

/**
 * Get diurnal variation data based on latitude.
 * @param {number} latitude - Latitude in decimal degrees.
 * @returns {Object} Diurnal variation data for the region.
 */
function getDiurnalVariation(latitude) {
    for (const region in diurnalPressureData) {
        const { latRange } = diurnalPressureData[region];
        if (latitude >= latRange[0] && latitude < latRange[1]) {
            return diurnalPressureData[region];
        }
    }
    return { baseAmplitude: 0, peakTimes: [0, 0, 0, 0] }; // Default for unexpected values
}

/**
 * Get weather anomaly based on the weather system and latitude.
 * @param {string} weatherSystem - Weather system type (e.g., HIGH, LOW, BETWEEN).
 * @param {number} latitude - Latitude in decimal degrees.
 * @param {number} pressureObserved - Observed pressure in pascals.
 * @returns {number} Weather anomaly adjustment.
 */
function getWeatherAnomaly(weatherSystem, latitude, pressureObserved) {
    const anomalies = {
        tropics: { HIGH: 300, LOW: -200, NORMAL: 50 },
        subtropics: { HIGH: 400, LOW: -300, NORMAL: 50 },
        midLatitudes: { HIGH: 500, LOW: -400, NORMAL: 50 },
        highMidLatitudes: { HIGH: 600, LOW: -500, NORMAL: 50 },
        polar: { HIGH: 700, LOW: -600, NORMAL: 50 },
    };

    const region = Object.keys(diurnalPressureData).find((key) => {
        const { latRange } = diurnalPressureData[key];
        return latitude >= latRange[0] && latitude < latRange[1];
    });

    const baseAnomaly = anomalies[region]?.[weatherSystem] || 0;

    // Scale anomaly based on pressure deviation
    const meanPressure = 101325; // Standard atmospheric pressure in Pascals
    const pressureDeviation = pressureObserved - meanPressure;
    const scaledAnomaly = baseAnomaly + 0.1 * pressureDeviation;

    return scaledAnomaly;
}

/**
 * Correct observed atmospheric pressure for diurnal variations and weather anomalies.
 * @param {number} pressureObserved - Observed pressure in pascals.
 * @param {number} latitude - Latitude of the observation.
 * @param {Date} date - Date and time of the observation.
 * @returns {Object} Corrected pressure and metadata.
 */
function correctPressure(pressureObserved, latitude, date) {
    if (pressureObserved <= 0) throw new Error("Invalid pressure value");
    if (!utils.isValidLatitude(latitude)) throw new Error("Invalid latitude value");

    const time = utils.get24HourFormat(date); // 0-23
    const dayOfYear = utils.getDayOfYear(date);

    // Get diurnal variation data and apply seasonal adjustment
    const variationData = getDiurnalVariation(Math.abs(latitude));
    const { baseAmplitude, peakTimes } = variationData;
    const seasonalFactor = getSeasonalAdjustment(dayOfYear, latitude);
    const amplitude = baseAmplitude * seasonalFactor;

    // Find the closest peak time
    const closestPeakTime = peakTimes.reduce((closest, peakTime) => {
        const hoursFromPeak = (time - peakTime + 24) % 24;
        const closestHoursFromPeak = (time - closest + 24) % 24;

        // Normalize to range [-12, 12]
        const normalizedHoursFromPeak = hoursFromPeak > 12 ? hoursFromPeak - 24 : hoursFromPeak;
        const normalizedClosestHoursFromPeak = closestHoursFromPeak > 12 ? closestHoursFromPeak - 24 : closestHoursFromPeak;

        return Math.abs(normalizedHoursFromPeak) < Math.abs(normalizedClosestHoursFromPeak) ? peakTime : closest;
    }, peakTimes[0]);

    // Calculate correction factor based on the closest peak time
    const rawDifference = (time - closestPeakTime + 24) % 24;
    const signedHoursFromClosestPeak = rawDifference > 12
        ? rawDifference - 24
        : rawDifference;
    const twoPiOver24 = 2 * Math.PI / 24;
    const correctionFactor = amplitude * Math.cos(twoPiOver24 * signedHoursFromClosestPeak) * Math.sign(signedHoursFromClosestPeak);

    // // Debugging logs
    // console.log("Time:", time);
    // console.log("Closest Peak Time:", closestPeakTime);
    // console.log("Raw Difference (0-23):", rawDifference);
    // console.log("Signed Hours From Closest Peak:", signedHoursFromClosestPeak);
    // console.log("Cosine Value:", Math.cos(twoPiOver24 * signedHoursFromClosestPeak));
    // console.log("Correction Factor:", correctionFactor);

    // Apply weather anomaly based on system type
    const pressureSystem = system.getSystemByPressure(pressureObserved - correctionFactor);
    const anomaly = getWeatherAnomaly(pressureSystem.name, latitude, pressureObserved);

    return {
        correctedPressure: Math.round(pressureObserved - correctionFactor + anomaly),
        correctionFactor,
        anomaly,
        seasonalFactor,
    };
}

module.exports = { correctPressure };
