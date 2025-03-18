function predictWeather(pastReadings, latitude, date, hoursAhead = 24, windSpeed = null, solarRadiation = null) {
    function polynomialRegression(x, y, degree = 2) {
        let matrix = [];
        let results = [];
        
        for (let i = 0; i < x.length; i++) {
            let row = [];
            for (let j = 0; j <= degree; j++) {
                row.push(Math.pow(x[i], j));
            }
            matrix.push(row);
            results.push(y[i]);
        }

        let coefficients = solveLinearSystem(matrix, results);
        return (xNew) => coefficients.reduce((sum, coef, index) => sum + coef * Math.pow(xNew, index), 0);
    }

    function solveLinearSystem(A, b) {
        let math = require('mathjs');
        return math.lusolve(A, b).map(x => x[0]);
    }

    function calculateDewPoint(temp, humidity) {
        return temp - (100 - humidity) / 5;
    }

    function estimateCloudCover(temp, dewPoint) {
        return Math.abs(temp - dewPoint) < 2 ? "High" : "Low";
    }

    function seasonalTemperatureAdjustment(latitude, date) {
        let dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        return 10 * Math.cos((2 * Math.PI * dayOfYear) / 365) * ((90 - Math.abs(latitude)) / 90);
    }

    let time = pastReadings.map((_, i) => i);
    let tempValues = pastReadings.map(r => r.temperature);
    let pressureValues = pastReadings.map(r => r.pressure);
    let humidityValues = pastReadings.map(r => r.humidity);

    let tempPredict = polynomialRegression(time, tempValues, 2);
    let pressurePredict = polynomialRegression(time, pressureValues, 2);
    let humidityPredict = polynomialRegression(time, humidityValues, 2);

    let seasonalCorrection = seasonalTemperatureAdjustment(latitude, date);
    let futureForecast = [];

    for (let h = 1; h <= hoursAhead; h++) {
        let futureTemp = tempPredict(time.length + h) + seasonalCorrection;
        let futurePressure = pressurePredict(time.length + h);
        let futureHumidity = Math.max(0, Math.min(100, humidityPredict(time.length + h)));

        if (windSpeed !== null) {
            futureTemp -= windSpeed * 0.1;
        }
        if (solarRadiation !== null) {
            futureTemp += solarRadiation * 0.005;
        }

        let dewPoint = calculateDewPoint(futureTemp, futureHumidity);
        let cloudCover = estimateCloudCover(futureTemp, dewPoint);

        futureForecast.push({
            hourAhead: h,
            futureTemperature: futureTemp,
            futurePressure: futurePressure,
            futureHumidity: futureHumidity,
            dewPoint: dewPoint,
            cloudCover: cloudCover
        });
    }

    return futureForecast;
}

// Example past 3-hour readings
let pastReadings = [
    { pressure: 1015, temperature: 25, humidity: 60 },
    { pressure: 1012, temperature: 24.5, humidity: 58 },
    { pressure: 1009, temperature: 24, humidity: 55 }
];

let latitude = 40.0; // Example latitude
let date = new Date(); // Current date

console.log(JSON.stringify(predictWeather(pastReadings, latitude, date), null, 2));
