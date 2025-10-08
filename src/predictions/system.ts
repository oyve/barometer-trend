export interface PressureSystem {
    key: number;
    name: string;
    short: string;
    threshold: number;
    text?: string;
}

/**
 * Get the pressure system based on the pressure value.
 * @param pressure - The pressure value in Pascal.
 * @returns The pressure system (LOW, NORMAL, HIGH).
 */
export function getSystemByPressure(pressure: number): PressureSystem {
    const LOW_THRESHOLD = 101000;
    const HIGH_THRESHOLD = 101500;

    const systems: PressureSystem[] = [
        { key: 0, name: "Low", text: "a below-normal", short: "LOW", threshold: LOW_THRESHOLD },
        { key: 1, name: "Normal", text: "normal", short: "NORMAL", threshold: HIGH_THRESHOLD },
        { key: 2, name: "High", text: "an above-normal", short: "HIGH", threshold: Number.MAX_SAFE_INTEGER }
    ];

    try {
        return systems.find((s) => pressure > systems[s.key === 0 ? 0 : s.key - 1].threshold && pressure <= s.threshold) || systems[0];
    } catch (error) {
        console.error("Error in getSystemByPressure: ", error);
        return systems[0];
    }
}

/**
 * @description Get the pressure system based on the trend of pressure readings.
 * @param readings Array of pressure readings
 * @returns The pressure system (LOW, NORMAL, HIGH) based on the trend of the readings.
 */
export function getSystemByPressureTrend(readings: any[]): PressureSystem | null {
    if(!readings) return null;
    if (readings.length < 2) return null;

    const regression = require('regression');
    const readingStore = require('../readingStore');
    
    const points: [number, number][] = readings.map((r, i) => [i, readingStore.getPressureByDefaultChoice(r)]);

    const result = regression.linear(points);
    const slope = result.equation[0];
    const lastPressure = points[points.length - 1][1];

    const LOW_THRESHOLD = 101000;
    const HIGH_THRESHOLD = 101500;

    const SYSTEMS: PressureSystem[] = [
        { key: 0, name: "Low", text: "a below-normal", short: "LOW", threshold: LOW_THRESHOLD },
        { key: 1, name: "Normal", text: "normal", short: "NORMAL", threshold: HIGH_THRESHOLD },
        { key: 2, name: "High", text: "an above-normal", short: "HIGH", threshold: Number.MAX_SAFE_INTEGER }
    ];

    let trendingKey: number;
    if (slope > 0) {
        trendingKey = lastPressure >= HIGH_THRESHOLD ? 2 :
                      lastPressure >= LOW_THRESHOLD ? 1 : 0;
    } else if (slope < 0) {
        trendingKey = lastPressure <= LOW_THRESHOLD ? 0 :
                      lastPressure <= HIGH_THRESHOLD ? 1 : 2;
    } else {
        trendingKey = 1;
    }

    return SYSTEMS.find(s => s.key === trendingKey) || SYSTEMS[0];
}

export function forecast(pressure: number, pressures: any[]): { current: PressureSystem; trending?: PressureSystem | null } {
    const system = getSystemByPressure(pressure);
    return {
        current: {
            ...system,
            text: system.name.toLowerCase()
        },
        trending: getSystemByPressureTrend(pressures)
    };
}
