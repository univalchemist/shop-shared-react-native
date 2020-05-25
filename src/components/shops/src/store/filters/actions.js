import {
  UPDATE_SELECTED_CATEGORIES,
  UPDATE_SORT_TYPE,
  UPDATE_FILTER_TYPES,
  UPDATE_SEARCH_STRING,
} from './types';

export const updateSelectedCategories = categories => ({
  type: UPDATE_SELECTED_CATEGORIES,
  payload: categories,
});

export const updateSortType = sortType => ({
  type: UPDATE_SORT_TYPE,
  payload: sortType,
});

export const updateFilterTypes = filterTypes => ({
  type: UPDATE_FILTER_TYPES,
  payload: filterTypes,
});

export const updateSearchString = searchString => ({
  type: UPDATE_SEARCH_STRING,
  payload: searchString,
});
