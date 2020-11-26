const fronts = require('./fronts.json');
const utils = require('../utils');

/**
 * 
 * @param {Array<Object>} pressures Array of pressure readings
 * @returns {Array<Object>} Front JSON object
 */
function getFront(pressures) {
	let threeHourPressure = utils.getPressuresSince(pressures, -180)[0];
	let twoHourPressure = utils.getPressuresSince(pressures, -120)[0];
	let oneHourPressure = utils.getPressuresSince(pressures, -60)[0];
	let nowPressure = pressures[pressures.length - 1];

	return analyzePressures(threeHourPressure.value, twoHourPressure.value, oneHourPressure.value, nowPressure.value);
}

function analyzePressures(hourThreePressure, hourTwoPressure, hourOnePressure, nowPressure)
{
	let t1 = getTendency(hourThreePressure, hourTwoPressure);
	let t2 = getTendency(hourTwoPressure, hourOnePressure);
	let t3 = getTendency(hourOnePressure, nowPressure);

	let key = t1.concat(t2, t3);
	let front = fronts.find((f) => f.key === key);
	return front !== undefined ? front : fronts.find((f) => f.key === "N/A");
}

function getTendency(earlier, later) {
	let difference = earlier - later;
	
	if(Math.abs(difference) < 10) return "S"; //STEADY
	if(difference > 0) return "F"; //FALLING
	if(difference < 0) return "R"; //RISING
}

module.exports = {
	getFront
}