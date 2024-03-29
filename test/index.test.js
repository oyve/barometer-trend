
const assert = require('assert');
const barometer = require('../index');
const utils = require('../utils');

describe("Unit Tests", function () {
    describe("Get all", function () {
        it("it should get all", function () {
        //arrange     
        barometer.clear();
        barometer.addPressure(utils.minutesFromNow(-170), 101500);
        barometer.addPressure(utils.minutesFromNow(-160), 101500 + 5);
        barometer.addPressure(utils.minutesFromNow(-50), 101500 + 6);
        barometer.addPressure(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = barometer.getAll();

        //assert
        assert.strictEqual(actual.length, 4);
        assert.strictEqual(actual[0].value, 101500);
        assert.strictEqual(actual[3].value, 101507);
        });
    });
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

describe("Function Tests - Trend chooser", function () {
    it("it should be RISING.STEADY and pick the THREE HOUR prognose", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-170), 101500);
        barometer.addPressure(utils.minutesFromNow(-160), 101500 + 5);

        //ONE HOUR: this should result in FALLING.SLOWLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 + 6);
        barometer.addPressure(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = barometer.getPredictions();

        //assert
        assert.strictEqual(actual.trend.tendency, "RISING");
        assert.strictEqual(actual.trend.trend, "STEADY");
    });

    it("it should be fALLING.RAPIDLY and pick the ONE HOUR prognose", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.CHANGING
        barometer.addPressure(utils.minutesFromNow(-170), 101500);
        barometer.addPressure(utils.minutesFromNow(-160), 101500 - 300);

        //ONE HOUR: this should result in FALLING.RAPIDLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 - 150);
        barometer.addPressure(utils.minutesFromNow(-40), 101500 - 600);

        //act
        var actual = barometer.getPredictions();

        //assert
        assert.strictEqual(actual.trend.tendency, "FALLING");
        assert.strictEqual(actual.trend.trend, "RAPIDLY");
    });

    it("it should not include older pressure readings", function () {
        //arrange     
        barometer.clear();
        //THREE HOUR+: this should result in FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-49*60), 101500 + 80);
        barometer.addPressure(utils.minutesFromNow(-48.5*60), 101500 + 75);

        //IF THE OLD READINGS WHERE INCLUDED THIS SHOULD RESULT IN FALLING.RAPIDLY - NOT FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-20), 101500 - 1);
        barometer.addPressure(utils.minutesFromNow(0), 101500 - 2);

        //act
        var actual = barometer.getPredictions();
        var actualCount = barometer.getPressureCount();

        //assert
        assert.strictEqual(actual.trend.tendency, "FALLING");
        assert.strictEqual(actual.trend.trend, "STEADY");
        assert.strictEqual(actualCount, 2);
    });

    it("it should be fALLING.RAPIDLY and include wind", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.CHANGING
        barometer.addPressure(utils.minutesFromNow(-120), 101500, 0, null, 225);
        barometer.addPressure(utils.minutesFromNow(-80), 101500 - 300, 0, null, 226);

        //ONE HOUR: this should result in FALLING.RAPIDLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 - 600, 0, null, 228);
        barometer.addPressure(utils.minutesFromNow(-1), 101500 - 900, 0, null, 230);

        //act
        var actual = barometer.getPredictions();

        //assert
        assert.strictEqual(actual.trend.tendency, "FALLING");
        assert.strictEqual(actual.trend.trend, "RAPIDLY");
        assert.strictEqual(actual.predictions.quadrant, "Increasing rain, clearing within 12 hours");
    });
});