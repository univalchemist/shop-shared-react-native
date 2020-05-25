import React, { useEffect, useState } from 'react';
import {
  Box,
  PlainText,
  SectionHeadingText,
  SecondaryText,
} from '@shops/wrappers/components';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import { getTrackOrder } from '@shops/store/orderhistory/actions';
import { connect } from 'react-redux';
import Spinner from '@shops/components/Spinner';
import { TouchableOpacity, Clipboard } from 'react-native';
import Toast from 'react-native-simple-toast';

const TrackOrderScreen = ({
  route: {
    params: { orderId },
  },
  getTrackOrder,
}) => {
  const intl = useIntl();
  const [trackOrderData, setTrackOrderData] = useState();

  useEffect(() => {
    const init = async () => {
      const { value } = await getTrackOrder(orderId);
      if (value[0]) setTrackOrderData(value[0]);
    };
    init();
  }, []);

  if (!trackOrderData) return <Spinner size={'small'} />;

  const onPhoneNumberPress = phoneNumber => {
    Clipboard.setString(phoneNumber);
    Toast.show(intl.formatMessage({ id: 'shop.trackOrder.copyToClipboard' }));
  };

  const phoneNumber = trackOrderData.shipments?.[0]?.address?.telephone;
  const street = trackOrderData.shipments?.[0]?.address?.street?.join(', ');
  const city = trackOrderData.shipments?.[0]?.address?.city;
  return (
    <Box flex={1} mx={32}>
      <SectionHeadingText fontSize={16} letterSpacing={0.3} pt={41} pb={8}>
        {intl.formatMessage({ id: 'shop.trackOrder.trackingDetails' })}
      </SectionHeadingText>
      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.status' })}
        content={trackOrderData.status}
      />

      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.deliveryPartner' })}
        content={trackOrderData.shipments[0].deliveryPartner}
      />

      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.trackingNumber' })}
        content={trackOrderData.shipments?.[0]?.trackingNumber}
      />

      <SectionHeadingText fontSize={16} letterSpacing={0.3} pt={41} pb={8}>
        {intl.formatMessage({ id: 'shop.trackOrder.shippingDetails' })}
      </SectionHeadingText>

      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.providerName' })}
        content={trackOrderData.vendor}
      />
      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.receiver' })}
        content={
          trackOrderData.shipments?.[0]?.address?.firstName +
          ' ' +
          trackOrderData.shipments?.[0]?.address?.lastName
        }
      />
      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.deliveryAddress' })}
        content={street + ', ' + city}
      />
      <Section
        title={intl.formatMessage({ id: 'shop.trackOrder.phoneNumber' })}
        content={phoneNumber}
        enable={phoneNumber}
        onPress={() => onPhoneNumberPress(phoneNumber)}
      />
    </Box>
  );
};

const Section = React.memo(({ title, content, onPress, enable }) => {
  const theme = useTheme();
  return (
    <Box pt={16}>
      <SecondaryText fontSize={14} lineHeight={20} letterSpacing={0.25}>
        {title}
      </SecondaryText>
      <TouchableOpacity onPress={onPress} disabled={!enable}>
        <PlainText
          fontSize={14}
          lineHeight={24}
          color={theme.colors.text}
          letterSpacing={0.1}
          fontWeight={600}
        >
          {content}
        </PlainText>
      </TouchableOpacity>
    </Box>
  );
});

export default connect(null, { getTrackOrder })(TrackOrderScreen);
