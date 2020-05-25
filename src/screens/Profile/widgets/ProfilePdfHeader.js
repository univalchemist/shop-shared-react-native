import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { HeaderButton } from '@wrappers/components';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { shareDocumentAndroid, shareDocumentIOS } from '@utils';

const ProfilePdfHeader = ({ uri, intl }) => (
  <TouchableOpacity>
    <HeaderButton
      icon="share"
      type={Platform.OS === 'ios' ? 'feather' : ''}
      onPress={() => {
        return Platform.OS === 'ios'
          ? shareDocumentIOS({ url: uri, type: 'application/pdf', intl })
          : shareDocumentAndroid({ url: uri, type: 'application/pdf', intl });
      }}
    />
  </TouchableOpacity>
);

ProfilePdfHeader.propTypes = {
  uri: PropTypes.string,
  intl: intlShape.isRequired,
};

export default injectIntl(ProfilePdfHeader);
