const utils = require('../utils');

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

// Diurnal pressure data with base amplitudes (without seasonal adjustment)
const diurnalPressureData = {
    tropics: { latRange: [0, 23.5], baseAmplitude: 350, peakTimes: [10, 16] },
    subtropics: { latRange: [23.5, 30], baseAmplitude: 250, peakTimes: [11, 17] },
    midLatitudes: { latRange: [30, 60], baseAmplitude: 150, peakTimes: [12, 18] },
    highMidLatitudes: { latRange: [60, 70], baseAmplitude: 100, peakTimes: [13, 19] },
    polar: { latRange: [70, 90], baseAmplitude: 50, peakTimes: [14, 20] },
};

function getDiurnalVariation(latitude) {
    if (latitude >= 0 && latitude < 23.5) return diurnalPressureData.tropics;
    if (latitude >= 23.5 && latitude < 30) return diurnalPressureData.subtropics;
    if (latitude >= 30 && latitude < 60) return diurnalPressureData.midLatitudes;
    if (latitude >= 60 && latitude < 70) return diurnalPressureData.highMidLatitudes;
    if (latitude >= 70 && latitude <= 90) return diurnalPressureData.polar;
    return { amplitude: 0, peakTimes: [0, 0] }; // Default for unexpected values
}

// Simplified function to return a weather anomaly based on the input weather system ("high" or "low")
function getRegionByLatitude(latitude) {
    if (latitude >= 0 && latitude < 23.5) return 'tropics';
    if (latitude >= 23.5 && latitude < 30) return 'subtropics';
    if (latitude >= 30 && latitude < 60) return 'midLatitudes';
    if (latitude >= 60 && latitude < 75) return 'highMidLatitudes';
    if (latitude >= 75 && latitude <= 90) return 'polar';
    return 'unknown';
}

function getWeatherAnomaly(weatherSystem, lat) {
    const region = getRegionByLatitude(lat);
    let anomaly = 0;

    if (weatherSystem === 'high') {
        if (region === 'tropics') anomaly = 300;
        else if (region === 'subtropics') anomaly = 400;
        else if (region === 'midLatitudes') anomaly = 500;
        else if (region === 'highMidLatitudes') anomaly = 600;
        else if (region === 'polar') anomaly = 700;
    } else if (weatherSystem === 'low') {
        if (region === 'tropics') anomaly = -200;
        else if (region === 'subtropics') anomaly = -300;
        else if (region === 'midLatitudes') anomaly = -400;
        else if (region === 'highMidLatitudes') anomaly = -500;
        else if (region === 'polar') anomaly = -600;
    }

    return anomaly;
}

function correctPressure(pressureObserved, latitude, date) {
    const time = utils.get24HourFormat(date);
    const dayOfYear = utils.getDayOfYear(date);
    
    // Get the basic diurnal variation data
    const variationData = getDiurnalVariation(Math.abs(latitude), dayOfYear);
    const { baseAmplitude, peakTimes } = variationData;

    // Apply seasonal adjustment based on the solar declination
    const seasonalFactor = getSeasonalAdjustment(dayOfYear, latitude);
    const amplitude = baseAmplitude * seasonalFactor;

    // Get weather system anomaly (high- or low-pressure system)
    let weatherSystem = 'low'
    const weatherAnomaly = getWeatherAnomaly(weatherSystem, latitude);

    // Calculate pressure correction for each peak time
    let correctionFactor = 0;
    for (let peakTime of peakTimes) {
        const hoursFromPeak = (time - peakTime + 24) % 24;
        correctionFactor += amplitude * Math.cos((2 * Math.PI * hoursFromPeak) / 12);
    }

    // Normalize the correction factor by the number of peaks
    correctionFactor /= peakTimes.length;

    // Apply the weather anomaly (either increase or decrease pressure)
    const finalPressure = pressureObserved - correctionFactor + weatherAnomaly;
    return finalPressure;
}

module.exports = {
	correctPressure
}

// Example usage:
// const lat = 45; // Latitude
// const lon = -80; // Longitude
// const time = 14; // Local time in hours (24-hour format)
// const observedPressure = 101500; // Example barometer reading in Pa (already corrected for altitude)
// const dayOfYear = 172; // Day of year (e.g., June 21st is the 172nd day)
// const weatherSystem = 'high'; // Weather system: 'high' or 'low'

// const correctedPressure = correctPressure(observedPressure, lat, lon, time, dayOfYear, weatherSystem);
// console.log(`Corrected Pressure: ${correctedPressure.toFixed(2)} Pa`);
