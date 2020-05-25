import * as actions from '../actions';
import * as types from '../types';

describe('Shop filters actions', () => {
  it('should create an action to update selected categories', () => {
    const categories = [{ value: '3', labelValue: '4' }];

    const expectedAction = {
      type: types.UPDATE_SELECTED_CATEGORIES,
      payload: categories,
    };

    return expect(actions.updateSelectedCategories(categories)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to update sort type', () => {
    const sortType = 'bestselling-DESC';

    const expectedAction = {
      type: types.UPDATE_SORT_TYPE,
      payload: sortType,
    };

    return expect(actions.updateSortType(sortType)).toEqual(expectedAction);
  });

  it('should create an action to update filter types', () => {
    const filterTypes = {
      rangePrice: [0, 1000],
    };

    const expectedAction = {
      type: types.UPDATE_FILTER_TYPES,
      payload: filterTypes,
    };

    return expect(actions.updateFilterTypes(filterTypes)).toEqual(
      expectedAction,
    );
  });
});
