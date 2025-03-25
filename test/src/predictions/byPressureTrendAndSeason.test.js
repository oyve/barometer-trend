const byPressureTrendAndSeason = require('../../src/predictions/byPressureTrendAndSeason');
const assert = require('assert');

describe("By Pressure Trend And Seasons Tests", function () {
    describe("Pressure lower than 98205.3", function () {
        it("it should equal a RISING.RAPIDLY - winter", function () {
			//arrange
			const expected = "Fair for 48 hours, lower temperatures";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(97000, "RISING", "RAPIDLY", false);
            //assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal a RISING.RAPIDLY - summer", function () {
			//arrange
			const expected = "Gales, showers, colder";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(97000, "RISING", "RAPIDLY", true);
            //assert
			assert.strictEqual(actual, expected);
		});

		it("it should replace CHANGING with RAPIDLY - summer", function () {
			//arrange
			const expected = "Gales, showers, colder";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(97000, "RISING", "CHANGING", true);
            //assert
			assert.strictEqual(actual, expected);
		});

		it("it should replace QUICKLY with RAPIDLY - summer", function () {
			//arrange
			const expected = "Gales, showers, colder";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(97000, "RISING", "QUICKLY", true);
            //assert
			assert.strictEqual(actual, expected);
		});
	});
    describe("Pressure lower than 101592", function () {
        it("it should equal a STEADY.STEADY - winter", function () {
			//arrange
			const expected = "Cloudy and warmer";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(101000, "RISING", "STEADY", false);
            //assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal a STEADY.STEADY - summer", function () {
			//arrange
			const expected = "Little change";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(101000, "STEADY", "STEADY", true);
            //assert
			assert.strictEqual(actual, expected);
		});
	});
	describe("Pressure lower than 104978", function () {
        it("it should equal a FALLING.SLOWLY - winter", function () {
			//arrange
			const expected = "Cloudy, warmer, then rain or snow";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(104000, "FALLING", "SLOWLY", false);
            //assert
			assert.strictEqual(actual, expected);
		});

		it("it should equal a FALLING.SLOWLY - summer", function () {
			//arrange
			const expected = "Cloudy and more humid";
            //act
            var actual = byPressureTrendAndSeason.getPrediction(104000, "FALLING", "SLOWLY", true);
            //assert
			assert.strictEqual(actual, expected);
		});
	});
});

