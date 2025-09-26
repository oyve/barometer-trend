declare class PressureEMA {
    private alpha;
    private ema;
    constructor(alpha?: number);
    updateEMA(pressure: number): number;
}
declare const weatherEMA: PressureEMA;
declare const pressureReadings: number[];
//# sourceMappingURL=EMA.d.ts.map