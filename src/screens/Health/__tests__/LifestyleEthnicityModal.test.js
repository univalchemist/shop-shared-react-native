import { renderForTest } from '@testUtils';
import React from 'react';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import { change } from 'redux-form';
import LifestyleEthnicityModal from '../LifestyleEthnicityModal';

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({ type: 'OK' })),
}));

const initialState = {
  health: {
    ethnicityOptions: {
      EastAsian: 'ethnicityOptions.EastAsian',
      SouthAsian: 'ethnicityOptions.SouthAsian',
    },
  },
  form: {
    lifestyleForm: {
      values: {
        ethnicity: 'EastAsian',
      },
    },
  },
};

describe('LifestyleEthnicityModal', () => {
  it('should render correctly', () => {
    const component = renderForTest(<LifestyleEthnicityModal />, {
      initialState,
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should update lifestyle form upon choosing an ethnicity', async () => {
    const navigation = { goBack: jest.fn() };
    const component = renderForTest(
      <LifestyleEthnicityModal navigation={navigation} />,
      {
        initialState,
      },
    );
    const listItem = component.getByText('East Asian');
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    expect(change).toBeCalledWith('lifestyleForm', 'ethnicity', 'EastAsian');
  });

  it('should navigate back to lifestyle form upon choosing an ethnicity', async () => {
    const navigation = { goBack: jest.fn() };
    const component = renderForTest(
      <LifestyleEthnicityModal navigation={navigation} />,
      {
        initialState,
      },
    );
    const listItem = component.getByText('East Asian');
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    expect(navigation.goBack).toBeCalledTimes(1);
  });
});
