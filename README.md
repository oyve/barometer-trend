![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Calculate the tendency and trend of a barometer for a *one* to *three* hour period including barometric weather predictions.

## Features
- Tendency and trend of the barometer for the *last hour* or *three hours* (`FALLING|SLOWLY`)
- Prediction of weather and systems:
  - By pressure trend only (`Expect gale force weather'`)
  - By pressure trend, thresholds and wind direction (`Increasing rain, clearing within 12 hours.`)
  - By seasonal pressure thresholds for winter and summer (`Cloudy and humid, thunderstorms`)
  - Front system tendency for the last three hours (`Falling before a lesser rise` | `Cold front passage` | `Strong and gusty, then veers`)
  - Force wind expectation in Beaufort scale based on the pressure tendency (`F8-9`)
- Detects current pressure system `Low`, `Normal`, `High`

Note
- Picks the period with the highest severity (one hour or three hours)
- All calculations corrected (internally) to sea level pressure by optional `altitude` and `temperature`
- Up to 48 hour history

## Install & Use
```
npm i barometer-trend
```

```
const barometer = require('barometer-trend');

barometer.addPressure(datetime1, 101500);
barometer.addPressure(datetime2, 101505);
barometer.addPressure(datetime3, 101512, 100, 20, 225); //100 = altitude, 20 = C degrees, 225 = wind direction 

//barometer.addPressure(...) is more precise when pressure is corrected by altitude and temperature.

let forecast = barometer.getPredictions(); //returns JSON
```

## Note
- Pressure must be input in Pascals, 1015 mBar/hPa = 101500 Pascal.
- `getPredictions()` investigate the trend for the latest *one hour* and *three hours*
- If run less than *one hour* or *three hours*, the latest timing up until now is picked.
- The most recent trend with the highest severity is chosen (*One hour* or *Three hour* reading)

## Contribute
Feel free to contribute; create an Issue, and Pull Request including test code.

## Disclaimer
- All calculations is done by online research; the author of this library does not have a background in metereology. All sources listed below.
- A barometer is only *one source of weather information* and may give a general trend and indication, but not "see" the overall picture. (There's a reason satelittes exists and being a metereologist is a paid job.)
- All calculations presumes being located at sea with no disturbances.
- Near land, winds may be one-two Beaufort scale numbers lower and the wind might be coming from "the wrong direction".
- In subtropic and tropical regions some of the calculations may not be valid at all; i.e. the trade winds (easterlies) is different from northern hemishpere west->east (westerlies) low pressure systems.
- In trade wind zones observe the daily variations; any change to this pattern could possibly indicate gale weather.

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
