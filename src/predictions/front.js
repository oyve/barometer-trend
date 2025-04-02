const fronts = require('./fronts.json');
const utils = require('../utils');
const regression = require('regression');

const Pascal10 = 10;
const ONE_HOUR = 60;
const TWO_HOURS = 120;
const THREE_HOURS = 180;

/**
 * 
 * @param {Array<Object>} pressures Array of pressure readings
 * @returns {Array<Object>} Front JSON object
 */
function getFront(pressures) {
	let threeHourPressures = utils.getPressuresByPeriod(pressures, utils.minutesFromNow(-180), utils.minutesFromNow(-120));
	let twoHourPressures = utils.getPressuresByPeriod(pressures, utils.minutesFromNow(-120), utils.minutesFromNow(-60));
	let oneHourPressures = utils.getPressuresByPeriod(pressures, utils.minutesFromNow(-60), new Date());

	return analyzePressures(threeHourPressures, twoHourPressures, oneHourPressures);
}

function analyzePressures(hourThreePressures, hourTwoPressures, hourOnePressures) {
	let frontNull = fronts.find((f) => f.key === null);

	if (!(hourThreePressures && hourTwoPressures && hourOnePressures)) return frontNull;

	let t1 = getTendency(hourThreePressures, THREE_HOURS);
	let t2 = getTendency(hourTwoPressures, TWO_HOURS);
	let t3 = getTendency(hourOnePressures, ONE_HOUR);

	if(!(t1 && t2 && t3)) return frontNull;

	let key = t1.concat(t2, t3);
	console.debug("Front pattern: " + key);
	let front = fronts.find((f) => f.key === key);
	return front !== undefined ? front : frontNull;
}

function regressPressures(pressures) {
	let minutelyPressures = [];
	let i = 0;
	let now = new Date();
	 
	pressures.forEach((p) => {
		let diff = now - p.datetime;
		let min = Math.round((diff/1000)/ONE_HOUR);
		minutelyPressures.push([min, p.value]);
	});

	let result = regression.linear(minutelyPressures);
	return result;
}

function getTendency(pressures, start) {
	let regression = regressPressures(pressures);

	let difference = regression.predict(start)[1] - regression.predict(start + ONE_HOUR)[1];
	if (Math.abs(difference) < Pascal10) return "S"; //STEADY
	if (difference > 0) return "R"; //RISING
	if (difference < 0) return "F"; //FALLING
}

module.exports = {
	getFront
}