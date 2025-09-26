import * as utils from '../utils';
interface HistoricPressureEntry {
    hour: number;
    pressure: utils.PressureReading | null;
}
/**
 *
 * @param pressures Pressures
 * @param limit Number of historic values to return
 * @returns [{hour: hour, pressure: pressure}]
 */
export declare function getHistoricPressures(pressures: utils.PressureReading[], limit?: number): HistoricPressureEntry[];
export {};
//# sourceMappingURL=history.d.ts.map