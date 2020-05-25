import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AddToCartButton } from '@shops/components';
import { render } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

describe('AddCartButton', () => {
  it('should render correctly', () => {
    const api = {
      addToCart: jest.fn(() => Promise.resolve({ data: {} })),
    };
    const [AddCartButtonCom] = render(
      <AddToCartButton quantity={1} sku={'a'} />,
      { api },
    );
    const buttonText = AddCartButtonCom.getByText('Add to cart');
    const button = AddCartButtonCom.getByType(TouchableOpacity);

    fireEvent(button, 'press');
    expect(buttonText).toBeDefined();
  });

  it('should onAddToCartSuccess when addToCart Successs', async () => {
    const api = {
      addToCart: jest.fn(() => Promise.resolve({ data: {} })),
    };
    const onAddToCartSuccess = jest.fn();
    const [AddCartButtonCom] = render(
      <AddToCartButton
        quantity={1}
        sku={'a'}
        onAddToCartSuccess={onAddToCartSuccess}
      />,
      { api },
    );
    const button = AddCartButtonCom.getByType(TouchableOpacity);

    fireEvent(button, 'press');
    await flushMicrotasksQueue();
    expect(onAddToCartSuccess).toBeCalled();
  });

  it('should onAddToCartFailed when addToCart Failed', async () => {
    const api = {
      addToCart: jest.fn(() => Promise.reject({})),
    };
    const onAddToCartFailed = jest.fn();
    const [AddCartButtonCom] = render(
      <AddToCartButton
        quantity={1}
        sku={'a'}
        onAddToCartFailed={onAddToCartFailed}
      />,
      { api },
    );
    const button = AddCartButtonCom.getByType(TouchableOpacity);

    fireEvent(button, 'press');
    await flushMicrotasksQueue();
    expect(onAddToCartFailed).toBeCalled();
  });

  it('should renderProperly when addToCart Failed but no callback handler', async () => {
    const api = {
      addToCart: jest.fn(() => Promise.reject({})),
    };
    const [AddCartButtonCom] = render(
      <AddToCartButton quantity={1} sku={'a'} />,
      { api },
    );
    const button = AddCartButtonCom.getByType(TouchableOpacity);

    fireEvent(button, 'press');
    await flushMicrotasksQueue();
    expect(button).toBeDefined();
  });
});
