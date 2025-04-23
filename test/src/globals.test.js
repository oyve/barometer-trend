
const assert = require('assert');
const globals = require('../../src/globals');
const utils = require('../../src/utils');

describe("Globals Tests", function () {
    describe("Mean tempereature", function () {
        it("it should default", function () {
            //arrange
            const expected = 15;
            //act
            var actual = globals.meanSeaLevelTemperature;
            //assert
            assert.strictEqual(actual, expected);
            });
        it("it should set", function () {
        //arrange
        const expected = 20;
        globals.setMeanSeaLevelTemperature(expected);
        //act
        var actual = globals.meanSeaLevelTemperature;
        //assert
        assert.strictEqual(actual, expected);
        });
    });

    describe("Keep pressure readings for", function () {
        it("it should default", function () {
            //arrange
            const expected = utils.MINUTES.FORTYEIGHT_HOURS;
            //act
            var actual = globals.keepPressureReadingsFor;
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should set", function () {
        //arrange
        const expected = 20;
        globals.setKeepPressureReadingsFor(expected);
        //act
        var actual = globals.keepPressureReadingsFor;
        //assert
        assert.strictEqual(actual, expected);
        globals.setKeepPressureReadingsFor(); //default it again to not affect later tests
        });
    });

    describe("Apply Sea Level", function () {
        it("it should default", function () {
            //arrange
            const expected = false;
            //act
            var actual = globals.applyAdjustToSeaLevel;
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should set", function () {
        //arrange
        const expected = true;
        globals.setApplyAdjustToSeaLevel(expected);
        //act
        var actual = globals.applyAdjustToSeaLevel;
        //assert
        assert.strictEqual(actual, expected);
        globals.setApplyAdjustToSeaLevel(); //default it again to not affect later tests
        });
    });

    describe("Apply Diurnal Rythm", function () {
        it("it should default", function () {
            //arrange
            const expected = false;
            //act
            var actual = globals.applyDiurnalRythm;
            //assert
            assert.strictEqual(actual, expected);
        });
        it("it should set", function () {
        //arrange
        const expected = true;
        globals.setApplyDiurnalRythm(expected);
        //act
        var actual = globals.applyDiurnalRythm;
        //assert
        assert.strictEqual(actual, expected);
        globals.setApplyDiurnalRythm(); //default it again to not affect later tests
        });
    });
});