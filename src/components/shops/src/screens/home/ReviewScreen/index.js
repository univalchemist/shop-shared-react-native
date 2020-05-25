import React, { useState } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import {
  Box,
  Text,
  SectionHeadingText,
  SecondaryText,
} from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { RatingStars } from '@shops/components';
import moment from 'moment';
import { connect } from 'react-redux';
import { DATE_FORMAT_SHORT } from '@shops/utils/constant';

const ReviewScreen = ({
  route: {
    params: { productSku, reviews },
  },
  productMap,
}) => {
  const theme = useTheme();
  const [product] = useState(productMap[productSku]);
  const renderItem = ({ item }) => {
    return (
      <Box
        borderBottomWidth={1}
        borderColor={theme.colors.divider}
        mt={3}
        pb={3}
      >
        <Box flexDirection={'row'} alignItems={'center'}>
          <Box flex={1}>
            {item.title && (
              <SecondaryText color={theme.colors.text} fontWeight={'bold'}>
                {item.title}
              </SecondaryText>
            )}
            <RatingStars rating={item.ratings} />
          </Box>
          <Text fontSize={14} fontWeight={'bold'} color={theme.colors.ratings}>
            {moment(item.reviewDate).format(DATE_FORMAT_SHORT)}
          </Text>
        </Box>
        <Text>{item.nickName}</Text>
        <Text mt={3}>{item.detail}</Text>
      </Box>
    );
  };
  const renderHeader = () => {
    return (
      <Box>
        <SectionHeadingText>{product.name}</SectionHeadingText>
        <SecondaryText color={theme.colors.text} mt={1}>
          {product.vendor}
        </SecondaryText>
        <Box flexDirection={'row'} alignItems={'center'} mt={2}>
          <RatingStars rating={product.averageRating} />
          <Text textAlign={'center'} fontSize={18}>
            {`(${product.ratingsCount})`}
          </Text>
        </Box>
      </Box>
    );
  };
  return (
    <Box as={SafeAreaView} flex={1} mx={3} my={3}>
      <FlatList
        ListHeaderComponent={renderHeader}
        keyExtractor={item => item.id.toString()}
        data={reviews}
        renderItem={renderItem}
      />
    </Box>
  );
};
const mapStateToProps = ({
  shop: {
    home: { productMap },
  },
}) => ({
  productMap,
});

export default connect(mapStateToProps)(ReviewScreen);
