import React from 'react';
import { renderForTest } from '@testUtils';
import SingleSelectModal from '../SingleSelectModal';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import { change } from 'redux-form';

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({ type: 'OK' })),
}));

const params = {
  form: 'SingleSelectForm',
  fieldKey: 'questionName',
  data: [{ label: 'question label', value: 'qv' }],
  initialSelected: 'qv',
};

const navigation = {
  goBack: jest.fn(),
};

const route = {
  params,
};

describe('SingleSelectModal', () => {
  it('should render correctly', () => {
    const component = renderForTest(
      <SingleSelectModal navigation={navigation} route={route} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should update form with name upon choosing an item', async () => {
    const component = renderForTest(
      <SingleSelectModal navigation={navigation} route={route} />,
    );
    const listItem = component.getByText('question label');
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    expect(change).toBeCalledWith('SingleSelectForm', 'questionName', 'qv');
  });

  it('should navigate back to form upon choosing an item', async () => {
    const component = renderForTest(
      <SingleSelectModal navigation={navigation} route={route} />,
    );

    const listItem = component.getByText('question label');
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    expect(navigation.goBack).toBeCalled();
  });
});
