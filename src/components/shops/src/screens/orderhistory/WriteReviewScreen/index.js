import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  ScrollView,
  SecondaryText,
  SectionHeadingText,
  Text,
  Footer,
  TrackedButton,
  CheckBox,
} from '@shops/wrappers/components';
import { BackButton } from '@shops/components';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { REVIEW_SUBMITTED_SCREEN } from '@shops/navigation/routes';
import { reviewFieldBuilder, reviewRatingBuilder } from './reviewFormBuilder';
import { getReviewForm, postReview } from '@shops/store/review/actions';
import { connect } from 'react-redux';
import Spinner from '@shops/components/Spinner';

const WriteReviewScreen = ({
  navigation,
  route: {
    params: { boughtProduct, orderId },
  },
  getReviewForm,
  postReview,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [reviewForm, setReviewForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAcceptRule, setIsAcceptRule] = useState(false);
  const handleSubmitRef = useRef();
  const submittingRef = useRef();
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const { value } = await getReviewForm();
        setReviewForm(value);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async reviewData => {
    const ratings = Object.keys(reviewForm.ratings).map(key => ({
      ratingId: reviewForm.ratings[key].ratingId,
      optionId: reviewForm.ratings[key].currentRating,
    }));
    try {
      await postReview({
        orderId: orderId,
        sku: boughtProduct.sku,
        body: { reviewData, ratings },
      });
      navigation.navigate(REVIEW_SUBMITTED_SCREEN);
    } catch (e) {
      console.log({ e });
    }
  };

  const onRatingChange = (ratingKey, starId) => {
    setReviewForm(prevReviewForm => {
      let newReviewForm = { ...prevReviewForm };
      newReviewForm.ratings[ratingKey].currentRating = starId;
      return newReviewForm;
    });
  };

  return (
    <Box flex={1}>
      <ScrollView flex={1} bg={theme.colors.transparent}>
        <BackButton navigation={navigation} />
        {isLoading ? (
          <Spinner size={'small'} />
        ) : (
          <Box mx={32} mt={24} flex={1} pb={32}>
            <Text fontSize={24} lineHeight={24}>
              {intl.formatMessage({ id: 'shop.writeReview.header' })}
            </Text>
            <Box mt={32}>
              <Text>{boughtProduct.name}</Text>
              <SecondaryText fontSize={14} mt={2}>
                <FormattedMessage
                  id="shop.writeReview.byVendor"
                  values={{
                    vendor: (
                      <Text color="fonts.blackLink">
                        {boughtProduct.vendor}
                      </Text>
                    ),
                  }}
                />
              </SecondaryText>
            </Box>
            <Box mt={16}>
              <SectionHeadingText>
                {intl.formatMessage({ id: 'shop.writeReview.rating' })}
              </SectionHeadingText>
              <Box mt={16}>
                {reviewRatingBuilder(reviewForm.ratings, intl, onRatingChange)}
              </Box>
            </Box>
            <Form
              onSubmit={handleSubmit}
              render={({ handleSubmit, submitting }) => {
                handleSubmitRef.current = handleSubmit;
                submittingRef.current = submitting;
                return <Box>{reviewFieldBuilder(reviewForm.fields, intl)}</Box>;
              }}
            />

            <Box flexDirection={'row'} mt={48}>
              <CheckBox
                containerStyle={style.checkBoxContainerStyle}
                onPress={() => setIsAcceptRule(!isAcceptRule)}
                checked={isAcceptRule}
              />
              <Text style={style.textAcceptRule}>
                {intl.formatMessage({
                  id: 'shop.writeReview.acceptRule',
                })}
              </Text>
            </Box>
          </Box>
        )}
      </ScrollView>

      <Footer
        flexDirection="row"
        style={[style.footer, { backgroundColor: theme.colors.white }]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              disabled={!isAcceptRule || isLoading || submittingRef.current}
              onPress={() => {
                handleSubmitRef.current?.();
              }}
              title={intl.formatMessage({
                id: 'shop.writeReview.buttonSubmit',
                defaultMessage: 'Submit',
              })}
            />
          </Box>
        </Box>
      </Footer>
    </Box>
  );
};

const style = {
  startContainerStyle: {
    marginLeft: 5,
  },
  footer: {
    paddingBottom: 16,
  },
  checkBoxContainerStyle: { padding: 0, marginLeft: 0 },
  textAcceptRule: { flexShrink: 1, fontSize: 14 },
};

export default connect(null, { getReviewForm, postReview })(WriteReviewScreen);
