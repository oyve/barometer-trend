import predictionSeasonJSON = require('./prediction_season.json');

interface SeasonPrediction {
    tendency: string;
    trend: string;
    winter: string;
    summer: string;
}

interface PressureRange {
    pressure: number;
    predictions: SeasonPrediction[];
}

export function getPrediction(pressure: number, tendency: string, trend: string, isSummer: boolean = true): string | undefined {
	let pressureRange = (predictionSeasonJSON as PressureRange[]).find((p) => pressure < p.pressure);

	if(!pressureRange) return undefined;

	let actualTendency = tendency;
	let actualTrend = trend;

	if(trend === "STEADY") actualTendency = "STEADY";
	if(trend === "CHANGING") actualTrend = "RAPIDLY"; //CHANGING does not exist in the weather table, choose the less opportunistic
	if(trend === "QUICKLY") actualTrend = "RAPIDLY"; //QUICKLY does not exist in the weather table

	let prediction = pressureRange.predictions.find((p) => p.tendency === actualTendency && p.trend === actualTrend);

	if(!prediction) return undefined;

	return isSummer ? prediction.summer : prediction.winter;
}