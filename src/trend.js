const utils = require('./utils');
const readingStore = require('./readingStore');

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
	{ pascal: 0.056, trend: TREND.STEADY }, //up to 10 Pa per 3 hours
	{ pascal: 0.89, trend: TREND.SLOWLY }, //10-160 Pa per 3 hours
	{ pascal: 2, trend: TREND.CHANGING }, //160-360 Pa per 3 hours
	{ pascal: 3.33, trend: TREND.QUICKLY }, //360-600 Pa per 3 hours
	{ pascal: 9999, trend: TREND.RAPIDLY }
];

function ascendingNumbers(a, b) {
	return a - b;
}

function getSeverityNotion(severity, tendency) {
    if(severity === 0) return severity;

    return tendency === TENDENCY.RISING ? severity : -severity;
}

function calculate(from) {
	if (readingStore.getAll().length < 2) return null;

	let subsetOfPressures = readingStore.getPressuresSince(from);

	if (subsetOfPressures.length >= 2) {
		let earlier = subsetOfPressures[0];
		let later = subsetOfPressures[subsetOfPressures.length - 1];

		let earlierValue = readingStore.getPressureByDefaultChoice(earlier);
		let laterValue = readingStore.getPressureByDefaultChoice(later);

		let difference = laterValue - earlierValue;
		let ratio = difference / from;
		let tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;
		
		let threshold = THRESHOLDS_RATIO.sort(ascendingNumbers).find((t) => Math.abs(ratio) < t.pascal);

		return {
			tendency: tendency.key,
			trend: threshold.trend.key,
			from: earlier,
			to: later,
			difference: difference,
			ratio: Math.abs(ratio),
			period: Math.abs(from),
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

function getTrend() {
	let threeHours = calculate(-utils.MINUTES.THREE_HOURS);
	let oneHour = calculate(-utils.MINUTES.ONE_HOUR);

    let actual = threeHours;
    actual = compareSeverity(oneHour, actual);
	
	return actual;
}

module.exports = {
	getTrend,
	TENDENCY,
	TREND
}