const assert = require('assert');
const trend = require('../../src/trend');
const utils = require('../../src/utils');

describe("Prediction Rough Tests", function () {
	describe("THREE HOUR predictions", function () {

		it("it should RISING.STEADY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 5 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 11 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "SLOWLY");
		});

		it("it should RISING.SLOWLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 110 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "CHANGING");
		});
		
		it("it should RISING.QUICKLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 360 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 600 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "RAPIDLY");
		});

		it("it should FALLING.STEADY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 9 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 110 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "SLOWLY");
		});

		it("it should FALLING.CHANGING", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 180 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "CHANGING");
		});
		
		it("it should FALLING.QUICKLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 360 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "QUICKLY");
		});

		it("it should FALLING.RAPIDLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 700 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend, "RAPIDLY");
		});
	});

	describe("ONE HOUR predictions", function () {
		it("it should RISING.SLOWLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 60 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 100 }},
			];
			//actr
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 100 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "CHANGING");
		});

		it("it should RISING.QUICKLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 150 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 300 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 500 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 700 }},
			];
			//act
			var actual = trend.getTrend(pressures);
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend, "RAPIDLY");
		});
	});
});