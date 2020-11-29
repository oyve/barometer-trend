const utils = require('./utils');

const TWENTY_MINUTES = 20;
const ONE_HOUR = 60;
const THREE_HOURS = 180;

const TENDENCY = {
	RISING: { key: 'RISING' },
	FALLING: { key: 'FALLING' }
};

const TREND = {
	STEADY: { key: 'STEADY', severity: 0 },
	SLOWLY: { key: 'SLOWLY', severity: 1 },
	CHANGING: { key: 'CHANGING', severity: 2 },
	QUICKLY: { key: 'QUICKLY', severity: 3 },
	RAPIDLY: { key: 'RAPIDLY', severity: 4 }
};

const THRESHOLDS_RATIO = [
	{ pascal: 0.56, trend: TREND.STEADY }, //up to 100 Pa per 3 hours
	{ pascal: 0.89, trend: TREND.SLOWLY }, //160 Pa per 3 hours
	{ pascal: 2, trend: TREND.CHANGING }, //360 Pa per 3 hours
	{ pascal: 3.33, trend: TREND.QUICKLY }, //600 Pa per 3 hours
	{ pascal: 9999, trend: TREND.RAPIDLY }
];

function ascendingNumbers(a, b) {
	return a - b;
}

function getSeverityNotion(severity, tendency) {
    if(severity === 0) return severity;

    return tendency === TENDENCY.RISING ? severity : -severity;
}

function calculate(pressures, from) {
	if (pressures.length < 2) return null;

	let subsetOfPressures = utils.getPressuresSince(pressures, from);

	if (subsetOfPressures.length >= 2) {
		let earlier = subsetOfPressures[0];
		let later = subsetOfPressures[subsetOfPressures.length - 1];
		let difference = later.value - earlier.value;
		let ratio = difference / from;
		let tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;
		
		let threshold = THRESHOLDS_RATIO.sort(ascendingNumbers).find((t) => Math.abs(ratio) < t.pascal);

		return {
			tendency: tendency.key,
			trend: threshold.trend.key,
			from: earlier.value,
			to: later.value,
			difference: difference,
			ratio: ratio,
			period: from,
			severity: getSeverityNotion(threshold.trend.severity, tendency),
		}
	}

	return null;
}

function compareSeverity(earlier, later) {
	if (earlier !== null && later !== null && earlier.severity > later.severity) {
		return earlier;
	}

    return later;
}

function getTrend(pressures) {
	let threeHours = calculate(pressures, -utils.MINUTES.THREE_HOURS);
	let oneHour = calculate(pressures, -utils.MINUTES.ONE_HOUR);

    let actual = threeHours;
    actual = compareSeverity(oneHour, actual);
	
	return actual;
}

module.exports = {
	getTrend,
	TENDENCY,
	TREND
}