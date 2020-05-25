import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { Box, ListItem, Icon, Text } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { updateSortType } from '@shops/store/actions';

export const GreenTick = () => <Icon name="check" color="#00847F" size={30} />;

const SortByScreen = ({
  sortings,
  crrSortType,
  updateSortType,
  navigation,
}) => {
  const theme = useTheme();

  const sortTypes = useMemo(
    () =>
      Object.keys(sortings).map(key => {
        const sorting = sortings[key];

        return {
          sortType: sorting.id + '-' + sorting.direction,
          label: sorting.name,
        };
      }),
    [sortings],
  );

  const onPressItem = async sortType => {
    updateSortType(sortType);
    navigation.goBack();
  };

  return (
    <Box backgroundColor={theme.colors.background} flex={1}>
      <FlatList
        data={sortTypes}
        keyExtractor={({ sortType }) => sortType}
        renderItem={({ item: { label, sortType } }) => (
          <ListItem
            rightIcon={crrSortType === sortType && <GreenTick />}
            onPress={() => onPressItem(sortType)}
            selected={sortType === crrSortType}
            accessible={true}
            accessibilityLabel={label}
          >
            <Text>{label}</Text>
          </ListItem>
        )}
      />
    </Box>
  );
};

const mapStateToProps = ({ shop: { filters, config } }) => {
  return {
    crrSortType: filters.sortType,
    sortings: config.sortings,
  };
};

export default connect(mapStateToProps, { updateSortType })(SortByScreen);
