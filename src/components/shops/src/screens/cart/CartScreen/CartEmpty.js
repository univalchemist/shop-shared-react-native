import React from 'react';
import { Box, Text, Image, TrackedButton } from '@shops/wrappers/components';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import { cartEmpty } from '@shops/assets/images';

const CartEmpty = ({ navigation }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box
      alignItems="center"
      flex={1}
      backgroundColor={theme.colors.backgroundColor}
      padding={32}
    >
      <Box mt={64} mb={64}>
        <Image source={cartEmpty} />
      </Box>
      <Text fontWeight="bold">
        {intl.formatMessage({ id: 'shop.cart.cartEmptyTitle' })}
      </Text>
      <Box mt={8}>
        <Text>{intl.formatMessage({ id: 'shop.cart.cartEmptyDesc' })}</Text>
      </Box>
      <Box flex={1} flexDirection="row" mt={32}>
        <Box flex={1}>
          <TrackedButton
            primary
            onPress={navigation.goBack}
            title={intl.formatMessage({ id: 'shop.cart.continueShopping' })}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CartEmpty;
