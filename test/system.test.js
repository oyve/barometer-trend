const assert = require('assert');
const system = require('../predictions/system');

describe("Prediction System Tests", function () {
	describe("getHighLow", function () {

		it("it should be NORMAL", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101500);
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
			var actual = system.getSystemByPressure(100914.4); //<- TEST MARGIN
			//assert
			assert.strictEqual(actual.key, 0);
			assert.strictEqual(actual.name, "Low");
		});

		it("it should be HIGH", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(102500);
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});

		it("it should be HIGH", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(102268.9); //<-TEST MARGIN
			//assert
			assert.strictEqual(actual.key, 2);
			assert.strictEqual(actual.name, "High");
		});
	});
});