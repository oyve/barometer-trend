![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Calculate the trend of a barometer over a three hour period.

## Features
Gets the suggested:
- Tendency and trend of the barometer for the *last hour* or *three hours* (`FALLNG|SLOWLY`)
- Front system tendency, passage and wind analyze based on the latest three hours. (`Falling before a lesser rise` | `Cold front passage` | `Strong and gusty, then veers`)
- Force wind expectation in Beaufort scale based on the ratio of pressure increase/decrease (`F8-9`)
- Prediction of weather by ratio of increase/decrease trend (`Expect gale force weather'`)
- Prediction of weather by pressure tendency, threshold and wind direction (`Increasing rain, clearing within 12 hours.`)
- Prediction of weather by pressure threshold for winter|summer (`Cloudy and humid, thunderstorms`)

## Install & Use
```
npm i barometer-trend
```

```
const barometer = require('barometer-trend');

barometer.addPressure(datetime1, 101500);
barometer.addPressure(datetime2, 101505);
barometer.addPressure(datetime3, 101512, 225); //225 = wind direction - enables more calculations

let trend = barometer.getTrend();
```

## Note
- Pressure must be in Pascals, 1015 mBar/hPa = 101500 Pascal.
- Pressure readings older than *three hours* are automatically removed.
- GetTrend() investigate the trend for the latest *one hour* and *three hours*.
- The most recent trend with the highest severity is chosen.

## Contribute
Feel free to create a Pull Request including test code.

## Disclaimer
- All calculations is done by online research; the author of this library does not have a background in metereology. All sources listed below.
- A barometer is only *one source of weather information* and may give a general trend and indication, but not "see" the overall picture. (There's a reason satelittes exists and being a metereologist is a paid job.)
- All calculations presumes being located at sea with no disturbances.
- Near land, winds may be one-two Beaufort scale numbers lower and the wind might be coming from "the wrong direction".
- In subtropic and tropical regions some of the calculations may not be valid at all; i.e. the tradewind system is different from northern hemishpere west->east low pressure systems.
- In trade wind zones observe the daily variations; any change to this pattern could possibly indicate gale weather.

## Sources / References
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)
- [UK Met Office Marine Forecast Glossary](https://www.metoffice.gov.uk/weather/guides/coast-and-sea/glossary)
- [Hughes38.com](http://www.hughes38.com/wp-content/uploads/2016/02/Barometer-Wind-and-Temperature-WX.pdf)
- [SafeBoater.com](https://www.safeboater.com/learn-the-rules/weather.html)
- [Air pressure changes and their meanings](http://www.bohlken.net/airpressure2.htm)
- [Sailing Eurybia](https://sailingeurybia.com/weather-resources/)
- [Wikipedia: Beaufort scale](https://en.wikipedia.org/wiki/Beaufort_scale)