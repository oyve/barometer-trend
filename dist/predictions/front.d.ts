import * as utils from '../utils';
interface Front {
    key: string | null;
    tendency: string | null;
    prognose: string | null;
    wind: string | null;
}
interface RegressionPoint {
    datetime: Date;
    value?: number;
    calculated?: {
        pressureASL: number;
    };
}
/**
 *
 * @param pressures Array of pressure readings
 * @returns Front JSON object
 */
export declare function getFront(pressures: (utils.PressureReading | RegressionPoint)[]): Front | undefined;
export {};
//# sourceMappingURL=front.d.ts.map