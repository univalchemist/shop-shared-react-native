import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Text,
  SectionHeadingText,
  Icon,
} from '@shops/wrappers/components';
import { RatingStars } from '@shops/components';
import { getReviews } from '@shops/store/actions';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import { SHOP_REVIEW_SCREEN } from '@shops/navigation/routes';
import Accordion from 'react-native-collapsible/Accordion';
import ReadMoreText from './ReadMoreText';
import moment from 'moment';
import { DATE_FORMAT_SHORT } from '@shops/utils/constant';

const MAX_REVIEW_ITEMS = 2;

export const MoreDetail = ({ product, getReviews, navigation }) => {
  const theme = useTheme();
  const intl = useIntl();
  const [activeSection, setActiveSection] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviewData = async () => {
      const { value: reviews } = await getReviews(product.id);
      setReviews(reviews);
    };
    getReviewData();
  }, [getReviews, product.id]);

  const sections = [
    {
      titleId: 'shop.product.moreProductDetails',
      defaultTitle: 'More Product Details',
      value: product.description,
    },
    {
      titleId: 'shop.product.rating',
      defaultTitle: `Review (${reviews.length})`,
      value: reviews,
    },
  ];
  const renderHeader = (item, index) => {
    switch (item.titleId) {
      case 'shop.product.rating':
        return renderRatingHeader({ item, index });
      default:
        return renderDefaultHeader({ item, index });
    }
  };
  const renderContent = item => {
    switch (item.titleId) {
      case 'shop.product.rating':
        return renderRatingContent({ item: item.value });
      default:
        return renderDefaultContent({ item: item.value });
    }
  };
  const renderDefaultHeader = ({ item, index }) => {
    return (
      <Box flexDirection={'row'} alignItems={'center'} height={50}>
        <Text width={'90%'}>
          {intl.formatMessage({
            id: item.titleId,
            defaultMessage: item.defaultTitle,
          })}
        </Text>
        <Icon
          name={activeSection[0] === index ? 'expand-less' : 'expand-more'}
          size={30}
        />
      </Box>
    );
  };

  const renderRatingHeader = ({ item, index }) => {
    return (
      <Box flexDirection={'row'} alignItems={'center'} height={50}>
        <Text width={'30%'}>
          {intl.formatMessage(
            {
              id: item.titleId,
              defaultMessage: item.defaultTitle,
            },
            { ratingCount: reviews.length },
          )}
        </Text>
        <RatingStars width={'60%'} rating={product.averageRating} />
        <Icon
          name={activeSection[0] === index ? 'expand-less' : 'expand-more'}
          size={30}
        />
      </Box>
    );
  };

  const renderRatingContent = () => {
    const cutDownReviews =
      reviews.length > MAX_REVIEW_ITEMS ? reviews.slice(0, 2) : reviews;
    return (
      <Box>
        {cutDownReviews.map(renderRatingRow)}
        <Box mx={2} my={4}>
          <Button
            outline
            title={intl.formatMessage({
              id: 'shop.product.seeAllReviews',
              defaultMessage: 'See all reviews',
            })}
            onPress={() => {
              navigation.navigate(SHOP_REVIEW_SCREEN, {
                productSku: product.sku,
                reviews,
              });
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderRatingRow = (item, index) => {
    return (
      <Box key={index.toString()} my={3}>
        <Box flexDirection={'row'}>
          <Box flex={1}>
            <Text>{item.title}</Text>
            <RatingStars rating={item.ratings} />
          </Box>
          <Text>{moment(item.reviewDate).format(DATE_FORMAT_SHORT)}</Text>
        </Box>
        <Box mt={3}>
          <ReadMoreText numberOfLines={3}>{item.detail}</ReadMoreText>
        </Box>
      </Box>
    );
  };

  const renderDefaultContent = ({ item }) => {
    return (
      <Box flexDirection={'row'}>
        <Text>{item}</Text>
      </Box>
    );
  };

  return (
    <Box py={24} borderBottomWidth={1} borderColor={theme.colors.divider}>
      <SectionHeadingText>
        {intl.formatMessage({
          id: 'shop.product.moreDetails',
          defaultMessage: 'More Details',
        })}
      </SectionHeadingText>

      <Accordion
        underlayColor={theme.colors.transparent}
        activeSections={activeSection}
        sections={sections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={setActiveSection}
      />
    </Box>
  );
};

export default connect(null, { getReviews })(MoreDetail);
