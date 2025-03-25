const quadrantPrediction = require('../../src/predictions/byPressureTendencyAndWind');
const assert = require('assert');

describe("Pressure Tendency and Wind Tests", function () {
    describe("Northern Hemishpere - Get prediction by wind", function () {
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 280, "FALLING");
            //assert
            assert.strictEqual(actual, "Changing weather");
        });

        it("it should equal a pressure below 102200", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(102100, 45, "STEADY");
            //assert
            assert.strictEqual(actual, "No change");
        });

        it("it should equal a pressure below 999999", function () {
            //arrange     
            //act
            var actual = quadrantPrediction.getPrediction(102300, 100, "RISING");
            //assert
            assert.strictEqual(actual, "Fair weather");
		});
    });
    
    describe("Southern Hemisphere - Get prediction by wind", function () {
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 45, "FALLING", null, false);
            //assert
            assert.strictEqual(actual, "Changing weather");
        });

        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 135, "FALLING", null, false);
            //assert
            assert.strictEqual(actual, "Increasing rain, clearing within 12 hours");
        });

        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 225, "FALLING", null, false);
            //assert
            assert.strictEqual(actual, "Severe storm imminent, clearing within 24 hours");
        });
        
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 315, "FALLING", null, false);
            //assert
            assert.strictEqual(actual, "Heavy rain, severe NE-gale and colder");
        });
    });
});