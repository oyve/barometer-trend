"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrediction = getPrediction;
const predictionSeasonJSON = require("./prediction_season.json");
function getPrediction(pressure, tendency, trend, isSummer = true) {
    let pressureRange = predictionSeasonJSON.find((p) => pressure < p.pressure);
    if (!pressureRange)
        return undefined;
    let actualTendency = tendency;
    let actualTrend = trend;
    if (trend === "STEADY")
        actualTendency = "STEADY";
    if (trend === "CHANGING")
        actualTrend = "RAPIDLY"; //CHANGING does not exist in the weather table, choose the less opportunistic
    if (trend === "QUICKLY")
        actualTrend = "RAPIDLY"; //QUICKLY does not exist in the weather table
    let prediction = pressureRange.predictions.find((p) => p.tendency === actualTendency && p.trend === actualTrend);
    if (!prediction)
        return undefined;
    return isSummer ? prediction.summer : prediction.winter;
}
//# sourceMappingURL=byPressureTrendAndSeason.js.map