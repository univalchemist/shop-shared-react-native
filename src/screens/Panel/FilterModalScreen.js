import React from 'react';
import { connect } from 'react-redux';
import { CustomMultiselectCheckBox } from '@wrappers/components/form';
import { useIntl } from '@wrappers/core/hooks';
import { updateFilter } from '@store/panel/actions';
import { SPECIALTY } from './utils/filter/FilterTypes';
import { categories, logAction } from '@store/analytics/trackingActions';

const toTitleCase = str => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const FilterModalScreen = ({
  selectedValues,
  updateFilter,
  specialty,
  navigation,
}) => {
  const intl = useIntl();
  const data = specialty;
  return (
    <>
      <CustomMultiselectCheckBox
        buttonLabel={intl.formatMessage({ id: 'showResults' })}
        clearAllButtonLabel={intl.formatMessage({ id: 'clearAll' })}
        clearAllButtonTrackingActionParams={{
          category: categories.PANEL_CLINIC_SEARCH,
          action: 'Clear all filters',
        }}
        data={data}
        selectedValues={selectedValues}
        onSubmit={values => {
          logAction({
            category: categories.PANEL_CLINIC_SEARCH,
            action: `Filter search by ${toTitleCase(values.join(', '))}`,
          });
          updateFilter({ type: SPECIALTY, values });
          navigation.goBack();
        }}
        onChange={() => {}}
      />
    </>
  );
};

const mapStateToProps = ({ panel: { filters, specialty } }) => {
  return {
    selectedValues: filters.getFilterByType(SPECIALTY).values || [],
    specialty: specialty.map(current => ({
      label: toTitleCase(current),
      value: current,
    })),
  };
};

const enhance = connect(mapStateToProps, { updateFilter });

export default enhance(FilterModalScreen);
