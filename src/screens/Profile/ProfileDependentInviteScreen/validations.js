import { compose, keys, reduce } from 'ramda';
import { getYearsAgo, getAgeInDays, getDateDuration } from '@utils';
import {
  DEPENDENT_EMAIL,
  CONFIRM_EMAIL,
  MIN_SPOUSE_AGE,
  MIN_CHILD_AGE,
  MAX_CHILD_AGE,
} from './constants';
import { isMatched } from './helpers';

const _getAgeInDays = getAgeInDays();

const validateSpouseAge = min => dobDate => value => {
  const ageInDays = _getAgeInDays(dobDate);
  const nowTillMinYearsAgo = getDateDuration()(getYearsAgo(min)) + 1;
  const isValid = ageInDays > nowTillMinYearsAgo;

  return isValid ? '' : 'invalidDoB';
};

const validateChildAge = (min, max) => dobDate => value => {
  const ageInDays = _getAgeInDays(dobDate);
  const getDuration = getDateDuration();
  const nowTillMinYearsAgo = getDuration(getYearsAgo(min)) + 1;
  const nowTillMaxYearsAgo = getDuration(getYearsAgo(max));
  const isValid =
    ageInDays > nowTillMinYearsAgo && ageInDays < nowTillMaxYearsAgo;

  return isValid ? '' : 'invalidDoB';
};

export const validateAge = isSpouse => {
  return isSpouse
    ? validateSpouseAge(MIN_SPOUSE_AGE)
    : validateChildAge(MIN_CHILD_AGE, MAX_CHILD_AGE);
};

const validations = values => (state, key) => {
  switch (key) {
    case CONFIRM_EMAIL: {
      if (isMatched(values[DEPENDENT_EMAIL], values[CONFIRM_EMAIL])) {
        return state;
      }

      return {
        ...state,
        [CONFIRM_EMAIL]: 'isEmailNotMatched',
      };
    }

    default: {
      return state;
    }
  }
};

export default values =>
  compose(
    reduce(validations(values), {}),
    keys,
  )(values);
