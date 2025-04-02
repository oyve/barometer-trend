const trend = require('../trend');

const PREDICTIONS = [
	//rising: general rule: more fair, dry, stable, colder - the faster the more wind
	{ tendency: trend.TENDENCY.RISING.key, trend: trend.TREND.STEADY.key, prediction: 'Continued current weather' },
	{ tendency: trend.TENDENCY.RISING.key, trend: trend.TREND.SLOWLY.key, prediction: 'Expect more fair, dry, cool weather' },
	{ tendency: trend.TENDENCY.RISING.key, trend: trend.TREND.CHANGING.key, prediction: 'Expect fair, dry, cool weather and a strong breeze' },
	{ tendency: trend.TENDENCY.RISING.key, trend: trend.TREND.QUICKLY.key, prediction: 'Expect more dry and cold weather and a strong breeze to gale winds' },
	{ tendency: trend.TENDENCY.RISING.key, trend: trend.TREND.RAPIDLY.key, prediction: 'Expect shortly fair weather and gale or storm winds' },
	//falling: general rule: more wet, unstable - the faster the more wind
	{ tendency: trend.TENDENCY.FALLING.key, trend: trend.TREND.STEADY.key, prediction: 'Continued current weather' },
	{ tendency: trend.TENDENCY.FALLING.key, trend: trend.TREND.SLOWLY.key, prediction: 'Expect more wet and unsettled conditions' },
	{ tendency: trend.TENDENCY.FALLING.key, trend: trend.TREND.CHANGING.key, prediction: 'Expect wet, unsettled weather and a strong breeze' },
	{ tendency: trend.TENDENCY.FALLING.key, trend: trend.TREND.QUICKLY.key, prediction: 'Expect gale force weather' },
	{ tendency: trend.TENDENCY.FALLING.key, trend: trend.TREND.RAPIDLY.key, prediction: 'Expect storm force weather' }
];

function getPrediction(tendency, trend) {
	return PREDICTIONS.find((pr) => pr.tendency === tendency && pr.trend === trend).prediction
}

module.exports = {
	getPrediction
}
