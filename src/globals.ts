interface DefaultsConfig {
    meanSeaLevelTemperature: number;
    isDiurnalEnabled: boolean;
    keepPressureReadingsFor: number;
}

const defaults: DefaultsConfig = {
    meanSeaLevelTemperature: 15,
    isDiurnalEnabled: false,
    keepPressureReadingsFor: 60*48 //48 hours
}

/**
 * Global constants
 */
class Globals {
    public meanSeaLevelTemperature: number;
    public isDiurnalEnabled: boolean;
    public keepPressureReadingsFor: number;

    constructor() {
        this.meanSeaLevelTemperature = defaults.meanSeaLevelTemperature; //celcius
        this.isDiurnalEnabled = defaults.isDiurnalEnabled;
        this.keepPressureReadingsFor = defaults.keepPressureReadingsFor; //48 hours
    }

    /**
     * 
     * @param value Mean temperature at sea level 
     */
    setMeanSeaLevelTemperature(value: number = defaults.meanSeaLevelTemperature): void {
        this.meanSeaLevelTemperature = value;
    }

    /**
     * 
     * @param value True or false
     */
    setIsDiurnalEnabled(value: boolean = defaults.isDiurnalEnabled): void {
        this.isDiurnalEnabled = value;
    }

    /**
     * 
     * @param value Number of whole minutes to keep pressure readings for. Default: 48 hours.
     */
    setKeepPressureReadingsFor(value: number = defaults.keepPressureReadingsFor): void {
        if(Number.isInteger(value) && value > 0) this.keepPressureReadingsFor = value;
    }
}

const globals = new Globals();

export = globals;