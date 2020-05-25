import React from 'react';
import {
  Box,
  Text,
  ListSkeletonPlaceholder,
  ListPicker,
  Image,
  Container,
  ErrorPanel,
  ScrollView,
} from '@wrappers/components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getDocuments } from '@store/document/actions';
import { profileNoDocuments } from '@images';
import { PROFILE_DOCUMENT_VIEWER_MODAL } from '@routes';
import { useFetchActions } from '@wrappers/core/hooks';
import { categories } from '@store/analytics/trackingActions';

const ProfileDocumentsScreen = ({
  documents,
  intl,
  getDocuments,
  navigation,
}) => {
  const [isLoading, isError] = useFetchActions([getDocuments]);

  const onPressItem = id => {
    navigation.navigate(PROFILE_DOCUMENT_VIEWER_MODAL, {
      uri: id,
      contentType: 'application/pdf',
      allowShare: true,
      secure: true,
    });
  };

  const data = documents
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(doc => ({
      key: doc.url,
      value: doc.title,
    }));

  let component;
  if (isLoading) {
    component = <ListSkeletonPlaceholder count={3} />;
  } else if (isError) {
    component = <ErrorPanel />;
  } else if (documents.length === 0) {
    component = (
      <Container>
        <Box height="100%" justifyContent="center" alignItems="center">
          <Box>
            <Image
              maxWidth={215}
              maxHeight={215}
              source={profileNoDocuments}
              resizeMode="contain"
            />
          </Box>
          <Box mt={4}>
            <Text
              fontWeight={300}
              fontSize={32}
              lineHeight={37}
              letterSpacing={-1.5}
            >
              {intl.formatMessage({ id: 'profile.noDocumentsText' })}
            </Text>
          </Box>
        </Box>
      </Container>
    );
  } else {
    component = (
      <ScrollView>
        <ListPicker
          data={data}
          onPressItem={onPressItem}
          selectedKey={0}
          icon="picture-as-pdf"
          getActionParams={item => {
            return {
              category: categories.PROFILE_USEFUL_DOCUMENTS,
              action: 'View useful document',
              document_name: item.value,
            };
          }}
        />
      </ScrollView>
    );
  }
  return component;
};

ProfileDocumentsScreen.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.shape({})),
  hasDocumentsLoaded: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  fetchDocuments: PropTypes.func,
};

const mapStateToProps = ({ document: { documents } }) => ({
  documents,
});

const enhance = compose(connect(mapStateToProps, { getDocuments }), injectIntl);

export default enhance(ProfileDocumentsScreen);
