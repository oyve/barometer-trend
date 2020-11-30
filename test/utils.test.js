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
			var actual = utils.adjustPressureToSeaLevel(98000, 100, 30);
			//assert
			assert.strictEqual(actual, 99110);
		});
	});
});