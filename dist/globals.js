"use strict";
const defaults = {
    meanSeaLevelTemperature: 15,
    isDiurnalEnabled: false,
    keepPressureReadingsFor: 60 * 48 //48 hours
};
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
     * @param value Mean temperature at sea level
     */
    setMeanSeaLevelTemperature(value = defaults.meanSeaLevelTemperature) {
        this.meanSeaLevelTemperature = value;
    }
    /**
     *
     * @param value True or false
     */
    setIsDiurnalEnabled(value = defaults.isDiurnalEnabled) {
        this.isDiurnalEnabled = value;
    }
    /**
     *
     * @param value Number of whole minutes to keep pressure readings for. Default: 48 hours.
     */
    setKeepPressureReadingsFor(value = defaults.keepPressureReadingsFor) {
        if (Number.isInteger(value) && value > 0)
            this.keepPressureReadingsFor = value;
    }
}
const globals = new Globals();
module.exports = globals;
//# sourceMappingURL=globals.js.map