import React, { useState, useEffect } from 'react';
import {
  Box,
  ScrollView,
  Text,
  Image,
  SecondaryText,
  TrackedButton,
  SectionHeadingText,
} from '@shops/wrappers/components';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  useTheme,
  useIntl,
  useGetFormattedPrice,
} from '@shops/wrappers/core/hooks';
import moment from 'moment';
import { BackButton, ImageProduct } from '@shops/components';
import { deliveryGrey } from '@shops/assets/icons';
import {
  TRACK_ORDER_SCREEN,
  WRITE_REVIEW_SCREEN,
} from '@shops/navigation/routes';
import { DATE_FORMAT_LONG } from '@shops/utils/constant';
import { getOrderDetail } from '@shops/store/orderhistory/actions';

export const OrderHistoryDetailScreen = ({
  navigation,
  route: {
    params: { orderHistory: orderHistoryInit },
  },
  getOrderDetail,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [orderHistory, setOrderHistory] = useState(orderHistoryInit);

  useEffect(() => {
    const init = async () => {
      const { value } = await getOrderDetail(orderHistory.orderId);
      setOrderHistory(value);
    };
    init();
  }, []);

  const fmtTotalAmount = useGetFormattedPrice(
    orderHistory.grandTotal,
    orderHistory.currency,
  );
  const fmtByPaymentMethod = useGetFormattedPrice(
    orderHistory.payment?.grandTotal,
    orderHistory.currency,
  );
  const fmtDeliveryFee = useGetFormattedPrice(
    orderHistory.shipping,
    orderHistory.currency,
  );

  const renderDetailOrder = item => {
    const fmtPrice = useGetFormattedPrice(item.total, orderHistory.currency);
    const deliveryFeeFormatted = useGetFormattedPrice(
      item.deliveryFee,
      orderHistory.currency,
    );
    return (
      <Box key={item.sku}>
        <Box
          flexDirection={'row'}
          mt={44}
          alignItems={'flex-start'}
          key={item.sku}
        >
          <Box width={80} height={72} bg={theme.colors.white}>
            <ImageProduct imageModel={item.thumbnail} />
          </Box>
          <Box ml={8}>
            <Text fontSize={14}>{item.name}</Text>
            <Text fontSize={14}>{fmtPrice}</Text>
            <SecondaryText fontSize={12}>
              {intl.formatMessage(
                { id: 'shop.orderHistoryDetail.deliveryFee' },
                { deliveryFeeFormatted },
              )}
            </SecondaryText>
            <SecondaryText fontSize={12}>
              {intl.formatMessage(
                {
                  id: 'shop.orderHistory.qty',
                  defaultMessage: `Qty: ${item.quantity}`,
                },
                { quantity: item.quantity },
              )}
            </SecondaryText>
            <SecondaryText fontSize={12}>
              {intl.formatMessage(
                {
                  id: 'shop.orderHistory.status',
                  defaultMessage: `Status: ${item.status ||
                    orderHistory.status}`,
                },
                { status: item.status || orderHistory.status },
              )}
            </SecondaryText>
          </Box>
        </Box>
        <Box mt={24}>
          <TrackedButton
            primary
            onPress={() => {
              console.log({ item });
              navigation.navigate(TRACK_ORDER_SCREEN, {
                orderId: orderHistory.orderId,
              });
            }}
            title={intl.formatMessage({
              id: 'shop.orderHistoryDetail.buttonTrackOrder',
            })}
          />
        </Box>
        <Box mt={8}>
          <TrackedButton
            onPress={() => {
              navigation.navigate(WRITE_REVIEW_SCREEN, {
                boughtProduct: item,
                orderId: orderHistory.orderId,
              });
            }}
            outline
            buttonStyle={styles.buttonStyle}
            title={intl.formatMessage({
              id: 'shop.orderHistoryDetail.buttonWriteReview',
            })}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1}>
      <ScrollView flex={1} bg={theme.colors.transparent}>
        <BackButton navigation={navigation} />
        <Box mx={32} mt={24} flex={1} pb={32}>
          <Text fontSize={24} lineHeight={24}>
            {intl.formatMessage(
              { id: 'shop.orderHistory.orderNo' },
              { orderNo: orderHistory.orderIdText },
            )}
          </Text>
          <Text mt={32} fontSize={14}>
            {moment(orderHistory.orderDate).format(DATE_FORMAT_LONG)}
          </Text>
          <Box flexDirection={'row'} mt={1}>
            <Box flex={1}>
              <Text fontSize={14} flex={1}>
                {intl.formatMessage(
                  {
                    id: 'shop.orderHistory.totalItems',
                    defaultMessage: `Total (${orderHistory.itemCount} items)`,
                  },
                  { item: orderHistory.itemCount },
                )}
              </Text>
            </Box>
            <Text>{fmtTotalAmount}</Text>
          </Box>
          <Box
            borderBottomWidth={1}
            borderColor={theme.colors.divider}
            flex={1}
            pb={32}
          >
            <Box flexDirection={'row'} mt={44} alignItems={'center'}>
              <Image source={deliveryGrey} width={22} height={16} />
              <Text ml={9}>
                {intl.formatMessage({
                  id: 'shop.orderHistory.deliveryOrSelfCollection',
                })}
              </Text>
            </Box>
            {renderDetailOrder(orderHistory.items?.[0])}
          </Box>
          <Box>
            <SectionHeadingText mt={32}>
              {intl.formatMessage({
                id: 'shop.orderHistoryDetail.paymentSummary',
              })}
            </SectionHeadingText>
            <Box flexDirection={'row'} mt={32}>
              <Box flex={1}>
                <Text fontSize={14}>
                  {intl.formatMessage(
                    {
                      id: 'shop.orderHistoryDetail.paymentBy',
                    },
                    { method: orderHistory.payment?.method },
                  )}
                </Text>
              </Box>
              <SecondaryText fontSize={14}>{fmtByPaymentMethod}</SecondaryText>
            </Box>
            {orderHistory.shipping && (
              <SecondaryText ml={16} fontSize={12}>
                {intl.formatMessage(
                  {
                    id: 'shop.orderHistoryDetail.inclDeliveryFee',
                  },
                  {
                    deliveryFeeFormatted: fmtDeliveryFee,
                  },
                )}
              </SecondaryText>
            )}
            <Box flexDirection={'row'} mt={24}>
              <Box flex={1}>
                <Text fontSize={14} flex={1} fontWeight={'bold'}>
                  {intl.formatMessage(
                    {
                      id: 'shop.orderHistory.totalItems',
                      defaultMessage: `Total (${orderHistory.items.length} items)`,
                    },
                    { item: orderHistory.items.length },
                  )}
                </Text>
              </Box>
              <Text fontSize={14} fontWeight={'bold'}>
                {fmtTotalAmount}
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  buttonStyle: { backgroundColor: 'transparent' },
});

export default connect(null, { getOrderDetail })(OrderHistoryDetailScreen);
