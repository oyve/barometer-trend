"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrediction = getPrediction;
const trend = __importStar(require("../trend"));
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
function getPrediction(tendency, trendValue) {
    const prediction = PREDICTIONS.find((pr) => pr.tendency === tendency && pr.trend === trendValue);
    return prediction ? prediction.prediction : undefined;
}
//# sourceMappingURL=byPressureTrend.js.map