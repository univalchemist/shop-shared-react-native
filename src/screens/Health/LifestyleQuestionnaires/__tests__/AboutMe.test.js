import React from 'react';
import { renderForTest } from '@testUtils';
import AboutMe from '../AboutMe';
import { InputField, CheckBoxField } from '@wrappers/components/form';
import {
  validateHeight,
  validateWeight,
  validateWaistCircumference,
} from '@wrappers/core/validations';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import messages from '@messages/en-HK.json';

describe('About Me', () => {
  const AboutMeWithReduxForm = compose(
    reduxForm({
      form: 'lifestyleForm',
    }),
  )(AboutMe);

  it('should have validHeight as validate prop for height input field', () => {
    const aboutMe = renderForTest(<AboutMeWithReduxForm />);

    const heightInputField = aboutMe.queryAllByType(InputField)[0];

    expect(heightInputField.props.validate).toEqual(validateHeight);
  });

  it('should have validWeight as validate prop for weight input field', () => {
    const aboutMe = renderForTest(<AboutMeWithReduxForm />);

    const weightInputField = aboutMe.queryAllByType(InputField)[1];

    expect(weightInputField.props.validate).toEqual(validateWeight);
  });

  it('should have validWaistCircumference as validate prop for waist circumference input field', () => {
    const aboutMe = renderForTest(<AboutMeWithReduxForm />);

    const waistCircumferenceInputField = aboutMe.queryAllByType(InputField)[2];

    expect(waistCircumferenceInputField.props.validate).toEqual(
      validateWaistCircumference,
    );
  });

  it('should have ethnicity checkbox', () => {
    const aboutMe = renderForTest(<AboutMeWithReduxForm />);

    const ethnicityCheckbox = aboutMe.queryAllByType(CheckBoxField)[0];

    expect(ethnicityCheckbox.props.name).toEqual('isAsian');
    expect(ethnicityCheckbox.props.label).toEqual(
      messages['ethnicity.iAmAsian'],
    );
  });
});
