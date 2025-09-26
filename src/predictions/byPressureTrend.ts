import * as trend from '../trend';

interface PredictionEntry {
    tendency: string;
    trend: string;
    prediction: string;
}

const PREDICTIONS: PredictionEntry[] = [
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

export function getPrediction(tendency: string, trendValue: string): string | undefined {
	const prediction = PREDICTIONS.find((pr) => pr.tendency === tendency && pr.trend === trendValue);
	return prediction ? prediction.prediction : undefined;
}