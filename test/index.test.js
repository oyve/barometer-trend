const barometer = require('../index');
const assert = require('assert');

describe("Pressure - Unit Tests", function () {
    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            barometer.clear();
            barometer.addPressure(new Date(), 1015);

            //assert
            assert.ok(true, "My function does not crash");
        });
    });
});



describe("Pressure - Integration Tests", function () {
    describe("Get Trend", function () {
        it("it should be null", function () {
            //arrange
            barometer.clear();
            barometer.addPressure(new Date(), 1015);
            const expected = null;

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual, expected);
        });

        it("it should be RISING.STEADY", function () {
            //arrange
            mockPressures(1015, 1016, 1015 + 9);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "STEADY");
        });
        
        it("it should be RISING.SLOWLY", function () {
            //arrange
            mockPressures(1015, 1016, 1015 + 15);
            
            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "SLOWLY");
        });

        it("it should be RISING.CHANGING", function () {
            //arrange
            mockPressures(1015, 1016, 1015 + 16);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "CHANGING");
        });

        it("it should be RISING.QUICKLY", function () {
            //arrange
            mockPressures(1015, 1016, 1015 + 36);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "QUICKLY");
        });

        it("it should be RISING.RAPIDLY", function () {
            //arrange
            mockPressures(1015, 1016, 1015 + 60);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "RAPIDLY");
        });

        it("it should be FALLING.STEADY", function () {
            //arrange
            mockPressures(1015 + 9, 1016, 1015);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "STEADY");
        });

        it("it should be FALLING.SLOWLY", function () {
            //arrange
            mockPressures(1015 + 15, 1016, 1015);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "SLOWLY");
        });

        it("it should be FALLING.CHANGING", function () {
            //arrange
            mockPressures(1015 + 16, 1016, 1015);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "CHANGING");
        });

        it("it should be FALLING.QUICKLY", function () {
            //arrange
            mockPressures(1015 + 36, 1016, 1015);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "QUICKLY");
        });

        it("it should be FALLING.RAPIDLY", function () {
            //arrange     
            mockPressures(1015 + 60, 1016, 1015);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "RAPIDLY");
        });
    });
});

function mockPressures(pressure1, pressure2, pressure3) {
    barometer.clear();
    barometer.addPressure(barometer.minutesFromNow(-20), pressure1);
    barometer.addPressure(barometer.minutesFromNow(-10), pressure2);
    barometer.addPressure(barometer.minutesFromNow(0), pressure3);
}