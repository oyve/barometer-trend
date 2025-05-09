const assert = require('assert');
const system = require('../../../src/predictions/system');
const readingStore = require('../../../src/readingStore');
const { read } = require('fs');
const utils = require("../../../src/utils")

describe("System Tests", function () {
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
			readingStore.clear();
			const pressures = [
				{ datetime: new Date(), pressure: 101100 }
			];
			pressures.forEach((p) => readingStore.add(p.pressure));

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			assert.strictEqual(actual, null);
		});
		it("it should be trending to LOW", function () {
			//arrange
			readingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101100 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101000 },
				{ datetime: utils.minutesFromNow(-1), pressure: 100900 },
			];
			pressures.forEach((p) => readingStore.add(p.datetime, p.pressure));
			
			//act
			var actual = system.getSystemByPressureTrend(readingStore.getAll());
			//assert
			assert.strictEqual(actual.key, 0);
			assert.strictEqual(actual.name, "Low");
		});
		it("it should be trending to NORMAL", function () {
			//arrange
			readingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101100 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101200 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101300 },
			];
			pressures.forEach((p) => readingStore.add(p.datetime, p.pressure));
			//act
			var actual = system.getSystemByPressureTrend(readingStore.getAll());
			//assert
			assert.strictEqual(actual.key, 1);
			assert.strictEqual(actual.name, "Normal");
		});
		it("it should be trending to HIGH", function () {
			//arrange
			readingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101400 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101500 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101600 },
			];
			pressures.forEach((p) => readingStore.add(p.datetime, p.pressure));
			//act
			var actual = system.getSystemByPressureTrend(readingStore.getAll());
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});

	});
});