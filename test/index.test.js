const pressure = require('../index');
const assert = require('assert');
const { clear } = require('console');

describe("Pressure - Unit Tests", function () {
    // afterEach(function(done) {
    //     pressure.clear();
    //  });

    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            pressure.addPressure(new Date().getTime(), 1015);

            //assert
            assert.ok(true, "My function does not crash");
            pressure.clear();
        });
    });
});



describe("Pressure - Integration Tests", function () {
    // afterEach(function(done) {
    //     pressure.clear();
    //  });

    describe("Get Trend", function () {
        it("it should be null", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            const expected = null;

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual, expected);
            pressure.clear();
        });

        it("it should be RISING.STEADY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015 + 9);
            const expected = "RISING.STEADY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });
        
        it("it should be RISING.SLOWLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015 + 15);
            const expected = "RISING.SLOWLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be RISING.CHANGING", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015 + 16);
            const expected = "RISING.CHANGING";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be RISING.QUICKLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015 + 36);
            const expected = "RISING.QUICKLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be RISING.RAPIDLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015 + 60);
            const expected = "RISING.RAPIDLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be FALLING.STEADY", function () {
            //arrange
            
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015 + 9);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015);
            const expected = "FALLING.STEADY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be FALLING.SLOWLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015 + 15);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015);
            const expected = "FALLING.SLOWLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be FALLING.CHANGING", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015 + 16);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015);
            const expected = "FALLING.CHANGING";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be FALLING.QUICKLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015 + 36);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015);
            const expected = "FALLING.QUICKLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });

        it("it should be FALLING.RAPIDLY", function () {
            //arrange
            pressure.addPressure(new Date(2020, 11, 5, 12, 0, 0).getTime(), 1015 + 60);
            pressure.addPressure(new Date(2020, 11, 5, 12, 10, 0).getTime(), 1016);
            pressure.addPressure(new Date(2020, 11, 5, 12, 20, 0).getTime(), 1015);
            const expected = "FALLING.RAPIDLY";

            //act
            var actual = pressure.getTrend(new Date(2020, 11, 5, 12, 0, 0).getTime());

            //assert
            assert.strictEqual(actual.key, expected);
            pressure.clear();
        });
    });
});