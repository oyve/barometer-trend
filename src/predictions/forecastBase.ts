class ForecastBase {
    constructor() {
      if (new.target === ForecastBase) {
        throw new TypeError("Cannot construct ForecastBase instances directly");
      }
    }
  
    forecast(): any {
      throw new Error("Method 'forecast()' must be implemented.");
    }
  }
  
  export { ForecastBase };
