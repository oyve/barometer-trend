/**
 * Global constants
 */
declare class Globals {
    meanSeaLevelTemperature: number;
    isDiurnalEnabled: boolean;
    keepPressureReadingsFor: number;
    constructor();
    /**
     *
     * @param value Mean temperature at sea level
     */
    setMeanSeaLevelTemperature(value?: number): void;
    /**
     *
     * @param value True or false
     */
    setIsDiurnalEnabled(value?: boolean): void;
    /**
     *
     * @param value Number of whole minutes to keep pressure readings for. Default: 48 hours.
     */
    setKeepPressureReadingsFor(value?: number): void;
}
declare const globals: Globals;
export = globals;
//# sourceMappingURL=globals.d.ts.map