import React from 'react';
import { renderForTest } from '@testUtils';
import { Datepicker } from '@wrappers/components';
import ClaimDetailsFormScreen from '../ClaimDetailsFormScreen';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import messages from '@messages/en-HK';
import { change, handleSubmit } from 'redux-form';

jest.mock('redux-form', () => ({
  Field: 'Field',
  reduxForm: () => component => component,
  handleSubmit: callback => () => callback(),
  change: jest.fn(() => ({ type: 'OK' })),
}));

describe('ClaimDetailsFormScreenPure', () => {
  const initialState = {
    form: {
      claimDetailsForm: {
        values: { isMultiInsurer: false },
      },
    },
    claimType: {
      categories: {
        all: [],
        byId: {},
      },
      types: {
        byId: {},
      },
      reasons: {
        byId: {},
      },
    },
    wallet: { balanceMap: {} },
    user: {
      membersMap: {
        '': {
          terminationDate: '2020-02-29T16:00:00',
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Datepicker', () => {
    it('should validate the onCancel', () => {
      const touch = jest.fn();
      const change = jest.fn();
      const navigation = { navigate: jest.fn() };
      const { getByType } = renderForTest(
        <ClaimDetailsFormScreen
          change={change}
          handleSubmit={jest.fn()}
          touch={touch}
          navigation={navigation}
        />,
        {
          initialState,
        },
      );

      const field = getByType(Datepicker);
      field.props.onCancel();

      expect(touch).toHaveBeenCalledTimes(1);
      expect(touch).toHaveBeenCalledWith('consultationDate');
    });

    it('should change consultationDate', async () => {
      const navigation = { navigate: jest.fn() };
      const screen = renderForTest(
        <ClaimDetailsFormScreen
          touch={() => {}}
          handleSubmit={() => {}}
          change={change}
          navigation={navigation}
        />,
        { initialState },
      );
      const datepicker = screen.getByType(Datepicker);
      act(() => {
        fireEvent(datepicker, 'confirm', new Date(0));
      });
      await flushMicrotasksQueue();
      expect(change).toHaveBeenCalledWith(
        'consultationDate',
        '1970-01-01T00:00:00.000Z',
      );
    });

    it('should setIsVisible onPress', async () => {
      const navigation = { navigate: jest.fn() };
      const screen = renderForTest(
        <ClaimDetailsFormScreen
          touch={() => {}}
          handleSubmit={() => {}}
          change={() => {}}
          navigation={navigation}
        />,
        { initialState },
      );
      const datepicker = screen.getByType(Datepicker);
      const Field = datepicker.props.field;
      const setIsVisible = jest.fn();
      const field = renderForTest(
        <Field date={new Date()} setIsVisible={setIsVisible} />,
      );
      const selectField = field.getByProps({ name: 'consultationDate' });
      act(() => {
        fireEvent.press(selectField);
      });
      await flushMicrotasksQueue();

      expect(setIsVisible).toHaveBeenCalledWith(true);
    });
  });

  it('should clear otherInsurerAmount when otherInsurer checkbox is unchecked', async () => {
    const navigation = { navigate: jest.fn() };
    const screen = renderForTest(
      <ClaimDetailsFormScreen
        navigation={navigation}
        change={change}
        handleSubmit={handleSubmit}
      />,
      { initialState },
    );
    const button = screen.getByProps({
      title: messages['claim.uploadDocuments'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(change).toHaveBeenCalled();
    expect(change).toHaveBeenCalledWith('otherInsurerAmount', '');
  });
});
