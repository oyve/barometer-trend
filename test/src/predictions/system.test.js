const assert = require('assert');
const system = require('../../../src/predictions/system');

describe("Prediction System Tests", function () {
	describe("System match", function () {
		it("it should be NORMAL", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101400);
			//assert
			assert.strictEqual(actual.key, 1);
			assert.strictEqual(actual.name, "Normal");
		});

		it("it should be LOW", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(100500);
			//assert
			assert.strictEqual(actual.key, 0);
			assert.strictEqual(actual.name, "Low");
		});

		it("it should be LOW", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101000); //<- LOW THRESHOLD
			//assert
			assert.strictEqual(actual.key, 0);
			assert.strictEqual(actual.name, "Low");
		});

		it("it should be NORMAL 2", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101001); //<- LOW THRESHOLD
			//assert
			assert.strictEqual(actual.key, 1);
			assert.strictEqual(actual.name, "Normal");
		});

		it("it should be HIGH", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(102500);
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});

		it("it should be NORMAL", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101500); //<-HIGH THRESHOLD
			//assert
			assert.strictEqual(actual.key, 1);
			assert.strictEqual(actual.name, "Normal");
		});

		it("it should be HIGH 2", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101501); //<-HIGH THRESHOLD
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});
	});
	describe("getSystemByPressureTrend Tests", function () {
		it("it should be null", function () {
			//arrange
			const pressures = [
				{ datetime: new Date(), pressure: 101100 }
			];

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			assert.strictEqual(actual, null);
		});
		it("it should be trending to LOW", function () {
			//arrange
			const pressures = [
				{ datetime: new Date(), pressure: 101100 },
				{ datetime: new Date(), pressure: 101000 },
				{ datetime: new Date(), pressure: 100900 },
			];

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			assert.strictEqual(actual.key, 0);
			assert.strictEqual(actual.name, "Low");
		});
		it("it should be trending to NORMAL", function () {
			//arrange
			const pressures = [
				{ datetime: new Date(), pressure: 101100 },
				{ datetime: new Date(), pressure: 101200 },
				{ datetime: new Date(), pressure: 101300 },
			];

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			assert.strictEqual(actual.key, 1);
			assert.strictEqual(actual.name, "Normal");
		});
		it("it should be trending to HIGH", function () {
			//arrange
			const pressures = [
				{ datetime: new Date(), pressure: 101400 },
				{ datetime: new Date(), pressure: 101500 },
				{ datetime: new Date(), pressure: 101600 },
			];

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});

	});
});