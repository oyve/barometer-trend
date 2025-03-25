const utils = require('../utils');
const system = require('./system');

// Function to calculate seasonal adjustment based on solar declination
function calculateSolarDeclination(dayOfYear) {
    const epsilon = 23.44 * Math.PI / 180; // Earth's axial tilt in radians
    const omega = (2 * Math.PI / 365) * (dayOfYear - 81); // Earth’s orbital angle
    return epsilon * Math.sin(omega); // Solar declination in radians
}

function getSeasonalAdjustment(dayOfYear, lat) {
    const declination = calculateSolarDeclination(dayOfYear);
    const angle = Math.asin(Math.sin(lat * Math.PI / 180) * Math.sin(declination));
    return 1 + 0.2 * Math.sin(angle); // Modulate amplitude based on latitude and solar declination
}

// Diurnal pressure data with base amplitudes and adjusted 4-peak cycle (6-hour periodicity)
const diurnalPressureData = {
    tropics: { latRange: [0, 23.5], baseAmplitude: 350, peakTimes: [4, 10, 16, 22] },
    subtropics: { latRange: [23.5, 30], baseAmplitude: 250, peakTimes: [4, 10, 16, 22] },
    midLatitudes: { latRange: [30, 60], baseAmplitude: 150, peakTimes: [4, 10, 16, 22] },
    highMidLatitudes: { latRange: [60, 70], baseAmplitude: 100, peakTimes: [4, 10, 16, 22] },
    polar: { latRange: [70, 90], baseAmplitude: 50, peakTimes: [4, 10, 16, 22] },
};

function getDiurnalVariation(latitude) {
    for (const region in diurnalPressureData) {
        const { latRange } = diurnalPressureData[region];
        if (latitude >= latRange[0] && latitude < latRange[1]) {
            return diurnalPressureData[region];
        }
    }
    return { amplitude: 0, peakTimes: [0, 0, 0, 0] }; // Default for unexpected values
}

function getRegionByLatitude(latitude) {
    for (const region in diurnalPressureData) {
        const { latRange } = diurnalPressureData[region];
        if (latitude >= latRange[0] && latitude < latRange[1]) {
            return region;
        }
    }
    return 'unknown';
}

function getWeatherAnomaly(weatherSystem, lat) {
    const anomalies = {
        tropics: { HIGH: 300, LOW: -200, BETWEEN: 50 },
        subtropics: { HIGH: 400, LOW: -300, BETWEEN: 50 },
        midLatitudes: { HIGH: 500, LOW: -400, BETWEEN: 50 },
        highMidLatitudes: { HIGH: 600, LOW: -500, BETWEEN: 50 },
        polar: { HIGH: 700, LOW: -600, BETWEEN: 50 },
    };

    const region = getRegionByLatitude(lat);
    return anomalies[region]?.[weatherSystem] || 0;
}

/**
 * Correct observed atmospheric pressure for diurnal variations and weather anomalies.
 * @param {number} pressureObserved - Observed pressure in pascals.
 * @param {number} latitude - Latitude of the observation.
 * @param {Date} date - Date and time of the observation.
 * @returns {number} Pressure corrected by diurnal rhythm and weather anomaly.
 */
function correctPressure(pressureObserved, latitude, date) {
    if (pressureObserved <= 0) throw new Error("Invalid pressure value");
    if (!utils.isValidLatitude(latitude)) throw new Error("Invalid latitude value");

    const time = utils.get24HourFormat(date);
    const dayOfYear = utils.getDayOfYear(date);

    // Get diurnal variation data and apply seasonal adjustment
    const variationData = getDiurnalVariation(Math.abs(latitude));
    const { baseAmplitude, peakTimes } = variationData;
    const seasonalFactor = getSeasonalAdjustment(dayOfYear, latitude);
    const amplitude = baseAmplitude * seasonalFactor;

    // Calculate pressure correction based on 4 peaks (6-hour periodicity)
    let correctionFactor = 0;
    for (const peakTime of peakTimes) {
        const hoursFromPeak = (time - peakTime + 24) % 24;
        correctionFactor += amplitude * Math.cos((2 * Math.PI * hoursFromPeak) / 24);
    }
    correctionFactor /= peakTimes.length; // Normalize correction factor

    // Apply weather anomaly based on system type
    const pressureSystem = system.getSystemByPressure(pressureObserved - correctionFactor);
    const anomaly = getWeatherAnomaly(pressureSystem.short, latitude);

    return Math.round(pressureObserved - correctionFactor + anomaly);
}

module.exports = { correctPressure };
