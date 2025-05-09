class ForecastBase {
    constructor() {
      if (new.target === ForecastBase) {
        throw new TypeError("Cannot construct ForecastBase instances directly");
      }
    }
  
    forecast() {
      throw new Error("Method 'forecast()' must be implemented.");
    }
  }
  
  module.exports = ForecastBase