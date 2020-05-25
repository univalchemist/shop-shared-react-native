import React from 'react';
import RadioGroup from '../RadioGroup';
import RadioButton from '../RadioButton';
import { renderForTest } from '@testUtils';
import { fireEvent } from 'react-native-testing-library';
import { TouchableWithoutFeedback } from 'react-native';

describe('RadioGroup', () => {
  it('should render correctly', () => {
    const radioGroup = renderForTest(
      <RadioGroup value={0} onChange={value => value + 1}>
        <RadioButton text="Delivery (+HK$ 5.00)" value={0} />
        <RadioButton text="Self-collection (Free)" value={1} />
      </RadioGroup>,
    );

    const radioButtons = radioGroup.getAllByType(RadioButton);

    expect(radioButtons.length).toEqual(2);
  });
  it('should update value when user click radio buttons', () => {
    const handleChange = jest.fn();
    const radioGroup = renderForTest(
      <RadioGroup value={0} onChange={handleChange}>
        <RadioButton text="Delivery (+HK$ 5.00)" value={0} />
        <RadioButton text="Self-collection (Free)" value={1} />
      </RadioGroup>,
    );

    const radioButtons = radioGroup.getAllByType(TouchableWithoutFeedback);

    fireEvent(radioButtons[0], 'press');

    expect(handleChange).toHaveBeenCalledWith(0);
  });
});
