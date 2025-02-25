/**
 * Get the pressure system based on the pressure value.
 * @param {number} pressure - The pressure value in Pascal.
 * @returns {Object} The pressure system (LOW, NORMAL, HIGH).
 */
function getSystemByPressure(pressure) {
    const LOW_THRESHOLD = 100914.4;
    const HIGH_THRESHOLD = 102268.9;

    const systems = [
        { key: 0, name: "Low", threshold: LOW_THRESHOLD + 0.1 },
        { key: 1, name: "Between Low and High", threshold: HIGH_THRESHOLD },
        { key: 2, name: "High", threshold: Number.MAX_SAFE_INTEGER }
    ];

    try {
        return systems.find((s) => pressure < s.threshold);
    } catch (error) {
        console.error("Error in getSystemByPressure: ", error);
        return null;
    }
}

module.exports = {
    getSystemByPressure
};