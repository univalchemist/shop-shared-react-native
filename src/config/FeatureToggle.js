import Config from 'react-native-config';

export class FeatureToggle {
  constructor(key) {
    this.key = key;
  }

  get on() {
    return !!Config[this.key] && Config[this.key].toLowerCase() === 'true';
  }

  get off() {
    return !this.on;
  }

  turnOn() {
    Config[this.key] = 'true';
  }

  turnOff() {
    Config[this.key] = 'false';
  }
}

export default {
  NO_DEFAULT_ANSWERS: new FeatureToggle('NO_DEFAULT_ANSWERS'),
  ENABLE_CLAIMS_FILTER: new FeatureToggle('ENABLE_CLAIMS_FILTER'),
  USE_BIOMETRICS: new FeatureToggle('USE_BIOMETRICS'),
  TIPS_PRODUCT_RECOMMENDATION: new FeatureToggle('TIPS_PRODUCT_RECOMMENDATION'),
  TERMINATED_LABEL_FOR_CLINIC: new FeatureToggle('TERMINATED_LABEL_FOR_CLINIC'),
  DETECT_ROOTED_DEVICE: new FeatureToggle('DETECT_ROOTED_DEVICE'),
};
