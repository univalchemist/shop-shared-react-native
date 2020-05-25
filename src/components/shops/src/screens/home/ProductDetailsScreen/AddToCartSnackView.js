import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Image, Text, Icon, SecondaryText } from '@shops/wrappers/components';
import { cart, xmark } from '@shops/assets/icons';
import React from 'react';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import PropTypes from 'prop-types';

export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILED = 'ADD_TO_CART_FAILED';

export const AddToCartSnackView = ({
  onContainerPress,
  quantity,
  type,
  backgroundColor = '#484848',
  onCancelPress,
  ...props
}) => {
  if (!type) return null;
  return (
    <TouchableOpacity
      disabled={type === ADD_TO_CART_FAILED}
      activeOpacity={0.95}
      style={style.container}
      onPress={onContainerPress}
      {...props}
    >
      {type === ADD_TO_CART_SUCCESS ? (
        <AddToCartSuccessView
          quantity={quantity}
          onCancelPress={onCancelPress}
          {...props}
        />
      ) : (
        type === ADD_TO_CART_FAILED && <AddToCartFailedView />
      )}
    </TouchableOpacity>
  );
};

export const AddToCartSuccessView = ({ quantity, onCancelPress }) => {
  const theme = useTheme();
  const intl = useIntl();
  return (
    <Box
      flexDirection={'row'}
      width={'100%'}
      flex={1}
      bg={theme.colors.backgroundSnackSuccess}
    >
      <Box
        height={80}
        flexDirection={'row'}
        alignItems={'center'}
        width={'80%'}
      >
        <Image source={cart} width={25} height={25} mx={4} />
        <Text color={theme.colors.white}>
          {intl.formatMessage(
            {
              id: 'shop.product.snackBarMessage',
              defaultMessage: `${quantity} items add to cart.`,
            },
            {
              quantity,
            },
          )}
        </Text>
      </Box>
      <TouchableOpacity onPress={onCancelPress} style={style.cancelContainer}>
        <Image source={xmark} width={20} height={20} />
      </TouchableOpacity>
    </Box>
  );
};

export const AddToCartFailedView = ({ onCancelPress }) => {
  const theme = useTheme();
  const intl = useIntl();
  return (
    <Box
      flexDirection={'row'}
      width={'100%'}
      flex={1}
      bg={theme.colors.backgroundSnackError}
    >
      <Box
        minHeight={80}
        flexDirection={'row'}
        alignItems={'center'}
        width={'80%'}
      >
        <Box  mx={20} mt={-2}>
        <Icon
          name={'error-outline'}
          fontSize={20}
          color={theme.colors.iconSnackError}
        />
        </Box>
        <SecondaryText color={theme.colors.text}>
          {intl.formatMessage({
            id: 'shop.product.snackBarMessageFailed',
          })}
        </SecondaryText>
      </Box>
      <TouchableOpacity
        onPress={onCancelPress}
        style={style.cancelContainerFailedView}
      >
        <Icon name={'clear'} fontSize={16} color={theme.colors.black}  />
      </TouchableOpacity>
    </Box>
  );
};

const style = StyleSheet.create({
  container: { flex: 1 },
  cancelContainer: { padding: 20 },
  cancelContainerFailedView: { padding: 10, flex: 1,marginTop:10 },
});

AddToCartSnackView.propTypes = {
  onContainerPress: PropTypes.func,
  onCancelPress: PropTypes.func,
  quantity: PropTypes.number,
  type: PropTypes.oneOf([
    undefined,
    false,
    null,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAILED,
  ]).isRequired,
};
