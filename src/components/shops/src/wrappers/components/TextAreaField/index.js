import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { useIntl, runValidations } from '@cxa-rn/core';
import TextArea from '../TextArea';

const TextAreaField = React.forwardRef((props, ref) => {
  const intl = useIntl();
  const {
    height,
    field,
    label,
    secureTextEntry,
    hint,
    keyboardType,
    autoCapitalize,
    returnKeyType,
    rightIcon,
    leftIcon,
    onSubmitEditing,
    selectTextOnFocus,
    onEndEditing,
    editable,
    onTouchStart,
    onPress,
    onKeyPress,
    validationErrorsLocalized,
    validate,
    required,
    onChangeText,
    onFocus,
    inputComponent,
    labelComponent,
    errorAfterSubmit,
    ...restProps
  } = props;
  const validateField = Array.isArray(validate)
    ? runValidations(validate)
    : validate;

  React.useImperativeHandle(ref, () => ({
    ...ref.current,
    focus: () => ref.current?.input?.focus(),
  }));

  const TextAreaCom = inputComponent || TextArea;

  return (
    <Field validate={validateField} {...restProps}>
      {fieldProps => {
        const {
          input: { value, onChange, ...restInput },
          meta: { error, touched },
        } = fieldProps;

        const localizedError =
          error && validationErrorsLocalized
            ? error
            : errorAfterSubmit
            ? errorAfterSubmit
            : error &&
              intl.formatMessage({ id: error, defaultMessage: 'Error' });

        const labelField =
          field &&
          intl.formatMessage({
            id: field.i18nId,
            defaultMessage: field.defaultLabel,
          });
        return (
          <TextAreaCom
            {...restProps}
            {...restInput}
            height={height}
            ref={ref}
            hint={hint}
            label={label || labelField}
            labelComponent={labelComponent}
            secureTextEntry={secureTextEntry}
            onSubmitEditing={onSubmitEditing}
            selectTextOnFocus={selectTextOnFocus}
            onChangeText={value => {
              onChangeText && onChangeText(value);
              onChange && onChange(value);
            }}
            value={value}
            error={localizedError}
            touched={touched || errorAfterSubmit}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={returnKeyType}
            rightIcon={rightIcon}
            leftIcon={leftIcon}
            editable={editable}
            onTouchStart={onTouchStart}
            onPress={onPress}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            accessibilityLabel={label || labelField}
            required={required}
            placeholder={
              field &&
              intl.formatMessage({
                id: field.i18nId && `${field.i18nId}.placeholder`,
                defaultMessage: field.defaultLabel,
              })
            }
            onEndEditing={onEndEditing}
          />
        );
      }}
    </Field>
  );
});

TextAreaField.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  secureTextEntry: PropTypes.bool,
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  rightIcon: PropTypes.node,
  leftIcon: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  onTouchStart: PropTypes.func,
  editable: PropTypes.bool,
  onPress: PropTypes.func,
  onKeyPress: PropTypes.func,
  onChangeText: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  validationErrorsLocalized: PropTypes.bool,
};

export const focusField = ref => {
  ref.current.focus();
};

export default TextAreaField;
