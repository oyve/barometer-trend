const assert = require('assert');
const diurnalRythm = require('../../../src/predictions/diurnalRythm');

describe("Diurnal Rythm Tests", function () {
    describe("Get correction 40", function () {

        it("it should equal at midnight", function () {
            //arrange
            const expected = 10046;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T00:00:01"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in morning", function () {
            //arrange
            const expected = 9954;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T06:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in late morning", function () {
            //arrange
            const expected = 9973;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T09:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in noon", function () {
            //arrange
            const expected = 10046;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T12:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in mid day", function () {
            //arrange
            const expected = 10027;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T15:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in afternoon", function () {
            //arrange
            const expected = 9954;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T18:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should equal in evening", function () {
            //arrange
            const expected = 9973;
            //act
            var actual = diurnalRythm.correctPressure(10500, 60.123, new Date("2025-07-16T21:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
    });
});