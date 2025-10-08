/**
 * @module globals
 * @description Global constants and settings for the library.
 * @example
 * const globals = require('./globals');
 * globals.setMeanSeaLevelTemperature(20); //set mean sea level temperature to 20 Celsius degrees
 */
const defaults = {
    meanSeaLevelTemperature: 15, //celcius
    keepPressureReadingsFor: 60*48, //48 hours
    applyAdjustToSeaLevel: false,
    applyDiurnalRythm: false,
    applySmoothing: false,
    ignoreFlagInTesting: false
}


/**
 * Global constants and settings for the library.
 */
class Globals {
    public meanSeaLevelTemperature: number;
    public keepPressureReadingsFor: number;
    public applyAdjustToSeaLevel: boolean;
    public applyDiurnalRythm: boolean;
    public ignoreFlagInTesting: boolean;
    public applySmoothing: boolean;

    constructor() {
        this.meanSeaLevelTemperature = defaults.meanSeaLevelTemperature; //celcius
        this.keepPressureReadingsFor = defaults.keepPressureReadingsFor; //48 hours
        this.applyAdjustToSeaLevel = defaults.applyAdjustToSeaLevel;
        this.applyDiurnalRythm = defaults.applyDiurnalRythm;
        this.ignoreFlagInTesting = defaults.ignoreFlagInTesting;
        this.applySmoothing = defaults.applySmoothing;
    }

    /**
     * 
     * @param value Mean temperature at sea level, default = 15 Celsius degrees.
     * @description Default: 15 Celsius degrees. This is used for pressure calculations.
     */
    setMeanSeaLevelTemperature(value: number = defaults.meanSeaLevelTemperature): void {
        this.meanSeaLevelTemperature = value;
    }

    /**
     * 
     * @param value Number of whole minutes to keep pressure readings for. Default: 48 hours.
     * @example
     * globals.setKeepPressureReadingsFor(120); //keep pressure readings for 120 minutes
     */
    setKeepPressureReadingsFor(value: number = defaults.keepPressureReadingsFor): void {
        if(Number.isInteger(value) && value > 0) this.keepPressureReadingsFor = value;
    }

    /**
     * When set to true internal calculations will use readings adjusted to sea level. Can be combined with diurnal.
     * @param value True or false, default = false
     * @example
     * globals.setApplyAdjustToSeaLevel(true); //apply sea level adjustment
     */
    setApplyAdjustToSeaLevel(value: boolean = defaults.applyAdjustToSeaLevel): void {
        this.applyAdjustToSeaLevel = value;
    }

    /**
     * When set to true internal calculations will use readings adjusted to diurnal rythm. Can be comined with sea level.
     * @param value True or false, default = false
     * @example
     * globals.setApplyDiurnalRythm(true); //apply diurnal rythm
     */
    setApplyDiurnalRythm(value: boolean = defaults.applyDiurnalRythm): void {
        this.applyDiurnalRythm = value;
    }

    /**
     * @description When set to true internal calculations will use readings smoothed with an exponential moving average.
     * @param value True or false, default = false
     * @example
     * globals.setApplySmoothing(true); //apply smoothing
     */
    setApplySmoothing(value: boolean = defaults.applySmoothing): void {
        this.applySmoothing = value;
    }

    /**
     * A flag to be set under testing where parameteres change dynamically with dates, such as diurnal.
     * @param value True or false, default = false
     * @example
     * globals.setIgnoreFlagInTesting(true); //ignore flag in testing
     */
    setIgnoreFlagInTesting(value: boolean = defaults.ignoreFlagInTesting): void {
        this.ignoreFlagInTesting = value;
    }

    setDefaults(): void {
        this.meanSeaLevelTemperature = defaults.meanSeaLevelTemperature;
        this.keepPressureReadingsFor = defaults.keepPressureReadingsFor;
        this.applyAdjustToSeaLevel = defaults.applyAdjustToSeaLevel;
        this.applyDiurnalRythm = defaults.applyDiurnalRythm;
        this.ignoreFlagInTesting = defaults.ignoreFlagInTesting;
        this.applySmoothing = defaults.applySmoothing;
    }
}

const globalsAsSingleton = new Globals();

export = globalsAsSingleton;
