const assert = require('assert');
const beaufort = require('../predictions/beaufort');
const utils = require('../utils');

describe("Beaufort Tests", function () {
	describe("Get beafort prognose", function () {

		it("it should equal F6-7", function () {
			//arrange
			const expected = "F6-7";
			//act
			var actual = beaufort.getByPressureVariationRatio(+3);
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F8-9", function () {
			//arrange
			const expected = "F8-9";
			//act
			var actual = beaufort.getByPressureVariationRatio(+4);
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F10+", function () {
			//arrange
			const expected = "F10+";
			//act
			var actual = beaufort.getByPressureVariationRatio(+6);
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F6-7", function () {
			//arrange
			const expected = "F6-7";
			//act
			var actual = beaufort.getByPressureVariationRatio(-2);
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F8-12", function () {
			//arrange
			const expected = "F8-12";
			//act
			var actual = beaufort.getByPressureVariationRatio(-4);
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal Less than F6", function () {
			//arrange
			const expected = "Less than F6";
			//act
			var actual = beaufort.getByPressureVariationRatio(1);
			//assert
			assert.strictEqual(actual, expected);
		});
	});
});
