const defaults = {
    meanSeaLevelTemperature: 15,
    isDiurnalEnabled: false,
    keepPressureReadingsFor: 60*48 //48 hours
}


/**
 * Global constants
 */
class Globals {
    constructor() {
        this.meanSeaLevelTemperature = defaults.meanSeaLevelTemperature; //celcius
        this.isDiurnalEnabled = defaults.isDiurnalEnabled;
        this.keepPressureReadingsFor = defaults.keepPressureReadingsFor; //48 hours
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
}

let globals = new Globals();

module.exports = globals;