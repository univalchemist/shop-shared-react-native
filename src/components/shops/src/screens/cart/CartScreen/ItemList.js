import React from 'react';
import { connect } from 'react-redux';
import { Box } from '@shops/wrappers/components';
import CartItem from './CartItem';

// TODO: map thumb image to cart item when backend update
const ItemList = ({ navigation, items }) => {
  return (
    <Box>
      {items.map(item => (
        <CartItem
          navigate={navigation.navigate}
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          price={item.price}
          sku={item.sku}
        />
      ))}
    </Box>
  );
};

const mapStateToProps = ({
  shop: {
    cart: { items },
  },
}) => {
  return {
    items,
  };
};

export default connect(mapStateToProps)(ItemList);
