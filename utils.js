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
	let now = new Date();
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
 * @param {Array<Object>} pressures The pressures to filter
 * @param {number} minutes Since X minutes
 * @returns {Array<Object>} Subset of pressures
 */
function getPressuresSince(pressures, minutes) {

	let earlier = minutesFromNow(-Math.abs(minutes));

	let subPressures = pressures.filter((p) => {
		return p.datetime.getTime() >= earlier.getTime();
	});
	return subPressures;
}

function isNullOrUndefined(value) {
	return (value === null || value === undefined);
}

/**
 * 
 * @param {Array<Object>} pressures Array of pressurs 
 * @param {Date} datetime 
 * @returns The pressure closest to the given datetime, null if not found
 */
function getPressureClosestTo(pressures, datetime) {
	let previous = [...pressures].reverse().find((p) => p.datetime.getTime() <= datetime.getTime());
	let next = pressures.find((p) => p.datetime.getTime() >= datetime.getTime());

	if(isNullOrUndefined(next) && isNullOrUndefined(previous)) return null;
	if(isNullOrUndefined(next)) return previous;
	if(isNullOrUndefined(previous)) return next;

	let diffNext = Math.abs(next.datetime.getTime() - datetime.getTime());
	let diffPrevious =  Math.abs(previous.datetime.getTime() - datetime.getTime());

	return (diffNext < diffPrevious) ? next : previous;
}

/**
 * 
 * @param {Array<Object>} pressures Array of pressures
 * @param {Date} startTime Period start
 * @param {Date} endTime Period end
 * @returns Subset of pressures of the given period
 */
function getPressuresByPeriod(pressures, startTime, endTime)
{
	return pressures.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
}

/**
 * 
 * @param {Array<Object>} pressures Array of pressures
 * @returns Average pressure value
 */
function getPressureAverage(pressures) {
	let sum = 0;
	pressures.forEach((p) => {
		sum += p.value;
	});

	return sum / pressures.length;
}

function isSummer(isNorthernHemisphere = true) {
    let month = new Date().getMonth() + 1;
	let summer = month >= 4 && month <= 9; //April to September
	
	return isNorthernHemisphere ? summer : !summer;
}

/**
 * 
 * @param {number} celcius Celcius degrees
 * @returns Kelvin degrees
 */
function toKelvinFromCelcius(celcius) {
	return celcius + 273.15;
}

/**
 * 
 * @param {number} date Datetime
 * @returns {number} Day number of year
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * 
 * @param {datetime} date Datetime
 * @returns {number} 24-hour format hour of date
 */
function get24HourFormat(date) {
    return date.getHours();
}

/**
 * 
 * @param {number} latitude Latitude in decimal form, i.e. 63.123
 * @returns {boolean} true or false
 */
function isValidLatitude(latitude) {
    return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

function isNorthernHemisphere(latitude) {
	if(latitude === null) return true;
    return latitude > 0 ? true : false;
}

module.exports = {
	minutesFromNow,
	getPressuresSince,
	isSummer,
	adjustPressureToSeaLevel,
	toKelvinFromCelcius,
	getPressureClosestTo,
	getPressuresByPeriod,
	getPressureAverage,
	getDayOfYear,
	get24HourFormat,
	isValidLatitude,
	isNorthernHemisphere,
	MINUTES,
	KELVIN
}