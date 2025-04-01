

// function calculateEMA(currentPressure, prevousEMA, alpha) {
//     return alpha * currentPressure + (1 - alpha) * prevousEMA;
// }

// let pressureReadings = [];

// let alpha = 0.2; //smoothing factor (0.1 - 0.3)
// let ema = pressureReadings[0].pressure;

// for(let i = 1; pressureReadings.length; i++) {
//     let deltaT = pressureReadings[i].timestamp - pressureReadings[i - 1].timestamp; //time difference

//     ema = calculateEMA(pressureReadings[i].pressure, ema, alpha);

//     return ema;
// }

class PressureEMA {
    constructor(alpha = 0.2) {
        this.alpha = alpha;
        this.ema = null;
    }

    updateEMA(pressure) {
        if(this.ema == null) {
            this.ema = pressure;
        } else {
            this.ema = this.alpha * pressure + (1 - this.alpha) * this.ema;
        }

        return this.ema;
    }
}

const weatherEMA = new PressureEMA(0.2);

const pressureReadings = [];

pressureReadings.forEach((pressure, index) => {
    const ema = weatherEMA.updateEMA(pressure);
    return ema;
})