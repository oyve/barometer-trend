const assert = require('assert');
const front = require('../../../src/predictions/front');
const utils = require('../../../src/utils');

describe("Front Tests", function () {
	describe("Analyze pressures", function () {

		it("it should equal FFF", function () {
			//arrange
			const expected = "FFF";
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101325 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101320 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101320 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101310 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101305 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101300 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101325 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101320 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101320 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101310 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101305 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101310 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101325 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101320 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101320 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101310 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101320 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101335 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101340 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101320 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101310 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101305 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101300 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101335 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101340 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101345 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101350 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101355 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101360 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101365 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101370 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101335 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101340 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101345 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101350 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101355 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101355 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101350 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101355 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101325 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101320 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101325 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101335 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101340 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101345 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101350 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101335 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101340 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101345 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101350 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101355 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101350 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101345 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101340 },
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
				{ datetime: utils.minutesFromNow(-179), pressure: 101330 },
				{ datetime: utils.minutesFromNow(-140), pressure: 101335 },
				{ datetime: utils.minutesFromNow(-121), pressure: 101330 },

				{ datetime: utils.minutesFromNow(-119), pressure: 101320 },
				{ datetime: utils.minutesFromNow(-90), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-61), pressure: 101320 },

				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101315 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101310 },
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, expected);
		});

		it("it has only less than one hour readings", function () {
			//arrange
			const expected = null;

			const pressures = [
				{ datetime: utils.minutesFromNow(-59), pressure: 101310 },
				{ datetime: utils.minutesFromNow(-30), pressure: 101305 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101300 },
			];
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, null);
		});

		it("it should not be recognized", function () {
			//arrange
			const expected = null;
			const pressures = [
				{ datetime: utils.minutesFromNow(-179), pressure: 101300 },
				{ datetime: utils.minutesFromNow(-119), pressure: 101200 },
				{ datetime: utils.minutesFromNow(-59), pressure: 101200 },
				{ datetime: new Date(), pressure: 101100 }
			]; //FSF
			//act
			var actual = front.getFront(pressures);
			//assert
			assert.strictEqual(actual.key, null);
		});
	});
});