
const assert = require('assert');
const globals = require('../../src/globals');

describe("Globals Tests", function () {
    describe("Diurnal Enabled Tests", function () {
        it("it should be default false", function () {
        //arrange     
        const expected = false;
        //act
        var actual = globals.isDiurnalEnabled;
        //assert
        assert.strictEqual(actual, expected);
        });
        it("it should be set to true", function () {
        //arrange     
        const expected = true;
        globals.setIsDiurnalEnabled(true);
        //act
        var actual = globals.isDiurnalEnabled;
        //assert
        assert.strictEqual(actual, expected);
        });
        it("it should be set to false", function () {
        //arrange     
        const expected = false;
        globals.setIsDiurnalEnabled(true);
        globals.setIsDiurnalEnabled(false);
        //act
        var actual = globals.isDiurnalEnabled;
        //assert
        assert.strictEqual(actual, expected);
        });
    });

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
});