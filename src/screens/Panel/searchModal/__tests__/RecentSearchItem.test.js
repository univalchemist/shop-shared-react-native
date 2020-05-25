import React from 'react';
import { renderForTest } from '@testUtils';
import { ListItem } from '@wrappers/components';
import { RecentSearchItem } from '../RecentSearchItem';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { FilterTypes } from '../../utils/filter';

describe('RecentSearchItem', () => {
  const item = {
    label: 'clinic a',
    filter: {
      type: FilterTypes.NAME,
      values: ['clinic a'],
    },
  };
  const updateFilter = jest.fn();
  const saveToLocalStorage = jest.fn();
  const updateSearchTerm = jest.fn();
  const updateButtonPressCount = jest.fn();
  const updateSuccessfulSearchTerm = jest.fn();
  let listItem;

  beforeEach(async () => {
    const renderedRecentSearch = renderForTest(
      <RecentSearchItem
        item={item}
        updateFilter={updateFilter}
        saveToLocalStorage={saveToLocalStorage}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        buttonCount={0}
      />,
    );
    await flushMicrotasksQueue;
    listItem = renderedRecentSearch.queryAllByType(ListItem);

    fireEvent.press(listItem[0]);
    await flushMicrotasksQueue;
  });

  it('should render one list item given one recent search', async () => {
    expect(listItem.length).toBe(1);
    expect(listItem[0].props.children.props.children).toBe('clinic a');
  });

  it('should updateFilter', () => {
    expect(updateFilter).toHaveBeenCalledWith({
      type: FilterTypes.NAME,
      values: ['clinic a'],
    });
  });

  it('should saveToLocalStorage', () => {
    expect(saveToLocalStorage).toHaveBeenCalledWith({
      label: 'clinic a',
      filter: {
        type: FilterTypes.NAME,
        values: ['clinic a'],
      },
    });
  });

  it('should update searchTerm', () => {
    expect(updateSearchTerm).toHaveBeenCalledWith('clinic a');
  });

  it('should increment button count to force rerender', () => {
    expect(updateButtonPressCount).toHaveBeenCalled();
  });

  it('should update successful search term', () => {
    expect(updateSuccessfulSearchTerm).toHaveBeenCalledWith('clinic a');
  });
});
