import React from 'react';
import { ListItem, Text, Image } from '@wrappers/components';
import { FilterTypes } from '../utils/filter';
import { useIntl } from '@wrappers/core/hooks';
import { nonSelectedMapMarkerIcon } from '@images';
import { requestPermission } from '../utils/GrantLocationPermission';
import { logAction } from '@store/analytics/trackingActions';

export const NearMeButton = ({
  buttonCount,
  updateSearchTerm,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  updateFilter,
  actionParams,
}) => {
  const intl = useIntl();
  const nearMeText = intl.formatMessage({
    id: 'panelSearch.nearMe',
  });

  return (
    <ListItem
      leftIcon={<Image source={nonSelectedMapMarkerIcon} />}
      accessibilityLabel={nearMeText}
      onPress={() => {
        updateSearchTerm(nearMeText);
        updateButtonPressCount(buttonCount + 1);
        updateSuccessfulSearchTerm(nearMeText);

        if (actionParams) {
          logAction({
            ...actionParams,
            clinic_search_feature: 'Near me',
          });
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            updateFilter({
              type: FilterTypes.NEAR_ME,
              values: [coords.longitude, coords.latitude],
            }),
          async () => {
            await requestPermission();
          },
        );
      }}
    >
      <Text>{nearMeText}</Text>
    </ListItem>
  );
};
