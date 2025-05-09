const fronts = require('./fronts.json');
const utils = require('../utils');
const regression = require('regression');
const readingStore = require('../readingStore');
const ForecastBase = require('./forecastBase');

const Pascal10 = 10;
const ONE_HOUR = 60;
const TWO_HOURS = 120;
const THREE_HOURS = 180;

const TIME_PERIODS = {
	THREE_HOURS: utils.minutesFromNow(-THREE_HOURS),
	TWO_HOURS: utils.minutesFromNow(-TWO_HOURS),
	ONE_HOUR: utils.minutesFromNow(-ONE_HOUR)
};

class FrontAnalyzer extends ForecastBase {

	constructor() {
		super();
	 }
	
	/**
	 * @description Get Front forecasts
	 * @returns {Array<Object>} Front JSON object
	 */
	forecast() {
		let {t1, t2, t3} = this.analyzePressures();

		if(!(t1 && t2 && t3)) return null;

		let key = [t1, t2, t3].join('');
		let front = fronts.find((f) => f.key === key);
		return front != undefined ? front : null;
	}

	analyzePressures() {
		let threeHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.THREE_HOURS, TIME_PERIODS.TWO_HOURS);
		let twoHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.TWO_HOURS, TIME_PERIODS.ONE_HOUR);
		let oneHourPressures = readingStore.getPressuresByPeriod(TIME_PERIODS.ONE_HOUR, new Date());

		if (!(threeHourPressures && twoHourPressures && oneHourPressures)) return frontNull;

		let t1 = this.getTendency(threeHourPressures, THREE_HOURS);
		let t2 = this.getTendency(twoHourPressures, TWO_HOURS);
		let t3 = this.getTendency(oneHourPressures, ONE_HOUR);

		return {t1, t2, t3};
	}

	regressPressures(pressures) {
		let minutelyPressures = [];
		let now = new Date();
		
		pressures.forEach((p) => {
			let diff = now - p.datetime;
			let hours = Math.round((diff/1000)/ONE_HOUR);
			minutelyPressures.push([hours, readingStore.getPressureByDefaultChoice(p)]);
		});

		let result = regression.linear(minutelyPressures);
		return result;
	}

	getTendency(pressures, start) {
		if (!pressures?.length) return null;

		let regression = this.regressPressures(pressures);
		if (!regression) return null; 

		let difference = regression.predict(start)[1] - regression.predict(start + ONE_HOUR)[1];
		if (Math.abs(difference) < Pascal10) return "S"; //STEADY
		if (difference > 0) return "R"; //RISING
		if (difference < 0) return "F"; //FALLING
	}
}

module.exports = FrontAnalyzer;