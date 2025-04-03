const defaults = {
    meanSeaLevelTemperature: 15,
    isDiurnalEnabled: false,
    keepPressureReadingsFor: 60*48, //48 hours
    applyAdjustToSeaLevel: false,
    applyDiurnalRythm: false,
    ignoreFlagInTesting: false
}


/**
 * Global constants
 */
class Globals {
    constructor() {
        this.meanSeaLevelTemperature = defaults.meanSeaLevelTemperature; //celcius
        this.isDiurnalEnabled = defaults.isDiurnalEnabled;
        this.keepPressureReadingsFor = defaults.keepPressureReadingsFor; //48 hours
        this.applyAdjustToSeaLevel = defaults.applyAdjustToSeaLevel;
        this.applyDiurnalRythm = defaults.applyDiurnalRythm;
        this.ignoreFlagInTesting = defaults.ignoreFlagInTesting;
    }

    /**
     * 
     * @param {number} value Mean temperature at sea level 
     */
    setMeanSeaLevelTemperature(value = defaults.meanSeaLevelTemperature) {
        this.meanSeaLevelTemperature = value;
    }

    /**
     * 
     * @param {boolean} value True or false
     */
    setIsDiurnalEnabled(value = defaults.isDiurnalEnabled) {
        this.isDiurnalEnabled = value;
    }

    /**
     * 
     * @param {number} value Number of whole minutes to keep pressure readings for. Default: 48 hours.
     */
    setKeepPressureReadingsFor(value = defaults.keepPressureReadingsFor) {
        if(Number.isInteger(value) && value > 0) this.keepPressureReadingsFor = value;
    }

    /**
     * When set to true internal calculations will use readings adjusted to sea level. Can be combined with diurnal.
     * @param {boolean} value True or false
     */
    setApplyAdjustToSeaLevel(value = defaults.applyAdjustToSeaLevel) {
        this.applyAdjustToSeaLevel = value;
    }

    /**
     * When set to true internal calculations will use readings adjusted to diurnal rythm. Can be comined with sea level.
     * @param {boolean} value True or false 
     */
    setApplyDiurnalRythm(value = defaults.applyDiurnalRythm) {
        this.applyDiurnalRythm = value;
    }

    /**
     * A flag to be set under testing where parameteres change dynamically with dates, such as diurnal.
     * @param {boolean} value True or false
     */
    setIgnoreFlagInTesting(value = defaults.ignoreFlagInTesting) {
        this.ignoreFlagInTesting = value;
    }
}

let globals = new Globals();

module.exports = globals;