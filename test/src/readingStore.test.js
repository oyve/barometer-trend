
const assert = require('assert');
const readingStore = require('../../src/readingStore');
const utils = require('../../src/utils');
const globals = require('../../src/globals');

describe("ReadingStore Tests", function () {
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
        it("it should should be sealevel pressure", function () {
            //arrange     
            readingStore.clear();
            //globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm(false);
            const expected = 101500;
            readingStore.add(null, expected);
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();

            //assert
            assert.strictEqual(actual, expected);
            globals.setDefaults();
            globals.setIgnoreFlagInTesting();
        });
        it("it should should not be pressure by altitude as latitude is missing", function () {
            //arrange     
            readingStore.clear();
            //globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm(false);
            const expected = 114129;
            readingStore.add(null, 101500, { altitude: 1000 });
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setDefaults();
        });
        it("it should should be diurnal by altitude", function () {
            //arrange     
            readingStore.clear();
            //globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 115409;
            readingStore.add(new Date("2025-03-03T12:00:00"), 101500, { altitude: 1000, latitude: 45.123 });
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setDefaults();
        });
        it("it should should be sealevel diurnal", function () {
            //arrange     
            readingStore.clear();
            //globals.setApplyAdjustToSeaLevel(false);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 101518;
            readingStore.add(new Date("2025-03-03T12:00:00"), 101500, { altitude: 0, latitude: 45.123 });
            
            //act
            var actual = readingStore.getPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setDefaults();
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
        
    describe("Smoothig tests", function () {
        it("it should smooth", function () {
            //arrange
            globals.setApplySmoothing(true);
            readingStore.clear();
            const expected = 101355;
            const pressures = [
                { datetime: utils.minutesFromNow(-60), pressure: 101325 },
                { datetime: utils.minutesFromNow(-50), pressure: 101330 },
                { datetime: utils.minutesFromNow(-40), pressure: 101335 },
                { datetime: utils.minutesFromNow(-30), pressure: 101340 },
                { datetime: utils.minutesFromNow(-20), pressure: 101345 },
                { datetime: utils.minutesFromNow(-10), pressure: 101350 },
                { datetime: new Date(), pressure: 101400 }, //freak value
            ];
            pressures.forEach(p => readingStore.add(p.datetime, p.pressure));
            //act
            var all = readingStore.getAll();
            var actual = all.at(-1).pressure; //get the last value
            //assert
            assert.strictEqual(actual, expected);
            globals.setDefaults();
        });
    });
});