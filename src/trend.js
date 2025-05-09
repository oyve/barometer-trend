const utils = require('./utils');
const globals = require('./globals');
const readingStore = require('./readingStore');
const ForecastBase = require('./predictions/forecastBase');
const EMA = require('./EMA');

const TENDENCY = {
	RISING: { key: 'RISING' },
	FALLING: { key: 'FALLING' }
};

const TREND = {
	STEADY: { key: 'STEADY', severity: 1, category: "Normal" },
	SLOWLY: { key: 'SLOWLY', severity: 2, category: "Minor" },
	CHANGING: { key: 'CHANGING', severity: 3, category: "Moderate" },
	QUICKLY: { key: 'QUICKLY', severity: 4, category: "Major" },
	RAPIDLY: { key: 'RAPIDLY', severity: 5, category: "Severe" }
};

const THRESHOLDS_RATIO = [
	{ pascal: 0.056, trend: TREND.STEADY }, //up to 10 Pa per 3 hours
	{ pascal: 0.89, trend: TREND.SLOWLY }, //10-160 Pa per 3 hours
	{ pascal: 2, trend: TREND.CHANGING }, //160-360 Pa per 3 hours
	{ pascal: 3.33, trend: TREND.QUICKLY }, //360-600 Pa per 3 hours
	{ pascal: 9999, trend: TREND.RAPIDLY }
];

const TIME_PERIODS = {
    THREE_HOURS: utils.MINUTES.THREE_HOURS,
    ONE_HOUR: utils.MINUTES.ONE_HOUR
};

class TrendAnalyzer extends ForecastBase
{
	constructor() {
		super();
	}

	#calculate(from) {
		if (typeof from !== 'number') return null;
		if (from === 0) return null;

		let subsetOfPressures = readingStore.getPressuresSince(from).map(r => readingStore.getPressureByDefaultChoice(r));
		if (!subsetOfPressures || subsetOfPressures.length < 2) return null;
		
		if(globals.applySmoothing) {
			toSmoothen = [...subsetOfPressures]
			subsetOfPressures = EMA.process(toSmoothen)
		}

		let first = subsetOfPressures[0];
		let last = subsetOfPressures[subsetOfPressures.length - 1];

		let difference = last - first;
		let ratio = difference / from;

		let tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;
		let threshold = THRESHOLDS_RATIO.sort((a, b) => a.pascal - b.pascal).find((t) => Math.abs(ratio) < t.pascal);

		return {
			tendency: tendency.key,
			trend: threshold.trend,
			from: first,
			to: last,
			difference: difference,
			ratio: Math.abs(ratio),
			period: Math.abs(from)
		}
	}

	#pickHighestSeverity(earlier, later) {
		if (!earlier) return later;
		if (!later) return earlier;
		return earlier.severity > later.severity ? earlier : later;
	}

	forecast() {
		let threeHours = this.#calculate(TIME_PERIODS.THREE_HOURS);
		let oneHour = this.#calculate(TIME_PERIODS.ONE_HOUR);

		if(threeHours === null && oneHour === null) return null;

		let actual = this.#pickHighestSeverity(oneHour, threeHours);
		
		return actual;
	}
}

module.exports = {
	TrendAnalyzer,
	TENDENCY,
	TREND
}