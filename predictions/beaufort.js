const BEAUFORT_RATIOS = [
	{ low: 2.67, high: 3.33, force: "F6-7", min: 6, max: 7, description: "Strong breeze to near gale" },
	{ low: 3.33, high: 5.5, force: "F8-9", min: 8, max: 9, description: "Gale to strong gale" },
	{ low: 5.5, high: 9999, force: "F10+", min: 10, max: 12, description: "Storm or more" },
	{ low: -3.33, high: -1.67, force: "F6-7", min: 6, max: 7, description: "Strong breeze to near gale" },
	{ low: -9999, high: -3.33, force: "F8-12", min:8, max: 12, description: "Gale or violent storm conditions" },
];

function getByPressureVariationRatio(ratio) {
	let beaufort = BEAUFORT_RATIOS.find((b) => ratio <= b.high && ratio >= b.low);
	return beaufort !== undefined ?
		{ force: beaufort.force, min: beaufort.min, max: beaufort.max, description: beaufort.description } :
		{ force: "Less than F6", min: 0, max: 6, description: "Less than a strong breeze" };
}

module.exports = {
	getByPressureVariationRatio
}