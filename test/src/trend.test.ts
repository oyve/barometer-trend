import * as trend from '../../src/trend';
import * as utils from '../../src/utils';
import { ReadingStore } from '../../src/readingStore';

const trendAnalyzer = new trend.TrendAnalyzer(); 

describe("Trend Tests", function () {
	describe("THREE HOUR predictions", function () {

		it("it should RISING.STEADY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 5 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 11 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("SLOWLY");
		});

		it("it should RISING.SLOWLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 110 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("CHANGING");
		});
		
		it("it should RISING.QUICKLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 360 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 600 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("RAPIDLY");
		});

		it("it should FALLING.STEADY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 9 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("STEADY");
		});

		it("it should FALLING.SLOWLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 110 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("SLOWLY");
		});

		it("it should FALLING.CHANGING", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 180 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("CHANGING");
		});
		
		it("it should FALLING.QUICKLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 360 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("QUICKLY");
		});

		it("it should FALLING.RAPIDLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 - 700 }},
			];
			//act
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("FALLING");
			expect(actual?.trend.key).toBe("RAPIDLY");
		});
	});

	describe("ONE HOUR predictions", function () {
		it("it should RISING.SLOWLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 60 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 100 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("SLOWLY");
		});

		it("it should RISING.CHANGING", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 100 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 170 }},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("CHANGING");
		});

		it("it should RISING.QUICKLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), pressure: 101350},
				{ datetime: utils.minutesFromNow(-55), pressure: 101350 + 400},
				{ datetime: utils.minutesFromNow(-1), pressure: 101350 + 500},
			];
			pressures.forEach(p => ReadingStore.add(p.datetime, p.pressure));
			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("QUICKLY");
		});

		it("it should RISING.RAPIDLY", function () {
			//arrange
			ReadingStore.clear();
			let pressures = [
				{ datetime: utils.minutesFromNow(-170), calculated: { pressureASL: 101350 }},
				{ datetime: utils.minutesFromNow(-55), calculated: { pressureASL: 101350 + 500 }},
				{ datetime: utils.minutesFromNow(-1), calculated: { pressureASL: 101350 + 700 }},
			];
			
			pressures.forEach(p => ReadingStore.add(p.datetime, p.calculated.pressureASL));

			//act
			var actual = trendAnalyzer.forecast();
			//assert
			expect(actual?.tendency).toBe("RISING");
			expect(actual?.trend.key).toBe("RAPIDLY");
		});
	});
});