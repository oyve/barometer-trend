import * as quadrantPrediction from '../../../src/predictions/byPressureTendencyAndWind';

describe("Pressure Tendency and Wind Tests", function () {
    describe("Northern Hemishpere - Get prediction by wind", function () {
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 280, "FALLING");
            //assert
            expect(actual).toBe("Changing weather");
        });

        it("it should equal a pressure below 102200", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(102100, 45, "STEADY");
            //assert
            expect(actual).toBe("No change");
        });

        it("it should equal a pressure below 999999", function () {
            //arrange     
            //act
            var actual = quadrantPrediction.getPrediction(102300, 100, "RISING");
            //assert
            expect(actual).toBe("Fair weather");
		});
    });
    
    describe("Southern Hemisphere - Get prediction by wind", function () {
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 45, "FALLING", null, false);
            //assert
            expect(actual).toBe("Changing weather");
        });

        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 135, "FALLING", null, false);
            //assert
            expect(actual).toBe("Increasing rain, clearing within 12 hours");
        });

        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 225, "FALLING", null, false);
            //assert
            expect(actual).toBe("Severe storm imminent, clearing within 24 hours");
        });
        
        it("it should equal a pressure below 100900", function () {
            //arrange
            //act
            var actual = quadrantPrediction.getPrediction(100800, 315, "FALLING", null, false);
            //assert
            expect(actual).toBe("Heavy rain, severe NE-gale and colder");
        });
    });
});