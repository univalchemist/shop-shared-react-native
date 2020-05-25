import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import CustomOrder from '../CustomOrder';
import { QuantityButton } from '@shops/components';
import { renderForTest } from '@testUtils';
import { RadioGroup, RadioButton, BorderInput } from '@shops/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

describe('CustomOrder', () => {
  it('should render correctly', () => {
    const customOrder = renderForTest(<CustomOrder />);

    const sectionHeadingText = customOrder.getByText('Customise my order');
    const redButtons = customOrder.getAllByType(QuantityButton);
    const radioButtons = customOrder.getAllByType(RadioButton);

    expect(sectionHeadingText).toBeDefined();
    expect(redButtons.length).toEqual(2);
    expect(radioButtons.length).toEqual(1);
  });
  it('should increase amount when user click plus button', async () => {
    let quantity = 1;
    const customOrder = renderForTest(
      <CustomOrder
        quantity={quantity}
        onChangeQuantity={value => {
          quantity = value;
        }}
      />,
    );
    const plusButton = customOrder.getAllByType(QuantityButton)[1];

    fireEvent(plusButton, 'press');
    await flushMicrotasksQueue();

    expect(quantity).toEqual(2);
  });
  it('should decrease amount when user click minus button and amount > 0', () => {
    let quantity = 2;
    const customOrder = renderForTest(
      <CustomOrder
        quantity={quantity}
        onChangeQuantity={value => {
          quantity = value;
        }}
      />,
    );
    const [minusButton] = customOrder.getAllByType(QuantityButton);

    fireEvent(minusButton, 'press');

    expect(quantity).toEqual(1);
  });

  it('should do nothing  when user click minus button and amount == 1', async () => {
    let quantity = 1;
    const customOrder = renderForTest(
      <CustomOrder
        quantity={quantity}
        onChangeQuantity={value => {
          quantity = value;
        }}
      />,
    );
    const [minusButton] = customOrder.getAllByType(QuantityButton);

    fireEvent(minusButton, 'press');
    await flushMicrotasksQueue();

    expect(quantity).toEqual(1);
  });

  it('should update value when user type value on input', () => {
    let quantity = 1;
    const customOrder = renderForTest(
      <CustomOrder
        quantity={quantity}
        onChangeQuantity={value => {
          quantity = value;
        }}
      />,
    );
    const input = customOrder.getByType(BorderInput);

    fireEvent(input, 'changeText', '12');

    expect(quantity).toEqual(12);
  });

  it('should render value to 1  when user remove input', () => {
    let quantity = 1;
    const customOrder = renderForTest(
      <CustomOrder
        quantity={quantity}
        onChangeQuantity={value => {
          quantity = value;
        }}
      />,
    );
    const input = customOrder.getByType(BorderInput);

    fireEvent(input, 'changeText', '');

    expect(quantity).toEqual(1);
  });

  it('should update delivery value when user click radio button', () => {
    const customOrder = renderForTest(<CustomOrder />);

    const radioGroup = customOrder.getByType(RadioGroup);
    const radioButtons = customOrder.getAllByType(TouchableWithoutFeedback);

    fireEvent(radioButtons[0], 'press');

    expect(radioGroup.props.value).toEqual(0);
  });
});
