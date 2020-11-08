'use strict'

const HALF_HOUR = 30;
const ONE_HOUR = 60;
const THREE_HOURS = 180;

const TENDENCY = {
    RISING: { key: 'RISING' },
    FALLING: { key: 'FALLING' }
};

const TREND = {
    STEADY: { key: 'STEADY', severity: 1 },
    SLOWLY: { key: 'SLOWLY', severity: 2 },
    CHANGING: { key: 'CHANGING', severity: 3 },
    QUICKLY: { key: 'QUICKLY', severity: 4 },
    RAPIDLY: { key: 'RAPIDLY', severity: 5 }
};

const PREDICTIONS = [
    //rising
    { tendency: TENDENCY.RISING, trend: TREND.STEADY, indicator: 'Conditions are stable for now' },
    { tendency: TENDENCY.RISING, trend: TREND.SLOWLY, indicator: 'Slowly more dry, clear and stable conditions are expected' },
    { tendency: TENDENCY.RISING, trend: TREND.CHANGING, indicator: 'More dry, clear and stable conditions are expected' },
    { tendency: TENDENCY.RISING, trend: TREND.QUICKLY, indicator: 'Quickly more fair conditions, but also more wind are expected' },
    { tendency: TENDENCY.RISING, trend: TREND.RAPIDLY, indicator: 'A short bout of fair weather and stiff winds are expected' },
    //falling
    { tendency: TENDENCY.FALLING, trend: TREND.STEADY, indicator: 'Conditions are stable for now' },
    { tendency: TENDENCY.FALLING, trend: TREND.SLOWLY, indicator: 'Slowly more wet and unsettled conditions are expected' },
    { tendency: TENDENCY.FALLING, trend: TREND.CHANGING, indicator: 'Wet and unsettled conditions with more wind are expected' },
    { tendency: TENDENCY.FALLING, trend: TREND.QUICKLY, indicator: 'Gale weather conditions are expected' },
    { tendency: TENDENCY.FALLING, trend: TREND.RAPIDLY, indicator: 'Storm weather conditions are expected' }
];

const THRESHOLDS = [
    { pascal: 10, trend: TREND.STEADY },
    { pascal: 16, trend: TREND.SLOWLY },
    { pascal: 36, trend: TREND.CHANGING },
    { pascal: 60, trend: TREND.QUICKLY },
    { pascal: 1000, trend: TREND.RAPIDLY }
];

let pressures = [];

function clear() {
    pressures = [];
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

function removeOldPressures(threshold) {
    var threshold = minutesFromNow(-THREE_HOURS);
    pressures = pressures.filter((p) => p.datetime.getTime() >= threshold.getTime());
}

/**
 * 
 * @param {number} minutes Minutes from current time
 */
function minutesFromNow(minutes) {
    var now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    now = new Date(now);
    return now;
}

function ascendingNumbers(a, b) {
    return a-b;
}

/**
 * Get the trend of the barometer
 */
function getTrend() {
    let latestHalfHour = calculate(-HALF_HOUR);
    let latestHour = calculate(-ONE_HOUR);
    let latestThreeHours = calculate(-THREE_HOURS);

    let actual = latestThreeHours;

    if(latestHour != null && latestThreeHours != null) {
        if(TREND[latestHour.trend].severity > TREND[latestThreeHours.trend].severity) {
            actual = latestHour;
        }
    }

    if(latestHalfHour != null && latestHour != null) {
        if(TREND[latestHalfHour.trend].severity > TREND[latestHour.trend].severity) {
            actual = latestHalfHour;
        }
    }

    return actual;
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
            let prediction = PREDICTIONS.find((pr) => pr.tendency == tendency && pr.trend == threshold.trend);

            return {
                tendency: tendency.key,
                trend: threshold.trend.key,
                prediction: prediction ? prediction.indicator : null
            }
        }

        return null;
    }

    return null;
}

module.exports = {
    clear: clear,
    addPressure: addPressure,
    getTrend: getTrend,
    minutesFromNow: minutesFromNow,
    TENDENCY: TENDENCY,
    TREND: TREND
}