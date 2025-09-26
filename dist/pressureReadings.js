"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const events_1 = require("events");
const utils = __importStar(require("./utils"));
const diurnalrythm = __importStar(require("./predictions/diurnalRythm"));
const globals = __importStar(require("./globals"));
class PressureReadings extends events_1.EventEmitter {
    constructor() {
        super();
        this.pressures = [];
    }
    /**
     * Add a pressure reading.
     * @param datetime Timestamp of reading
     * @param pressure Pressure in Pascals
     * @param altitude Altitude above sea level in meters, default = 0
     * @param temperature Temperature in Kelvin, defaults to 15 Celsius degrees
     * @param trueWindDirection True wind direction in degrees
     * @param latitude Latitude in decimal degrees, eg. 45.123
     */
    add(datetime, pressure, altitude, temperature, trueWindDirection, latitude) {
        let actualDatetime;
        if (utils.isNullOrUndefined(datetime)) {
            actualDatetime = new Date(Date.now());
        }
        else if (typeof datetime === 'number') {
            actualDatetime = new Date(datetime);
        }
        else {
            actualDatetime = datetime;
        }
        const actualAltitude = utils.isNullOrUndefined(altitude) ? 0 : altitude;
        const actualTemperature = utils.isNullOrUndefined(temperature) ?
            utils.toKelvinFromCelsius(globals.meanSeaLevelTemperature) : temperature;
        let actualWindDirection = trueWindDirection;
        if (!utils.isNullOrUndefined(trueWindDirection) && trueWindDirection === 360) {
            actualWindDirection = 0;
        }
        const ema = 1;
        const pressureASL = utils.adjustPressureToSeaLevel(pressure, actualAltitude, actualTemperature);
        const diurnalPressure = (utils.isValidLatitude(latitude || 0) && latitude !== null && latitude !== undefined) ?
            diurnalrythm.correctPressure(pressure, latitude, actualDatetime).correctedPressure :
            null;
        const diurnalPressureASL = (utils.isValidLatitude(latitude || 0) && latitude !== null && latitude !== undefined) ?
            diurnalrythm.correctPressure(pressureASL, latitude, actualDatetime).correctedPressure :
            null;
        const reading = {
            datetime: actualDatetime,
            pressure: pressure,
            meta: {
                altitude: actualAltitude,
                temperature: actualTemperature,
                trueWindDirection: actualWindDirection || undefined,
                latitude: latitude || undefined
            },
            calculated: {
                pressureASL: pressureASL,
                diurnalPressure: diurnalPressure || undefined,
                diurnalPressureASL: diurnalPressureASL || undefined,
                EMA: ema
            }
        };
        this.pressures.push(reading);
        this.removeOldPressures();
        this.emit('pressureAdded', reading);
    }
    removeOldPressures(threshold = utils.minutesFromNow(-globals.keepPressureReadingsFor)) {
        this.pressures = this.pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
    }
    /**
     * Get the last pressure reading.
     * @returns The last pressure reading.
     */
    getLatestPressure() {
        return this.pressures[this.pressures.length - 1];
    }
    /**
     * Check if there are any pressure readings.
     * @returns True if there are pressure readings, false otherwise.
     */
    hasPressures() {
        return this.pressures.length > 0;
    }
    /**
     * Clear the pressure readings. (Mainly for testing purposes)
     */
    clear() {
        this.pressures = [];
    }
}
const pressureReadingsAsSingleton = new PressureReadings();
module.exports = pressureReadingsAsSingleton;
//# sourceMappingURL=pressureReadings.js.map