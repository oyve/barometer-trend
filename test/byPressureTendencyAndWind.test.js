const quadrantPrediction = require('../predictions/byPressureTendencyAndWind');
const assert = require('assert');

describe("By Pressure Tendency and Wind Tests", function () {
    describe("Get prediction by wind", function () {
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPredictionByQuadrant(100800, 280, "FALLING");
            //assert
            assert.strictEqual(actual, "Changing weather.");
        });

        it("it should equal a pressure below 102200", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPredictionByQuadrant(102100, 45, "STEADY");
            //assert
            assert.strictEqual(actual, "No change.");
        });

        it("it should equal a pressure below 999999", function () {
            //arrange     
            //act
            var actual = quadrantPrediction.getPredictionByQuadrant(102300, 100, "RISING");
            //assert
            assert.strictEqual(actual, "Fair weather.");
		});
	});
});