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
exports.TREND = exports.TENDENCY = void 0;
exports.getTrend = getTrend;
const utils = __importStar(require("./utils"));
exports.TENDENCY = {
    RISING: { key: 'RISING' },
    FALLING: { key: 'FALLING' }
};
exports.TREND = {
    STEADY: { key: 'STEADY', severity: 0 },
    SLOWLY: { key: 'SLOWLY', severity: 1 },
    CHANGING: { key: 'CHANGING', severity: 2 },
    QUICKLY: { key: 'QUICKLY', severity: 3 },
    RAPIDLY: { key: 'RAPIDLY', severity: 4 }
};
const THRESHOLDS_RATIO = [
    { pascal: 0.056, trend: exports.TREND.STEADY }, //up to 10 Pa per 3 hours
    { pascal: 0.89, trend: exports.TREND.SLOWLY }, //10-160 Pa per 3 hours
    { pascal: 2, trend: exports.TREND.CHANGING }, //160-360 Pa per 3 hours
    { pascal: 3.33, trend: exports.TREND.QUICKLY }, //360-600 Pa per 3 hours
    { pascal: 9999, trend: exports.TREND.RAPIDLY }
];
function ascendingNumbers(a, b) {
    return a.pascal - b.pascal;
}
function getSeverityNotion(severity, tendency) {
    if (severity === 0)
        return severity;
    return tendency === exports.TENDENCY.RISING ? severity : -severity;
}
function calculate(pressures, from, useDiurnal = false) {
    if (pressures.length < 2)
        return null;
    let subsetOfPressures = utils.getPressuresSince(pressures, from);
    if (subsetOfPressures.length >= 2) {
        let earlier = subsetOfPressures[0];
        let later = subsetOfPressures[subsetOfPressures.length - 1];
        let earlierValue = useDiurnal && earlier?.calculated?.diurnalPressure !== null && earlier?.calculated?.diurnalPressure !== undefined
            ? earlier.calculated.diurnalPressure
            : earlier.calculated.pressureASL;
        let laterValue = useDiurnal && later?.calculated?.diurnalPressure !== null && later?.calculated?.diurnalPressure !== undefined
            ? later.calculated.diurnalPressure
            : later.calculated.pressureASL;
        let difference = laterValue - earlierValue;
        let ratio = difference / from;
        let tendency = difference >= 0 ? exports.TENDENCY.RISING : exports.TENDENCY.FALLING;
        let threshold = THRESHOLDS_RATIO.sort(ascendingNumbers).find((t) => Math.abs(ratio) < t.pascal);
        if (!threshold) {
            threshold = THRESHOLDS_RATIO[THRESHOLDS_RATIO.length - 1];
        }
        return {
            tendency: tendency.key,
            trend: threshold.trend.key,
            from: earlier,
            to: later,
            difference: difference,
            ratio: Math.abs(ratio),
            period: Math.abs(from),
            severity: getSeverityNotion(threshold.trend.severity, tendency),
        };
    }
    return null;
}
function compareSeverity(earlier, later) {
    if (earlier !== null && later !== null && earlier.severity > later.severity) {
        return earlier;
    }
    return later;
}
function getTrend(pressures, useDiurnal = false) {
    let threeHours = calculate(pressures, -utils.MINUTES.THREE_HOURS, useDiurnal);
    let oneHour = calculate(pressures, -utils.MINUTES.ONE_HOUR, useDiurnal);
    let actual = threeHours;
    actual = compareSeverity(oneHour, actual);
    return actual;
}
//# sourceMappingURL=trend.js.map