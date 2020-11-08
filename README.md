![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Calculate the trend of a barometer over a three hour period.

## Use
Also see the Test folder for more examples.

```
const barometer = require('barometer-trend');

barometer.addPressure(datetime1, 1015);
barometer.addPressure(datetime2, 1016);
barometer.addPressure(datetime3, 1017);

let trend = barometer.getTrend();
```

> Pressure readings older than *3 hours* are automatically deleted.\
> GetTrend() investigate the trend for the latest *half hour*, *hour* and *three hours*.\
> The newest trend with the highest severity is choosen.\
> I.e. if the *half hour* trend shows rapidly falling pressure, this will be the one returned.\

## Contribute
Feel free to create a Pull Request including test code.

## Disclaimer
This code is inspired by the article
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)