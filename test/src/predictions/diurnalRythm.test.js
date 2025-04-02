const assert = require('assert');
const diurnalRythm = require('../../../src/predictions/diurnalRythm');

describe("Diurnal Rythm Tests", function () {
    describe("Mid-High Latitude Correct Pressure Calculations for 24-Hour Cycle", function () {
        const pressureObserved = 101325; // Standard atmospheric pressure
        const latitude = 60.123; // Latitude for testing
        const expectedResults = [
            { time: "2025-07-16T00:00:00", expectedPressure: 101429 }, // Midnight
            { time: "2025-07-16T03:00:00", expectedPressure: 101232 }, // 3 AM
            { time: "2025-07-16T06:00:00", expectedPressure: 101429 }, // 6 AM
            { time: "2025-07-16T09:00:00", expectedPressure: 101232 }, // 9 AM
            { time: "2025-07-16T12:00:00", expectedPressure: 101429 }, // Noon
            { time: "2025-07-16T15:00:00", expectedPressure: 101232 }, // 3 PM
            { time: "2025-07-16T18:00:00", expectedPressure: 101429 }, // 6 PM
            { time: "2025-07-16T21:00:00", expectedPressure: 101232 }, // 9 PM
        ];

        expectedResults.forEach(({ time, expectedPressure }) => {
            it(`should return correct pressure and metadata at ${time}`, function () {
                // Arrange
                const date = new Date(time);

                // Act
                const result = diurnalRythm.correctPressure(pressureObserved, latitude, date);

                // Assert
                assert.strictEqual(result.correctedPressure, expectedPressure, `Failed at ${time}`);
            });
        });
    });

    // describe("Mid Latitude Correct Pressure Calculations for 24-Hour Cycle", function () {
    //     const pressureObserved = 101325; // Standard atmospheric pressure
    //     const latitude = 45.123; // Latitude for testing
    //     const expectedResults = [
    //         { time: "2025-07-16T00:00:00", expectedPressure: 101165 }, // Midnight
    //         { time: "2025-07-16T03:00:00", expectedPressure: 101212 }, // 3 AM
    //         { time: "2025-07-16T06:00:00", expectedPressure: 101165 }, // 6 AM
    //         { time: "2025-07-16T09:00:00", expectedPressure: 101212 }, // 9 AM
    //         { time: "2025-07-16T12:00:00", expectedPressure: 101165 }, // Noon
    //         { time: "2025-07-16T15:00:00", expectedPressure: 101212 }, // 3 PM
    //         { time: "2025-07-16T18:00:00", expectedPressure: 101165 }, // 6 PM
    //         { time: "2025-07-16T21:00:00", expectedPressure: 101212 }, // 9 PM
    //     ];

    //     expectedResults.forEach(({ time, expectedPressure }) => {
    //         it(`should return correct pressure and metadata at ${time}`, function () {
    //             // Arrange
    //             const date = new Date(time);

    //             // Act
    //             const result = diurnalRythm.correctPressure(pressureObserved, latitude, date);

    //             // Assert
    //             assert.strictEqual(result.correctedPressure, expectedPressure, `Failed at ${time}`);
    //         });
    //     });
    // });

    describe("Error Handling", function () {
        it("should throw an error for invalid pressure", function () {
            // Arrange
            const pressureObserved = -100; // Invalid pressure
            const latitude = 60.123;
            const date = new Date("2025-07-16T12:00:00");

            // Act & Assert
            assert.throws(() => {
                diurnalRythm.correctPressure(pressureObserved, latitude, date);
            }, /Invalid pressure value/);
        });

        it("should throw an error for invalid latitude", function () {
            // Arrange
            const pressureObserved = 101325;
            const latitude = 100; // Invalid latitude
            const date = new Date("2025-07-16T12:00:00");

            // Act & Assert
            assert.throws(() => {
                diurnalRythm.correctPressure(pressureObserved, latitude, date);
            }, /Invalid latitude value/);
        });
    });
});