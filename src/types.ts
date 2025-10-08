export interface ReadingMeta {
    altitude: number;
    temperature: number | null;
    humidity: number | null;
    trueWindDirection: number | null;
    trueWindSpeed: number | null;
    latitude: number | null;
}

export interface ReadingCalculated {
    smoothed: number;
    pressureASL: number;
    diurnalPressure: number;
    diurnalPressureASL: number;
}

export interface Reading {
    datetime: Date;
    pressure: number;
    meta: ReadingMeta;
    calculated: ReadingCalculated;
    originalPressure: () => number;
}

export interface TrendResult {
    tendency: string;
    trend: {
        key: string;
        severity: number;
        category: string;
    };
    from: number;
    to: number;
    difference: number;
    ratio: number;
    period: number;
}

export interface Tendency {
    key: string;
}

export interface Trend {
    key: string;
    severity: number;
    category: string;
}
