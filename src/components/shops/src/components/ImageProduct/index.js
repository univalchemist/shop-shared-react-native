import React, { useState } from 'react';
import styled from 'styled-components/native';

import { ImageErrorCard } from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';
import FastImage from '@shops/components/FastImage';

const StyledImage = styled(FastImage)`
  width: 100%;
  aspect-ratio: 1;
  resize-mode: contain;
`;

export const ImageProduct = React.memo(({ imageModel, ...props }) => {
  const [isError, setError] = useState(false);
  const intl = useIntl();
  const onStyleImageError = () => setError(true);
  if (!imageModel || isError)
    return (
      <ImageErrorCard
        width={'100%'}
        aspectRatio={1}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        accessibilityLabel={intl.formatMessage({
          id: 'image.error.unableToLoad',
        })}
        accessible={true}
        {...props}
      />
    );
  return (
    <StyledImage
      source={{ uri: imageModel.file }}
      onError={onStyleImageError}
      accessible={true}
      {...props}
    />
  );
});

export default ImageProduct;
