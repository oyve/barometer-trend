import * as byPressureTrend from './src/predictions/byPressureTrend';
import * as byPressureTendencyAndWind from './src/predictions/byPressureTendencyAndWind';
import * as byPressureTrendAndSeason from './src/predictions/byPressureTrendAndSeason';
import * as beaufort from './src/predictions/beaufort';
import * as utils from './src/utils';
import * as system from './src/predictions/system';
import readingStore = require('./src/readingStore');
import * as barometerLabel from './src/predictions/label';
import { TrendAnalyzer, TENDENCY, TREND } from './src/trend';
import * as forecastText from './src/predictions/forecastText';
import FrontAnalyzer = require('./src/predictions/front');
import { Reading } from './src/types';

let latitude: number | null = null;

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
function clear(): void {
    readingStore.clear();
}

/**
 * 
 * @param datetime Timestamp of barometer reading
 * @param pressure Pressure in Pascal
 * @param meta Meta data object containing altitude, temperature, humidity, trueWindDirection and latitude
 */
function addPressure(datetime: Date, pressure: number, meta: Record<string, any> = {}): Reading | undefined {
    return readingStore.add(datetime, pressure, meta);
}

/**
 * @returns True or false
 */
function hasPressures(): boolean {
    return readingStore.hasPressures();
}

/**
 * Get latitude
 * @returns Returns latitude, null if not set
 */
function getLatitude(): number | null {
    return latitude;
}

/**
 * Set latitude as a decimal number, i.e. 45.123
 * @param lat Latitude in decimal format, i.e. 45.123
 * @returns true or false if set after validation
 */
function setLatitude(lat: number): boolean {
    if(utils.isValidLatitude(lat)) {
        latitude = lat;
        return true;
    }

    return false;
}

/**
 * Get the trend and forecastof the barometer.
 * If latitude is set it will determine northern|southern hemisphere (default: northern)
 * @returns Object
 */
function getForecast(): any;
function getForecast(isNorthernHemisphere: boolean): any;
function getForecast(isNorthernHemisphere?: boolean): any {
    // Handle no arguments case - check if latitude is set
    if (arguments.length === 0) {
        if (latitude === null) return null;
        isNorthernHemisphere = utils.isNorthernHemisphere(latitude);
    }
    
    // Default to northern hemisphere if not specified
    if (isNorthernHemisphere === undefined) {
        isNorthernHemisphere = true;
    }

    if (readingStore.readings.length < 2) return null;

    const last10Minutes = readingStore.getAllLastMinutes(10);

    const trendAnalyzer = new TrendAnalyzer();
    const frontAnalyzer = new FrontAnalyzer();

    const pressureTrend = trendAnalyzer.forecast();
    if (pressureTrend === null) return null;

    const pressureSystems = system.forecast(readingStore.getPressureByDefaultChoice(), readingStore.getPressuresSince(-60));
    const forecastPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend.key);
    const forecastFront = frontAnalyzer.forecast();
    const beaufortForecast = beaufort.forecast(pressureTrend.ratio, utils.getAverageValue(last10Minutes, r => r.meta?.trueWindSpeed));
    const forecastByPressureAndSeason = byPressureTrendAndSeason.getPrediction(readingStore.getPressureByDefaultChoice(), pressureTrend.tendency, pressureTrend.trend.key, utils.isSummer(isNorthernHemisphere));
    const latestReading = readingStore.getLatestReading();
    const forecastPressureTendencyThresholdAndQuadrant = latestReading ? 
        byPressureTendencyAndWind.getPrediction(readingStore.getPressureByDefaultChoice(), latestReading.meta.trueWindDirection, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere) :
        'N/A';
    const labels = barometerLabel.getBarometerLabel(readingStore.getPressureByDefaultChoice());

    const forecast = {
        pressure: readingStore.getLatestReading(),
        trend: pressureTrend,
        models: {
            pressureOnly: forecastPressureOnly,
            quadrant: forecastPressureTendencyThresholdAndQuadrant,
            season: forecastByPressureAndSeason,
            beaufort: beaufortForecast,
            front: forecastFront,
            pressureSystem: pressureSystems,
            label: labels
        },
        dataQuality: readingStore.getDataQuality(),
        forecastMinutes: getForecastMinutes()
    };

    if(forecast != null) {
        const textForecast = forecastText.forecast(forecast as any);
        (forecast.models as any).forecastText = textForecast;
    }

    return forecast;
}

function getForecastMinutes(): number {
    const first = readingStore.getFirstReading();
    if(first === null) return 0;
    const diffMs = Math.abs(new Date().getTime() - first.datetime.getTime()); // difference in milliseconds
    return Math.floor(diffMs / 60000);
}

async function getForecastAsync(): Promise<any>;
async function getForecastAsync(isNorthernHemisphere: boolean): Promise<any>;
async function getForecastAsync(isNorthernHemisphere?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            if (arguments.length === 0) {
                const forecast = getForecast();
                resolve(forecast);
            } else {
                const forecast = getForecast(isNorthernHemisphere!);
                resolve(forecast);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}

function getBarometerUpdates(): any {
    if(readingStore.count() < 1) return null;
    
    return barometerLabel.getBarometerLabel(readingStore.getPressureByDefaultChoice());
}

/**
 * Change altitude for all existing readings
 * @param altitude Altitude
 */
function changeAltitude(altitude: number): void {
    readingStore.getAll().forEach(r => r.meta.altitude = altitude);
}

export = {
    clear,
    hasPressures,
    addPressure,
    getForecast,
    getBarometerUpdates,
    getLatitude,
    setLatitude,
    getForecastAsync,
    changeAltitude
};
