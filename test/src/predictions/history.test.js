const assert = require('assert');
const history = require('../../src/predictions/history');
const barometer = require('../../../index');
const utils = require('../../src/utils');

describe("History Tests", function () {
	describe("Unit tests", function () {
		it("it should equal 5 hours", function () {
			//arrange
			//+1 = time will run past one hour mark - with only a reading per hour thus picking the hour before
			const pressures = [
				{ datetime: utils.minutesFromNow(-5 * 60), value: 101505 },
				{ datetime: utils.minutesFromNow(-4 * 60), value: 101504 },
				{ datetime: utils.minutesFromNow(-3 * 60), value: 101503 },
				{ datetime: utils.minutesFromNow(-2 * 60), value: 101502 },
				{ datetime: utils.minutesFromNow(-1 * 60), value: 101501 },
				{ datetime: new Date(), value: 101500 }
			];

			let actual = history.getHistoricPressures(pressures);

			//assert
			assert.strictEqual(actual.length, 48);

			assert.strictEqual(actual.find((h) => h.hour == 1).pressure.value, 101501);
			assert.strictEqual(actual.find((h) => h.hour == 2).pressure.value, 101502);
			assert.strictEqual(actual.find((h) => h.hour == 3).pressure.value, 101503);
			assert.strictEqual(actual.find((h) => h.hour == 4).pressure.value, 101504);
			assert.strictEqual(actual.find((h) => h.hour == 5).pressure.value, 101505);
		});

		it("it should equal 3 hours", function () {
			//arrange
			const pressures = [
				{ datetime: utils.minutesFromNow(-5 * 60), value: 101505 },
				{ datetime: utils.minutesFromNow(-4 * 60), value: 101504 },
				{ datetime: utils.minutesFromNow(-3 * 60), value: 101503 },
				{ datetime: utils.minutesFromNow(-2 * 60), value: 101502 },
				{ datetime: utils.minutesFromNow(-1 * 60), value: 101501 },
				{ datetime: new Date(), value: 101500 }
			];

			let actual = history.getHistoricPressures(pressures, 3);

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
			let actual = barometer.getPredictions().history;

			//assert
			assert.strictEqual(actual.length, 48);

			assert.strictEqual(actual.find((h) => h.hour == 1).pressure.value, 101501);
			assert.strictEqual(actual.find((h) => h.hour == 2).pressure.value, 101502);
			assert.strictEqual(actual.find((h) => h.hour == 3).pressure.value, 101503);
			assert.strictEqual(actual.find((h) => h.hour == 4).pressure.value, 101504);
			assert.strictEqual(actual.find((h) => h.hour == 5).pressure.value, 101505);
		});
	});
});
