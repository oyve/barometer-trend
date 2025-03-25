const assert = require('assert');
const beaufort = require('../../../src/predictions/beaufort');

describe("Beaufort Tests", function () {
	describe("Get beaufort prognose", function () {

		it("it should equal F6-7", function () {
			//arrange
			const expected = "F6-7";
			//act
			var actual = beaufort.getByPressureVariationRatio(+3).force;
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F8-9", function () {
			//arrange
			const expected = "F8-9";
			//act
			var actual = beaufort.getByPressureVariationRatio(+4).force;
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F10+", function () {
			//arrange
			const expected = "F10+";
			//act
			var actual = beaufort.getByPressureVariationRatio(+6).force;
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F6-7", function () {
			//arrange
			const expected = "F6-7";
			//act
			var actual = beaufort.getByPressureVariationRatio(-2).force;
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal F8-12", function () {
			//arrange
			const expected = "F8-12";
			//act
			var actual = beaufort.getByPressureVariationRatio(-4).force;
			//assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal Less than F6", function () {
			//arrange
			const expected = "Less than F6";
			//act
			var actual = beaufort.getByPressureVariationRatio(1).force;
			//assert
			assert.strictEqual(actual, expected);
		});
	});
});
