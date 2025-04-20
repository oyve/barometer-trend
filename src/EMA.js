/**
 * This code implements an Exponential Moving Average (EMA) for smoothing pressure readings from a barometer.
 * The EMA is calculated using a smoothing factor (alpha) that determines the weight of the most recent reading.
 */
class EMASmoothing {
    constructor(alpha = 0.1) {
        this.alpha = alpha; //smoothing factor (0.1 - 0.3)
        this.ema = null;
    }

/**
 * Corrects outliers by adjusting them to fit the surrounding trend, particularly for downward or upward trends.
 * Uses a combination of trend detection and EMA for smoothing.
 *
 * @param {number[]} data - Array of barometric readings (in Pascals).
 * @param {number} alpha - Smoothing factor for EMA (0.1–0.5).
 * @param {number} deviationThreshold - The number of standard deviations beyond which a value is considered an outlier.
 * @returns {number[]} Filtered and smoothed data array.
 */
 smoothOutliersWithTrendCorrection(data, deviationThreshold = 2) {
    // Step 1: Calculate mean and standard deviation of the dataset
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / data.length;
    const standardDeviation = Math.sqrt(variance);
  
    console.log(`Mean: ${mean}, Standard Deviation: ${standardDeviation}`);
  
    const result = [...data]; // Copy data for smoothing
  
    // Step 2: Loop through the data starting from the second value
    for (let i = 1; i <= data.length - 1; i++) {
      const currentValue = data[i];
      const previousValue = result[i - 1];
      const nextValue = data[i + 1] ?? currentValue;
  
      // Step 3: Calculate the deviation of the current value from the mean
      const deviation = Math.abs(currentValue - mean);
  
      // Step 4: Detect if the current value is an outlier
      if (deviation > deviationThreshold * standardDeviation) {
        console.log(`Outlier detected at index ${i}: ${currentValue} (Jump: ${deviation})`);
  
        // Calculate the trend by looking at the previous and next values
        const trend = nextValue - previousValue;
  
        // Handle downward trend (when the trend is negative)
        if (trend < 0 && currentValue > previousValue) {
          const correctedValue = previousValue + trend * 0.5; // Apply correction towards the downward trend
          result[i] = Math.round(correctedValue);
        }
        // Handle upward trend (when the trend is positive)
        else if (trend > 0 && currentValue < previousValue) {
          const correctedValue = previousValue + (trend * 0.5)
          result[i] = Math.round(correctedValue);
        }
        else {
          // Apply EMA smoothing if trend is unclear
          const ema = this.#EMASmoothening(currentValue, previousValue);
          result[i] = Math.round(ema);
        }
      }
    }
  
    return result;
  }
    
    

    /**
     * @description Updates the EMA with the new reading.
     * @param {number} reading Pressure reading from the barometer
     * @returns {number} The updated EMA value
     * @private
     */
    #updateEMA(reading) {
        this.ema === null ?
            this.ema = reading :
            //this.ema = this.alpha * reading + (1 - this.alpha) * this.ema;
            this.ema = this.#EMASmoothening(reading, this.ema);

        return this.ema;
    }

    #EMASmoothening(currentValue, nextValue) {
        let ema = this.alpha * currentValue + (1 - this.alpha) * nextValue;
        return ema;
    }

    #smoothen(readings, roundTo = 0) {
        let smoothened = [];
        readings.forEach((reading) => {
            let result = this.#updateEMA(reading)
            result = Number(result).toFixed(roundTo); //round to the specified number of decimal places
            smoothened.push(result);
        });  
        return smoothened;
    }

    /**
     * @description Takes an array of pressure readings and returns an array of smoothened pressure readings using EMA.
     * @param {Array} readings Array of pressure readings 
     * @param {number} [roundTo=0] Number of decimal places to round the result to (default is 0)
     * @returns {Array} Array of smoothened pressure readings
     */
    process(readings) {
        let filteredReadings = this.smoothOutliersWithTrendCorrection(readings, 1.5);
        //let filteredReadings = this.filterJumps(readings, 30); // Filter out jumps greater than 30 hPa
        //let processedReadings = this.#smoothen(filteredReadings, roundTo);
        return filteredReadings;
    }
}
const smoothener = new EMASmoothing(0.1);
module.exports = smoothener;
