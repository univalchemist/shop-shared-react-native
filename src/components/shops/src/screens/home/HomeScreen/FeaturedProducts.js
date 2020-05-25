import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList } from 'react-native';
import ProductItem from '@shops/components/ProductItem';
import { connect } from 'react-redux';
import { Box, TrackedButton, Text } from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';
import { getProductsByCategoryId } from '@shops/store/actions';
import { Spinner } from '@shops/components';
import { getSuggestedOffers } from '@shops/store/home/actions';
import { ScreenHeadingText } from '@cxa-rn/components';

const FeaturedProducts = ({
  style,
  products,
  onPress,
  pagination,
  categoryId,
  getProductsByCategoryId,
  getSuggestedOffers,
}) => {
  const intl = useIntl();

  const keyExtractor = item => item.id.toString();
  const renderItemSeparator = () => <View style={styles.separator} />;
  const renderFooter = () => {
    if (
      pagination?.numberOfResults <= products.length ||
      products.length === 0
    ) {
      return null;
    }

    if (pagination?.isLoading)
      return (
        <Box mt={16} justifyContent="center" alignItems="center" height={48}>
          <Spinner size="small" />
        </Box>
      );

    return (
      <Box mt={16}>
        <TrackedButton
          secondary
          onPress={() =>
            categoryId
              ? getProductsByCategoryId(categoryId)
              : getSuggestedOffers()
          }
          title={intl.formatMessage({
            id: 'shop.common.loadMore',
          })}
        />
      </Box>
    );
  };
  return (
    <View style={[styles.container, style]}>
      {products.length === 0 ? (
        <Box mx={32} alignItems={'center'}>
          <Text fontWeight={'bold'} textAlign={'center'} fontSize={14}>
            {intl.formatMessage({ id: 'shop.homePage.noResult' })}
          </Text>
          <Text mt={16} textAlign={'center'} fontSize={14}>
            {intl.formatMessage({ id: 'shop.homePage.noResultInfo' })}
          </Text>
        </Box>
      ) : (
        <FlatList
          style={styles.flatList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrappers}
          ItemSeparatorComponent={renderItemSeparator}
          data={products}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductItem product={item} onPress={onPress} />
          )}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

FeaturedProducts.propTypes = {
  products: PropTypes.array,
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.object,
};

FeaturedProducts.defaultProps = {
  products: [],
  style: {},
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  flatList: {
    paddingHorizontal: 32,
  },
  separator: {
    height: 16,
  },
  columnWrappers: {
    justifyContent: 'space-between',
  },
});

const mapStateToProps = ({ shop: { paginations } }, { categoryId }) => {
  return {
    pagination: categoryId
      ? paginations.productsByCategoryId[categoryId]
      : paginations.suggestedProducts,
  };
};

export default connect(mapStateToProps, {
  getProductsByCategoryId,
  getSuggestedOffers,
})(FeaturedProducts);
