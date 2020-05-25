/* istanbul ignore file */

import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Box, Image, Pdf } from '@cxa-rn/components';
import { getImageSizeFromUri, getImageSizeRelativeToView } from '@utils';
import { fetchTokens } from '@services/secureStore';

import theme from '@theme';

const ImageViewer = ({ secure, uri, authToken }) => {
  const [viewSize, setViewSize] = useState(null);
  const [imageSize, setImageSize] = useState(null);

  useEffect(() => {
    async function executeGetImageSize() {
      const imageSize = await getImageSizeFromUri(uri, secure);
      setImageSize(imageSize);
    }
    executeGetImageSize();
  }, [uri, secure]);
  const shouldDisplayImage = viewSize && imageSize;

  const relativeImageSize =
    shouldDisplayImage && getImageSizeRelativeToView(imageSize, viewSize);

  return (
    <Box
      backgroundColor={theme.colors.black}
      onLayout={event => {
        const layoutViewSize = event.nativeEvent.layout;
        setViewSize(layoutViewSize);
      }}
      height="100%"
    >
      {shouldDisplayImage && (
        <ImageZoom
          cropWidth={viewSize.width}
          cropHeight={viewSize.height}
          imageWidth={relativeImageSize.width}
          imageHeight={relativeImageSize.height}
        >
          {authToken && (
            <Image
              secure={secure}
              authToken={authToken}
              source={{ uri }}
              width="100%"
              height="100%"
            />
          )}
        </ImageZoom>
      )}
    </Box>
  );
};

const PdfViewer = ({ uri, secure, authToken }) => (
  <Box flex={1} justifyContent="flex-start" alignItems="center">
    {authToken && (
      <Pdf
        secure={secure}
        authToken={authToken}
        source={{
          uri,
          cache: false,
        }}
        style={{
          backgroundColor: '#000',
          ...StyleSheet.absoluteFill,
        }}
        enableAnnotationRendering={false}
        onError={error => {
          console.log(error);
        }}
      />
    )}
  </Box>
);

const DocumentViewerModal = ({ route }) => {
  const [authToken, setAuthToken] = useState(null);
  const { uri, contentType, secure } = route?.params || {};
  const PDF_CONTENT = 'application/pdf';
  const isPdf = contentType === PDF_CONTENT;

  useEffect(() => {
    const getToken = async () => {
      const { access_token } = await fetchTokens();
      setAuthToken(access_token);
    };

    getToken();
  }, []);

  return isPdf ? (
    <PdfViewer secure={secure} authToken={authToken} uri={uri} />
  ) : (
    <ImageViewer secure={secure} authToken={authToken} uri={uri} />
  );
};

export default DocumentViewerModal;
