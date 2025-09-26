/**
 * Get weather prediction based on pressure, wind direction, tendency, and trend.
 * @param pressure - The pressure value.
 * @param windDirection - The wind direction in degrees.
 * @param tendency - The pressure tendency (e.g., "RISING", "FALLING", "STEADY").
 * @param trend - The pressure trend (optional).
 * @param isNorthernHemisphere - True if located in the Northern Hemisphere, false otherwise.
 * @returns The weather prediction.
 */
export declare function getPrediction(pressure: number, windDirection: number | null | undefined, tendency: string, trend?: string | null, isNorthernHemisphere?: boolean): string;
//# sourceMappingURL=byPressureTendencyAndWind.d.ts.map