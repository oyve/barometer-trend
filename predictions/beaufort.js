const BEAUFORT_RATIOS = [
	{ low: 2.67, high: 3.33, number: "F6-7" },
	{ low: 3.33, high: 5.5, number: "F8-9" },
	{ low: 5.5, high: 9999, number: "F10+" },
	{ low: -3.33, high: -1.67, number: "F6-7" },
	{ low: -9999, high: -3.33, number: "F8-12" },
];

function getByPressureVariationRatio(ratio) {
	let beaufort = BEAUFORT_RATIOS.find((b) => ratio <= b.high && ratio >= b.low);
	return beaufort !== undefined ? beaufort.number : "Less than F6";
}

module.exports = {
	getByPressureVariationRatio
}