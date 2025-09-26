import fronts = require('./fronts.json');
import * as utils from '../utils';
import * as regression from 'regression';

interface Front {
	key: string | null;
	tendency: string | null;
	prognose: string | null;
	wind: string | null;
}

interface RegressionPoint {
	datetime: Date;
	value?: number; // for test data compatibility
	calculated?: {
		pressureASL: number;
	};
}

const Pascal10 = 10;
const ONE_HOUR = 60;
const TWO_HOURS = 120;
const THREE_HOURS = 180;

/**
 * Filter pressures within a specific time period (compatible with test data).
 */
function getPressuresByPeriodCompat(pressures: (utils.PressureReading | RegressionPoint)[], startTime: Date, endTime: Date): (utils.PressureReading | RegressionPoint)[] {
    return pressures.filter((p) => p.datetime.getTime() >= startTime.getTime() && p.datetime.getTime() <= endTime.getTime());
}

/**
 * 
 * @param pressures Array of pressure readings
 * @returns Front JSON object
 */
export function getFront(pressures: (utils.PressureReading | RegressionPoint)[]): Front | undefined {
	let threeHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-180), utils.minutesFromNow(-120));
	let twoHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-120), utils.minutesFromNow(-60));
	let oneHourPressures = getPressuresByPeriodCompat(pressures, utils.minutesFromNow(-60), new Date());

	return analyzePressures(threeHourPressures, twoHourPressures, oneHourPressures);
}

function analyzePressures(hourThreePressures: (utils.PressureReading | RegressionPoint)[], hourTwoPressures: (utils.PressureReading | RegressionPoint)[], hourOnePressures: (utils.PressureReading | RegressionPoint)[]): Front | undefined {
	let frontNull = (fronts as Front[]).find((f) => f.key === null);

	if (!(hourThreePressures && hourTwoPressures && hourOnePressures)) return frontNull;

	let t1 = getTendency(hourThreePressures, THREE_HOURS);
	let t2 = getTendency(hourTwoPressures, TWO_HOURS);
	let t3 = getTendency(hourOnePressures, ONE_HOUR);

	if(!(t1 && t2 && t3)) return frontNull;

	let key = t1.concat(t2, t3);
	console.debug("Front pattern: " + key);
	let front = (fronts as Front[]).find((f) => f.key === key);
	return front !== undefined ? front : frontNull;
}

function regressPressures(pressures: (utils.PressureReading | RegressionPoint)[]): regression.Result {
	let minutelyPressures: [number, number][] = [];
	let now = new Date();
	 
	pressures.forEach((p) => {
		let diff = now.getTime() - p.datetime.getTime();
		let min = Math.round((diff/1000)/ONE_HOUR);
		// Handle both test data format (with .value) and real data format (with .calculated.pressureASL)
		let pressureValue = 'value' in p && p.value !== undefined ? p.value : 
							'calculated' in p && p.calculated ? p.calculated.pressureASL : 0;
		minutelyPressures.push([min, pressureValue]);
	});

	let result = regression.linear(minutelyPressures);
	return result;
}

function getTendency(pressures: (utils.PressureReading | RegressionPoint)[], start: number): string | null {
	if (!pressures || pressures.length === 0) return null;
	
	let regressionResult = regressPressures(pressures);

	let difference = regressionResult.predict(start)[1] - regressionResult.predict(start + ONE_HOUR)[1];
	if (Math.abs(difference) < Pascal10) return "S"; //STEADY
	if (difference > 0) return "R"; //RISING
	if (difference < 0) return "F"; //FALLING
	
	return null;
}