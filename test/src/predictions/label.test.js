const assert = require('assert');

// Assume getBarometerLabel and barometerRanges are exported from your file
const { getBarometerLabel } = require('../../../src/predictions/label');

describe('getBarometerLabel', () => {
  it('should return "Stormy" for 97000 Pa', () => {
    const result = getBarometerLabel(97000);
    assert.strictEqual(result.label, 'Stormy');
  });

  it('should return "Rain" for 99000 Pa', () => {
    const result = getBarometerLabel(99000);
    assert.strictEqual(result.label, 'Rain');
  });

  it('should return "Change" for 101000 Pa', () => {
    const result = getBarometerLabel(101000);
    assert.strictEqual(result.label, 'Change');
  });

  it('should return "Fair" for 102200 Pa', () => {
    const result = getBarometerLabel(102200);
    assert.strictEqual(result.label, 'Fair');
  });

  it('should return "Clear" for 102700 Pa', () => {
    const result = getBarometerLabel(102700);
    assert.strictEqual(result.label, 'Clear');
  });

  it('should return "Very Dry" for 104000 Pa', () => {
    const result = getBarometerLabel(104000);
    assert.strictEqual(result.label, 'Very Dry');
  });

  it('should return "Unknown" for negative pressure', () => {
    const result = getBarometerLabel(-100);
    assert.strictEqual(result, null);
  });
});
