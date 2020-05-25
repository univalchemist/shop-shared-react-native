import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Image,
  Flex,
  Box,
  Text,
  UploadBox,
} from '@wrappers/components';
import { getImageFromImagePicker } from '@utils/nativeImageHelpers';
import { withTheme } from 'styled-components/native';
import { healthFutureMeImg } from '@images';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { HEALTH_PHOTO_VIEWER_MODAL } from '@routes';
import { useIntl } from '@wrappers/core/hooks';
import { logAction, categories } from '@store/analytics/trackingActions';
import styled from 'styled-components/native';
import theme from '@theme';
import { NAVIGATOR_HEIGHT } from '@utils';
import { connect } from 'react-redux';

const HintText = styled.Text`
  margin: 6px 0 10px;
  font-size: 12px;
  color: ${theme.colors.gray[1]};
`;

const enhance = compose(
  withTheme,
  connect(({ health: { faceAging } }) => ({ faceAging })),
);

const FutureMe = ({
  change,
  initialValues,
  navigation,
  uploadBoxLayout,
  faceAging,
}) => {
  const intl = useIntl();
  const uploadBoxRef = useRef();
  useEffect(() => {
    if (initialValues && initialValues.image) setDocument(initialValues.image);
    else setDocument(null);

    setIsError(faceAging.isError);
  }, []);
  useEffect(() => {
    setIsError(faceAging.isError);
  }, [faceAging]);

  const [document, setDocument] = useState(null);
  const [isError, setIsError] = useState(false);
  const [disableUpload, setDisableUpload] = useState(false);

  const openGallery = () => {
    setDisableUpload(true);
    getImageFromImagePicker({
      intl,
      onSuccess: image => {
        setDisableUpload(false);
        setIsError(false);
        setDocument(image);
        change(`image`, image);
        logAction({
          category: categories.HEALTH_QUESTION,
          action: 'Upload picture succesfully',
        });
      },
      onError: () => setDisableUpload(false),
      onCancel: () => setDisableUpload(false),
    });
  };

  const viewPhoto = () => {
    const { uri } = document;
    navigation.navigate(HEALTH_PHOTO_VIEWER_MODAL, {
      uri,
      onRemove: () => {
        change(`image`, null);
        setDocument(null);
      },
    });
  };

  const renderUploadBox = () => {
    return (
      <UploadBox
        disabled={disableUpload}
        width="100%"
        height="350"
        data={document && !isError ? { uri: document.uri } : null}
        onAdd={openGallery}
        onView={viewPhoto}
        accessibilityDocumentType={intl.formatMessage({
          id: 'uploadBox.accessibilityLabel.type.photo',
        })}
        accessibilityField={intl.formatMessage({
          id: 'futureMeTitle',
        })}
      />
    );
  };

  return (
    <Container>
      <Flex alignItems="center">
        <Box mt={3}>
          <Image
            width={148}
            height={161}
            source={healthFutureMeImg}
            resizeMode="contain"
          />
        </Box>
        <Box mt={3}>
          <Text
            lineHeight={37}
            fontSize={32}
            fontWeight={300}
            color="gray.0"
            paddingBottom={24}
            textAlign="center"
          >
            <FormattedMessage id="futureMeTitle" />
          </Text>
        </Box>

        <Box mt={3} width="100%">
          <Text lineHeight={22} fontSize={16} color="gray.0" textAlign="left">
            {<FormattedMessage id="futureMeHint" />}
          </Text>

          <Box>
            <HintText>{intl.formatMessage({ id: 'optional' })}</HintText>
          </Box>
        </Box>

        <Box
          ref={uploadBoxRef}
          onLayout={() => {
            uploadBoxRef.current.measure((x, y, w, h, px, py) => {
              uploadBoxLayout(py - NAVIGATOR_HEIGHT);
            });
          }}
          width="100%"
        >
          {renderUploadBox()}
        </Box>
      </Flex>
    </Container>
  );
};

FutureMe.propTypes = {
  change: PropTypes.func,
  initialValues: PropTypes.shape({
    image: PropTypes.object,
  }),
};
export default enhance(FutureMe);
