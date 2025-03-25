const assert = require('assert');
const beaufort = require('../../src/predictions/diurnalRythm');

describe("Diurnal Rythm Tests", function () {
    describe("Get correction 40", function () {

        it("it should equal", function () {
            //arrange
            const expected = 10137;
            //act
            var actual = beaufort.correctPressure(10500, 45.123, new Date("2025-03-16T02:00:00"));
            //assert
            assert.strictEqual(actual, expected);
        });
    });
});