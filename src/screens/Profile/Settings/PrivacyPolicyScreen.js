import React from 'react';
import {
  ParagraphSkeletonPlaceholder,
  ScrollView,
  Container,
  Box,
  PlainText,
  ErrorPanel,
} from '@wrappers/components';
import { connect } from 'react-redux';
import { useFetchActions } from '@wrappers/core/hooks';
import { getPrivacyPolicy } from '@store/legal/actions';

const PrivacyPolicyScreen = ({ getPrivacyPolicy, privacyPolicy }) => {
  const [isLoading, isError] = useFetchActions([getPrivacyPolicy]);
  let component;
  if (isLoading) {
    component = (
      <Container>
        <ParagraphSkeletonPlaceholder count={3} />
      </Container>
    );
  } else if (isError) {
    component = <ErrorPanel />;
  } else {
    component = (
      <Box bg="backgroundColor" flex={1}>
        <ScrollView>
          <Container>
            <PlainText>{privacyPolicy}</PlainText>
          </Container>
        </ScrollView>
      </Box>
    );
  }

  return component;
};

const enhance = connect(
  state => ({
    privacyPolicy: state.legal.privacyPolicy,
  }),
  {
    getPrivacyPolicy,
  },
);

export default enhance(PrivacyPolicyScreen);
