
const assert = require('assert');
const PR = require('../../src/pressureReadings');
const utils = require('../../src/utils');

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
});