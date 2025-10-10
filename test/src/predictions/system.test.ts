import { SystemAnalyzer as system } from '../../../src/predictions/system';
import { ReadingStore } from '../../../src/readingStore';
import * as utils from '../../../src/utils';

describe("System Tests", function () {
	describe("System match", function () {
		it("it should be NORMAL", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101400);
			//assert
			expect(actual?.key).toBe(1);
			expect(actual?.name).toBe("Normal");
		});

		it("it should be LOW", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(100500);
			//assert
			expect(actual?.key).toBe(0);
			expect(actual?.name).toBe("Low");
		});

		it("it should be LOW", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101000); //<- LOW THRESHOLD
			//assert
			expect(actual?.key).toBe(0);
			expect(actual?.name).toBe("Low");
		});

		it("it should be NORMAL 2", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101001); //<- LOW THRESHOLD
			//assert
			expect(actual?.key).toBe(1);
			expect(actual?.name).toBe("Normal");
		});

		it("it should be HIGH", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(102500);
			//assert
			expect(actual?.key).toBe(2);
			expect(actual?.name).toBe("High");
		});

		it("it should be NORMAL", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101500); //<-HIGH THRESHOLD
			//assert
			expect(actual?.key).toBe(1);
			expect(actual?.name).toBe("Normal");
		});

		it("it should be HIGH 2", function () {
			//arrange
			//act
			var actual = system.getSystemByPressure(101501); //<-HIGH THRESHOLD
			//assert
			expect(actual?.key).toBe(2);
			expect(actual?.name).toBe("High");
		});
	});
	describe("getSystemByPressureTrend Tests", function () {
		it("it should be null", function () {
			//arrange
			ReadingStore.clear();
			const pressures = [
				{ datetime: new Date(), pressure: 101100 }
			];
			pressures.forEach((p) => ReadingStore.add(p.datetime, p.pressure));

			//act
			var actual = system.getSystemByPressureTrend(pressures);
			//assert
			expect(actual).toBeNull();
		});
		it("it should be trending to LOW", function () {
			//arrange
			ReadingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101100 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101000 },
				{ datetime: utils.minutesFromNow(-1), pressure: 100900 },
			];
			pressures.forEach((p) => ReadingStore.add(p.datetime, p.pressure));
			
			//act
			var actual = system.getSystemByPressureTrend(ReadingStore.getAll());
			//assert
			expect(actual?.key).toBe(0);
			expect(actual?.name).toBe("Low");
		});
		it("it should be trending to NORMAL", function () {
			//arrange
			ReadingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101100 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101200 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101300 },
			];
			pressures.forEach((p) => ReadingStore.add(p.datetime, p.pressure));
			//act
			var actual = system.getSystemByPressureTrend(ReadingStore.getAll());
			//assert
			expect(actual?.key).toBe(1);
			expect(actual?.name).toBe("Normal");
		});
		it("it should be trending to HIGH", function () {
			//arrange
			ReadingStore.clear();
			const pressures = [
				{ datetime: utils.minutesFromNow(-3), pressure: 101400 },
				{ datetime: utils.minutesFromNow(-2), pressure: 101500 },
				{ datetime: utils.minutesFromNow(-1), pressure: 101600 },
			];
			pressures.forEach((p) => ReadingStore.add(p.datetime, p.pressure));
			//act
			var actual = system.getSystemByPressureTrend(ReadingStore.getAll());
			//assert
			expect(actual?.key).toBe(2);
			expect(actual?.name).toBe("High");
		});

	});
});