import * as barometer from '../index';
import * as utils from '../src/utils';
import { ReadingStore } from '../src/readingStore';

describe("Unit Tests", function () {
    describe("Set Latitude", function () {
        it("it should default", function () {
            //arrange
            const expected = undefined;
            //act
            var actual = barometer.getLatitude();
            //assert
            expect(actual).toBe(expected);
        });
        it("it should set", function () {
            //arrange
            const expected = 45.123;
            barometer.setLatitude(expected);
            //act
            var actual = barometer.getLatitude();
            //assert
            expect(actual).toBe(expected);
        });
    });
});

describe("Function Tests - Trend chooser", function () {
    it("it should be RISING.STEADY and pick the THREE HOUR prognose", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-170), 101500);
        barometer.addPressure(utils.minutesFromNow(-160), 101500 + 5);

        //ONE HOUR: this should result in FALLING.SLOWLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 + 6);
        barometer.addPressure(utils.minutesFromNow(-40), 101500 + 7);

        //act
        var actual = barometer.getForecast();

        //assert
        expect(actual?.trend.tendency).toBe("RISING");
        expect(actual?.trend.trend.key).toBe("STEADY");
    });

    it("it should be fALLING.RAPIDLY and pick the ONE HOUR prognose", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.CHANGING
        barometer.addPressure(utils.minutesFromNow(-170), 101500);
        barometer.addPressure(utils.minutesFromNow(-160), 101500 - 300);

        //ONE HOUR: this should result in FALLING.RAPIDLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 - 150);
        barometer.addPressure(utils.minutesFromNow(-40), 101500 - 600);

        //act
        var actual = barometer.getForecast();

        //assert
        expect(actual?.trend.tendency).toBe("FALLING");
        expect(actual?.trend.trend.key).toBe("RAPIDLY");
    });

    it("it should not include older pressure readings", function () {
        //arrange     
        barometer.clear();
        //THREE HOUR+: this should result in FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-49*60), 101500 + 80);
        barometer.addPressure(utils.minutesFromNow(-48.5*60), 101500 + 75);

        //IF THE OLD READINGS WHERE INCLUDED THIS SHOULD RESULT IN FALLING.RAPIDLY - NOT FALLING.STEADY
        barometer.addPressure(utils.minutesFromNow(-20), 101500 - 1);
        barometer.addPressure(utils.minutesFromNow(0), 101500 - 2);

        //act
        var actual = barometer.getForecast();
        var actualCount = ReadingStore.count();

        //assert
        expect(actual?.trend.tendency).toBe("FALLING");
        expect(actual?.trend.trend.key).toBe("STEADY");
        expect(actualCount).toBe(2);
    });

    it("it should be fALLING.RAPIDLY and include wind", function () {
        //arrange     
        barometer.clear();
        //THREE HOURS: this should result in FALLING.CHANGING
        barometer.addPressure(utils.minutesFromNow(-120), 101500, { trueWindDirection: 225});
        barometer.addPressure(utils.minutesFromNow(-80), 101500 - 300, { trueWindDirection: 226});

        //ONE HOUR: this should result in FALLING.RAPIDLY
        barometer.addPressure(utils.minutesFromNow(-50), 101500 - 600, { trueWindDirection: 228});
        barometer.addPressure(utils.minutesFromNow(-1), 101500 - 900, { trueWindDirection: 230});

        //act
        var actual = barometer.getForecast();

        //assert
        expect(actual?.trend.tendency).toBe("FALLING");
        expect(actual?.trend.trend.key).toBe("RAPIDLY");
        expect(actual?.models.quadrant).toBe("Increasing rain, clearing within 12 hours");
    });
});