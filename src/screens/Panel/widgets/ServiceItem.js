import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from '@wrappers/components';
import { Image } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import styled from 'styled-components/native';

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ServiceItem = ({ image, titleId, descId, routeName, navigation }) => {
  const intl = useIntl();
  const theme = useTheme();
  const handlePress = () => {
    routeName && navigation.navigate(routeName);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        height={134}
        backgroundColor={theme.colors.white}
        mb={16}
      >
        <Box flex={0.3}>
          <StyledImage source={image} />
        </Box>
        <Box flex={0.7} py={12} px={12}>
          <Text color={theme.colors.black}>
            {intl.formatMessage({
              id: titleId,
            })}
          </Text>
          <Text fontSize={14} color={theme.colors.gray[8]}>
            {intl.formatMessage({
              id: descId,
            })}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

ServiceItem.propTypes = {
  image: PropTypes.any,
  titleId: PropTypes.string,
  descId: PropTypes.string,
  routeName: PropTypes.string,
  navigation: PropTypes.object,
};

export default ServiceItem;
