import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { SecondaryText, Box } from '@shops/wrappers/components';
import { useGetFormattedPrice } from '@shops/wrappers/core/hooks';


const Price = ({ basePrice, finalPrice }) => {
  const isDiscount = finalPrice && finalPrice < basePrice;

  const fmtFinalPrice = useGetFormattedPrice(finalPrice);
  const fmtBasePrice = useGetFormattedPrice(basePrice);

  return (
    <>
      <Box height={24} justifyContent="center">
        {isDiscount && (
          <SecondaryText
            type="label"
            fontSize={12}
            style={styles.discount}
            accessibilityLabel={fmtBasePrice}
            height={22}
          >
            {fmtBasePrice}
          </SecondaryText>
        )}
      </Box>
      <SecondaryText
        accessible={true}
        fontSize={16}
        fontWeight="bold"
        accessibilityLabel={fmtFinalPrice}
      >
        {fmtFinalPrice}
      </SecondaryText>
    </>
  );
};

const styles = StyleSheet.create({
  discount: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'line-through',
  },
});

Price.propTypes = {
  basePrice: PropTypes.number.isRequired,
  finalPrice: PropTypes.number.isRequired,
};

Price.defaultProps = {
  basePrice: 0,
  finalPrice: 0,
};

export default Price;
