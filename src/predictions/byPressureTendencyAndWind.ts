import predictionsNorthernHemisphere = require('./prediction_nh.json');

interface Quadrant {
    name: string;
    low: number;
    high: number;
}

interface ForecastEntry {
    [tendency: string]: {
        [quadrant: string]: string;
    };
}

interface PressureEntry {
    pressure: number;
    forecast: ForecastEntry;
}

/**
 * Get weather prediction based on pressure, wind direction, tendency, and trend.
 * @param pressure - The pressure value.
 * @param windDirection - The wind direction in degrees.
 * @param tendency - The pressure tendency (e.g., "RISING", "FALLING", "STEADY").
 * @param trend - The pressure trend (optional).
 * @param isNorthernHemisphere - True if located in the Northern Hemisphere, false otherwise.
 * @returns The weather prediction.
 */
export function getPrediction(pressure: number, windDirection: number | null | undefined, tendency: string, trend: string | null = null, isNorthernHemisphere: boolean = true): string {
    if (windDirection === null || windDirection === undefined) return 'N/A - No true wind data';

    let quadrant = getQuadrantByCompassDegree(windDirection);

    if (!isNorthernHemisphere) {
        quadrant = adjustQuadrantForSouthernHemisphere(quadrant);
    }

    let actualTendency = tendency;
    if (trend !== null && trend === "STEADY") actualTendency = "STEADY";

    try {
        let pressureEntry = (predictionsNorthernHemisphere as PressureEntry[]).find((p) => pressure <= p.pressure);
        if (!pressureEntry) return 'N/A';
        
        let prediction = pressureEntry.forecast[actualTendency]?.[quadrant];
        return prediction || 'N/A';
    } catch (error) {
        console.error("Error in getPrediction: ", error);
        return 'N/A';
    }
}

/**
 * Adjust quadrant for Southern Hemisphere.
 * @param quadrant - The quadrant in the Northern Hemisphere.
 * @returns The adjusted quadrant for the Southern Hemisphere.
 */
function adjustQuadrantForSouthernHemisphere(quadrant: string): string {
    switch (quadrant) {
        case "NE": return "NW";
        case "SE": return "SW";
        case "SW": return "SE";
        case "NW": return "NE";
        default: return quadrant;
    }
}

/**
 * Get quadrant by compass degree.
 * @param degree - The compass degree.
 * @returns The quadrant name.
 */
function getQuadrantByCompassDegree(degree: number): string {
    degree = Math.round(degree);
    if (degree === 360) degree = 0;

    let quadrant = quadrants.find((q) => degree >= q.low && degree <= q.high);
    return quadrant ? quadrant.name : 'Unknown';
}

const quadrants: Quadrant[] = [
    { name: "NE", low: 0, high: 89 },
    { name: "SE", low: 90, high: 179 },
    { name: "SW", low: 180, high: 269 },
    { name: "NW", low: 270, high: 359 }
];