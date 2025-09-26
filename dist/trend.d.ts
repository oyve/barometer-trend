import * as utils from './utils';
export interface TendencyType {
    key: string;
}
export interface TrendType {
    key: string;
    severity: number;
}
export interface ThresholdRatio {
    pascal: number;
    trend: TrendType;
}
export interface TrendResult {
    tendency: string;
    trend: string;
    from: utils.PressureReading;
    to: utils.PressureReading;
    difference: number;
    ratio: number;
    period: number;
    severity: number;
}
export declare const TENDENCY: {
    RISING: {
        key: string;
    };
    FALLING: {
        key: string;
    };
};
export declare const TREND: {
    STEADY: {
        key: string;
        severity: number;
    };
    SLOWLY: {
        key: string;
        severity: number;
    };
    CHANGING: {
        key: string;
        severity: number;
    };
    QUICKLY: {
        key: string;
        severity: number;
    };
    RAPIDLY: {
        key: string;
        severity: number;
    };
};
export declare function getTrend(pressures: utils.PressureReading[], useDiurnal?: boolean): TrendResult | null;
//# sourceMappingURL=trend.d.ts.map