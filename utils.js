const MINUTES = {
	ONE_HOUR: 60,
	THREE_HOURS: 60*3,
	FORTYEIGHT_HOURS: 60*48
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

function adjustPressureToSeaLevel(pressure, height, temperature = toKelvinFromCelcius(15)) {
	temperature = temperature - KELVIN;
	let seaLevelPressure = pressure * Math.pow(1 - ((0.0065 * height) / (temperature + 0.0065 * height + KELVIN)), -5.257);
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

function toKelvinFromCelcius(celcius) {
	return celcius + 273.15;
}

module.exports = {
	minutesFromNow,
	getPressuresSince,
	isSummer,
	adjustPressureToSeaLevel,
	toKelvinFromCelcius,
	MINUTES,
	KELVIN
}