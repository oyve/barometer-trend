![Node.js CI](https://github.com/oyve/barometer-trend/workflows/Node.js%20CI/badge.svg)
# barometer-trend
Calculate the trend of a barometer over time.

## Use

```
const barometer = require('barometer-trend');

barometer.addPressure(datetime1, 1015)
barometer.addPressure(datetime2, 1016)
barometer.addPressure(datetime3, 1017)

let from = barometer.minutesFromNow(-60*3) //the last three hours
let trend = barometer.getTrend(from);
```

## Contribute
Feel free to create a Pull Request including test code.

## Disclaimer
This code is inspired by the article
- [How to use a barometer when sailing](https://www.jollyparrot.co.uk/blog/how-to-use-barometer-when-sailing)