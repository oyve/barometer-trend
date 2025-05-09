const utils = require('../utils');

function forecast(json) {
    if (!json) return null;

    const datetime = readableDate();
    const barometerLabel = json.models.label.label.toUpperCase().trim();
    const barometerDescription = json.models.label.description.toLowerCase().trim();
    const barometerDetailedDescription = json.models.label.detailedDescription.toLowerCase().trim();
    const tendency = json.trend.tendency.toLowerCase().trim();
    const trend = json.trend.trend.key.toLowerCase().replace('changing', 'progressively').trim();
    const severity = json.trend.trend.severity;
    const severityRating = utils.makeStars(severity, 5);
    const severityCategory = json.trend.trend.category.toUpperCase().trim();
    const pressureSystemCurrent = json.models.pressureSystem.current;
    const pressureSystemTrending = null; //json.models.pressureSystem.trending.name.toLowerCase().trim();
    const frontTendency = json.models.front?.tendency?.toLowerCase().trim() || null;
    const frontPrognose = json.models.front?.prognose?.toLowerCase().trim() || null;
    const frontWind = json.models.front?.wind?.toLowerCase().trim() || null;
    const pressureOnly = json.models.pressureOnly.toLowerCase().trim().removeWord("expect ").trim();
    const pressureAndWind = json.models.quadrant.toLowerCase().trim();
    const pressureAndSeason = json.models.season.toLowerCase().trim();
    
    const dataQualityStars = utils.getThreeStarRating(json.dataQuality)
    const dataQualityLabel = utils.getDataQualityRating(json.dataQuality).label.toUpperCase();

    const hasWind = pressureAndWind !== "n/a" && pressureAndWind !== null && pressureAndWind !== undefined;

    const showsText = `[${datetime}] [SEVERITY: ${severityRating} (${severityCategory})] Barometric pressure shows ${barometerLabel}, suggesting ${barometerDescription}.`;
    const expectWind = hasWind ? ` and ${pressureAndWind}.` : "";
    
    let pressureTrendingText = "";
    if(pressureSystemTrending != null && pressureSystemCurrent.key !== pressureSystemTrending.key) {
        pressureTrendingText = ` to ${pressureSystemTrending} pressure`
    }

    let pressureSystemCurrenttext = `${pressureSystemCurrent.text.capitalizeFirst()}`;

    const pressureText = `${pressureSystemCurrenttext} pressure is currently ${tendency} ${trend}${pressureTrendingText}, trending to give ${pressureOnly}, ${pressureAndSeason}${expectWind}.`;

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
    } else {
        frontText = "";
    }

    const dataQualityText = `[Accuracy: ${dataQualityStars} (${dataQualityLabel})]`;

    const result = [showsText, pressureText, frontText, dataQualityText].filter(Boolean).join(' ');
    return result;
}

function readableDate() {
    return new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

String.prototype.removeWord = function(wordToRemove) {
    const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');
    return this.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
  };

String.prototype.capitalizeFirst = function() {
return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {
    forecast
}