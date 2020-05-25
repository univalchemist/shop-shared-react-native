import React from 'react';
import { renderForTest } from '@testUtils';
import MultiSelectModal from '../MultiSelectModal';
import { CustomMultiselectCheckBox } from '@wrappers/components/form';
import { Text } from 'react-native';
import { Button } from '@wrappers/components';
import { CheckBox } from 'react-native-elements';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { change } from 'redux-form';
import { act } from 'react-test-renderer';

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({ type: 'OK' })),
}));

const params = {
  form: 'MultiSelectForm',
  fieldKey: 'questionName',
  data: [
    {
      label: 'item 1',
      value: 'item1',
    },
    {
      label: 'item 2',
      value: 'item2',
    },
  ],
  initialSelected: ['item2'],
  buttonLabel: 'buttonLabel',
};

const navigation = {
  goBack: jest.fn(),
};

const route = { params };

describe('Tempting food modal', () => {
  it('should render MultiSelectCheckbox with correct button label', () => {
    const component = renderForTest(
      <MultiSelectModal navigation={navigation} route={route} />,
    );
    const multiSelectCheckbox = component.queryAllByType(
      CustomMultiselectCheckBox,
    );
    expect(multiSelectCheckbox.length).toBe(1);
    expect(
      component.queryAllByType(Text)[component.queryAllByType(Text).length - 1]
        .props.children,
    ).toEqual(params.buttonLabel);
  });

  it('should update redux-form when submit button is pressed', async () => {
    const component = renderForTest(
      <MultiSelectModal navigation={navigation} route={route} />,
    );
    const confirmButton = component.queryAllByType(Button)[0];
    const items = component.queryAllByType(CheckBox);

    act(() => {
      fireEvent.press(items[0]);
    });

    await flushMicrotasksQueue();

    act(() => {
      fireEvent.press(confirmButton);
    });

    await flushMicrotasksQueue();

    expect(change).toBeCalledWith('MultiSelectForm', 'questionName', [
      'item2',
      'item1',
    ]);
  });

  it('should go back when submit button is pressed', async () => {
    const component = renderForTest(
      <MultiSelectModal navigation={navigation} route={route} />,
    );
    const confirmButton = component.queryAllByType(Button)[0];

    act(() => {
      fireEvent.press(confirmButton);
    });

    await flushMicrotasksQueue();

    expect(navigation.goBack).toBeCalled();
  });

  it('should retain checked options', () => {
    const component = renderForTest(
      <MultiSelectModal navigation={navigation} route={route} />,
    );
    const checkBoxes = component.queryAllByType(CheckBox);
    expect(checkBoxes[0].props.checked).toBe(false);
    expect(checkBoxes[1].props.checked).toBe(true);
  });
});
