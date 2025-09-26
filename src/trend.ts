import * as utils from './utils';

export interface TendencyType {
	key: string;
}

export interface TrendType {
	key: string;
	severity: number;
}

export interface ThresholdRatio {
	pascal: number;
	trend: TrendType;
}

export interface TrendResult {
	tendency: string;
	trend: string;
	from: utils.PressureReading;
	to: utils.PressureReading;
	difference: number;
	ratio: number;
	period: number;
	severity: number;
}

export const TENDENCY = {
	RISING: { key: 'RISING' },
	FALLING: { key: 'FALLING' }
};

export const TREND = {
	STEADY: { key: 'STEADY', severity: 0 },
	SLOWLY: { key: 'SLOWLY', severity: 1 },
	CHANGING: { key: 'CHANGING', severity: 2 },
	QUICKLY: { key: 'QUICKLY', severity: 3 },
	RAPIDLY: { key: 'RAPIDLY', severity: 4 }
};

const THRESHOLDS_RATIO: ThresholdRatio[] = [
	{ pascal: 0.056, trend: TREND.STEADY }, //up to 10 Pa per 3 hours
	{ pascal: 0.89, trend: TREND.SLOWLY }, //10-160 Pa per 3 hours
	{ pascal: 2, trend: TREND.CHANGING }, //160-360 Pa per 3 hours
	{ pascal: 3.33, trend: TREND.QUICKLY }, //360-600 Pa per 3 hours
	{ pascal: 9999, trend: TREND.RAPIDLY }
];

function ascendingNumbers(a: ThresholdRatio, b: ThresholdRatio): number {
	return a.pascal - b.pascal;
}

function getSeverityNotion(severity: number, tendency: TendencyType): number {
    if(severity === 0) return severity;

    return tendency === TENDENCY.RISING ? severity : -severity;
}

function calculate(pressures: utils.PressureReading[], from: number, useDiurnal: boolean = false): TrendResult | null {
	if (pressures.length < 2) return null;

	let subsetOfPressures = utils.getPressuresSince(pressures, from);

	if (subsetOfPressures.length >= 2) {
		let earlier = subsetOfPressures[0];
		let later = subsetOfPressures[subsetOfPressures.length - 1];

		let earlierValue = useDiurnal && earlier?.calculated?.diurnalPressure !== null && earlier?.calculated?.diurnalPressure !== undefined
		? earlier.calculated.diurnalPressure  
		: earlier.calculated.pressureASL;

		let laterValue = useDiurnal && later?.calculated?.diurnalPressure !== null && later?.calculated?.diurnalPressure !== undefined
		? later.calculated.diurnalPressure  
		: later.calculated.pressureASL;

		let difference = laterValue - earlierValue;
		let ratio = difference / from;
		let tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;
		
		let threshold = THRESHOLDS_RATIO.sort(ascendingNumbers).find((t) => Math.abs(ratio) < t.pascal);

		if (!threshold) {
			threshold = THRESHOLDS_RATIO[THRESHOLDS_RATIO.length - 1];
		}

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

function compareSeverity(earlier: TrendResult | null, later: TrendResult | null): TrendResult | null {
	if (earlier !== null && later !== null && earlier.severity > later.severity) {
		return earlier;
	}

    return later;
}

export function getTrend(pressures: utils.PressureReading[], useDiurnal: boolean = false): TrendResult | null {
	let threeHours = calculate(pressures, -utils.MINUTES.THREE_HOURS, useDiurnal);
	let oneHour = calculate(pressures, -utils.MINUTES.ONE_HOUR, useDiurnal);

    let actual = threeHours;
    actual = compareSeverity(oneHour, actual);
	
	return actual;
}