import React from 'react';
import { ListItem, Text, Image } from '@wrappers/components';
import { panelDoctorIcon } from '@images';
import { FilterTypes } from '../utils/filter';
import { useIntl } from '@wrappers/core/hooks';
import { logAction } from '@store/analytics/trackingActions';

export const ShowAllClinicsButton = ({
  buttonCount,
  updateSearchTerm,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  updateFilter,
  actionParams,
}) => {
  const intl = useIntl();
  return (
    <ListItem
      leftIcon={<Image source={panelDoctorIcon} />}
      accessibilityLabel={intl.formatMessage({
        id: 'panelSearch.showAllClinics',
      })}
      onPress={() => {
        if (actionParams) {
          logAction({
            ...actionParams,
            clinic_search_feature: 'Show all clinics',
          });
        }

        updateSearchTerm('');
        updateButtonPressCount(buttonCount + 1);
        updateSuccessfulSearchTerm('');
        updateFilter({
          type: FilterTypes.ALL_CLINICS,
          values: ['all clinics'],
        });
      }}
    >
      <Text>{intl.formatMessage({ id: 'panelSearch.showAllClinics' })}</Text>
    </ListItem>
  );
};
