/**
 * Global constants
 */
class Globals {
    constructor() {
        this.meanSeaLevelTemperature = 15; //celcius
        this.isDiurnalEnabled = false;
    }

    /**
     * 
     * @param {number} value Mean temperature at sea level 
     */
    setMeanSeaLevelTemperature(value) {
        this.meanSeaLevelTemperature = value;
    }

    /**
     * 
     * @param {boolean} value True or false
     */
    setIsDiurnalEnabled(value = false) {
        this.isDiurnalEnabled = value;
    }
}

let globals = new Globals();

module.exports = globals;