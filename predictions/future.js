function estimateFutureParameters(P1, T1, P2, hours, humidity, latitude, windSpeed = 0, solarRadiation = null) {
    // Constants
    const lapseRate = 6.5; // Dry adiabatic lapse rate in °C per kilometer
    const seaLevelPressure = 1013.25; // Standard atmospheric pressure in hPa
    const solarEffectFactor = 0.005; // Temperature increase per W/m² (rough estimate)
    const windEffectFactor = 0.01; // Temperature change per m/s of wind (rough estimate)
    
    // Calculate altitude change from pressure difference (using barometric formula)
    let altitudeChange = (Math.log(P1 / P2) * 44330);  // Calculate altitude difference (meters)
    let temperatureChange = (altitudeChange / 1000) * lapseRate;  // Apply lapse rate for temperature change

    // Time factor to adjust for longer/shorter prediction (based on pressure change rate)
    let timeFactor = hours / 6;

    // Adjust temperature change based on humidity
    let humidityFactor = 1;
    if (humidity > 80) {
        humidityFactor = 0.5; // Slow temperature change when humidity is high
    } else if (humidity < 30) {
        humidityFactor = 1.5; // Faster temperature change in dry air
    }

    // Adjust temperature based on wind speed
    let windFactor = windSpeed * windEffectFactor;
    
    // Calculate the future temperature change with time factor, humidity, and wind adjustment
    let futureTemperatureChange = temperatureChange * timeFactor * humidityFactor + windFactor;

    // Estimate solar radiation effects if provided
    let futureSolarRadiation = null;
    if (solarRadiation !== null) {
        futureSolarRadiation = solarRadiation * timeFactor;  // Adjust solar radiation based on time
        futureTemperatureChange += solarRadiation * solarEffectFactor * timeFactor;
    } else {
        // Estimate time of day based on latitude (simplified model)
        let currentHour = (latitude >= -23.5 && latitude <= 23.5) ? 12 : 6;  // Summer vs Winter (approx)
        if (currentHour >= 6 && currentHour <= 18) {
            let solarEstimate = 200 * (currentHour - 6);  // Rough estimate of solar radiation between 6 AM and 6 PM
            futureSolarRadiation = solarEstimate * timeFactor;
            futureTemperatureChange += solarEstimate * solarEffectFactor * timeFactor;
        }
    }

    // Estimate the future pressure
    let futurePressure = P1 - (altitudeChange / 100);  // Simplified formula for pressure drop with altitude change

    // Estimate the future humidity (approximating based on temperature and pressure change)
    let futureHumidity = humidity + (temperatureChange * 0.2);  // Adjust humidity by a factor based on temperature change

    // Estimate the future wind speed (assuming wind speed is constant unless specified)
    let futureWindSpeed = windSpeed;  // No wind change assumption

    // Package the results into a JSON array
    return {
        futureTemperature: T1 + futureTemperatureChange,  // Estimated future temperature
        futurePressure: futurePressure,  // Estimated future pressure
        futureHumidity: Math.min(100, Math.max(0, futureHumidity)),  // Estimated future humidity (0 to 100%)
        futureWindSpeed: futureWindSpeed,  // Future wind speed (constant unless changed)
        futureSolarRadiation: futureSolarRadiation  // Estimated solar radiation (if applicable)
    };
}

// Example usage:
let P1 = 1015;  // Current pressure in hPa
let T1 = 25;    // Current temperature in °C
let P2 = 1005;  // Future pressure in hPa
let hours = 6;  // Time in hours for prediction
let humidity = 50;  // Relative humidity in percentage
let latitude = 35;  // Latitude in degrees
let windSpeed = 5;  // Wind speed in m/s (optional)
let solarRadiation = null;  // Solar radiation, if not provided, time of day is used

// Estimate multiple parameters
let result = estimateFutureParameters(P1, T1, P2, hours, humidity, latitude, windSpeed, solarRadiation);
console.log(result);
