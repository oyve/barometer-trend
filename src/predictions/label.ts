/**
 * @description These values are the pressure ranges for the barometer labels,
 * typically seen on barometer dials. The ranges are defined in Pascals (Pa).
 * The labels are used to categorize the current atmospheric pressure into different weather conditions.
 */

interface BarometerRange {
  label: string;
  minPa: number;
  maxPa: number;
  description: string;
  detailedDescription: string;
}

const barometerRanges: BarometerRange[] = [
    {
      label: "Stormy",
      minPa: 0,
      maxPa: 97999,
      description: "Severe weather likely",
      detailedDescription: "Severe storms or extreme weather conditions likely"
    },
    {
      label: "Rain",
      minPa: 98000,
      maxPa: 99999,
      description: "Unsettled, wet weather",
      detailedDescription: "Rainy or unsettled weather expected"
    },
    {
      label: "Change",
      minPa: 100000,
      maxPa: 101999,
      description: "Changing weather",
      detailedDescription: "Unstable conditions, weather may shift"
    },
    {
      label: "Fair",
      minPa: 102000,
      maxPa: 102499,
      description: "Generally good weather",
      detailedDescription: "Mostly clear skies with pleasant weather"
    },
    {
      label: "Clear",
      minPa: 102500,
      maxPa: 102999,
      description: "Clear skies, stable weather",
      detailedDescription: "Bright and clear skies, stable weather"
    },
    {
      label: "Very Dry",
      minPa: 103000,
      maxPa: Infinity,
      description: "Dry, stable, clear weather",
      detailedDescription: "Very dry and stable conditions, clear skies"
    }
  ];
  
  /**
   * 
   * @param pressurePa Pressure in Pascal
   * @returns An object containing the label and description for the given pressure
   */
  export function getBarometerLabel(pressurePa: number): BarometerRange | null {
    pressurePa = Math.round(pressurePa); // Round to the nearest integer
    const match = barometerRanges.find(
      range => pressurePa >= range.minPa && pressurePa <= range.maxPa
    );
    return match ?? null;
  }
