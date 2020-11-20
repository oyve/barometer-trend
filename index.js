'use strict'

const HALF_HOUR = 30;
const ONE_HOUR = 60;
const THREE_HOURS = 180;

const TENDENCY = {
    RISING: { key: 'RISING' },
    FALLING: { key: 'FALLING' }
};

const TREND = {
    STEADY: { key: 'STEADY', severity: 0 },
    SLOWLY: { key: 'SLOWLY', severity: 1 },
    CHANGING: { key: 'CHANGING', severity: 2 },
    QUICKLY: { key: 'QUICKLY', severity: 3 },
    RAPIDLY: { key: 'RAPIDLY', severity: 4 }
};

const THRESHOLDS = [
    { pascal: 10, trend: TREND.STEADY },
    { pascal: 16, trend: TREND.SLOWLY },
    { pascal: 36, trend: TREND.CHANGING },
    { pascal: 60, trend: TREND.QUICKLY },
    { pascal: 1000, trend: TREND.RAPIDLY }
];

const PREDICTIONS = [
    //rising
    { tendency: TENDENCY.RISING, trend: TREND.STEADY, indicator: 'Conditions are stable for now' },
    { tendency: TENDENCY.RISING, trend: TREND.SLOWLY, indicator: 'Slowly more dry, clear and stable conditions are expected' },
    { tendency: TENDENCY.RISING, trend: TREND.CHANGING, indicator: 'More dry, clear and stable conditions are expected' },
    { tendency: TENDENCY.RISING, trend: TREND.QUICKLY, indicator: 'Quickly more fair conditions, but also more wind are likely' },
    { tendency: TENDENCY.RISING, trend: TREND.RAPIDLY, indicator: 'A short bout of fair weather and stiff winds are likely' },
    //falling
    { tendency: TENDENCY.FALLING, trend: TREND.STEADY, indicator: 'Conditions are stable for now' },
    { tendency: TENDENCY.FALLING, trend: TREND.SLOWLY, indicator: 'Slowly more wet and unsettled conditions are expected' },
    { tendency: TENDENCY.FALLING, trend: TREND.CHANGING, indicator: 'Wet and unsettled conditions with more wind are expected' },
    { tendency: TENDENCY.FALLING, trend: TREND.QUICKLY, indicator: 'Gale weather conditions are likely' },
    { tendency: TENDENCY.FALLING, trend: TREND.RAPIDLY, indicator: 'Storm weather conditions are likely' }
];

let pressures = [];

/**
 * Clear the pressure readings. (Mainly for testing purposes)
 */
function clear() {
    pressures = [];
}

function hasPressures() {
    return pressures.length > 0;
}

/**
 * 
 * @param {Date} datetime Timestamp of barometer reading
 * @param {number} pressure Pressure in Pascal
 */
function addPressure(datetime, pressure) {
    pressures.push({
        datetime: datetime,
        value: pressure
    });

    removeOldPressures();
}

/**
 * Get the count of pressure entries. (Mainly for testing purposes)
 * @returns {number} Number of pressure entries
 */
function getPressureCount() {
    return pressures.length;
}

function removeOldPressures(threshold) {
    var threshold = minutesFromNow(-THREE_HOURS);
    pressures = pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
}

/**
 * 
 * @param {number} minutes Minutes from current time
 * @returns {Date} Date with given minute difference
 */
function minutesFromNow(minutes) {
    var now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return new Date(now);
}

function ascendingNumbers(a, b) {
    return a - b;
}

/**
 * Get the trend of the barometer
 * @returns {Array.<Object>} .tendency, .trend and .prediction
 */
function getTrend() {
    let latestHalfHour = calculate(-HALF_HOUR);
    let latestHour = calculate(-ONE_HOUR);
    let latestThreeHours = calculate(-THREE_HOURS);

    let actual = latestThreeHours;
    actual = compareSeverity(latestHour, actual) || actual;
    actual = compareSeverity(latestHalfHour, actual) || actual;

    return actual;
}

function compareSeverity(earlier, later) {
    if (earlier != null && later != null) {
        if (earlier.trend.severity > later.trend.severity) {
            return earlier;
        }
    }

    return later;
}

/**
 * 
 * @param {Date} from Datetime from when to compare readings
 */
function calculate(from) {
    if (pressures.length < 2) return null;

    var fromDatetime = minutesFromNow(-Math.abs(from));

    let subsetOfPressures = pressures.filter((p) => {
        return p.datetime.getTime() >= fromDatetime.getTime();
    });

    if (subsetOfPressures.length >= 2) {
        let earlier = subsetOfPressures[0];
        let later = subsetOfPressures[subsetOfPressures.length - 1];
        let difference = later.value - earlier.value;
        let tendency = difference >= 0 ? TENDENCY.RISING : TENDENCY.FALLING;

        let threshold = THRESHOLDS.sort(ascendingNumbers).find((t) => Math.abs(difference) < t.pascal);

        if (threshold != null) {
            let prediction = PREDICTIONS.find((pr) => pr.tendency === tendency && pr.trend === threshold.trend);

            return {
                tendency: prediction.tendency.key,
                trend: prediction.trend.key,
                indicator: prediction ? prediction.indicator : null,
                fromPressure: earlier.value,
                toPressure: later.value,
                pressureDifference: difference,
                periodMinutes: from,
                severity: prediction.trend.severity
            }
        }

        return null;
    }

    return null;
}

module.exports = {
    clear: clear,
    addPressure: addPressure,
    getPressureCount,
    getTrend: getTrend,
    minutesFromNow: minutesFromNow,
    hasPressures: hasPressures,
    TENDENCY: TENDENCY,
    TREND: TREND
}