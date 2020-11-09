![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Calculate the trend of a barometer over a three hour period.

## Use
Also see the Test folder for more examples.

```
const barometer = require('barometer-trend');

barometer.addPressure(datetime1, 101500);
barometer.addPressure(datetime2, 101505);
barometer.addPressure(datetime3, 101512);

let trend = barometer.getTrend();

console.log(trend.tendency); //'RISING'
console.log(trend.trend); //'SLOWLY'
console.log(trend.prediction); //'Slowly more dry, clear and stable conditions are expected'
```

> Pressure must be in Pascals, 1015 mBar/hPa = 101500 Pascal\
> Pressure readings older than *three hours* are automatically deleted.\
> GetTrend() investigate the trend for the latest *half hour*, *one hour* and *three hours*.\
> The most recent trend with the highest severity is chosen.

## Contribute
Feel free to create a Pull Request including test code.

## Disclaimer
This code is inspired by the article
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)