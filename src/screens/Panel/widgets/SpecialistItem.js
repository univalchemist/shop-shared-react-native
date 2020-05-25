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

const SpecialistItem = ({ image, code, onPress }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        height={56}
        backgroundColor={theme.colors.white}
        mb={16}
      >
        <Box flex={0.3}>
          <StyledImage source={image} />
        </Box>
        <Box flex={0.7} pl={12} pr={2}>
          <Text
            fontSize={12}
            lineHeight={16}
            color={theme.colors.black}
            numberOfLines={2}
          >
            {intl.formatMessage({
              id: `speciality.name.${code}`,
            })}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

SpecialistItem.propTypes = {
  image: PropTypes.any,
  nameId: PropTypes.string,
};

export default SpecialistItem;
