import { ReadingStore } from '../../src/readingStore';
import * as utils from '../../src/utils';
import { Globals } from '../../src/globals';

describe("ReadingStore.Tests", function () {
    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            ReadingStore.clear();
            ReadingStore.add(new Date(), 101500);

            //assert
            expect(true).toBe(true);
        });
        it("it should not add older than", function () {
            //arrange
            const expected = 0;
            ReadingStore.clear();
            let old = utils.minutesFromNow(-50*60); //50 hours ago
            ReadingStore.add(old, 101500);
            //act
            let actual = ReadingStore.count()

            //assert
            expect(actual).toBe(expected);
            expect(true).toBe(true);
        });
        it("it should not add two same datetimes", function () {
            //arrange
            const expected = 1;
            ReadingStore.clear();
            let old = utils.minutesFromNow(-10); //50 hours ago
            ReadingStore.add(old, 101500);
            ReadingStore.add(old, 101500);
            //act
            let actual = ReadingStore.count()

            //assert
            expect(actual).toBe(expected);
            expect(true).toBe(true);
        });
    });
    describe("Has pressure", function () {
        it("it should not have", function () {
            //arrange
            ReadingStore.clear();
            let expected = false;
            //act
            let actual = ReadingStore.hasPressures();

            //assert
            expect(actual).toBe(expected);
        });
        it("it should have", function () {
            //arrange
            ReadingStore.clear();
            let expected = true;
            ReadingStore.add(new Date(), 101500);
            //act
            let actual = ReadingStore.hasPressures();

            //assert
            expect(actual).toBe(expected);
        });
    });
    describe("Get all", function () {
        it("it should get all", function () {
        //arrange     
        ReadingStore.clear();
        ReadingStore.add(utils.minutesFromNow(-170), 101500);
        ReadingStore.add(utils.minutesFromNow(-160), 101500 + 5);
        ReadingStore.add(utils.minutesFromNow(-50), 101500 + 6);
        ReadingStore.add(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = ReadingStore.readings;

        //assert
        expect(actual?.length).toBe(4);
        expect(actual[0].pressure).toBe(101500);
        expect(actual[3].pressure).toBe(101507);
        });
    });
    describe("getPressureByChoice", function () {
        it("it should should be sealevel pressure", function () {
            //arrange     
            ReadingStore.clear();
            //Globals.setApplyAdjustToSeaLevel(); //apply defaults
            Globals.setApplyDiurnalRythm(false);
            const expected = 101500;
            ReadingStore.add(null, expected);
            
            //act
            var actual = ReadingStore.getPressureByDefault();

            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
            Globals.setIgnoreFlagInTesting();
        });
        it("it should should not be pressure by altitude as latitude is missing", function () {
            //arrange     
            ReadingStore.clear();
            //Globals.setApplyAdjustToSeaLevel(true);
            Globals.setApplyDiurnalRythm(false);
            const expected = 114129;
            ReadingStore.add(null, 101500, { altitude: 1000 });
            
            //act
            var actual = ReadingStore.getPressureByDefault();
    
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
        it("it should should be diurnal by altitude", function () {
            //arrange     
            ReadingStore.clear();
            //Globals.setApplyAdjustToSeaLevel(true);
            Globals.setApplyDiurnalRythm(true);
            Globals.setIgnoreFlagInTesting(true);
            const expected = 115409;
            ReadingStore.add(new Date("2025-03-03T12:00:00"), 101500, { altitude: 1000, latitude: 45.123 });
            
            //act
            var actual = ReadingStore.getPressureByDefault();
    
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
        it("it should should be sealevel diurnal", function () {
            //arrange     
            ReadingStore.clear();
            //Globals.setApplyAdjustToSeaLevel(false);
            Globals.setApplyDiurnalRythm(true);
            Globals.setIgnoreFlagInTesting(true);
            const expected = 101518;
            ReadingStore.add(new Date("2025-03-03T12:00:00"), 101500, { altitude: 0, latitude: 45.123 });
            
            //act
            var actual = ReadingStore.getPressureByDefault();
    
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
    });

    describe("Find pressure closest to", function () {

        it("it should pick the previous", function () {
            //arrange
            ReadingStore.clear();
            const expected = 101400;
            const pressures = [
                { datetime: utils.minutesFromNow(-61), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-58), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = ReadingStore.getPressureClosestTo(utils.minutesFromNow(-60));
            //assert
            expect(actual?.calculated.pressureASL).toBe(expected);
        });

        it("it should pick the next", function () {
            //arrange
            ReadingStore.clear();
            const expected = 101600;
            const pressures = [
                { datetime: utils.minutesFromNow(-62), calculated: { pressureASL: 101400 }},
                { datetime: utils.minutesFromNow(-59), calculated: { pressureASL: expected }},
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = ReadingStore.getPressureClosestTo(utils.minutesFromNow(-60));
            //assert
            expect(actual?.calculated.pressureASL).toBe(expected);
        });

        it("it should pick the middle", function () {
            //arrange
            ReadingStore.clear();
            const expected = 101500;
            const pressures = [
                { datetime: utils.minutesFromNow(-61), calculated: { pressureASL: 101400 }},
                { datetime: utils.minutesFromNow(-55), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-50), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = ReadingStore.getPressureClosestTo(utils.minutesFromNow(-57));
            //assert
            expect(actual?.calculated.pressureASL).toBe(expected);
        });

        it("it should pick hour", function () {
            //arrange
            ReadingStore.clear();
            const expected = 101400;
            const pressures = [
                { datetime: utils.minutesFromNow(-60*5), calculated: { pressureASL: 101100 }},
                { datetime: utils.minutesFromNow(-60*4), calculated: { pressureASL: 101200 }},
                { datetime: utils.minutesFromNow(-60*3), calculated: { pressureASL: 101300 }},
                { datetime: utils.minutesFromNow(-60*2), calculated: { pressureASL: expected }},
                { datetime: utils.minutesFromNow(-60*1), calculated: { pressureASL: 101500 }},
                { datetime: new Date(), calculated: { pressureASL: 101600 }},
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
            //act
            var actual = ReadingStore.getPressureClosestTo(utils.minutesFromNow(-60*2));
            //assert
            expect(actual?.calculated.pressureASL).toBe(expected);
        });
    });
        
    describe("Smoothing tests", function () {
        it("it should smooth", function () {
            //arrange
            Globals.setApplySmoothing(true);
            ReadingStore.clear();
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
            pressures.forEach(p => ReadingStore.add(p.datetime, p.pressure));
            //act
            var all = ReadingStore.getAll();
            //var lastReading = all.at(-1);
            var lastReading = all[all.length - 1];
            var actual = lastReading ? lastReading.pressure : undefined; //get the last value safely
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
    });


    
    describe("Data Quality tests", function () {
        it("it should be 25%", function () {
            //arrange
            ReadingStore.clear();
            const expected = (1 / 6) * 100;
            const pressures = [
                { datetime: utils.minutesFromNow(-25), pressure: 101325 }
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.pressure));
            //act
            var actual = ReadingStore.getDataQuality();
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
        it("it should be 50%", function () {
            //arrange
            ReadingStore.clear();
            const expected = (2 / 6) * 100;
            const pressures = [
                { datetime: utils.minutesFromNow(-50), pressure: 101325 },
                { datetime: utils.minutesFromNow(-25), pressure: 101325 }
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.pressure));
            //act
            var actual = ReadingStore.getDataQuality();
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
        it("it should be 100%", function () {
            //arrange
            ReadingStore.clear();
            const expected = (6 / 6) * 100;
            const pressures = [
                { datetime: utils.minutesFromNow(-170), pressure: 101325 },
                { datetime: utils.minutesFromNow(-140), pressure: 101325 },
                { datetime: utils.minutesFromNow(-110), pressure: 101325 },
                { datetime: utils.minutesFromNow(-80), pressure: 101325 },
                { datetime: utils.minutesFromNow(-50), pressure: 101325 },
                { datetime: utils.minutesFromNow(-20), pressure: 101325 }
            ];
            pressures.forEach(p => ReadingStore.add(p.datetime, p.pressure));
            //act
            var actual = ReadingStore.getDataQuality();
            //assert
            expect(actual).toBe(expected);
            Globals.setDefaults();
        });
    });
});