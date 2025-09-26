"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemByPressure = getSystemByPressure;
/**
 * Get the pressure system based on the pressure value.
 * @param pressure - The pressure value in Pascal.
 * @returns The pressure system (LOW, NORMAL, HIGH).
 */
function getSystemByPressure(pressure) {
    const LOW_THRESHOLD = 100914.4;
    const HIGH_THRESHOLD = 102268.9;
    const systems = [
        { key: 0, name: "Low", short: "LOW", threshold: LOW_THRESHOLD + 0.1 },
        { key: 1, name: "Between Low and High", short: "BETWEEN", threshold: HIGH_THRESHOLD },
        { key: 2, name: "High", short: "HIGH", threshold: Number.MAX_SAFE_INTEGER }
    ];
    try {
        return systems.find((s) => pressure < s.threshold);
    }
    catch (error) {
        console.error("Error in getSystemByPressure: ", error);
        return undefined;
    }
}
//# sourceMappingURL=system.js.map