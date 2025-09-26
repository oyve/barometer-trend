export interface PressureSystem {
    key: number;
    name: string;
    short: string;
    threshold: number;
}
/**
 * Get the pressure system based on the pressure value.
 * @param pressure - The pressure value in Pascal.
 * @returns The pressure system (LOW, NORMAL, HIGH).
 */
export declare function getSystemByPressure(pressure: number): PressureSystem | undefined;
//# sourceMappingURL=system.d.ts.map