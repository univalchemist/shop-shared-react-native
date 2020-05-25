import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, SectionList } from 'react-native';
import { connect } from 'react-redux';
import { SectionHeadingText, Box, Text } from '@shops/wrappers/components';
import { NAVIGATION_HOME_PRODUCT_PATH } from '@shops/navigation/routes';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import FeaturedProducts from './FeaturedProducts';
import FilterGroup from './FilterGroup';
import { getSuggestedOffers, getProducts } from '@shops/store/actions';
import {
  getSuggestedProductsSelector,
  getGroupedProductsSelector,
} from '@shops/store/selectors';
import { Spinner } from '@shops/components';

const HomeScreen = ({
  navigation,
  errorMessage,
  getSuggestedOffers,
  selectedCategories,
  sortType,
  filterTypes,
  searchString,
  getProducts,
  groupedProducts,
  suggestedProducts,
  productsPagination,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestedOffers = async () => {
      setIsLoading(true);
      try {
        await getSuggestedOffers();
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestedOffers();
  }, [getSuggestedOffers]);

  useEffect(() => {
    const data = [
      {
        title: intl.formatMessage({
          id: 'shop.homePage.suggestedItems',
          defaultMessage: 'Suggested Items',
        }),
        data: [suggestedProducts],
      },
    ];
    setData(data);
  }, [intl, suggestedProducts]);

  useEffect(() => {
    if (
      selectedCategories.length > 0 ||
      sortType ||
      Object.keys(filterTypes).length > 0 ||
      (searchString !== null && searchString.length === 0) ||
      searchString?.length >= 3
    ) {
      getProducts();
    }
  }, [selectedCategories, sortType, filterTypes, searchString, getProducts]);

  const onProductPress = product => {
    navigation.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
      productSku: product.sku,
    });
  };

  const renderList = ({ section, item }) => {
    const { categoryId } = section;
    return (
      <Box
        mt={8}
        pb={24}
        borderBottomWidth={1}
        borderColor={theme.colors.divider}
      >
        <FeaturedProducts
          categoryId={categoryId}
          products={item}
          onPress={onProductPress}
        />
      </Box>
    );
  };

  const sectionData = groupedProducts?.length ? groupedProducts : data;

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }
  return (
    <Box flex={1}>
      <SectionList
        contentContainerStyle={[
          styles.sectionList,
          { backgroundColor: theme.colors.background },
        ]}
        sections={sectionData}
        keyExtractor={(item, index) => item + index}
        renderItem={renderList}
        ListHeaderComponent={
          <FilterGroup
            sortType={sortType}
            filterTypes={filterTypes}
            selectedCategories={selectedCategories}
          />
        }
        renderSectionHeader={({ section: { title, data }, ...item }) => (
          <Box mx={32}>
            <SectionHeadingText
              backgroundColor={theme.colors.background}
              fontWeight={'bold'}
              lineHeight={37}
              textAlign={groupedProducts?.length ? 'left' : 'center'}
            >
              {title} {groupedProducts?.length ? `(${data?.[0].length})` : ''}
            </SectionHeadingText>
          </Box>
        )}
        style={{ backgroundColor: theme.colors.background }}
        renderSectionFooter={() =>
          isLoading || productsPagination?.isLoading ? (
            <Spinner size="small" />
          ) : null
        }
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  sectionList: {
    paddingBottom: 16,
  },
});

HomeScreen.propTypes = {
  getHomeData: PropTypes.func,
  navigation: PropTypes.object,
  featuredProducts: PropTypes.object,
  featuredCategories: PropTypes.object,
  refreshing: PropTypes.bool,
};

const mapStateToProps = ({ shop }) => {
  const { filters, paginations } = shop;
  const { selectedCategories, sortType, filterTypes, searchString } = filters;
  const { products: productsPagination } = paginations;

  const suggestedProducts = getSuggestedProductsSelector(shop);
  const groupedProducts = getGroupedProductsSelector(shop);

  return {
    suggestedProducts,
    selectedCategories,
    sortType,
    filterTypes,
    searchString,
    groupedProducts,
    productsPagination,
  };
};

export default connect(mapStateToProps, { getSuggestedOffers, getProducts })(
  HomeScreen,
);
