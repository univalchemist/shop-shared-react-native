import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from '@wrappers/components';
import { notificationBlackIcon } from '@images';
import styled from 'styled-components/native';

const StyledButton = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
`;

const StyledImage = styled(Image)`
  width: 20px;
  height: 24px;
`;

const DoctorLandingHeader = () => {
  return (
    <StyledButton onPress={() => {}}>
      <StyledImage source={notificationBlackIcon} />
    </StyledButton>
  );
};

export default DoctorLandingHeader;
