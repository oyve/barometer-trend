import { TENDENCY, TREND } from '../trend';

interface Prediction {
	tendency: string;
	trend: string;
	prediction: string;
}

const PREDICTIONS: Prediction[] = [
	//rising: general rule: more fair, dry, stable, colder - the faster the more wind
	{ tendency: TENDENCY.RISING.key, trend: TREND.STEADY.key, prediction: 'Continued current weather' },
	{ tendency: TENDENCY.RISING.key, trend: TREND.SLOWLY.key, prediction: 'Expect more fair, dry, cool weather' },
	{ tendency: TENDENCY.RISING.key, trend: TREND.CHANGING.key, prediction: 'Expect fair, dry, cool weather and a strong breeze' },
	{ tendency: TENDENCY.RISING.key, trend: TREND.QUICKLY.key, prediction: 'Expect more dry and cold weather and a strong breeze to gale winds' },
	{ tendency: TENDENCY.RISING.key, trend: TREND.RAPIDLY.key, prediction: 'Expect shortly fair weather and gale or storm winds' },
	//falling: general rule: more wet, unstable - the faster the more wind
	{ tendency: TENDENCY.FALLING.key, trend: TREND.STEADY.key, prediction: 'Continued current weather' },
	{ tendency: TENDENCY.FALLING.key, trend: TREND.SLOWLY.key, prediction: 'Expect more wet and unsettled conditions' },
	{ tendency: TENDENCY.FALLING.key, trend: TREND.CHANGING.key, prediction: 'Expect wet, unsettled weather and a strong breeze' },
	{ tendency: TENDENCY.FALLING.key, trend: TREND.QUICKLY.key, prediction: 'Expect gale force weather' },
	{ tendency: TENDENCY.FALLING.key, trend: TREND.RAPIDLY.key, prediction: 'Expect storm force weather' }
];

export function getPrediction(tendency: string, trend: string): string {
	const prediction = PREDICTIONS.find((pr) => pr.tendency === tendency && pr.trend === trend);
	return prediction ? prediction.prediction : 'Unknown';
}
