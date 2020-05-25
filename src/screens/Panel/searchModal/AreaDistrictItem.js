import React from 'react';
import { ListItem, Text } from '@wrappers/components';
import { FilterTypes } from '../utils/filter';
import { useIntl } from '@wrappers/core/hooks';
import { logAction } from '@store/analytics/trackingActions';

export const AreaDistrictItem = ({
  item,
  index,
  section,
  buttonCount,
  updateSearchTerm,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  updateFilter,
  saveToLocalStorage,
  actionParams,
}) => {
  const intl = useIntl();

  return (
    <ListItem
      accessibilityLabel={item}
      onPress={() => {
        const isArea =
          section.title ===
          intl.formatMessage({ id: 'panelSearch.search.areas' });
        const isDistrict =
          section.title.split('-')[0].trim() ===
          intl.formatMessage({ id: 'panelSearch.search.districts' });

        if (isArea || isDistrict) {
          updateSearchTerm(item);
          updateButtonPressCount(buttonCount + 1);
          updateSuccessfulSearchTerm(item);
        }

        if (isArea) {
          updateFilter({ type: FilterTypes.AREA, values: [item] });
          saveToLocalStorage({
            label: `${item} (${intl.formatMessage({
              id: 'panelSearch.search.area',
            })})`,
            filter: { type: FilterTypes.AREA, values: [item] },
          });
        }
        if (isDistrict) {
          updateFilter({
            type: FilterTypes.DISTRICT,
            values: [section.title.split('-')[1].trim(), item],
          });
          saveToLocalStorage({
            label: `${item} (${intl.formatMessage({
              id: 'panelSearch.search.district',
            })})`,
            filter: {
              type: FilterTypes.DISTRICT,
              values: [section.title.split('-')[1].trim(), item],
            },
          });
        }

        if (actionParams && (isDistrict || isArea)) {
          logAction({
            ...actionParams,
            clinic_search_feature: isDistrict ? 'District' : 'Area',
          });
        }
      }}
    >
      <Text key={index}>{item}</Text>
    </ListItem>
  );
};
