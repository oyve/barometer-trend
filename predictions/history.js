const utils = require('../utils');

/**
 * 
 * @param {Array<Object>} pressures Pressures
 * @param {number} limit Number of historic values to return
 * @returns [{hour: hour, pressure: pressure}]
 */
function getHistoricPressures(pressures, limit = 48) {
	let historicPressures = [];

	for (hour = 1; hour <= limit; hour++) {
		let threshold = utils.minutesFromNow(-hour * 60);

		let pressure = utils.getPressureClosestTo(pressures, threshold);

		if (pressure !== null && isLessThanOld(pressure.datetime, threshold, 30)) {
			historicPressures.push({ hour: hour, pressure: pressure });
		} else {
			historicPressures.push({ hour: hour, pressure: null });
		}
	}

	return historicPressures;
}

/**
 * 
 * @param {Date} actual The actual pressure time
 * @param {Date} threshold Threshold time
 * @param {number} minutes Max number of minutes difference
 * @returns 
 */
function isLessThanOld(actual, threshold, minutes) {
	return (actual.getTime() - threshold.getTime()) < minutes * 60 * 1000;
}

module.exports = {
	getHistoricPressures
}