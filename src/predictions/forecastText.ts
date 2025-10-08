import * as utils from '../utils';

interface PressureSystem {
    key: number;
    name: string;
    short: string;
    text?: string;
}

interface ForecastJson {
    models: {
        label: {
            label: string;
            description: string;
            detailedDescription: string;
        };
        pressureSystem: {
            current: PressureSystem;
        };
        front?: {
            tendency?: string;
            prognose?: string;
            wind?: string;
        };
        pressureOnly: string;
        quadrant: string;
        season: string;
    };
    trend: {
        tendency: string;
        trend: {
            key: string;
            severity: number;
            category: string;
        };
    };
    dataQuality: number;
    forecastMinutes: number;
}

function removeWord(text: string, wordToRemove: string): string {
    const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');
    return text.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
}

function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function forecast(json: ForecastJson | null): string | null {
    if (!json) return null;

    const datetime = readableDate();
    const barometerLabel = json.models.label.label.toUpperCase().trim();
    const barometerDescription = json.models.label.description.toLowerCase().trim();
    const tendency = json.trend.tendency.toLowerCase().trim();
    const trend = json.trend.trend.key.toLowerCase().replace('changing', 'progressively').trim();
    const severity = json.trend.trend.severity;
    const severityRating = utils.makeStars(severity, 5);
    const severityCategory = json.trend.trend.category.toUpperCase().trim();
    const pressureSystemCurrent = json.models.pressureSystem.current;
    const frontTendency = json.models.front?.tendency?.toLowerCase().trim() || null;
    const frontPrognose = json.models.front?.prognose?.toLowerCase().trim() || null;
    const frontWind = json.models.front?.wind?.toLowerCase().trim() || null;
    const pressureOnly = removeWord(json.models.pressureOnly.toLowerCase().trim(), "expect ").trim();
    const pressureAndWind = json.models.quadrant.toLowerCase().trim();
    const pressureAndSeason = json.models.season.toLowerCase().trim();
    
    const dataQualityStars = utils.getThreeStarRating(json.dataQuality);
    const dataQualityLabel = utils.getDataQualityRating(json.dataQuality).label.toUpperCase();

    const hasWind = pressureAndWind !== "n/a" && pressureAndWind !== null && pressureAndWind !== undefined;

    const showsText = `[${datetime}] [SEVERITY: ${severityRating} (${severityCategory})] Barometric pressure shows ${barometerLabel}, suggesting ${barometerDescription}.`;
    const expectWind = hasWind ? ` and ${pressureAndWind}.` : "";

    const pressureSystemCurrenttext = capitalizeFirst(pressureSystemCurrent.text || pressureSystemCurrent.name.toLowerCase());

    const pressureText = `${pressureSystemCurrenttext} pressure is currently ${tendency} ${trend}, trending to give ${pressureOnly}, ${pressureAndSeason}${expectWind}.`;

    let frontText = "";
    if(frontTendency !== null) {
        frontText = `For the last 3 hours the pressure has been ${frontTendency}, indicating a ${frontPrognose}, and the wind ${frontWind}.`;
    } else if(json.forecastMinutes >= 180) {
        if(pressureSystemCurrent.short === "LOW")
            frontText = "There is no established frontal pattern, and conditions will remain relatively stable but may bring occasional cloud cover. While significant precipitation is unlikely, light rain or drizzle cannot be ruled out, and winds may be slightly more variable."
        else if(pressureSystemCurrent.short === "HIGH")
            frontText = "There is no established frontal pattern, and conditions will remain generally stable, with mostly clear skies and little cloud cover. There is a very low chance of precipitation, and winds will be light. Temperatures will likely be moderate for the season, with a generally calm and pleasant atmosphere.";
        else if(pressureSystemCurrent.short === "NORMAL")
            frontText = "There is no established frontal pattern, and conditions will remain relatively stable, though some cloud cover may develop at times. While precipitation is unlikely, light rain or drizzle could occur in isolated areas. Winds will be moderate, with no significant shifts in temperature or humidity expected";
    }

    const dataQualityText = `[Accuracy: ${dataQualityStars} (${dataQualityLabel})]`;

    const result = [showsText, pressureText, frontText, dataQualityText].filter(Boolean).join(' ');
    return result;
}

function readableDate(): string {
    return new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}
