const utils = require('../utils');

function getHistoricPressures(pressures, limit = 48) {
	let historicPressures = [];

	for(hour = 1; hour <= limit; hour++) {
		let pressure = utils.getPressuresSince(pressures, hour * 60)[0];

		//Add: pressure too old? will always return "freshest", 48hrs could be 1hr

		if(pressure !== null) {
			historicPressures.push({ "hour": hour, "pressure": pressure });
		}
	}
	
	return historicPressures;
}

module.exports = {
	getHistoricPressures
}