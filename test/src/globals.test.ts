import { Globals } from '../../src/globals';
import * as utils from '../../src/utils';

describe("Globals Tests", function () {
    describe("Mean tempereature", function () {
        it("it should default", function () {
            //arrange
            const expected = 15;
            //act
            var actual = Globals.meanSeaLevelTemperature;
            //assert
            expect(actual).toBe(expected);
        });
        it("it should set", function () {
            //arrange
            const expected = 20;
            Globals.setMeanSeaLevelTemperature(expected);
            //act
            var actual = Globals.meanSeaLevelTemperature;
            //assert
            expect(actual).toBe(expected);
        });
    });

    describe("Keep pressure readings for", function () {
        it("it should default", function () {
            //arrange
            const expected = utils.MINUTES.FORTYEIGHT_HOURS;
            //act
            var actual = Globals.keepPressureReadingsFor;
            //assert
            expect(actual).toBe(expected);
        });
        it("it should set", function () {
            //arrange
            const expected = 20;
            Globals.setKeepPressureReadingsFor(expected);
            //act
            var actual = Globals.keepPressureReadingsFor;
            //assert
            expect(actual).toBe(expected);
            Globals.setKeepPressureReadingsFor(); //default it again to not affect later tests
        });
    });

    describe("Apply Sea Level", function () {
        it("it should default", function () {
            //arrange
            const expected = false;
            //act
            var actual = Globals.applyAdjustToSeaLevel;
            //assert
            expect(actual).toBe(expected);
        });
        it("it should set", function () {
            //arrange
            const expected = true;
            Globals.setApplyAdjustToSeaLevel(expected);
            //act
            var actual = Globals.applyAdjustToSeaLevel;
            //assert
            expect(actual).toBe(expected);
            Globals.setApplyAdjustToSeaLevel(); //default it again to not affect later tests
        });
    });

    describe("Apply Diurnal Rythm", function () {
        it("it should default", function () {
            //arrange
            const expected = false;
            //act
            var actual = Globals.applyDiurnalRythm;
            //assert
            expect(actual).toBe(expected);
        });
        it("it should set", function () {
            //arrange
            const expected = true;
            Globals.setApplyDiurnalRythm(expected);
            //act
            var actual = Globals.applyDiurnalRythm;
            //assert
            expect(actual).toBe(expected);
            Globals.setApplyDiurnalRythm(); //default it again to not affect later tests
        });
    });
});