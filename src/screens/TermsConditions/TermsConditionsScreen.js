import React from 'react';
import {
  ParagraphSkeletonPlaceholder,
  ScrollView,
  Container,
  Box,
  ErrorPanel,
} from '@wrappers/components';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { useFetchActions } from '@wrappers/core/hooks';
import { getTermsAndConditions } from '@store/legal/actions';
import { useTheme } from '@wrappers/core/hooks';
import HTML from 'react-native-render-html';

const TermsConditionsScreen = ({
  getTermsAndConditions,
  termsAndConditions,
}) => {
  const [isLoading, isError] = useFetchActions([getTermsAndConditions]);
  const theme = useTheme();

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
            <HTML
              baseFontStyle={{
                fontSize: 16,
                color: theme.colors.gray[1],
              }}
              html={termsAndConditions}
              imagesMaxWidth={Dimensions.get('window').width}
            />
          </Container>
        </ScrollView>
      </Box>
    );
  }

  return component;
};

const enhance = connect(
  state => ({
    termsAndConditions: state.legal.termsAndConditions,
  }),
  {
    getTermsAndConditions,
  },
);

export default enhance(TermsConditionsScreen);
