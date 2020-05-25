import React from 'react';
import {
  Box,
  Text,
  Image,
  SectionHeadingText,
  TrackedButton,
} from '@shops/wrappers/components';
import { reviewSubmitted } from '@shops/assets/icons';
import { useIntl } from '@shops/wrappers/core/hooks';

const ReviewSubmittedScreen = ({ navigation }) => {
  const intl = useIntl();
  return (
    <Box flex={1} mx={32}>
      <Box justifyContent={'center'} flex={1} alignItems={'center'}>
        <Image source={reviewSubmitted} height={215} width={215} />
        <SectionHeadingText fontSize={32} lineHeight={32} mt={24}>
          {intl.formatMessage({
            id: 'shop.reviewSubmitted.header',
            defaultMessage: 'Review Submitted',
          })}
        </SectionHeadingText>
        <Text textAlign={'center'} mt={16}>
          {intl.formatMessage({
            id: 'shop.reviewSubmitted.content',
          })}
        </Text>
      </Box>
      <Box mt={24} mb={20}>
        <TrackedButton
          primary
          title={intl.formatMessage({
            id: 'shop.reviewSubmitted.button',
          })}
          onPress={() => {
            navigation.pop(3)
          }}
        />
      </Box>
    </Box>
  );
};

export default ReviewSubmittedScreen;
