import React from 'react';
import { connect } from 'react-redux';
import {
  SHOP_SELECT_CATEGORY_MODAL,
  SHOP_FILTER_MODAL,
  SHOP_SORT_MODAL,
} from '@shops/navigation/routes';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Box, SecondaryText, Icon } from '@shops/wrappers/components';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { useNavigation } from '@react-navigation/native';

const MAX_TEXT_WIDTH =
  (Dimensions.get('window').width - 32 * 2 - 16) / 2 - 32 * 2;

const Select = ({ children, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.selectContainer, { borderColor: theme.colors.border }]}
      activeOpacity={0.5}
      onPress={onPress}
    >
      {children}
      <Icon name="expand-more" />
    </TouchableOpacity>
  );
};

const FilterGroup = ({
  selectedCategories,
  sortType,
  filterTypes,
  sortings,
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const { navigate } = useNavigation();
  const hasSelectedCategories = selectedCategories.length > 0;
  const hasFiltered = Object.keys(filterTypes).length > 0;
  const crrSorting = sortings[sortType];

  const onSelectCategoryPress = () => {
    navigate(SHOP_SELECT_CATEGORY_MODAL);
  };

  const onSortByPress = () => {
    navigate(SHOP_SORT_MODAL);
  };

  const onFilterByPress = () => {
    navigate(SHOP_FILTER_MODAL);
  };

  return (
    <>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal={32}
        paddingVertical={20}
        backgroundColor={theme.colors.background}
      >
        <Select onPress={onSelectCategoryPress}>
          <SecondaryText>
            {hasSelectedCategories
              ? intl.formatMessage(
                  { id: 'shop.filterGroup.selected' },
                  { selected_categories_length: selectedCategories.length },
                )
              : intl.formatMessage({ id: 'shop.filterGroup.selectCatgory' })}
          </SecondaryText>
        </Select>
      </Box>
      {hasSelectedCategories && (
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={32}
          paddingBottom={20}
          backgroundColor={theme.colors.background}
        >
          <Select onPress={onSortByPress}>
            <SecondaryText
              ellipsizeMode="tail"
              numberOfLines={1}
              width={MAX_TEXT_WIDTH}
            >
              {crrSorting
                ? crrSorting?.name
                : intl.formatMessage({
                    id: 'shop.filterGroup.sort',
                  })}
            </SecondaryText>
          </Select>
          <Box width={20} />
          <Select onPress={onFilterByPress}>
            <SecondaryText>
              {hasFiltered
                ? intl.formatMessage(
                    { id: 'shop.filterGroup.filtered' },
                    { number: Object.keys(filterTypes).length },
                  )
                : intl.formatMessage({ id: 'shop.filterGroup.filter' })}
            </SecondaryText>
          </Select>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  selectContainer: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 16,
    flex: 1,
  },
});

const mapStateToProps = ({ shop: { config } }) => {
  return { sortings: config.sortings };
};

export default connect(mapStateToProps)(FilterGroup);
