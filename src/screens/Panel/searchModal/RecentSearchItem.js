import React from 'react';
import { ListItem, Text } from '@wrappers/components';
import { logAction } from '@store/analytics/trackingActions';

export const RecentSearchItem = ({
  item,
  updateFilter,
  saveToLocalStorage,
  updateSearchTerm,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  buttonCount,
  actionParams,
}) => {
  return (
    <ListItem
      onPress={() => {
        if (actionParams) {
          logAction({
            ...actionParams,
            clinic_search_feature: 'Recent',
          });
        }

        updateFilter(item.filter);
        saveToLocalStorage(item);
        updateSearchTerm(item.label);
        updateButtonPressCount(buttonCount + 1);
        updateSuccessfulSearchTerm(item.label);
      }}
    >
      <Text>{item.label}</Text>
    </ListItem>
  );
};
