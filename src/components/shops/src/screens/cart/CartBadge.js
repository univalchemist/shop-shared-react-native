import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Image, Box } from '@shops/wrappers/components';
import { cart } from '@shops/assets/icons';
import { useTheme } from '@shops/wrappers/core/hooks';

const CartBadge = ({ itemsCount }) => {
  const theme = useTheme();
  return (
    <Box px={1}>
      <Image source={cart} height={18} width={18} />
      {itemsCount > 0 && (
        <View
          style={[styles.circle, { backgroundColor: theme.colors.primary[0] }]}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const mapStateToProps = ({ shop: { cart } }) => {
  return {
    itemsCount: cart.itemsCount,
  };
};

export default connect(mapStateToProps)(CartBadge);
