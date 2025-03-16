![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Analyze and calculate tendency, trend and weather predictions of barometer readings, over a *one* or *three* hour period.

## Features
- Tendency and trend of the barometer for the *last hour* or *three hours* (`FALLING|SLOWLY`)
- Prediction of weather and systems:
  - By pressure trend only (`Expect gale force weather'`)
  - By pressure trend, thresholds and wind direction (`Increasing rain, clearing within 12 hours.`)
  - By seasonal pressure thresholds for winter and summer (`Cloudy and humid, thunderstorms`)
  - Front system tendency last three hours (`Falling before a lesser rise` | `Cold front passage` | `Strong and gusty, then veers`)
  - Force wind expectation in Beaufort scale based on the pressure tendency (`F8-9`)
- Detects current pressure system `Low`, `Normal`, `High`

### Optional features
- Additional parameters for more precise calculations: `Altitude`, `temperature`, `wind direction`
- Diurnal pressure correction (rudimentary pressure correction based on given `latitude` and time of year)

## Install & Use
```
npm i barometer-trend
```

## How to use
```
const barometer = require('barometer-trend');

//Basic use
barometer.addPressure(datetime1, 101500);
barometer.addPressure(datetime2, 101505);

//Including any of altitude, temperature and wind direction, otherwise null, for more precise calculations
barometer.addPressure(datetime3, 101512, 100, 20, 225); //100 altitude, 20 °C degrees, 225° wind direction
barometer.addPressure(datetime3, 101512, 100, null, null); //only altitude, temperature defaults

 //get forecast as JSON
let forecast = barometer.getPredictions();
```

> [!IMPORTANT]
> Diurnal pressure Correction
Diurnal pressure correction is an adjustment to atmospheric pressure readings that accounts for natural daily fluctuations caused by temperature changes. As the sun heats the air during the day, pressure tends to drop, while cooler nighttime temperatures cause it to rise. These variations can be estimated generically based on latitude and time of year, with peak pressure typically occurring in the early morning and late evening, though this timing varies by region, geography and weather patterns. This makes precise corrections difficult without historical data for a specific location.

Enabling this setting apply pressure correction using a generic approximation. Note: You will also need to set `latitude`. If your stations is moving (i.e. sailboat), you must update the latitude periodically, preferably as often as you update pressure readings.

---
//Enabling diurnal pressure corrections (before adding pressure readings)
barometer.setDiurnalEnabled(true);
barometer.setLatitude(45.123); //once for stationary stations or periodically for moving stations
barometer.addPressure(...as above....);
---

> [!NOTE]
> General information
- Pressure is input in Pascals (1015 mBar/hPa = 101500 Pascal).
- Software returns the period with the highest severity (one hour or three hours).
- Calculations are internally corrected to sea level pressure by optional `altitude` and `temperature`.
  - Altitude defaults to 0 meter ASL if not set.
  - Temperature defaults to 15°C degrees (global mean temperature) if not set.
- Up to `48-hour` in-memory history in case of software restart.
- If run less than *one hour* or *three hours*, the period until now is picked (might not be stabile)

## Contribute
Feel free to contribute; create an Issue, and Pull Request including test code.

## Disclaimer
- All calculations is by online research. Author of this library does not have a background in metereology. Sources listed below.
- A barometer is *one source of weather information* and may give a general trend and indication, but not "see" the overall picture. (There's a reason satelittes exists and being a metereologist is a paid job.)
- All calculations assumes being located at sea with no disturbances (i.e. mountains may give different readings)
- Near land, winds may be one-two Beaufort scale numbers lower and the wind may be from "the wrong direction".
- In subtropic and tropical regions some calculations may not be valid at all. I.e. the trade winds (easterlies) is different from northern hemishpere west->east (westerlies) low pressure systems.
- In trade wind zones observe the daily variations; changes to this pattern could possibly indicate gale weather.

## Sources / References
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)
- [UK Met Office Marine Forecast Glossary](https://www.metoffice.gov.uk/weather/guides/coast-and-sea/glossary)
- [Hughes38.com](http://www.hughes38.com/wp-content/uploads/2016/02/Barometer-Wind-and-Temperature-WX.pdf)
- [SafeBoater.com](https://www.safeboater.com/learn-the-rules/weather.html)
- [Air pressure changes and their meanings](http://www.bohlken.net/airpressure2.htm)
- [Sailing Eurybia](https://sailingeurybia.com/weather-resources/)
- [Wikipedia: Beaufort scale](https://en.wikipedia.org/wiki/Beaufort_scale)
- [Pressure conversion to sea level](https://keisan.casio.com/exec/system/1224575267)
- [Heidorn.info: Applying The Barometer To Weather Watching](http://www.heidorn.info/keith/weather/eyes/barometer3.htm)
