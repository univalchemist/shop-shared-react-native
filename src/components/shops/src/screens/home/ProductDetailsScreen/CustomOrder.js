import React, { useState } from 'react';
import { Box, Text, SectionHeadingText } from '@shops/wrappers/components';
import {
  RadioGroup,
  RadioButton,
  BorderInput,
  QuantityButton,
} from '@shops/components';
import {
  useTheme,
  useIntl,
  useGetFormattedPrice,
} from '@shops/wrappers/core/hooks';

const CustomOrder = ({
  quantity,
  onChangeQuantity = () => {},
  deliveryFee = 18,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [deliveryType, setDeliveryType] = useState(0);
  const deliveryFeeFormatted = useGetFormattedPrice(deliveryFee);
  const decreaseAmount = () => {
    if (quantity <= 1) return;
    onChangeQuantity(quantity - 1);
  };

  const increaseAmount = () => {
    onChangeQuantity(quantity + 1);
  };

  const handleChangeDeliveryType = value => {
    setDeliveryType(value);
  };
  return (
    <Box py={24} borderBottomWidth={1} borderColor={theme.colors.divider}>
      <Box>
        <SectionHeadingText>
          {intl.formatMessage({
            id: 'shop.product.customiseOrder',
            defaultMessage: 'Customise my order',
          })}
        </SectionHeadingText>
        <Box flexDirection="row" alignItems="center" my={24}>
          <Text width={'35%'}>
            {intl.formatMessage({
              id: 'shop.product.quantity',
              defaultMessage: 'Quantity',
            })}
          </Text>
          <Box
            width={'65%'}
            flexDirection={'row'}
            alignItems="center"
            justifyContent={'space-between'}
          >
            <QuantityButton text="-" onPress={decreaseAmount} />
            <BorderInput
              value={quantity}
              textAlign={'center'}
              color={theme.colors.text}
              width={70}
              height={56}
              keyboardType={'numeric'}
              onChangeText={text => {
                if (!text) return onChangeQuantity(1);
                onChangeQuantity(parseInt(text.replace(/[^0-9]/g, ''), 10));
              }}
            />
            <QuantityButton text="+" onPress={increaseAmount} />
          </Box>
        </Box>

        <Box>
          <Text mb={24}>
            {intl.formatMessage({
              id: 'shop.product.deliveryType',
              defaultMessage: 'Delivery or Self-collection',
            })}
          </Text>
          <RadioGroup value={deliveryType} onChange={handleChangeDeliveryType}>
            <RadioButton text={deliveryFeeFormatted} value={0} />
            {/*<RadioButton text="Self-collection (Free)" value={1} />*/}
          </RadioGroup>
        </Box>
        {/*<BorderInput*/}
        {/*  fontSize={16}*/}
        {/*  height={56}*/}
        {/*  optional*/}
        {/*  placeholder={'Special instruction for vendor'}*/}
        {/*  inputStyle={{ height: 56 }}*/}
        {/*/>*/}
      </Box>
    </Box>
  );
};

CustomOrder.propTypes = {};

export default CustomOrder;
