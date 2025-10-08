import predictionSeasonJSON = require('./prediction_season.json');

interface SeasonPrediction {
    summer: string;
    winter: string;
}

interface TrendPrediction {
    tendency: string;
    trend: string;
    summer: string;
    winter: string;
}

interface PressureRange {
    pressure: number;
    predictions: TrendPrediction[];
}

export function getPrediction(pressure: number, tendency: string, trend: string, isSummer: boolean = true): string {
    const pressureRange = (predictionSeasonJSON as PressureRange[]).find((p) => pressure < p.pressure);
    
    if (!pressureRange) return 'Unknown';

    if(trend === "STEADY") tendency = "STEADY";
    if(trend === "CHANGING") trend = "RAPIDLY"; //CHANGING does not exist in the weather table, choose the less opportunistic
    if(trend === "QUICKLY") trend = "RAPIDLY"; //QUICKLY does not exist in the weather table

    const prediction = pressureRange.predictions.find((p) => p.tendency === tendency && p.trend === trend);

    if (!prediction) return 'Unknown';

    return isSummer ? prediction.summer : prediction.winter;
}
