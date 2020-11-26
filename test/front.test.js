const assert = require('assert');
const front = require('../predictions/front');
const utils = require('../utils');

describe("Front Tests", function () {
	describe("Analyze pressures", function () {

		it("it should equal FFF", function () {
			//arrange
			const expected = "FFF";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101330 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101310 },
				{ datetime: utils.minutesFromNow(-1), value: 101300 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal FFS", function () {
			//arrange
			const expected = "FFS";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101330 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101310 },
				{ datetime: utils.minutesFromNow(-1), value: 101315 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal FFR", function () {
			//arrange
			const expected = "FFR";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101330 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101310 },
				{ datetime: utils.minutesFromNow(-1), value: 101320 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal RFF", function () {
			//arrange
			const expected = "RFF";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101320 },
				{ datetime: utils.minutesFromNow(-119), value: 101330 },
				{ datetime: utils.minutesFromNow(-59), value: 101320 },
				{ datetime: utils.minutesFromNow(-1), value: 101310 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal RRR", function () {
			//arrange
			const expected = "RRR";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101310 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101330 },
				{ datetime: utils.minutesFromNow(-1), value: 101340 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal RRS", function () {
			//arrange
			const expected = "RRS";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101310 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101330 },
				{ datetime: utils.minutesFromNow(-1), value: 101335 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal FRR", function () {
			//arrange
			const expected = "FRR";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101320 },
				{ datetime: utils.minutesFromNow(-119), value: 101310 },
				{ datetime: utils.minutesFromNow(-59), value: 101320 },
				{ datetime: utils.minutesFromNow(-1), value: 101330 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal RRF", function () {
			//arrange
			const expected = "RRF";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101310 },
				{ datetime: utils.minutesFromNow(-119), value: 101320 },
				{ datetime: utils.minutesFromNow(-59), value: 101330 },
				{ datetime: utils.minutesFromNow(-1), value: 101320 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should equal SSS", function () {
			//arrange
			const expected = "SSS";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101310 },
				{ datetime: utils.minutesFromNow(-119), value: 101315 },
				{ datetime: utils.minutesFromNow(-59), value: 101320 },
				{ datetime: utils.minutesFromNow(-1), value: 101325 }
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it should not be recognized", function () {
			//arrange
			const expected = "N/A";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), value: 101300 },
				{ datetime: utils.minutesFromNow(-119), value: 101200 },
				{ datetime: utils.minutesFromNow(-59), value: 101200 },
				{ datetime: utils.minutesFromNow(-1), value: 101100 }
			]; //FSF
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});
	});
});