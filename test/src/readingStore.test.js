
const assert = require('assert');
const PR = require('../../src/readingStore');
const utils = require('../../src/utils');
const globals = require('../../src/globals');

describe("Pressure Readings Tests", function () {
    describe("Add pressure", function () {
        it("it should not throw exceptions", function () {
            //arrange
            //act
            PR.clear();
            PR.add(new Date(), 101500);

            //assert
            assert.ok(true, "My function does not crash");
        });
    });
    describe("Has pressure", function () {
        it("it should not have", function () {
            //arrange
            PR.clear();
            let expected = false;
            //act
            let actual = PR.hasPressures();

            //assert
            assert.strictEqual(actual, expected)
        });
        it("it should have", function () {
            //arrange
            PR.clear();
            let expected = true;
            PR.add(new Date(), 101500);
            //act
            let actual = PR.hasPressures();

            //assert
            assert.strictEqual(actual, expected)
        });
    });
    describe("Get all", function () {
        it("it should get all", function () {
        //arrange     
        PR.clear();
        PR.add(utils.minutesFromNow(-170), 101500);
        PR.add(utils.minutesFromNow(-160), 101500 + 5);
        PR.add(utils.minutesFromNow(-50), 101500 + 6);
        PR.add(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = PR.pressures;

        //assert
        assert.strictEqual(actual.length, 4);
        assert.strictEqual(actual[0].pressure, 101500);
        assert.strictEqual(actual[3].pressure, 101507);
        });
    });
    describe("getPressureByChoice", function () {
        it("it should should be false false", function () {
            //arrange     
            PR.clear();
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm();
            const expected = 101500;
            PR.add(null, expected);
            
            //act
            var actual = PR.getLatestPressureByDefaultChoice();

            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm();
        });
        it("it should should be true false", function () {
            //arrange     
            PR.clear();
            globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm();
            const expected = 113903;
            PR.add(null, 101500, 1000);
            
            //act
            var actual = PR.getLatestPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
        });
        it("it should should be true true", function () {
            //arrange     
            PR.clear();
            globals.setApplyAdjustToSeaLevel(true);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 115161;
            PR.add(new Date("2025-03-03T12:00:00"), 101500, 1000, null, null, 45.123);
            
            //act
            var actual = PR.getLatestPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
            globals.setIgnoreFlagInTesting();
        });
        it("it should should be false true", function () {
            //arrange     
            PR.clear();
            globals.setApplyAdjustToSeaLevel(false);
            globals.setApplyDiurnalRythm(true);
            globals.setIgnoreFlagInTesting(true);
            const expected = 101518;
            PR.add(new Date("2025-03-03T12:00:00"), 101500, 1000, null, null, 45.123);
            
            //act
            var actual = PR.getLatestPressureByDefaultChoice();
    
            //assert
            assert.strictEqual(actual, expected);
            globals.setApplyAdjustToSeaLevel(); //apply defaults
            globals.setApplyDiurnalRythm()
            globals.setIgnoreFlagInTesting();
        });
    });
});