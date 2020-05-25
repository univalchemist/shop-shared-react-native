import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Image, Text } from '@wrappers/components';
import {
  focusField,
  InputField,
  CheckBoxField,
} from '@wrappers/components/form';
import styled, { withTheme } from 'styled-components/native';
import { healthAboutMeImg } from '@images';
import {
  validateHeight,
  validateWaistCircumference,
  validateWeight,
} from '@wrappers/core/validations';
import theme from '@theme';
import { FormattedMessage } from 'react-intl';
import { useIntl } from '@wrappers/core/hooks';

const RightText = styled(Text)`
  font-size: 16px;
  font-weight: 300;
  ${({ theme }) => `
    color: ${theme.inputField.rightText}
  `};
`;

const DidYouKnowTitle = styled(Text)`
  color: ${props => props.theme.colors.gray[0]};
  font-size: ${props => props.theme.fontSizes[0]};
`;

const DidYouKnowText = styled(Text)`
  color: ${props => props.theme.colors.gray[8]};
  font-size: ${props => props.theme.fontSizes[0]};
  line-height: 16px;
`;

const styles = {
  checkboxField: {
    marginLeft: 0,
    padding: 0,
  },
};

const AboutMe = ({ submitCount }) => {
  const heightInputRef = useRef(null);
  const weightInputRef = useRef(null);
  const waistCircumferenceInputRef = useRef(null);
  const intl = useIntl();

  return (
    <Container>
      <Image
        width={148}
        height={161}
        source={healthAboutMeImg}
        resizeMode="contain"
        alignSelf="center"
      />
      <Box mt={24}>
        <Text
          lineHeight={37}
          fontSize={32}
          fontWeight={300}
          color={theme.colors.gray[0]}
          textAlign="center"
        >
          <FormattedMessage id="aboutMeTitle" />
        </Text>
      </Box>
      <Box mt={3}>
        <InputField
          submitCount={submitCount}
          ref={heightInputRef}
          name="height"
          validate={validateHeight}
          autoCapitalize="none"
          label={intl.formatMessage({ id: 'height' })}
          returnKeyType="done"
          keyboardType="number-pad"
          onSubmitEditing={() => focusField(weightInputRef)}
          rightIcon={
            <RightText>
              <FormattedMessage id="heightMetricLabel" />
            </RightText>
          }
          customStyles={theme.customInputStyles}
        />
      </Box>
      <Box>
        <InputField
          ref={weightInputRef}
          submitCount={submitCount}
          name="weight"
          validate={validateWeight}
          autoCapitalize="none"
          label={intl.formatMessage({ id: 'weight' })}
          returnKeyType="done"
          keyboardType="number-pad"
          onSubmitEditing={() => focusField(waistCircumferenceInputRef)}
          rightIcon={
            <RightText>
              <FormattedMessage id="weightMetricLabel" />
            </RightText>
          }
          customStyles={theme.customInputStyles}
        />
      </Box>
      <Box>
        <InputField
          ref={waistCircumferenceInputRef}
          submitCount={submitCount}
          name="waistCircumference"
          validate={validateWaistCircumference}
          autoCapitalize="none"
          label={intl.formatMessage({ id: 'waistCircumference' })}
          returnKeyType="done"
          keyboardType="number-pad"
          hint={intl.formatMessage({ id: 'optional' })}
          rightIcon={
            <RightText>
              <FormattedMessage id="heightMetricLabel" />
            </RightText>
          }
          customStyles={theme.customInputStyles}
        />
      </Box>
      <Box>
        <CheckBoxField
          name="isAsian"
          containerStyle={styles.checkboxField}
          label={intl.formatMessage({ id: 'ethnicity.iAmAsian' })}
          withContainer={false}
        />
      </Box>
      <Box mt={16}>
        <DidYouKnowTitle>
          {intl.formatMessage({ id: 'ethnicity.didYouKnow' })}
        </DidYouKnowTitle>
        <DidYouKnowText>
          {intl.formatMessage({ id: 'ethnicity.didYouKnowText' })}
        </DidYouKnowText>
      </Box>
    </Container>
  );
};

AboutMe.propTypes = {
  initialValues: PropTypes.shape({
    height: PropTypes.string,
    weight: PropTypes.string,
    waistCircumference: PropTypes.string,
  }),
};

export default withTheme(AboutMe);
