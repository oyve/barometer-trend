const regression = require('regression');
const ForecastBase = require('./forecastBase');
const { temperature: temperatureFormulas } = require('weather-formulas');

const riskArray = [
    { key: 0, text: "Low"},
    { key: 1, text: "Moderate"},
    { key: 2, text: "High"}
];

const regression = require('regression');  // For polynomial regression
const logisticRegression = require('ml-logistic-regression'); // Logistic Regression for binary classification

class AdvectionFogForecast {
  constructor(airTemps, seaTemps, humidities, windSpeeds, pressures, timesOfDay, seasons) {
    // Arrays of historical data for the last 3-48 hours
    this.airTemps = airTemps;       // Array of past air temps in °C
    this.seaTemps = seaTemps;       // Array of past sea temps in °C
    this.humidities = humidities;   // Array of past humidity values (%)
    this.windSpeeds = windSpeeds;   // Array of past wind speeds (knots)
    this.pressures = pressures;     // Array of past pressures (hPa)
    this.timesOfDay = timesOfDay;   // Array indicating the time of day (morning, afternoon, night)
    this.seasons = seasons;         // Array indicating the season (summer, winter, etc.)
  }

  // Calculate temperature spread (airTemp - dewPoint)
  calculateTemperatureSpread(airTemp, dewPoint) {
    return airTemp - dewPoint;
  }

  // Use polynomial regression to capture non-linear trends
  calculatePolynomialSlope(values) {
    const data = values.map((value, index) => [index, value]);  // [time, value] pairs
    const result = regression.polynomial(data, { order: 2 }); // Quadratic regression (order 2)
    return result.equation[0];  // Return the slope of the polynomial curve
  }

  // Logistic regression for fog/no fog classification
  calculateLogisticForecast() {
    const features = this.airTemps.map((temp, i) => [
      temp, 
      this.humidities[i], 
      this.windSpeeds[i], 
      this.pressures[i], 
      this.timesOfDay[i] === 'morning' ? 1 : 0,  // Time of day feature
      this.seasons[i] === 'winter' ? 1 : 0       // Season feature
    ]);
    
    const labels = this.humidities.map((humidity, i) => (humidity > 90 && this.calculateTemperatureSpread(this.airTemps[i], this.calculateDewPoint(this.airTemps[i], humidity)) < 2) ? 1 : 0);  // 1 for fog, 0 for no fog
    
    const logistic = new logisticRegression();
    logistic.train(features, labels);
    
    const forecast = logistic.predict(features);  // Get probability for each hour
    return forecast;  // Array of probabilities for fog occurrence
  }

  // Calculate the dew point slope over the past hours
  calculateDewPointSlope() {
    const dewPoints = this.humidities.map((humidity, i) => temperatureFormulas.dewPointArdenBuckEquation(this.airTemps[i], humidity));
    return this.calculatePolynomialSlope(dewPoints);  // Polynomial regression on dew point
  }

  // Calculate fog risk score based on trends and historical data
  calculateRiskScore() {
    const airTempSlope = this.calculatePolynomialSlope(this.airTemps);
    const humiditySlope = this.calculatePolynomialSlope(this.humidities);
    const pressureSlope = this.calculatePolynomialSlope(this.pressures);
    const windSlope = this.calculatePolynomialSlope(this.windSpeeds);
    const dewPointSlope = this.calculateDewPointSlope();

    // Add weights to factors based on their importance
    let riskScore = 0;

    // Temperature spread (smaller spread = higher fog risk)
    const tempSpread = this.calculateTemperatureSpread(this.airTemps[this.airTemps.length - 1], this.calculateDewPoint(this.airTemps[this.airTemps.length - 1], this.humidities[this.humidities.length - 1]));
    if (tempSpread < 2) riskScore += 3;  // More likely to have fog

    // Air temperature slope (decreasing temperature = higher risk)
    if (airTempSlope < 0) riskScore += Math.abs(airTempSlope) * 2;  // Increased weight on temperature slope


    // Dew point slope (increase in dew point = higher risk)
    if (dewPointSlope > 0) riskScore += Math.abs(dewPointSlope) * 1.5;

    // Wind speed slope (decreasing wind speed = higher risk)
    if (windSlope < 0) riskScore += Math.abs(windSlope) * 1.5;

    // Pressure slope (falling pressure = higher risk)
    if (pressureSlope < 0) riskScore += Math.abs(pressureSlope);

    // Humidity slope (increasing humidity = higher risk)
    if (humiditySlope > 0) riskScore += Math.abs(humiditySlope);

    return riskScore;
  }

  // Final fog forecast (fog probability)
  forecastLevel() {
    const riskScore = this.calculateRiskScore();
    const logisticForecast = this.calculateLogisticForecast();
    const avgProbability = logisticForecast.reduce((sum, prob) => sum + prob, 0) / logisticForecast.length;

    const finalRiskScore = riskScore * avgProbability;  // Combine risk score with probability
    
    if (finalRiskScore >= 12) return 'High';
    if (finalRiskScore >= 6) return 'Moderate';
    return 'Low';
  }
}

// Example usage with historical data (last 4 hours):
const airTemps = [18, 17, 16, 15];  // °C, last 4 hours
const seaTemps = [14, 14, 14, 14];  // °C, last 4 hours
const humidities = [95, 96, 97, 98];  // %, last 4 hours
const windSpeeds = [5, 5, 4, 4];  // knots, last 4 hours
const pressures = [1015, 1016, 1015, 1014];  // hPa, last 4 hours
const timesOfDay = ['morning', 'afternoon', 'evening', 'night'];  // Time of day (for feature)
const seasons = ['summer', 'autumn', 'winter', 'spring'];  // Season (for feature)

const fogForecast = new AdvectionFogForecast(airTemps, seaTemps, humidities, windSpeeds, pressures, timesOfDay, seasons);
console.log(`Fog Risk Score: ${fogForecast.calculateRiskScore().toFixed(2)}`);
console.log(`Forecast Level: ${fogForecast.forecastLevel()}`);


module.exports = AdvectionFogForecast;