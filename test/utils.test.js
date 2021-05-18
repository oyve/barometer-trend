const assert = require('assert');
const utils = require('../utils');

describe("Utils Tests", function () {
	describe("Minutes from now", function () {

		it("it should equal", function () {
			//arrange
			const expected = new Date().getHours() - 3;
			//act
			var actual = utils.minutesFromNow(-180).getHours();
			//assert
			assert.strictEqual(actual, expected);
		});
	});

	describe("Correct pressure to sea level with default temperature", function () {

		it("it should equal", function () {
			//arrange
			//act
			var actual = utils.adjustPressureToSeaLevel(98000, 100);
			//assert
			assert.strictEqual(actual, 99168);
		});

		it("Correct pressure to sea level with altitude and temperature", function () {
			//arrange
			//act
			var actual = utils.adjustPressureToSeaLevel(98000, 100, 30 + utils.KELVIN);
			//assert
			assert.strictEqual(actual, 99110);
		});

		it("Correct pressure to sea level with only temperature", function () {
			//arrange
			//act
			var actual = utils.adjustPressureToSeaLevel(98000, 0, 30 + utils.KELVIN);
			//assert
			assert.strictEqual(actual, 98000);
			//https://www.easycalculation.com/weather/temperature-barometer-correction.php
		});
	});

	
	describe("Find pressure closest to", function () {

		it("it should pick the previous", function () {
			//arrange
			const expected = 101400;
			const pressures = [
				{ datetime: utils.minutesFromNow(-61), value: expected },
				{ datetime: utils.minutesFromNow(-58), value: 101600 },
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.value, expected);
		});

		it("it should pick the next", function () {
			//arrange
			const expected = 101600;
			const pressures = [
				{ datetime: utils.minutesFromNow(-62), value: 101400 },
				{ datetime: utils.minutesFromNow(-59), value: expected },
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.value, expected);
		});

		it("it should pick the middle", function () {
			//arrange
			const expected = 101500;
			const pressures = [
				{ datetime: utils.minutesFromNow(-61), value: 101400 },
				{ datetime: utils.minutesFromNow(-60), value: expected },
				{ datetime: utils.minutesFromNow(-59), value: 101600 },
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.value, expected);
		});

		it("it should pick hour", function () {
			//arrange
			const expected = 101400;
			const pressures = [
				{ datetime: utils.minutesFromNow(-60*5), value: 101100 },
				{ datetime: utils.minutesFromNow(-60*4), value: 101200 },
				{ datetime: utils.minutesFromNow(-60*3), value: 101300 },
				{ datetime: utils.minutesFromNow(-60*2), value: expected },
				{ datetime: utils.minutesFromNow(-60*1), value: 101500 },
				{ datetime: new Date(), value: 101600 },
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60*2));
			//assert
			assert.strictEqual(actual.value, expected);
		});
	});
});