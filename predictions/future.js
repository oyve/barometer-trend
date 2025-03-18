function predictWeather(pastReadings, latitude, altitude, date, hoursAhead = 24, windSpeed = null, solarRadiation = null) {
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

    function estimateCloudBase(temp, dewPoint) {
        return (temp - dewPoint) * 125; // Cloud base height in meters
    }

    function classifyCloudCover(temp, dewPoint) {
        let diff = temp - dewPoint;
        if (diff < 2) return "Low (Fog, Stratus)";
        if (diff < 7) return "Mid (Altostratus, Altocumulus)";
        return "High (Cirrus, Cirrostratus)";
    }

    function calculateCloudProbability(temp, dewPoint, pressure, humidity) {
        let cloudBase = estimateCloudBase(temp, dewPoint);
        let rhCloudBase = humidity * Math.exp(-cloudBase / 2000);
        let dewPointDiff = temp - dewPoint;
        let cloudProbability = 50; // Default probability
        
        if (rhCloudBase > 0.80 || dewPointDiff < 2) {
            cloudProbability = 80;
        } else if (rhCloudBase < 0.50 && pressure > 1020) {
            cloudProbability = 20;
        }
        
        return cloudProbability;
    }

    function calculateFogProbability(cloudBase, humidity, windSpeed) {
        if (cloudBase < 200 && humidity > 95 && windSpeed < 5) {
            return true; // Fog expected
        }
        return false; // No fog
    }

    function seasonalTemperatureAdjustment(latitude, date) {
        let dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        return 10 * Math.cos((2 * Math.PI * dayOfYear) / 365) * ((90 - Math.abs(latitude)) / 90);
    }

    function latitudeEffects(latitude, temp, hour) {
        let latFactor = (90 - Math.abs(latitude)) / 90;
        let baselineShift = -5 * (1 - latFactor);
        let diurnalTempFactor = 1 + 0.5 * (1 - latFactor);

        let tempAdjustment = baselineShift;
        if (hour > 12) {
            tempAdjustment -= diurnalTempFactor;
        }

        return tempAdjustment;
    }

    function altitudeCorrection(temp, altitude) {
        return temp - (altitude / 1000) * 6.5;
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
        let futureTemp = tempPredict(time.length + h) + seasonalCorrection + latitudeEffects(latitude, tempPredict(time.length + h), h);
        futureTemp = altitudeCorrection(futureTemp, altitude);
        
        let futurePressure = pressurePredict(time.length + h);
        let futureHumidity = Math.max(0, Math.min(100, humidityPredict(time.length + h)));

        if (windSpeed !== null) {
            futureTemp -= windSpeed * 0.1;
        }
        if (solarRadiation !== null) {
            futureTemp += solarRadiation * 0.005;
        }

        let dewPoint = calculateDewPoint(futureTemp, futureHumidity);
        let cloudBase = estimateCloudBase(futureTemp, dewPoint);
        let cloudCover = classifyCloudCover(futureTemp, dewPoint);
        let cloudProbability = calculateCloudProbability(futureTemp, dewPoint, futurePressure, futureHumidity);
        let fogExpected = calculateFogProbability(cloudBase, futureHumidity, windSpeed);

        futureForecast.push({
            hourAhead: h,
            futureTemperature: futureTemp,
            futurePressure: futurePressure,
            futureHumidity: futureHumidity,
            dewPoint: dewPoint,
            cloudBaseHeight: cloudBase,
            cloudCoverType: cloudCover,
            cloudProbability: cloudProbability,
            fogExpected: fogExpected
        });
    }

    return futureForecast;
}
