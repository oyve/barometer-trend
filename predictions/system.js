/**
 * Get the pressure system based on the pressure value.
 * @param {number} pressure - The pressure value in Pascal.
 * @returns {Object} The pressure system (LOW, NORMAL, HIGH).
 */
function getSystemByPressure(latitude, pressure, dateString) {
    let lat = Math.abs(latitude); // Normalize latitude (N/S treated the same)
    let date = new Date(dateString);
    let month = date.getMonth() + 1; // Get month (1-12)
    let season = (month >= 5 && month <= 10) ? "summer" : "winter"; // Approximate seasons

    let expectedPressure = 1013; // Base sea-level pressure
    let threshold = 7; // Dynamic threshold for classification

    // More detailed latitude bands with regional considerations
    if (season === "summer") {
        if (lat < 10) expectedPressure = 1007; // Deep tropical low  
        else if (lat < 20) expectedPressure = 1010; // Weak tropical low  
        else if (lat < 30) expectedPressure = 1022; // Strong subtropical high  
        else if (lat < 40) expectedPressure = 1015; // Transition zone  
        else if (lat < 50) expectedPressure = 1003; // Mid-latitude low  
        else if (lat < 60) expectedPressure = 1005; // Slight increase in pressure  
        else if (lat < 70) expectedPressure = 1025; // Arctic high begins  
        else expectedPressure = 1030; // Strong polar high  
    } else { // Winter
        if (lat < 10) expectedPressure = 1007; // Equatorial low remains stable  
        else if (lat < 20) expectedPressure = 1012; // Weak subtropical low  
        else if (lat < 30) expectedPressure = 1025; // Stronger subtropical high  
        else if (lat < 40) expectedPressure = 1010; // Mid-latitude transition  
        else if (lat < 50) expectedPressure = 998; // Deep winter low (storm tracks)  
        else if (lat < 60) expectedPressure = 995; // Icelandic Low region  
        else if (lat < 70) expectedPressure = 1030; // Strong polar high (Siberian High)  
        else expectedPressure = 1040; // Very strong Arctic/Antarctic high  
    }

    // Adjust threshold dynamically based on latitude  
    if (lat > 60) threshold = 10; // More variation in polar regions  
    if (lat < 20) threshold = 5; // Less variation in tropics  

    // Determine classification  
    if (pressure > expectedPressure + threshold) {
        return "High";
    } else if (pressure < expectedPressure - threshold) {
        return "Low";
    } else {
        return "Between";
    }
}

module.exports = {
    getSystemByPressure
};
