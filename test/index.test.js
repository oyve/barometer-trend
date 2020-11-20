const barometer = require('../index');
const assert = require('assert');

describe("Unit Tests", function () {
    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            barometer.clear();
            barometer.addPressure(new Date(), 101500);

            //assert
            assert.ok(true, "My function does not crash");
        });
    });
    describe("Has pressure", function () {
        it("it should not have", function () {
            //arrange
            barometer.clear();
            let expected = false;
            //act
            let actual = barometer.hasPressures();
        
            //assert
            assert.strictEqual(actual, expected)
        });
        it("it should have", function () {
            //arrange
            barometer.clear();
            let expected = true;
            barometer.addPressure(new Date(), 101500);
            //act
            let actual = barometer.hasPressures();
        
            //assert
            assert.strictEqual(actual, expected)
        });
    });
});



describe("Integration Tests", function () {
    describe("Get Trend", function () {
        it("it should be null", function () {
            //arrange
            barometer.clear();
            barometer.addPressure(new Date(), 101500);
            const expected = null;

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual, expected);
        });

        it("it should be RISING.STEADY", function () {
            //arrange
            mockPressures(101500, 9);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "STEADY");
            assert.strictEqual(actual.severity, 0);
        });
        
        it("it should be RISING.SLOWLY", function () {
            //arrange
            mockPressures(1015, 15);
            
            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "SLOWLY");
            assert.strictEqual(actual.severity, 1);
        });

        it("it should be RISING.CHANGING", function () {
            //arrange
            mockPressures(1015, 16);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "CHANGING");
            assert.strictEqual(actual.severity, 2);
        });

        it("it should be RISING.QUICKLY", function () {
            //arrange
            mockPressures(101500, 36);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "QUICKLY");
            assert.strictEqual(actual.severity, 3);
        });

        it("it should be RISING.RAPIDLY", function () {
            //arrange
            mockPressures(101500, 60);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "RAPIDLY");
            assert.strictEqual(actual.severity, 4);
        });

        it("it should be FALLING.STEADY", function () {
            //arrange
            mockPressures(101500, -9);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "STEADY");
            assert.strictEqual(actual.severity, 0);
        });

        it("it should be FALLING.SLOWLY", function () {
            //arrange
            mockPressures(101500, -15);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "SLOWLY");
            assert.strictEqual(actual.severity, -1);
        });

        it("it should be FALLING.CHANGING", function () {
            //arrange
            mockPressures(101500, -16);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "CHANGING");
            assert.strictEqual(actual.severity, -2);
        });

        it("it should be FALLING.QUICKLY", function () {
            //arrange
            mockPressures(101500, -36);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "QUICKLY");
            assert.strictEqual(actual.severity, -3);
        });

        it("it should be FALLING.RAPIDLY", function () {
            //arrange     
            mockPressures(101500, -60);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "RAPIDLY");
            assert.strictEqual(actual.severity, -4);
        });
    });

    describe("Function Tests - Trend chooser", function () {
        it("it should be RISING.STEADY and pick the THREE HOUR prognose", function () {
            //arrange     
            barometer.clear();
            //THREE HOURS: this should result in FALLING.STEADY
            barometer.addPressure(barometer.minutesFromNow(-180), 101500);
            barometer.addPressure(barometer.minutesFromNow(-160), 101500 + 5);

            //ONE HOUR: this should result in FALLING.SLOWLY
            barometer.addPressure(barometer.minutesFromNow(-50), 101500 + 6);
            barometer.addPressure(barometer.minutesFromNow(-40), 101500 + 7);

            //HALF HOUR: this should result in FALLING.CHANGING
            barometer.addPressure(barometer.minutesFromNow(-20), 101500 + 8);
            barometer.addPressure(barometer.minutesFromNow(0), 101500 + 9);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "STEADY");
        });

        it("it should be RISING.RAPIDLY and pick the ONE HOUR prognose", function () {
            //arrange     
            barometer.clear();
            //THREE HOURS: this should result in FALLING.STEADY
            barometer.addPressure(barometer.minutesFromNow(-180), 101500);
            barometer.addPressure(barometer.minutesFromNow(-160), 101500 + 5);

            //ONE HOUR: this should result in FALLING.SLOWLY
            barometer.addPressure(barometer.minutesFromNow(-50), 101500 + 10);
            barometer.addPressure(barometer.minutesFromNow(-40), 101500 + 15);

            //HALF HOUR: this should result in FALLING.CHANGING
            barometer.addPressure(barometer.minutesFromNow(-20), 101500 + 60);
            barometer.addPressure(barometer.minutesFromNow(0), 101500 + 70);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "RISING");
            assert.strictEqual(actual.trend, "RAPIDLY");
        });

        it("it should be FALLING.CHANGING and pick the HALF HOUR prognose", function () {
            //arrange     
            barometer.clear();
            //THREE HOUR: this should result in FALLING.STEADY
            barometer.addPressure(barometer.minutesFromNow(-180), 101500);
            barometer.addPressure(barometer.minutesFromNow(-160), 101500 - 5);

            //ONE HOUR: this should result in FALLING.SLOWLY
            barometer.addPressure(barometer.minutesFromNow(-60), 101500 - 10);
            barometer.addPressure(barometer.minutesFromNow(-50), 101500 - 12);

            //HALF HOUR: this should result in FALLING.CHANGING
            barometer.addPressure(barometer.minutesFromNow(-20), 101500 - 15);
            barometer.addPressure(barometer.minutesFromNow(0), 101500 - 17);

            //act
            var actual = barometer.getTrend();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "CHANGING");
        });
        
        it("it should not include older pressure readings", function () {
            //arrange     
            barometer.clear();
            //THREE HOUR+: this should result in FALLING.STEADY
            barometer.addPressure(barometer.minutesFromNow(-190), 101500 + 80);
            barometer.addPressure(barometer.minutesFromNow(-185), 101500 + 75);

            //IF THE OLD READINGS WHERE INCLUDED THIS SHOULD RESULT IN FALLING.RAPIDLY - NOT FALLING.STEADY
            barometer.addPressure(barometer.minutesFromNow(-20), 101500 - 1);
            barometer.addPressure(barometer.minutesFromNow(0), 101500 - 2);

            //act
            var actual = barometer.getTrend();
            var actualCount = barometer.getPressureCount();

            //assert
            assert.strictEqual(actual.tendency, "FALLING");
            assert.strictEqual(actual.trend, "STEADY");
            assert.strictEqual(actualCount, 2);
        });
    });
});

function mockPressures(pressure, difference) {
    barometer.clear();
    barometer.addPressure(barometer.minutesFromNow(-20), pressure);
    barometer.addPressure(barometer.minutesFromNow(0), pressure + difference);
}