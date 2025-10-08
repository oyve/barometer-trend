import fronts = require('./fronts.json');
import * as utils from '../utils';
import * as regression from 'regression';
import readingStore = require('../readingStore');
import ForecastBase = require('./forecastBase');
import { Reading } from '../types';

const Pascal10 = 10;
const ONE_HOUR = 60;
const TWO_HOURS = 120;
const THREE_HOURS = 180;

const TIME_PERIODS = {
	THREE_HOURS: utils.minutesFromNow(-THREE_HOURS),
	TWO_HOURS: utils.minutesFromNow(-TWO_HOURS),
	ONE_HOUR: utils.minutesFromNow(-ONE_HOUR)
};

interface FrontResult {
	key: string;
	tendency: string;
	prognose: string;
	wind: string;
}

interface AnalyzedPressures {
	t1: string | null;
	t2: string | null;
	t3: string | null;
}

class FrontAnalyzer extends ForecastBase {

	constructor() {
		super();
	 }
	
	/**
	 * @description Get Front forecasts
	 * @returns Front JSON object
	 */
	forecast(): FrontResult | null {
		const {t1, t2, t3} = this.analyzePressures();

		if(!(t1 && t2 && t3)) return null;

		const key = [t1, t2, t3].join('');
		const front = (fronts as FrontResult[]).find((f) => f.key === key);
		return front !== undefined ? front : null;
	}

	analyzePressures(): AnalyzedPressures {
		const threeHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.THREE_HOURS, TIME_PERIODS.TWO_HOURS);
		const twoHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.TWO_HOURS, TIME_PERIODS.ONE_HOUR);
		const oneHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.ONE_HOUR, new Date());

		if (!(threeHourPressures && twoHourPressures && oneHourPressures)) {
			return { t1: null, t2: null, t3: null };
		}

		const t1 = this.getTendency(threeHourPressures, THREE_HOURS);
		const t2 = this.getTendency(twoHourPressures, TWO_HOURS);
		const t3 = this.getTendency(oneHourPressures, ONE_HOUR);

		return {t1, t2, t3};
	}

	regressPressures(pressures: Reading[]): regression.Result {
		const minutelyPressures: [number, number][] = [];
		const now = new Date();
		
		pressures.forEach((p) => {
			const diff = now.getTime() - p.datetime.getTime();
			const hours = Math.round((diff/1000)/ONE_HOUR);
			minutelyPressures.push([hours, readingStore.getPressureByDefaultChoice(p)]);
		});

		const result = regression.linear(minutelyPressures);
		return result;
	}

	getTendency(pressures: Reading[], start: number): string | null {
		if (!pressures?.length) return null;

		const regressionResult = this.regressPressures(pressures);
		if (!regressionResult) return null; 

		const difference = regressionResult.predict(start)[1] - regressionResult.predict(start + ONE_HOUR)[1];
		if (Math.abs(difference) < Pascal10) return "S"; //STEADY
		if (difference > 0) return "R"; //RISING
		if (difference < 0) return "F"; //FALLING
		return null;
	}
}

export = FrontAnalyzer;
