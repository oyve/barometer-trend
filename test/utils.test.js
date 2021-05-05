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

	describe("Correct pressure to sea level", function () {

		it("it should equal", function () {
			//arrange
			//act
			var actual = utils.adjustPressureToSeaLevel(98000, 100);
			//assert
			assert.strictEqual(actual, 99168);
		});

		it("it should equal with temperature", function () {
			//arrange
			//act
			var actual = utils.adjustPressureToSeaLevel(98000, 100, 30 + utils.KELVIN);
			//assert
			assert.strictEqual(actual, 99110);
		});
	});

	describe("Correct to SI units", function () {

		it("it should be SI units", function () {
			//arrange
			let pressure = 1015.48;
			let temperature = 12.5;

			let SIUnits = utils.toSIUnits(pressure, temperature); //hPa and Celcius degrees

			//assert
			assert.strictEqual(SIUnits.pressure, pressure * 100);
			assert.strictEqual(SIUnits.temperature, temperature + utils.KELVIN);
		});
	});
});