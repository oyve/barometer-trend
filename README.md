![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Analyze and calculate tendency, trend and weather predictions of barometer readings, for a *one* or *three* hour period.

## Features
- Tendency and trend of the barometer for the *last hour* or *three hours* (`FALLING|SLOWLY`)
- Prediction of weather and systems:
  - By pressure trend only (`Expect gale force weather'`)
  - By pressure trend, thresholds and wind direction (`Increasing rain, clearing within 12 hours.`)
  - By seasonal pressure thresholds for winter and summer (`Cloudy and humid, thunderstorms`)
  - Front system tendency last three hours (`Falling before a lesser rise` | `Cold front passage` | `Strong and gusty, then veers`)
  - Force wind expectation in Beaufort scale based on the pressure tendency (`F8-9`)
- Detects current pressure system `Low`, `Normal`, `High`
- (Optional) Additional data for increased precision: `Altitude`, `Temperature`, `Wind direction`
- (Optional) Diurnal pressure correction (pressure correction based on location and time of year)

## Install
```
npm i barometer-trend
```

## How to use
```
const barometer = require('barometer-trend');

//Basic use
barometer.addPressure(datetime1, pressure = 101500); //(1015 mBar/hPa = 101500 Pascal)
barometer.addPressure(datetime2, pressure = 101505);

//For additional, more precise calculations, include any of Altitude (meters), Temperature (Celcius) and Wind direction (Degrees)
barometer.addPressure(datetime3, pressure = 101500, altitude = 100, temperature = 20, windDirection = 225);

 //With only Altitude, Temperature defaults. Wind direction data is not generated in result.
barometer.addPressure(datetime3, pressure = 101512, altitude = 100, temperature = null, windDirection = null);

 //Get forecast as JSON

 //Automatically determines northern|southern hemisphere if latitude is set, otherwise default to northern
barometer.setLatitude(45.123);
let forecast = barometer.getPredictions();

//or use
let forecast = barometer.getPredictions(northernHemisphere = true|false);
```

### Diurnal Pressure Correction (semi-diurnal)
Diurnal pressure correction is an adjustment to atmospheric pressure that accounts for natural daily variations in atmospheric pressure due to a tidal action in the atmosphere. The swelling and relaxing of air mass causes the pressure to swing through a cycle caused by temperature changes over a day. These variations can be roughly estimated based on latitude and time of year, with peak pressure typically occurring in the early morning and late evening, though this timing varies by region, geography (eg. mountains) and weather patterns. This makes precise corrections difficult without historical data for a specific location.

> [!NOTE]
> By enabling this setting, pressure readings will be corrected using a generic approximation based on your latitude and time of year. You will need to set `latitude`. If your stations is moving (i.e. sailboat), you must update the latitude periodically (preferably as often as you update pressure readings).

```
//Enabling diurnal pressure corrections (before adding pressure readings)
barometer.setDiurnalEnabled(true);

//Set latitude once for stationary stations, or periodically for moving stations
barometer.setLatitude(45.123);

barometer.addPressure(...as above....);
barometer.addPressure(...as above....);
```

### Additional information
- Software returns the period with the highest severity (one hour or three hours).
- Calculations are internally corrected to sea level pressure by optional `Altitude` and `Temperature`.
  - Altitude defaults to 0 meter ASL if not set.
  - Temperature defaults to 15°C degrees (global mean temperature) if not set.
- `48-hour` in-memory history.

> [!NOTE]
> If run less than *one hour* or *three hours*, the period until now is picked (might not be stabile)

## Contribute
Feel free to contribute, create an Issue, or Pull Request including test code.

## Disclaimer
> [!CAUTION]
> A barometer is one source of weather information and may give a general trend and indication, but not "see" the overall picture (why satelittes exists and metereology is a job).

- All calculations is by online research. Author of this library does not have a background in metereology. Sources listed below.
- All calculations assumes being located at sea with no disturbances (i.e. mountains may give different readings)
- Near land, winds may be one-two Beaufort scale numbers lower and the wind may be from "the wrong direction".
- In subtropic and tropical regions some calculations may not be valid at all. I.e. the trade winds (easterlies) is different from northern hemishpere west->east (westerlies) low pressure systems.
- In trade wind zones observe the daily variations; changes to this pattern could possibly indicate gale weather.

## Credits
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)
- [UK Met Office Marine Forecast Glossary](https://www.metoffice.gov.uk/weather/guides/coast-and-sea/glossary)
- [Hughes38.com](http://www.hughes38.com/wp-content/uploads/2016/02/Barometer-Wind-and-Temperature-WX.pdf)
- [SafeBoater.com](https://www.safeboater.com/learn-the-rules/weather.html)
- [Air pressure changes and their meanings](http://www.bohlken.net/airpressure2.htm)
- [Sailing Eurybia](https://sailingeurybia.com/weather-resources/)
- [Wikipedia: Beaufort scale](https://en.wikipedia.org/wiki/Beaufort_scale)
- [Pressure conversion to sea level](https://keisan.casio.com/exec/system/1224575267)
- [Heidorn.info: Applying The Barometer To Weather Watching](http://www.heidorn.info/keith/weather/eyes/barometer3.htm)
