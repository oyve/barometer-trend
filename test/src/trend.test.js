const assert = require('assert');
const trend = require('../../src/trend');
const utils = require('../../src/utils');
const globals = require('../../src/globals');
const readingStore = require('../../src/readingStore');


const trendAnalyzer = new trend.TrendAnalyzer(); 

describe("Trend Tests", function () {
	describe("THREE HOUR predictions", function () {

		it("it should RISING.STEADY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 5 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 11 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "SLOWLY");
		});

		it("it should RISING.SLOWLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 110 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "CHANGING");
		});
		
		it("it should RISING.QUICKLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 360 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 600 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "RAPIDLY");
		});

		it("it should FALLING.STEADY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 9 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 110 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "SLOWLY");
		});

		it("it should FALLING.CHANGING", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 180 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "CHANGING");
		});
		
		it("it should FALLING.QUICKLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 360 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "QUICKLY");
		});

		it("it should FALLING.RAPIDLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 700 }},
			];
			//act
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "FALLING");
			assert.strictEqual(actual.trend.key, "RAPIDLY");
		});
	});

	describe("ONE HOUR predictions", function () {
		it("it should RISING.SLOWLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 60 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 100 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 100 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "CHANGING");
		});

		it("it should RISING.QUICKLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), pressure: 101350},
				{ datetime: utils.minutesFromNow(-55), pressure: 101350 + 150},
				{ datetime: utils.minutesFromNow(-1), pressure: 101350 + 360},
			];
			pressures.forEach(p => readingStore.add(p.datetime, p.pressure));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			readingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 500 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 700 }},
			];
			
			pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));

			//act
			var actual = trendAnalyzer.forecast();
			//assert
			assert.strictEqual(actual.tendency, "RISING");
			assert.strictEqual(actual.trend.key, "RAPIDLY");
		});
	});
});