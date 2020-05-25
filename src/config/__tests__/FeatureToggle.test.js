import { FeatureToggle } from '../FeatureToggle';
import Config from 'react-native-config';

describe('FeatureToggle', () => {
  it('is on if toggle value is true in config', () => {
    const toggleName = 'someToggle';
    Config[toggleName] = 'true';

    const toggle = new FeatureToggle(toggleName);

    expect(toggle.on).toBe(true);
    expect(toggle.off).toBe(false);
  });

  it('is off if toggle value is not true in config', () => {
    const toggleName = 'someToggle';
    Config[toggleName] = 'some value';

    const toggle = new FeatureToggle(toggleName);

    expect(toggle.on).toBe(false);
    expect(toggle.off).toBe(true);
  });

  it('is on if toggle value is true in config ignore case', () => {
    const toggleName = 'someToggle';
    Config[toggleName] = 'tRuE';

    const toggle = new FeatureToggle(toggleName);

    expect(toggle.on).toBe(true);
    expect(toggle.off).toBe(false);
  });

  it('is off if toggle does not exist', () => {
    const toggleName = 'NonExistingToggle';
    const toggle = new FeatureToggle(toggleName);

    expect(toggle.on).toBe(false);
    expect(toggle.off).toBe(true);
  });
});
