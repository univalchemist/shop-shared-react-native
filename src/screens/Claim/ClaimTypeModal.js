import { CLAIM_DETAILS_FORM } from '@routes';
import {
  Text,
  TrackedListItem,
  Box,
  Icon,
  SectionHeadingText,
} from '@wrappers/components';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { SectionList } from 'react-native';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { fetchClaimTypes } from '@store/claimType/actions';
import { useIntl } from '@wrappers/core/hooks';
import { categories as trackingCategories } from '@store/analytics/trackingActions';

const ClaimTypeModal = ({
  change,
  claimType,
  claimTypeId,
  touch,
  untouch,
  navigation,
}) => {
  const intl = useIntl();
  const { types, categories } = claimType;
  useEffect(() => {
    setTimeout(() => touch('claimType'), 1000);
  }, [touch]);

  const onPressItem = async id => {
    const selectedItem = types.byId[id];
    const previousCategory = types.byId[claimTypeId]?.claimCategoryId;
    change('claimTypeId', id);
    change('claimType', selectedItem.claimType);
    if (previousCategory !== types.byId[id]?.claimCategoryId) {
      change('claimReason', '');
      change('receiptAmount', '');
      change('diagnosisText', '');

      untouch('claimReason');
      untouch('receiptAmount');
      untouch('diagnosisText');
    }
    navigation.navigate(CLAIM_DETAILS_FORM);
  };

  const mapToId = id => {
    const item = claimType.types.byId[id];
    return {
      key: id,
      name: item.claimType,
    };
  };

  const sections = categories.all.map(categoryId => {
    const category = categories.byId[categoryId];
    const claimTypeIds = category.claimTypeIds;
    const claimTypes = claimTypeIds
      .map(mapToId)
      .sort((a, b) => a.name.localeCompare(b.name, intl.locale));
    return {
      title: category.claimCategory,
      data: claimTypes,
    };
  });

  return (
    <Box flex={1} bg="gray.7">
      <SectionList
        ListHeaderComponent={<Box pt={24} />}
        ListFooterComponent={<Box pb={24} />}
        renderSectionFooter={() => <Box pb={32} />}
        renderItem={({ item }) => (
          <TrackedListItem
            dense
            withFullDivider
            rightIcon={
              claimTypeId === item.key && (
                <Icon size={24} color="black" name="check" />
              )
            }
            onPress={() => onPressItem(item.key)}
            key={item.key}
            actionParams={{
              category: trackingCategories.CLAIMS_SUBMISSION,
              action: 'Select consultation type',
            }}
          >
            <Text
              color="gray.1"
              fontSize={16}
              lineHeight={24}
              letterSpacing={0.15}
            >
              {item.name}
            </Text>
          </TrackedListItem>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Box backgroundColor="gray.7" px={4} py={2}>
            <SectionHeadingText>{title}</SectionHeadingText>
          </Box>
        )}
        sections={sections}
        keyExtractor={item => item.key}
      />
    </Box>
  );
};

ClaimTypeModal.propTypes = {
  claimType: PropTypes.shape({}),
  change: PropTypes.func,
  fetchClaimTypeDetails: PropTypes.func,
  claimTypeId: PropTypes.number,
  touch: PropTypes.func,
  untouch: PropTypes.func,
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
};

const mapStateToProps = ({
  claimType,
  form: {
    claimDetailsForm: { values: { claimTypeId } = {} },
  },
}) => ({ claimType, claimTypeId });

const enhance = compose(
  connect(mapStateToProps, { fetchClaimTypes }),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
  injectIntl,
);
export default enhance(ClaimTypeModal);
