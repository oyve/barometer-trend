const MAX_RATIO = 9999;
const MIN_RATIO = -9999;

const BEAUFORT_RATIOS = [
    { low: 2.67, high: 3.33, force: "F6-7", min: 6, max: 7, description: "Strong breeze to near gale" },
    { low: 3.33, high: 5.5, force: "F8-9", min: 8, max: 9, description: "Gale to strong gale" },
    { low: 5.5, high: MAX_RATIO, force: "F10+", min: 10, max: 12, description: "Storm or more" },
    { low: -3.33, high: -1.67, force: "F6-7", min: 6, max: 7, description: "Strong breeze to near gale" },
    { low: MIN_RATIO, high: -3.33, force: "F8-12", min: 8, max: 12, description: "Gale or violent storm conditions" },
];

/**
 * Get the Beaufort scale object based on wind speed (measured at a 10 minutes average to be correct).
 * @param {number} windSpeed - Wind speed in meters per second (m/s).
 * @returns {BeaufortScale | null} - Beaufort scale object or null if not found.
 */
function getBeaufortScaleByWindSpeed(windSpeed) {
    if(windSpeed === undefined || windSpeed === null) return null;
    if(windSpeed < 0) throw new Error('Wind speed cannot be negative.');
    windSpeed = Math.round(windSpeed * 10) / 10; //to 1 decimal place
    
    const beaufortScale = [
        { min: 0, max: 0.2, category: 'Calm', force: 0 },
        { min: 0.3, max: 1.5, category: 'Light Air', force: 1 },
        { min: 1.6, max: 3.3, category: 'Light Breeze', force: 2 },
        { min: 3.4, max: 5.4, category: 'Gentle Breeze', force: 3 },
        { min: 5.5, max: 7.9, category: 'Moderate Breeze', force: 4 },
        { min: 8, max: 10.7, category: 'Fresh Breeze', force: 5 },
        { min: 10.8, max: 13.8, category: 'Strong Breeze', force: 6 },
        { min: 13.9, max: 17.1, category: 'Near Gale', force: 7 },
        { min: 17.2, max: 20.7, category: 'Gale', force: 8 },
        { min: 20.8, max: 24.4, category: 'Strong Gale', force: 9 },
        { min: 24.5, max: 28.4, category: 'Storm', force: 10 },
        { min: 28.5, max: 32.6, category: 'Violent Storm', force: 11 },
        { min: 32.7, max: 37.1, category: 'Hurricane Force', force: 12 },
        //there are no official Beaufort category names for the extended scale beyond force 12
        { min: 37.2, max: 41.4, category: 'Strong Cyclonic Storm', force: 13 },
        { min: 41.5, max: 46.1, category: 'Severe Cyclonic Storm', force: 14 },
        { min: 46.2, max: 50.9, category: 'Violent Cyclone', force: 15 },
        { min: 51.0, max: 55.9, category: 'Extreme Cyclone', force: 16 },
        { min: 56.0, max: Infinity, category: 'Supreme Cyclone', force: 17 },
    ];

    return beaufortScale.find((entry) => windSpeed >= entry.min && windSpeed <= entry.max) || { min: 0, max: 0, category: 'N/A', force: -1 };
}

/**
 * Get Beaufort scale details by pressure variation ratio
 * @param {number} ratio - The pressure variation ratio
 * @returns {Object} Beaufort scale details
 */
function getByPressureVariationRatio(ratio) {
    try {
        let beaufort = BEAUFORT_RATIOS.find((b) => ratio <= b.high && ratio >= b.low);
        return beaufort !== undefined ?
            { force: beaufort.force, min: beaufort.min, max: beaufort.max, description: beaufort.description } :
            { force: "Less than F6", min: 0, max: 6, description: "Less than a strong breeze" };
    } catch (error) {
        console.error("Error in getByPressureVariationRatio: ", error);
        return { force: "Unknown", min: 0, max: 0, description: "Unknown conditions" };
    }
}

function forecast(ratio, windSpeed) {
    return {
        byPressure: getByPressureVariationRatio(ratio),
        byWind: getBeaufortScaleByWindSpeed(windSpeed)
    };
}

module.exports = {
    getByPressureVariationRatio,
    getBeaufortScaleByWindSpeed,
    forecast
};