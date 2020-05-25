import React from 'react';
import { SectionList } from 'react-native';
import { renderForTest } from '@testUtils';
import { SearchModal } from '../SearchModal';
import { ShowAllClinicsButton } from '../ShowAllClinicsButton';
import { NearMeButton } from '../NearMeButton';
import { AreaDistrictItem } from '../AreaDistrictItem';
import { RecentSearchItem } from '../RecentSearchItem';
import { FilterTypes } from '../../utils/filter';
import messages from '@messages/en-HK.json';

describe('SearchModal', () => {
  const mockClinics = [
    {
      name: 'Clinic A',
      area: 'Area 2',
      district: 'District 3',
    },
  ];
  const renderSearchModal = (clinics, recentSearches) => {
    return renderForTest(
      <SearchModal
        clinics={clinics}
        getRecentSearches={recentSearches}
        buttonPressCount={0}
        updateSearchTerm={jest.fn()}
        updateButtonPressCount={jest.fn()}
        updateSuccessfulSearchTerm={jest.fn()}
        updateFilter={jest.fn()}
        saveToLocalStorage={jest.fn()}
      />,
    );
  };
  describe('other options', () => {
    it('should not render other options header', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const otherOptionsHeader = searchModal.queryAllByText('Other options');

      expect(otherOptionsHeader.length).toBe(0);
    });

    it('should render near me button', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const nearMeButton = searchModal.queryAllByType(NearMeButton);

      expect(nearMeButton.length).toBe(1);
    });

    it('should render show all clinics button', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const showAllClinicsButton = searchModal.queryAllByType(
        ShowAllClinicsButton,
      );

      expect(showAllClinicsButton.length).toBe(1);
    });
  });

  describe('area district list', () => {
    it('should render a section list', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const sectionList = searchModal.queryAllByType(SectionList);

      expect(sectionList.length).toBe(1);
    });

    it('should render areas header', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const areasHeader = searchModal.queryAllByText(
        messages['panelSearch.search.areas'],
      );

      expect(areasHeader.length).toBe(1);
    });

    it('should render districts header', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const areasHeader = searchModal.queryAllByText(
        `${messages['panelSearch.search.districts']} - Area 2`,
      );

      expect(areasHeader.length).toBe(1);
    });

    // SectionList is not properly rendered during test
    it.skip('should render one area and one district list item', async () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const areaDistrictList = searchModal.queryAllByType(AreaDistrictItem);
      expect(areaDistrictList.length).toBe(2);
    });
  });

  describe('recent searches', () => {
    it('should render recent searches header', () => {
      const searchModal = renderSearchModal(
        [],
        [
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.NAME,
              values: ['clinic a'],
            },
          },
        ],
      );

      const listHeader = searchModal.queryAllByText(
        messages['panelSearch.recentSearches'],
      );

      expect(listHeader.length).toBe(1);
    });

    it('should render recent searches item', () => {
      const searchModal = renderSearchModal(
        [],
        [
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.NAME,
              values: ['clinic a'],
            },
          },
        ],
      );

      const recentSearches = searchModal.queryAllByType(RecentSearchItem);

      expect(recentSearches.length).toBe(1);
    });

    it('should not render recent searches items when there are no recent searches', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const recentSearches = searchModal.queryAllByType(RecentSearchItem);

      expect(recentSearches.length).toBe(0);
    });

    it('should not render recent searches header when there are no recent searches', () => {
      const searchModal = renderSearchModal(mockClinics, []);

      const recentSearchesHeader = searchModal.queryAllByText(
        messages['panelSearch.recentSearches'],
      );

      expect(recentSearchesHeader.length).toBe(0);
    });

    it('should render list item in order given three recent searches', async () => {
      const recentSearches = [
        {
          label: 'clinic a',
          filter: {
            type: FilterTypes.NAME,
            values: ['clinic a'],
          },
        },
        {
          label: 'clinic b',
          filter: {
            type: FilterTypes.NAME,
            values: ['clinic b'],
          },
        },
        {
          label: 'clinic c',
          filter: {
            type: FilterTypes.NAME,
            values: ['clinic c'],
          },
        },
      ];
      const searchModal = renderSearchModal(mockClinics, recentSearches);

      const recentSearchesItems = searchModal.queryAllByType(RecentSearchItem);

      expect(recentSearchesItems.length).toBe(3);
      expect(recentSearchesItems[0].props.item.label).toBe('clinic a');
      expect(recentSearchesItems[1].props.item.label).toBe('clinic b');
      expect(recentSearchesItems[2].props.item.label).toBe('clinic c');
    });
  });
});
