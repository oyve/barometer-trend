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
exports.getHistoricPressures = getHistoricPressures;
const utils = __importStar(require("../utils"));
/**
 *
 * @param pressures Pressures
 * @param limit Number of historic values to return
 * @returns [{hour: hour, pressure: pressure}]
 */
function getHistoricPressures(pressures, limit = 48) {
    let historicPressures = [];
    for (let hour = 1; hour <= limit; hour++) {
        let threshold = utils.minutesFromNow(-hour * 60);
        let pressure = utils.getPressureClosestTo(pressures, threshold);
        if (pressure !== null && isLessThanOld(pressure.datetime, threshold, 30)) {
            historicPressures.push({ hour: hour, pressure: pressure });
        }
        else {
            historicPressures.push({ hour: hour, pressure: null });
        }
    }
    return historicPressures;
}
/**
 *
 * @param actual The actual pressure time
 * @param threshold Threshold time
 * @param minutes Max number of minutes difference
 * @returns
 */
function isLessThanOld(actual, threshold, minutes) {
    return (actual.getTime() - threshold.getTime()) < minutes * 60 * 1000;
}
//# sourceMappingURL=history.js.map