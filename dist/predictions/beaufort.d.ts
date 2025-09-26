interface BeaufortResult {
    force: string;
    min: number;
    max: number;
    description: string;
}
/**
 * Get Beaufort scale details by pressure variation ratio
 * @param ratio - The pressure variation ratio
 * @returns Beaufort scale details
 */
export declare function getByPressureVariationRatio(ratio: number): BeaufortResult;
export {};
//# sourceMappingURL=beaufort.d.ts.map