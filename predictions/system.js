/**
 * 
 * @param {number} pressure in Pascal
 * @returns LOW | NORMAL | HIGH pressure system
 */
function getSystemByPressure(pressure) {
    const lowThreshold = 100914.4;
    const highTreshold = 102268.9;

    const systems = [
        { key: 0, name: "Low", threshold: lowThreshold + 0.1 },
        { key: 1, name: "Normal", threshold: highTreshold },
        { key: 2, name: "High", threshold: 999999 }
    ];

    return systems.find((s) => pressure < s.threshold);
}

module.exports = {
    getSystemByPressure
}