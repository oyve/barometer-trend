const assert = require('assert');
const history = require('../../../src/predictions/history');
const barometer = require('../../../index');
const utils = require('../../../src/utils');
const readingStore = require('../../../src/readingStore');

describe("History Tests", function () {
	describe("Unit tests", function () {
		it("it should equal 5 hours", function () {
			//arrange
			readingStore.clear();
			//+1 = time will run past one hour mark - with only a reading per hour thus picking the hour before
			const pressures = [
				{ datetime: utils.minutesFromNow(-5 * 60), pressure: 101505 },
				{ datetime: utils.minutesFromNow(-4 * 60), pressure: 101504 },
				{ datetime: utils.minutesFromNow(-3 * 60), pressure: 101503 },
				{ datetime: utils.minutesFromNow(-2 * 60), pressure: 101502 },
				{ datetime: utils.minutesFromNow(-1 * 60), pressure: 101501 },
				{ datetime: new Date(), pressure: 101500 }
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.pressure));
			let actual = history.getHistoricPressures();

			//assert
			assert.strictEqual(actual.length, 48);

			assert.strictEqual(actual.find((h) => h.hour == 1).pressure.pressure, 101501);
			assert.strictEqual(actual.find((h) => h.hour == 2).pressure.pressure, 101502);
			assert.strictEqual(actual.find((h) => h.hour == 3).pressure.pressure, 101503);
			assert.strictEqual(actual.find((h) => h.hour == 4).pressure.pressure, 101504);
			assert.strictEqual(actual.find((h) => h.hour == 5).pressure.pressure, 101505);
		});

		it("it should equal 3 hours", function () {
			//arrange
			readingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-5 * 60), pressure: 101505 },
				{ datetime: utils.minutesFromNow(-4 * 60), pressure: 101504 },
				{ datetime: utils.minutesFromNow(-3 * 60), pressure: 101503 },
				{ datetime: utils.minutesFromNow(-2 * 60), pressure: 101502 },
				{ datetime: utils.minutesFromNow(-1 * 60), pressure: 101501 },
				{ datetime: new Date(), pressure: 101500 }
			];

			pressures.forEach(p => readingStore.add(p.datetime, p.pressure));

			let actual = history.getHistoricPressures(3);

			//assert
			assert.strictEqual(actual.length, 3);
		});
	});

	describe("Function tests", function () {

		it("it should equal 5 hours", function () {
			//arrange
			barometer.clear();

			//+1 = time will run past one hour mark - with only a reading per hour thus picking the hour before
			barometer.addPressure(utils.minutesFromNow(-5 * 60), 101505);
			barometer.addPressure(utils.minutesFromNow(-4 * 60), 101504);
			barometer.addPressure(utils.minutesFromNow(-3 * 60), 101503);
			barometer.addPressure(utils.minutesFromNow(-2 * 60), 101502);
			barometer.addPressure(utils.minutesFromNow(-1 * 60), 101501);
			barometer.addPressure(utils.minutesFromNow(0), 101500);

			//act
			let asdf = barometer.getForecast()
			let actual = asdf.history;
			//let actual = barometer.getForecast().history;

			//assert
			assert.strictEqual(actual.length, 48);

			assert.strictEqual(actual.find((h) => h.hour == 1).pressure.calculated.pressureASL, 101501);
			assert.strictEqual(actual.find((h) => h.hour == 2).pressure.calculated.pressureASL, 101502);
			assert.strictEqual(actual.find((h) => h.hour == 3).pressure.calculated.pressureASL, 101503);
			assert.strictEqual(actual.find((h) => h.hour == 4).pressure.calculated.pressureASL, 101504);
			assert.strictEqual(actual.find((h) => h.hour == 5).pressure.calculated.pressureASL, 101505);
		});
	});
});
