import { getBarometerLabel } from '../../../src/predictions/label';

describe('getBarometerLabel', () => {
  it('should return "Stormy" for 97000 Pa', () => {
    const result = getBarometerLabel(97000);
    expect(result?.label).toBe('Stormy');
  });

  it('should return "Rain" for 99000 Pa', () => {
    const result = getBarometerLabel(99000);
    expect(result?.label).toBe('Rain');
  });

  it('should return "Change" for 101000 Pa', () => {
    const result = getBarometerLabel(101000);
    expect(result?.label).toBe('Change');
  });

  it('should return "Fair" for 102200 Pa', () => {
    const result = getBarometerLabel(102200);
    expect(result?.label).toBe('Fair');
  });

  it('should return "Clear" for 102700 Pa', () => {
    const result = getBarometerLabel(102700);
    expect(result?.label).toBe('Clear');
  });

  it('should return "Very Dry" for 104000 Pa', () => {
    const result = getBarometerLabel(104000);
    expect(result?.label).toBe('Very Dry');
  });

  it('should return "Unknown" for negative pressure', () => {
    const result = getBarometerLabel(-100);
    expect(result).toBeNull();
  });
});