const MINUTES = {
	ONE_HOUR: 60,
	THREE_HOURS: 60*3
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

/**
 * 
 * @param {*} pressures The pressures to filter
 * @param {*} minutes Since X minutes
 * @returns {Array<Object>} Subset of pressures
 */
function getPressuresSince(pressures, minutes) {
	let earlier = minutesFromNow(-Math.abs(minutes));
	let subPressures = pressures.filter((p) => {
		return p.datetime.getTime() >= earlier.getTime();
	});
	return subPressures;
}

function isSummer(isNorthernHemisphere = true) {
    let month = new Date().getMonth() + 1;
	let summer = month >= 4 && month <= 9; //April to September
	
	return isNorthernHemisphere ? summer : !summer;
}

module.exports = {
	minutesFromNow,
	getPressuresSince,
	isSummer,
	MINUTES
}