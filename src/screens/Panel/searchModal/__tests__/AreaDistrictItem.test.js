import React from 'react';
import { renderForTest } from '@testUtils';
import { ListItem } from '@wrappers/components';
import { AreaDistrictItem } from '../AreaDistrictItem';
import messages from '@messages/en-HK.json';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { FilterTypes } from '../../utils/filter';

describe('Area District Item', () => {
  const mockClinics = [
    {
      name: 'Clinic A',
      area: '   Area 2',
      district: 'District 3',
    },
    {
      name: 'Clinic B',
      area: 'Area 1',
      district: 'District 1',
    },
    {
      name: 'Clinic C',
      area: 'Area 2',
      district: '  District 2',
    },
  ];
  let updateSearchTerm,
    updateButtonPressCount,
    buttonPressCount,
    updateSuccessfulSearchTerm,
    updateFilter,
    saveToLocalStorage;

  beforeEach(() => {
    updateSearchTerm = jest.fn();
    updateButtonPressCount = jest.fn();
    buttonPressCount = 0;
    updateSuccessfulSearchTerm = jest.fn();
    updateFilter = jest.fn();
    saveToLocalStorage = jest.fn();
  });

  const renderAreaDistrictItem = (item, section) => {
    return renderForTest(
      <AreaDistrictItem
        item={item}
        index={0}
        section={section}
        clinics={mockClinics}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        buttonPressCount={buttonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
        saveToLocalStorage={saveToLocalStorage}
      />,
    );
  };

  describe('Area item is pressed', () => {
    const area = 'Area 1';
    const section = { title: messages['panelSearch.search.areas'] };

    beforeEach(async () => {
      const areaDistrictList = renderAreaDistrictItem(area, section);
      const areaButton = areaDistrictList.queryAllByType(ListItem)[0];

      fireEvent.press(areaButton);
      await flushMicrotasksQueue;
    });

    it('should update search term to selected area name', async () => {
      expect(updateSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSearchTerm).toHaveBeenCalledWith(area);
    });

    it('should update successful search term to selected area name', () => {
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledWith(area);
    });

    it('should increment button count to force rerender upon multiple press', () => {
      expect(updateButtonPressCount).toHaveBeenCalledTimes(1);
    });

    it('should add area filter', async () => {
      expect(updateFilter).toHaveBeenCalledWith({
        type: FilterTypes.AREA,
        values: [area],
      });
    });

    it('should save to local storage as a recent search', async () => {
      expect(saveToLocalStorage).toHaveBeenCalledWith({
        label: `${area} (${messages['panelSearch.search.area']})`,
        filter: {
          type: FilterTypes.AREA,
          values: [area],
        },
      });
    });
  });

  describe('District item is pressed', () => {
    const area = 'Area 1';
    const district = 'District 1';
    const section = {
      title: `${messages['panelSearch.search.districts']} - ${area}`,
    };

    beforeEach(async () => {
      const areaDistrictList = renderAreaDistrictItem(district, section);
      const districtButton = areaDistrictList.queryAllByType(ListItem)[0];

      fireEvent.press(districtButton);
      await flushMicrotasksQueue;
    });

    it('should update search term to selected district name', async () => {
      expect(updateSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSearchTerm).toHaveBeenCalledWith(district);
    });

    it('should update successful search term to selected district name', () => {
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledWith(district);
    });

    it('should increment button count to force rerender upon multiple press', () => {
      expect(updateButtonPressCount).toHaveBeenCalledTimes(1);
    });

    it('should add district filter with area and district as values', async () => {
      expect(updateFilter).toHaveBeenCalledWith({
        type: FilterTypes.DISTRICT,
        values: [area, district],
      });
    });

    it('should save to local storage as a recent search', async () => {
      expect(saveToLocalStorage).toHaveBeenCalledWith({
        label: `${district} (${messages['panelSearch.search.district']})`,
        filter: {
          type: FilterTypes.DISTRICT,
          values: [area, district],
        },
      });
    });
  });
});
