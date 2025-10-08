export interface PressureSystem {
    key: number;
    name: string;
    short: string;
    threshold: number;
    text?: string;
}

/**
 * Get the pressure system based on the pressure value.
 * @param pressure - The pressure value in Pascal.
 * @returns The pressure system (LOW, NORMAL, HIGH).
 */
export function getSystemByPressure(pressure: number): PressureSystem {
    const LOW_THRESHOLD = 100914.4;
    const HIGH_THRESHOLD = 102268.9;

    const systems: PressureSystem[] = [
        { key: 0, name: "Low", short: "LOW", threshold: LOW_THRESHOLD + 0.1 },
        { key: 1, name: "Between Low and High", short: "BETWEEEN", threshold: HIGH_THRESHOLD },
        { key: 2, name: "High", short: "HIGH", threshold: Number.MAX_SAFE_INTEGER }
    ];

    try {
        return systems.find((s) => pressure < s.threshold) || systems[0];
    } catch (error) {
        console.error("Error in getSystemByPressure: ", error);
        return systems[0];
    }
}

export function forecast(pressure: number, pressures: any[]): { current: PressureSystem } {
    const system = getSystemByPressure(pressure);
    return {
        current: {
            ...system,
            text: system.name.toLowerCase()
        }
    };
}
