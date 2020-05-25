import React from 'react';
import {
  flex,
  justifySelf,
  alignSelf,
  order,
  display,
  maxWidth,
  minWidth,
  width,
  height,
  maxHeight,
  minHeight,
  position,
  size,
  space,
  resizeMode,
  accessibilityLabel,
} from 'styled-system';
import styled from 'styled-components/native';
import RNFastImage from 'react-native-fast-image';

const BaseImage = styled(RNFastImage)`
  ${space}
  ${flex}
  ${justifySelf}
  ${alignSelf}
  ${display}
  ${width}
  ${maxWidth}
  ${minWidth}
  ${position}
  ${height}
  ${maxHeight}
  ${minHeight}
  ${size}
  ${order}
  ${resizeMode}
  ${accessibilityLabel}
`;

const FastImage = React.forwardRef(
  ({ secure, authToken, source, ...props }, ref) => {
    const headers = { Authorization: `Bearer ${authToken}` };

    const imageSource = secure
      ? {
          ...source,
          headers,
        }
      : source;

    return <BaseImage ref={ref} source={imageSource} {...props} />;
  },
);

export default FastImage;
