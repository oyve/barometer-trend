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
export function getHistoricPressures(pressures: utils.PressureReading[], limit: number = 48): HistoricPressureEntry[] {
	let historicPressures: HistoricPressureEntry[] = [];

	for (let hour = 1; hour <= limit; hour++) {
		let threshold = utils.minutesFromNow(-hour * 60);

		let pressure = utils.getPressureClosestTo(pressures, threshold);

		if (pressure !== null && isLessThanOld(pressure.datetime, threshold, 30)) {
			historicPressures.push({ hour: hour, pressure: pressure });
		} else {
			historicPressures.push({ hour: hour, pressure: null });
		}
	}

	return historicPressures;
}

/**
 * 
 * @param actual The actual pressure time
 * @param threshold Threshold time
 * @param minutes Max number of minutes difference
 * @returns 
 */
function isLessThanOld(actual: Date, threshold: Date, minutes: number): boolean {
	return (actual.getTime() - threshold.getTime()) < minutes * 60 * 1000;
}