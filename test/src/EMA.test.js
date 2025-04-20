
const assert = require('assert');
const EMA = require('../../src/EMA');

describe("Smoothing Tests", function () {
    describe("Downward trend", function () {
        it("it should be equal", function () {
            //arrange     
            const data = [101325, 101320, 101315, 101310, 101305];
            const expected = [101325, 101320, 101315, 101310, 101305];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
        it("it should smoothen fall of 50", function () {
            //arrange     
            const data = [101325, 101320, 101270, 101310, 101300];
            const expected = [101325, 101320, 101315, 101310, 101300];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
        it("it should smoothen rise of 50", function () {
            //arrange     
            const data = [101325, 101320, 101370, 101310, 101300];
            const expected = [101325, 101320, 101315, 101310, 101300];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
    });
    describe("Upward trend", function () {
        it("it should be equal", function () {
            //arrange     
            const data = [101325, 101330, 101335, 101340, 101345];
            const expected = [101325, 101330, 101335, 101340, 101345];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
        it("it should smoothen fall of 50", function () {
            //arrange     
            const data = [101325, 101330, 101285, 101340, 101350];
            const expected = [101325, 101330, 101335, 101340, 101350];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
        it("it should smoothen rise of 50", function () {
            //arrange     
            const data = [101325, 101330, 101385, 101340, 101350];
            const expected = [101325, 101330, 101336, 101340, 101350];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
    });

    describe("Other scenarios", function () {
        it("it should smoothen end rise of 50", function () {
            //arrange     
            const data = [101325, 101330, 101335, 101340, 101400];
            const expected = [101325, 101330, 101335, 101340, 101346];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
        it("it should smoothen end fall of 50", function () {
            //arrange     
            const data = [101325, 101320, 101315, 101310, 101260];
            const expected = [101325, 101320, 101315, 101310, 101305];
            //act
            var actual = EMA.process(data);
            //assert
            assert.deepEqual(actual, expected);
        });
    });
});