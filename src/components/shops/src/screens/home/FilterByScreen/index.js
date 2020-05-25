import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Footer,
  Box,
  SectionHeadingText,
  ListItem,
  Flex,
  SecondaryText,
  TrackedButton,
  CheckBox,
  Input,
  Text,
} from '@shops/wrappers/components';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { updateFilterTypes } from '@shops/store/actions';
import {
  FILTER_TYPES,
  MAX_RANGE_PRICE,
  MIN_RANGE_PRICE,
} from '@shops/config/constants';

const FilterByScreen = ({
  filterTypes,
  updateFilterTypes,
  navigation,
  defaultCurrencySymbol,
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const [rangePrice, setRangePrice] = useState(
    filterTypes[FILTER_TYPES.RANGE_PRICE] || [MIN_RANGE_PRICE, MAX_RANGE_PRICE],
  );
  const [isRatings, setIsRatings] = useState(
    filterTypes[FILTER_TYPES.RATINGS] || false,
  );
  const getNumber = val => parseInt(val.replace(/[^0-9]/g, ''), 10);
  const dismissKeyboard = () => Keyboard.dismiss();
  const toggleRatings = () => {
    setIsRatings(!isRatings);
  };

  const onPressApply = () => {
    const updatedData = {};

    if (isRatings) {
      updatedData[FILTER_TYPES.RATINGS] = true;
    }
    if (
      rangePrice[0] !== MIN_RANGE_PRICE ||
      rangePrice[1] !== MAX_RANGE_PRICE
    ) {
      updatedData[FILTER_TYPES.RANGE_PRICE] = rangePrice;
    }

    updateFilterTypes(updatedData);
    navigation.goBack();
  };
  const leftIcon = () => <Text mr={2}>{defaultCurrencySymbol}</Text>;
  return (
    <Box flex={1} backgroundColor={theme.colors.background}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Box flex={1}>
          <Box px={4} pt={32} pb={8}>
            <SectionHeadingText>
              {intl.formatMessage({ id: 'shop.filter.showProductWith' })}
            </SectionHeadingText>
          </Box>
          <ListItem onPress={toggleRatings} showDivider={false}>
            <Flex as={View} flexDirection="row" alignItems="flex-start">
              <Box flex={1} paddingRight={10}>
                <SecondaryText accessibilityLabel="Ratings">
                  {intl.formatMessage({ id: 'shop.filter.ratings' })}
                </SecondaryText>
              </Box>
              <CheckBox
                containerStyle={styles.checkBoxContainer}
                checked={isRatings}
                onPress={toggleRatings}
              />
            </Flex>
          </ListItem>
          <Box px={4} pt={32} pb={8}>
            <SectionHeadingText>
              {intl.formatMessage({ id: 'shop.filter.priceRange' })}
            </SectionHeadingText>
          </Box>

          <Box mx={4} mt={16} flexDirection={'row'}>
            <Box flex={1}>
              <Input
                value={rangePrice[0]?.toString()}
                keyboardType={'numeric'}
                leftIcon={leftIcon}
                label={intl.formatMessage({ id: 'shop.filter.min' })}
                onChangeText={val => {
                  if (!val)
                    return setRangePrice(previousVal => [0, previousVal[1]]);
                  if (getNumber(val) > rangePrice[1]) {
                    return setRangePrice(previousVal => [
                      previousVal[1],
                      previousVal[1],
                    ]);
                  }
                  setRangePrice(previousVal => [
                    getNumber(val),
                    previousVal[1],
                  ]);
                }}
              />
            </Box>
            <Box mx={16} mt={16}>
              <Text>{intl.formatMessage({ id: 'shop.common.to' })}</Text>
            </Box>
            <Box flex={1}>
              <Input
                value={rangePrice[1]?.toString()}
                keyboardType={'numeric'}
                leftIcon={leftIcon}
                label={intl.formatMessage({ id: 'shop.filter.max' })}
                onChangeText={val => {
                  if (!val)
                    return setRangePrice(previousVal => [previousVal[0], 0]);
                  if (getNumber(val) > MAX_RANGE_PRICE) {
                    return setRangePrice(previousVal => [
                      previousVal[0],
                      MAX_RANGE_PRICE,
                    ]);
                  }
                  setRangePrice(previousVal => [
                    previousVal[0],
                    getNumber(val),
                  ]);
                }}
              />
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
      <Footer
        flexDirection="row"
        style={[styles.footer, { backgroundColor: theme.colors.white }]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              onPress={onPressApply}
              title={intl.formatMessage({ id: 'shop.common.apply' })}
            />
          </Box>
        </Box>
      </Footer>
    </Box>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    padding: 0,
    margin: 0,
  },
  footer: {
    paddingBottom: 16,
  },
});

const mapStateToProps = ({ shop: { filters, config } }) => {
  const { currency } = config;
  return {
    filterTypes: filters.filterTypes,
    defaultCurrencySymbol: currency.defaultCurrencySymbol,
  };
};

export default connect(mapStateToProps, { updateFilterTypes })(FilterByScreen);
