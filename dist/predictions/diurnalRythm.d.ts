interface CorrectionResult {
    correctedPressure: number;
    correctionFactor: number;
    anomaly: number;
    seasonalFactor: number;
}
/**
 * Correct observed atmospheric pressure for diurnal variations and weather anomalies.
 * @param pressureObserved - Observed pressure in pascals.
 * @param latitude - Latitude of the observation.
 * @param date - Date and time of the observation.
 * @returns Corrected pressure and metadata.
 */
export declare function correctPressure(pressureObserved: number, latitude: number, date: Date): CorrectionResult;
export {};
//# sourceMappingURL=diurnalRythm.d.ts.map