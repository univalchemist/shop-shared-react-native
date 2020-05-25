import React, { useState } from 'react';
import { Box, Text } from '@shops/wrappers/components';
import { CheckBox } from '@shops/components';
import SelectAddress from './SelectAddress';
import AddressForm from './AddressForm';

const CartAddressses = ({
  addresses,
  title,
  saveAddressLabel,
  onFormChange,
  onChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const onSelectAddressChange = id => {
    if (id === 0) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }

    onChange && onChange(id);
  };

  const toggleSaveAddress = () => {
    setSaveAddress(!saveAddress);
  };

  return (
    <Box>
      <Text fontWeight={600} fontSize={18} mb={24}>
        {title}
      </Text>
      <SelectAddress
        initialSelected={addresses[0].id}
        onSelectChange={onSelectAddressChange}
        addresses={addresses}
      />
      {showForm && (
        <>
          <AddressForm onChange={onFormChange} />
          <CheckBox
            onPress={toggleSaveAddress}
            checked={saveAddress}
            label={saveAddressLabel}
          />
        </>
      )}
    </Box>
  );
};

export default CartAddressses;
