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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFront = getFront;
const fronts = require("./fronts.json");
const utils = __importStar(require("../utils"));
const regression = __importStar(require("regression"));
const Pascal10 = 10;
const ONE_HOUR = 60;
const TWO_HOURS = 120;
const THREE_HOURS = 180;
/**
 * Filter pressures within a specific time period (compatible with test data).
 */
function getPressuresByPeriodCompat(pressures, startTime, endTime) {
    return pressures.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
}
/**
 *
 * @param pressures Array of pressure readings
 * @returns Front JSON object
 */
function getFront(pressures) {
    let threeHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-180), utils.minutesFromNow(-120));
    let twoHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-120), utils.minutesFromNow(-60));
    let oneHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-60), new Date());
    return analyzePressures(threeHourPressures, twoHourPressures, oneHourPressures);
}
function analyzePressures(hourThreePressures, hourTwoPressures, hourOnePressures) {
    let frontNull = fronts.find((f) => f.key === null);
    if (!(hourThreePressures && hourTwoPressures && hourOnePressures))
        return frontNull;
    let t1 = getTendency(hourThreePressures, THREE_HOURS);
    let t2 = getTendency(hourTwoPressures, TWO_HOURS);
    let t3 = getTendency(hourOnePressures, ONE_HOUR);
    if (!(t1 && t2 && t3))
        return frontNull;
    let key = t1.concat(t2, t3);
    console.debug("Front pattern: " + key);
    let front = fronts.find((f) => f.key === key);
    return front !== undefined ? front : frontNull;
}
function regressPressures(pressures) {
    let minutelyPressures = [];
    let now = new Date();
    pressures.forEach((p) => {
        let diff = now.getTime() - p.datetime.getTime();
        let min = Math.round((diff / 1000) / ONE_HOUR);
        // Handle both test data format (with .value) and real data format (with .calculated.pressureASL)
        let pressureValue = 'value' in p && p.value !== undefined ? p.value :
            'calculated' in p && p.calculated ? p.calculated.pressureASL : 0;
        minutelyPressures.push([min, pressureValue]);
    });
    let result = regression.linear(minutelyPressures);
    return result;
}
function getTendency(pressures, start) {
    if (!pressures || pressures.length === 0)
        return null;
    let regressionResult = regressPressures(pressures);
    let difference = regressionResult.predict(start)[1] - regressionResult.predict(start + ONE_HOUR)[1];
    if (Math.abs(difference) < Pascal10)
        return "S"; //STEADY
    if (difference > 0)
        return "R"; //RISING
    if (difference < 0)
        return "F"; //FALLING
    return null;
}
//# sourceMappingURL=front.js.map