
const assert = require('assert');
const readingStore = require('../../src/readingStore');
const utils = require('../../src/utils');
const globals = require('../../src/globals');

describe("Pressure Readings Tests", function () {
    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            readingStore.clear();
            readingStore.add(new Date(), 101500);

            //assert
            assert.ok(true, "My function does not crash");
        });
    });
    describe("Has pressure", function () {
        it("it should not have", function () {
            //arrange
            readingStore.clear();
            let expected = false;
            //act
            let actual = readingStore.hasPressures();

            //assert
            assert.strictEqual(actual, expected)
        });
        it("it should have", function () {
            //arrange
            readingStore.clear();
            let expected = true;
            readingStore.add(new Date(), 101500);
            //act
            let actual = readingStore.hasPressures();

            //assert
            assert.strictEqual(actual, expected)
        });
    });
    describe("Get all", function () {
        it("it should get all", function () {
        //arrange     
        readingStore.clear();
        readingStore.add(utils.minutesFromNow(-170), 101500);
        readingStore.add(utils.minutesFromNow(-160), 101500 + 5);
        readingStore.add(utils.minutesFromNow(-50), 101500 + 6);
        readingStore.add(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = readingStore.readings;

        //assert
        assert.strictEqual(actual.length, 4);
        assert.strictEqual(actual[0].pressure, 101500);
        assert.strictEqual(actual[3].pressure, 101507);
        });
    });
    describe("getPressureByChoice", function () {
        it("it should should be false false", function () {
            //arrange     
            readingStore.clear();
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm();
            const expected = 101500;
            readingStore.add(null, expected);
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();

            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm();
        });
        it("it should should be true false", function () {
            //arrange     
            readingStore.clear();
            globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm();
            const expected = 113903;
            readingStore.add(null, 101500, 1000);
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
        });
        it("it should should be true true", function () {
            //arrange     
            readingStore.clear();
            globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 115161;
            readingStore.add(new Date("2025-03-03T12:00:00"), 101500, 1000, null, null, 45.123);
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
            globals.setIgnoreFlagInTesting();
        });
        it("it should should be false true", function () {
            //arrange     
            readingStore.clear();
            globals.setApplyAdjustToSeaLevel(false);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 101518;
            readingStore.add(new Date("2025-03-03T12:00:00"), 101500, 1000, null, null, 45.123);
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
            globals.setIgnoreFlagInTesting();
        });
    });

    describe("Find pressure closest to", function () {

        it("it should pick the previous", function () {
            //arrange
            readingStore.clear();
            const expected = 101400;
            const pressures = [
                { datetime: utils.minutesFromNow(-61), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-58), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = readingStore.getPressureClosestTo(utils.minutesFromNow(-60));
            //assert
            assert.strictEqual(actual.calculated.pressureASL, expected);
        });

        it("it should pick the next", function () {
            //arrange
            readingStore.clear();
            const expected = 101600;
            const pressures = [
                { datetime: utils.minutesFromNow(-62), calculated: { pressureASL: 101400 }},
                { datetime: utils.minutesFromNow(-59), calculated: { pressureASL: expected }},
            ];
            pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = readingStore.getPressureClosestTo(utils.minutesFromNow(-60));
            //assert
            assert.strictEqual(actual.calculated.pressureASL, expected);
        });

        it("it should pick the middle", function () {
            //arrange
            readingStore.clear();
            const expected = 101500;
            const pressures = [
                { datetime: utils.minutesFromNow(-61), calculated: { pressureASL: 101400 }},
                { datetime: utils.minutesFromNow(-60), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-59), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = readingStore.getPressureClosestTo(utils.minutesFromNow(-60));
            //assert
            assert.strictEqual(actual.calculated.pressureASL, expected);
        });

        it("it should pick hour", function () {
            //arrange
            readingStore.clear();
            const expected = 101400;
            const pressures = [
                { datetime: utils.minutesFromNow(-60*5), calculated: { pressureASL: 101100 }},
                { datetime: utils.minutesFromNow(-60*4), calculated: { pressureASL: 101200 }},
                { datetime: utils.minutesFromNow(-60*3), calculated: { pressureASL: 101300 }},
                { datetime: utils.minutesFromNow(-60*2), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-60*1), calculated: { pressureASL: 101500 }},
                { datetime: new Date(), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => readingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = readingStore.getPressureClosestTo(utils.minutesFromNow(-60*2));
            //assert
            assert.strictEqual(actual.calculated.pressureASL, expected);
        });
    });
});