const assert = require('assert');
const utils = require('../../src/utils');

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

	
	describe("Find pressure closest to", function () {

		it("it should pick the previous", function () {
			//arrange
			const expected = 101400;
			const pressures = [
				{ datetime: utils.minutesFromNow(-61), calculated: { pressureASL: expected }},
				{ datetime: utils.minutesFromNow(-58), calculated: { pressureASL: 101600 }},
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.calculated.pressureASL, expected);
		});

		it("it should pick the next", function () {
			//arrange
			const expected = 101600;
			const pressures = [
				{ datetime: utils.minutesFromNow(-62), calculated: { pressureASL: 101400 }},
				{ datetime: utils.minutesFromNow(-59), calculated: { pressureASL: expected }},
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.calculated.pressureASL, expected);
		});

		it("it should pick the middle", function () {
			//arrange
			const expected = 101500;
			const pressures = [
				{ datetime: utils.minutesFromNow(-61), calculated: { pressureASL: 101400 }},
				{ datetime: utils.minutesFromNow(-60), calculated: { pressureASL: expected }},
				{ datetime: utils.minutesFromNow(-59), calculated: { pressureASL: 101600 }},
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60));
			//assert
			assert.strictEqual(actual.calculated.pressureASL, expected);
		});

		it("it should pick hour", function () {
			//arrange
			const expected = 101400;
			const pressures = [
				{ datetime: utils.minutesFromNow(-60*5), calculated: { pressureASL: 101100 }},
				{ datetime: utils.minutesFromNow(-60*4), calculated: { pressureASL: 101200 }},
				{ datetime: utils.minutesFromNow(-60*3), calculated: { pressureASL: 101300 }},
				{ datetime: utils.minutesFromNow(-60*2), calculated: { pressureASL: expected }},
				{ datetime: utils.minutesFromNow(-60*1), calculated: { pressureASL: 101500 }},
				{ datetime: new Date(), calculated: { pressureASL: 101600 }},
			];
			//act
			var actual = utils.getPressureClosestTo(pressures, utils.minutesFromNow(-60*2));
			//assert
			assert.strictEqual(actual.calculated.pressureASL, expected);
		});
	});

	describe("getPressureAverageByTime Test", function () {

		it("it should average", function () {
			//arrange
			const expected = 101950;
			const pressures = [
				{ datetime: utils.minutesFromNow(-59), calculated: { pressureASL: 101800 }},
				{ datetime: utils.minutesFromNow(-30), calculated: { pressureASL: 101900 }},
				{ datetime: utils.minutesFromNow(-10), calculated: { pressureASL: 102000 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 102100 }}
			];
			let subset = utils.getPressuresByPeriod(pressures, utils.minutesFromNow(-60), new Date());
			//act
			var actual = utils.getPressureAverage(subset);
			//assert
			assert.strictEqual(actual, expected);
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