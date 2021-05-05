const MINUTES = {
	ONE_HOUR: 60,
	THREE_HOURS: 60*3
}

const KELVIN = 273.15;

/**
 * 
 * @param {number} minutes Minutes from current time
 * @returns {Date} Date with given minute difference
 */
function minutesFromNow(minutes) {
	var now = new Date();
	now.setMinutes(now.getMinutes() + minutes);
	return new Date(now);
}

function adjustPressureToSeaLevel(pressure, height, temperature = 288.15) { //15C
	temperature = temperature - 273.15;
	let seaLevelPressure = pressure * Math.pow(1 - ((0.0065 * height) / (temperature + 0.0065 * height + 273.15)), -5.257);
	return Math.round(seaLevelPressure);
}

/**
 * 
 * @param {*} pressures The pressures to filter
 * @param {*} minutes Since X minutes
 * @returns {Array<Object>} Subset of pressures
 */
function getPressuresSince(pressures, minutes) {
	let earlier = minutesFromNow(-Math.abs(minutes));
	let subPressures = pressures.filter((p) => {
		return p.datetime.getTime() >= earlier.getTime();
	});
	return subPressures;
}

function isSummer(isNorthernHemisphere = true) {
    let month = new Date().getMonth() + 1;
	let summer = month >= 4 && month <= 9; //April to September
	
	return isNorthernHemisphere ? summer : !summer;
}

/**
 * 
 * @param {number} pressure Pressure
 * @param {number} temperature Temperature
 * @returns returns Pascal and Kelvin if pressure and temperature is recieved in hPa or Celcius
 */
 function toSIUnits(pressure, temperature) {  
    if (Math.trunc(pressure).toString().length <= 4) {
        pressure *= 100;
    }

    if (Math.trunc(temperature).toString().length <= 2) {
        temperature += KELVIN;
    }

    return { pressure, temperature };
}

module.exports = {
	minutesFromNow,
	getPressuresSince,
	isSummer,
	adjustPressureToSeaLevel,
	toSIUnits,
	MINUTES,
	KELVIN
}