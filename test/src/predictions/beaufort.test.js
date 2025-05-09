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

	
	describe('getWindDirectionByDegree', () => {
		it('should be actual force', () => {
			//arrange
			let windSpeeds = [0, 0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.2, 41.5, 46.2, 51.0, 56.0];
			//act
			let i = 0;
			windSpeeds.forEach((windSpeed) => {
				let actual = beaufort.getBeaufortScaleByWindSpeed(windSpeed);
				//assert
				assert.strictEqual(actual?.force, i);
				i++;
			});
		});
		it('should round decimals up', () => {
			//arrange
			let expected = 3;
			//act
			let actual = beaufort.getBeaufortScaleByWindSpeed(5.44);
			//assert
			assert.strictEqual(actual?.force, expected);
		});
		it('should round decimals down', () => {
			//arrange
			let expected = 4;
			//act
			let actual = beaufort.getBeaufortScaleByWindSpeed(5.45);
			//assert
			assert.strictEqual(actual?.force, expected);
		});
	});
});
