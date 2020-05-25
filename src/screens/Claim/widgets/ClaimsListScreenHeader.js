import React from 'react';
import { Image, withTracking } from '@wrappers/components';
import { filterImage, selectedFilterImage } from '@images';
import { CLAIM_FILTERS_MODAL } from '@routes';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { categories } from '@store/analytics/trackingActions';
import FeatureToggle from '@config/FeatureToggle';

const TrackingButton = withTracking(TouchableOpacity);

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
  },
});

const headerTitle = ({ selectedClaimFilters, navigation }) => {
  if (FeatureToggle.ENABLE_CLAIMS_FILTER.off) return null;

  return (
    <TrackingButton
      style={styles.button}
      hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
      onPress={() => navigation.navigate(CLAIM_FILTERS_MODAL)}
      actionParams={{
        category: categories.CLAIMS,
        action: 'Filter claims',
      }}
    >
      <Image
        source={
          selectedClaimFilters.length > 0 ? selectedFilterImage : filterImage
        }
      />
    </TrackingButton>
  );
};

export default connect(state => ({
  selectedClaimFilters: state.claim.selectedClaimFilters,
}))(headerTitle);
