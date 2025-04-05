const assert = require('assert');
const utils = require('../../src/utils');
const readingStore = require('../../src/readingStore');

describe("Utils Tests", function () {
	describe("Minutes from now", function () {

		it("it should equal", function () {
			//arrange
			const now = new Date();
			const expected = now.getHours() < 3 ? now.getHours() + 24 - 3 : now.getHours() - 3; //avoid midnight 00 to 02 problem
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

	

	describe("dayOfYear Tests", function () {
		it("it should equal 2025", function () {
			//arrange
			let date = new Date("2025-03-16");
			const expected = 75;
			//act
			var actual = utils.getDayOfYear(date);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should equal 2024", function () {
			//arrange
			let date = new Date("2024-03-16");
			const expected = 76;
			//act
			var actual = utils.getDayOfYear(date);
			//assert
			assert.strictEqual(actual, expected);
		});
	});

	describe("24 Hour Format Tests", function () {
		it("it should equal half hour", function () {
			//arrange
			let time = new Date("2025-03-16T14:30:00");
			const expected = 14;
			//act
			var actual = utils.get24HourFormat(time);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should equal late hour", function () {
			//arrange
			let time = new Date("2025-03-16T14:01:00");
			const expected = 14;
			//act
			var actual = utils.get24HourFormat(time);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should equal early hour", function () {
			//arrange
			let time = new Date("2025-03-16T14:59:00");
			const expected = 14;
			//act
			var actual = utils.get24HourFormat(time);
			//assert
			assert.strictEqual(actual, expected);
		});
	});

	describe("IsValidLatitude Tests", function () {
		it("it should not be less than 90", function () {
			//arrange
			let latitude = -90.01
			let expected = false;
			//act
			var actual = utils.isValidLatitude(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should not be more than 90", function () {
			//arrange
			let latitude = 90.01
			let expected = false;
			//act
			var actual = utils.isValidLatitude(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should be true", function () {
			//arrange
			let latitude = 45.123
			let expected = true;
			//act
			var actual = utils.isValidLatitude(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should be not be NaN", function () {
			//arrange
			let latitude = NaN
			let expected = false;
			//act
			var actual = utils.isValidLatitude(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should be not be null", function () {
			//arrange
			let latitude = null
			let expected = false;
			//act
			var actual = utils.isValidLatitude(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
	});

	describe("Is Northern Hemisphere Tests", function () {
		it("it should be northern", function () {
			//arrange
			let latitude = 1.123
			let expected = true;
			//act
			var actual = utils.isNorthernHemisphere(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should not be northern", function () {
			//arrange
			let latitude = -1.123
			let expected = false;
			//act
			var actual = utils.isNorthernHemisphere(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
		it("it should not be default nortern", function () {
			//arrange
			let latitude = null;
			let expected = true;
			//act
			var actual = utils.isNorthernHemisphere(latitude);
			//assert
			assert.strictEqual(actual, expected);
		});
	});
});