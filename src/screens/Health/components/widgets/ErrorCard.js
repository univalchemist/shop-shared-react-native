import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CardContainer } from '@screens/Health/components/widgets/CardContainer';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import {
  Box,
  ErrorText,
  SectionHeadingText,
  Button,
} from '@wrappers/components';
import { LIFESTYLE_FORM } from '@routes';

export const ErrorCard = ({ color }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const intl = useIntl();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        navigation.navigate(LIFESTYLE_FORM, { scrollToFutureMe: true })
      }
    >
      <CardContainer
        theme={theme}
        justifyContent="center"
        color={color}
        flexGrow={1}
      >
        <SectionHeadingText textAlign="center">
          {intl.formatMessage({
            id: 'health.healthScoreHistory.errorMessage.somethingWentWrong',
          })}
        </SectionHeadingText>

        <ErrorText
          mt={2}
          textAlign="center"
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.lifestyleimage.errorMessage.unableToShow',
          })}
          flexGrow={1}
        >
          {intl.formatMessage({
            id: 'health.lifestyleimage.errorMessage.unableToShow',
          })}
        </ErrorText>
        <ErrorText
          textAlign="center"
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.lifestyleimage.errorMessage.tryAgain',
          })}
          flexGrow={1}
        >
          {intl.formatMessage({
            id: 'health.lifestyleimage.errorMessage.tryAgain',
          })}
        </ErrorText>
        <Box mt={4}>
          <Button
            primary
            title={intl.formatMessage({ id: 'tryAgain' })}
            onPress={() =>
              navigation.navigate(LIFESTYLE_FORM, { scrollToFutureMe: true })
            }
          />
        </Box>
      </CardContainer>
    </TouchableOpacity>
  );
};
