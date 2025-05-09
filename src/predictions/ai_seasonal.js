//These ranges are broadly valid for mid-latitudes (around 35° to 55° N/S)

const seasonalPressureData = [
    {
        "season": "spring",
        thresholds: [
            { pMin: 102500, pMax: Infinity, tMin: 5, tMax: 12, hMin: 0, hMax: 50, interpretation: "Dry and calm, night frost possible" },
            { pMin: 101500, pMax: 102500, tMin: 8, tMax: 15, hMin: 50, hMax: 70, interpretation: "Generally fair, light winds" },
            { pMin: 100500, pMax: 101500, tMin: 10, tMax: 18, hMin: 70, hMax: 100, interpretation: "Unsettled, showers likely" },
            { pMin: 0, pMax: 100500, tMin: 12, tMax: 20, hMin: 80, hMax: 100, interpretation: "Wet fronts or spring storms" }
        ],
        "season": "summer",
        thresholds: [
            { pMin: 102000, pMax: Infinity, tMin: 25, tMax: 35, hMin: 0, hMax: 50, interpretation: "Dry heat, stable, risk of drought" },
            { pMin: 102000, pMax: Infinity, tMin: 25, tMax: 30, hMin: 70, hMax: 100, interpretation: "Humid, muggy, thunderstorms likely" },
            { pMin: 101000, pMax: 102000, tMin: 20, tMax: 28, hMin: 50, hMax: 70, interpretation: "Warm, fair, chance of showers" },
            { pMin: 100000, pMax: 101000, tMin: 22, tMax: 30, hMin: 75, hMax: 100, interpretation: "Unstable, thunderstorm risk" },
            { pMin: 0, pMax: 100000, tMin: 25, tMax: 33, hMin: 85, hMax: 100, interpretation: "Likely storms, wind, heavy rain" }     
        ],
        "season": "autumn",
        thresholds: [
            { pMin: 102500, pMax: Infinity, tMin: 5, tMax: 12, hMin: 0, hMax: 60, interpretation: "Calm, cool, early frost possible" },
            { pMin: 101500, pMax: 102500, tMin: 8, tMax: 14, hMin: 50, hMax: 70, interpretation: "Fair, cooling gradually" },
            { pMin: 100500, pMax: 101500, tMin: 10, tMax: 16, hMin: 70, hMax: 100, interpretation: "Showery, wind increasing" },
            { pMin: 0, pMax: 100500, tMin: 8, tMax: 14, hMin: 80, hMax: 100, interpretation: "Storms, heavy rain, strong winds" }
        ],
        "season": "winter",
        thresholds: [
            { pMin: 103000, pMax: Infinity, tMin: -5, tMax: 2, hMin: 0, hMax: 60, interpretation: "Clear, very cold, fog/frost risk" },
            { pMin: 101500, pMax: 103000, tMin: 0, tMax: 5, hMin: 50, hMax: 70, interpretation: "Dry, cool, stable" },
            { pMin: 100500, pMax: 101500, tMin: -2, tMax: 4, hMin: 70, hMax: 100, interpretation: "Snow/sleet possible" },
            { pMin: 99500, pMax: 100500, tMin: -3, tMax: 3, hMin: 80, hMax: 100, interpretation: "Windy, snowstorms or cold rain" },
            { pMin: 0, pMax: 99500, tMin: -5, tMax: 2, hMin: 90, hMax: 100, interpretation: "Severe conditions, blizzards or storms" }
        ]
    }
]
  
//   // Filter by season and pressure
// const springForecasts = seasonalPressureData.filter(
//     d => d.season === "spring" && d.pMin <= 1010 && d.pMax >= 1010
//   );
  