import * as utils from './utils';
import globals = require('./globals');
import readingStore = require('./readingStore');
import ForecastBase = require('./predictions/forecastBase');
import EMA = require('./EMA');
import { Tendency, Trend, TrendResult } from './types';

export const TENDENCY: { RISING: Tendency; FALLING: Tendency } = {
	RISING: { key: 'RISING' },
	FALLING: { key: 'FALLING' }
};

export const TREND: { 
	STEADY: Trend; 
	SLOWLY: Trend; 
	CHANGING: Trend; 
	QUICKLY: Trend; 
	RAPIDLY: Trend 
} = {
	STEADY: { key: 'STEADY', severity: 1, category: "Normal" },
	SLOWLY: { key: 'SLOWLY', severity: 2, category: "Minor" },
	CHANGING: { key: 'CHANGING', severity: 3, category: "Moderate" },
	QUICKLY: { key: 'QUICKLY', severity: 4, category: "Major" },
	RAPIDLY: { key: 'RAPIDLY', severity: 5, category: "Severe" }
};

interface ThresholdRatio {
	pascal: number;
	trend: Trend;
}

const THRESHOLDS_RATIO: ThresholdRatio[] = [
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

export class TrendAnalyzer extends ForecastBase
{
	constructor() {
		super();
	}

	private calculate(from: number): TrendResult | null {
		if (typeof from !== 'number') return null;
		if (from === 0) return null;

		const subsetOfPressuresRaw = readingStore.getAll(from).map(r => readingStore.getPressureByDefault(r));
		if (!subsetOfPressuresRaw || subsetOfPressuresRaw.length < 2) return null;
		
		let subsetOfPressures = subsetOfPressuresRaw;
		if(globals.applySmoothing) {
			const toSmoothen = [...subsetOfPressuresRaw];
			subsetOfPressures = EMA.process(toSmoothen);
		}

		const first = subsetOfPressures[0];
		const last = subsetOfPressures[subsetOfPressures.length - 1];

		const difference = last - first;
		const ratio = difference / Math.abs(from);

		const tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;
		const threshold = THRESHOLDS_RATIO.sort((a, b) => a.pascal - b.pascal).find((t) => Math.abs(ratio) < t.pascal);

		if (!threshold) return null;

		return {
			tendency: tendency.key,
			trend: threshold.trend,
			from: first,
			to: last,
			difference: difference,
			ratio: Math.abs(ratio),
			period: Math.abs(from)
		};
	}

	private pickHighestSeverity(earlier: TrendResult | null, later: TrendResult | null): TrendResult | null {
		if (!earlier) return later;
		if (!later) return earlier;
		return earlier.trend.severity > later.trend.severity ? earlier : later;
	}

	forecast(): TrendResult | null {
		const threeHours = this.calculate(TIME_PERIODS.THREE_HOURS);
		const oneHour = this.calculate(TIME_PERIODS.ONE_HOUR);

		if(threeHours === null && oneHour === null) return null;

		const actual = this.pickHighestSeverity(oneHour, threeHours);
		
		return actual;
	}
}
