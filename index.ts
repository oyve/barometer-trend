import * as byPressureTrend from './src/predictions/byPressureTrend';
import * as byPressureTendencyAndWind from './src/predictions/byPressureTendencyAndWind';
import * as byPressureTrendAndSeason from './src/predictions/byPressureTrendAndSeason';
import * as beaufort from './src/predictions/beaufort';
import * as utils from './src/utils';
import { SystemAnalyzer as system } from './src/predictions/system';
import { ReadingStore } from './src/readingStore';
import * as barometerLabel from './src/predictions/label';
import { TrendAnalyzer, TENDENCY, TREND } from './src/trend';
import * as forecastText from './src/predictions/forecastText';
import { FrontAnalyzer as frontAnalyzer } from './src/predictions/front';
import { Reading } from './src/types';

let latitude: number | null = null;

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
export function clear(): void {
    ReadingStore.clear();
}

/**
 * 
 * @param datetime Timestamp of barometer reading
 * @param pressure Pressure in Pascal
 * @param meta Meta data object containing altitude, temperature, humidity, trueWindDirection and latitude
 */
export function addPressure(datetime: Date, pressure: number, meta: Record<string, any> = {}): Reading | undefined {
    return ReadingStore.add(datetime, pressure, meta);
}

/**
 * @returns True or false
 */
export function hasPressures(): boolean {
    return ReadingStore.hasPressures();
}

/**
 * Get latitude
 * @returns Returns latitude, null if not set
 */
export function getLatitude(): number | null | undefined {
    return latitude === null ? undefined : latitude;
}

/**
 * Set latitude as a decimal number, i.e. 45.123
 * @param lat Latitude in decimal format, i.e. 45.123
 * @returns true or false if set after validation
 */
export function setLatitude(lat: number): boolean {
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
export function getForecast(): any;
export function getForecast(isNorthernHemisphere: boolean): any;
export function getForecast(isNorthernHemisphere?: boolean): any {
    // Handle no arguments case - check if latitude is set
    if (arguments.length === 0) {
        if (latitude === null) return null;
        isNorthernHemisphere = utils.isNorthernHemisphere(latitude);
    }
    
    // Default to northern hemisphere if not specified
    if (isNorthernHemisphere === undefined) {
        isNorthernHemisphere = true;
    }

    if (ReadingStore.readings.length < 2) return null;

    const last10Minutes = ReadingStore.getAll(10);

    const trendAnalyzer = new TrendAnalyzer();
    //const frontAnalyzer = new FrontAnalyzer();

    const pressureTrend = trendAnalyzer.forecast();
    if (pressureTrend === null) return null;

    const pressureSystems = system.forecast();
    const forecastPressureOnly = byPressureTrend.getPrediction(pressureTrend.tendency, pressureTrend.trend.key);
    const forecastFront = frontAnalyzer.forecast();
    const beaufortForecast = beaufort.forecast(pressureTrend.ratio, utils.getAverageValue(last10Minutes, r => r.meta?.trueWindSpeed));
    const forecastByPressureAndSeason = byPressureTrendAndSeason.getPrediction(ReadingStore.getPressureByDefault(), pressureTrend.tendency, pressureTrend.trend.key, utils.isSummer(isNorthernHemisphere));
    const latestReading = ReadingStore.getLatest();
    const forecastPressureTendencyThresholdAndQuadrant = latestReading ? 
        byPressureTendencyAndWind.getPrediction(ReadingStore.getPressureByDefault(), latestReading.meta.trueWindDirection, pressureTrend.tendency, pressureTrend.trend, isNorthernHemisphere) :
        'N/A';
    const labels = barometerLabel.getBarometerLabel(ReadingStore.getPressureByDefault());

    const forecast = {
        pressure: ReadingStore.getLatest(),
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
        dataQuality: ReadingStore.getDataQuality(),
        forecastMinutes: getForecastMinutes()
    };

    if(forecast != null) {
        const textForecast = forecastText.forecast(forecast as any);
        (forecast.models as any).forecastText = textForecast;
    }

    return forecast;
}

function getForecastMinutes(): number {
    const first = ReadingStore.getFirst();
    if(first === null) return 0;
    const diffMs = Math.abs(new Date().getTime() - first.datetime.getTime()); // difference in milliseconds
    return Math.floor(diffMs / 60000);
}

export async function getForecastAsync(): Promise<any>;
export async function getForecastAsync(isNorthernHemisphere: boolean): Promise<any>;
export async function getForecastAsync(isNorthernHemisphere?: boolean): Promise<any> {
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

export function getBarometerUpdates(): any {
    if(ReadingStore.count() < 1) return null;
    
    return barometerLabel.getBarometerLabel(ReadingStore.getPressureByDefault());
}

/**
 * Change altitude for all existing readings
 * @param altitude Altitude
 */
export function changeAltitude(altitude: number): void {
    ReadingStore.getAll().forEach((r: Reading) => r.meta.altitude = altitude);
}