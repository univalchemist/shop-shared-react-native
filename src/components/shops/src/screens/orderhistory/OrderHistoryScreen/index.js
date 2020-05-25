import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  Box,
  Text,
  SecondaryText,
  TrackedButton,
} from '@shops/wrappers/components';
import {
  useGetFormattedPrice,
  useIntl,
  useTheme,
} from '@shops/wrappers/core/hooks';
import moment from 'moment';
import { ORDER_HISTORY_DETAIL_SCREEN } from '@shops/navigation/routes';
import { DATE_FORMAT_LONG } from '@shops/utils/constant';
import { connect } from 'react-redux';
import { getOrderHistory } from '@shops/store/actions';
import { useFetchActions } from '@wrappers/core/hooks';
import { Spinner } from '@shops/components';

const OrderHistoryScreen = ({ navigation, orderHistory, getOrderHistory }) => {
  const [isLoading] = useFetchActions([getOrderHistory]);

  const intl = useIntl();

  const renderHeader = () => (
    <Text fontSize={24} lineHeight={24} mt={32}>
      {intl.formatMessage({ id: 'shop.orderHistory.header' })}
    </Text>
  );

  return (
    <Box flex={1}>
      {isLoading ? (
        <Spinner size={'small'} />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          style={style.flatList}
          data={orderHistory}
          renderItem={({ item }) => (
            <OrderHistoryItem item={item} navigation={navigation} />
          )}
          keyExtractor={item => item.orderIdText}
        />
      )}
    </Box>
  );
};

const OrderHistoryItem = ({ item, navigation }) => {
  const totalAmount = useGetFormattedPrice(item.grandTotal, item.currency);
  const theme = useTheme();
  const intl = useIntl();
  return (
    <Box borderBottomWidth={1} borderColor={theme.colors.divider} mt={32}>
      <Text mt={12}>
        {intl.formatMessage(
          { id: 'shop.orderHistory.orderNo' },
          { orderNo: item.orderIdText },
        )}
      </Text>
      <Text mt={12} fontSize={14}>
        {moment(item.orderDate).format(DATE_FORMAT_LONG)}
      </Text>
      <Box flexDirection={'row'} mt={1}>
        <Box flex={1}>
          <Text fontSize={14} flex={1}>
            {intl.formatMessage(
              {
                id: 'shop.orderHistory.totalItems',
                defaultMessage: `Total (${item.itemCount} items)`,
              },
              { item: item.itemCount },
            )}
          </Text>
        </Box>
        <Text>{totalAmount}</Text>
      </Box>
      <Box mt={8}>
        {item.items?.map(itemDetail => (
          <Box key={itemDetail.sku}>
            <Text fontSize={14} mt={2}>
              {itemDetail.name}
            </Text>
            <SecondaryText fontSize={12}>
              {intl.formatMessage(
                {
                  id: 'shop.orderHistory.qty',
                  defaultMessage: `Qty: ${itemDetail.quantity}`,
                },
                { quantity: itemDetail.quantity },
              )}
            </SecondaryText>
          </Box>
        ))}
        <Box mt={24} mb={32}>
          <TrackedButton
            primary
            title={intl.formatMessage({
              id: 'shop.orderHistory.viewOrderDetails',
            })}
            onPress={() => {
              navigation.navigate(ORDER_HISTORY_DETAIL_SCREEN, {
                orderHistory: item,
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
const style = StyleSheet.create({
  flatList: { paddingHorizontal: 32 },
});

const mapStateToProps = ({ shop: { orderHistory } }) => {
  return {
    orderHistory: orderHistory.orderHistory,
  };
};

export default connect(mapStateToProps, { getOrderHistory })(
  OrderHistoryScreen,
);
