import React from 'react';
import { BorderInput } from '@shops/components';
import { renderForTest } from '@testUtils';
import { TextInput } from 'react-native';

describe('BorderInput', () => {
  it('should render correctly', () => {
    const placeHolder = 'Special instruction for vendor';
    const value = 'Instruction';
    const borderInput = renderForTest(
      <BorderInput value={value} placeholder={placeHolder} />,
    );
    const textInput = borderInput.getByType(TextInput);
    expect(textInput.props.value).toEqual(value);
    expect(textInput.props.placeholder).toEqual(placeHolder);
  });
});
