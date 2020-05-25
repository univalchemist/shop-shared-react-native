import { renderForTest, renderForTestWithStore } from '@testUtils';
import React from 'react';
import {
  flushMicrotasksQueue,
  fireEvent,
  act,
} from 'react-native-testing-library';
import PanelSearchScreen, {
  BackButton,
  PanelSearchScreen as PurePanelSearchScreen,
  FilterButton,
  MapViewContainer,
  MapView,
} from '../PanelSearchScreen';
import { ClinicCard } from '../widgets/clinicCards/ClinicCard';
import { Alert, Platform, BackHandler, Keyboard } from 'react-native';
import messages from '@messages/en-HK.json';
import PanelListView from '../widgets/PanelListView';
import { SearchBar } from 'react-native-elements';
import { PanelClinicFilters, FilterTypes } from '../utils/filter';
import mockNavigation from '@testUtils/__mocks__/navigation';
import MockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler';
import { StackBackButton, Image } from '@wrappers/components';
import { SearchModal } from '../searchModal/SearchModal';
import { filterImage, selectedFilterImage } from '@images';
import { FILTER_MODAL } from '@routes';
import { Storage } from '@utils';
import { PanelClusteredMapView } from '../widgets/PanelClusteredMapView';

const clinicsData = [
  {
    address: 'xyz',
    latitude: 1.22,
    longitude: 2.22,
    name: 'Some Clinic',
    specialty: 'Specialist',
    location: {
      latitude: 1.22,
      longitude: 2.22,
    },
  },
  {
    address: 'asd',
    latitude: 1.1232,
    longitude: 2.637,
    name: 'Dr Who Dat',
    specialty: 'Generalist',
    location: {
      latitude: 1.1232,
      longitude: 2.637,
    },
  },
];
const api = {
  fetchPanelClinics: jest.fn(() => Promise.resolve({ data: clinicsData })),
};

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => MockBackHandler,
);

const navigationWithEmptyGeolocation = {
  ...mockNavigation,
  geolocation: {},
};

describe('Panel Search', () => {
  const someRegion = {
    latitude: 65.332,
    longitude: 27.156,
    latitudeDelta: 12.1,
    longitudeDelta: 16.3,
  };

  const renderPanelSearchComponent = ({
    selectedClinic,
    clinics = [],
    filteredClinics = [],
    filters = new PanelClinicFilters({}),
    defaultLocation = someRegion,
    navigation = navigationWithEmptyGeolocation,
  }) =>
    renderForTest(<PanelSearchScreen navigation={navigation} />, {
      initialState: {
        panel: {
          selectedClinic,
          clinics,
          filteredClinics,
          filters,
          defaultLocation,
        },
      },
    });
  const renderPurePanelSearchComponent = ({
    clinics = [],
    filteredClinics = [],
    updateFilter = jest.fn(),
    removeAllFilters = jest.fn(),
  }) => {
    return renderForTest(
      <PurePanelSearchScreen
        navigation={navigationWithEmptyGeolocation}
        clinics={clinics}
        filteredClinics={filteredClinics}
        updateFilter={updateFilter}
        removeAllFilters={removeAllFilters}
        intl={{
          formatMessage: () => {},
        }}
      />,
      {
        initialState: {
          panel: {
            selectedClinic: [],
            clinics: [],
            filteredClinics: [],
            defaultLocation: someRegion,
          },
        },
      },
    );
  };
  const getSearchModal = component => component.queryAllByType(SearchModal);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let originalNavigator;
  beforeAll(() => {
    Platform.OS = 'ios';
    originalNavigator = global.navigator;
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        requestAuthorization: jest.fn(),
      },
    };
  });

  afterAll(() => {
    global.navigator = originalNavigator;
  });

  it.skip('should render the Panel Search with Map View', () => {
    const panelSearchScreen = renderPanelSearchComponent({}).toJSON();

    expect(panelSearchScreen).toMatchSnapshot();
  });

  it('should go back to lifestyle screen when back button clicked', async () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });
    const button = panelSearchScreen.getByType(BackButton);
    act(() => {
      button.props.handlePress();
    });

    await flushMicrotasksQueue();
    expect(navigationWithEmptyGeolocation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should call remove all filters when component is unmounted', () => {
    const removeAllFilters = jest.fn();
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const { unmount } = renderForTest(
      <PurePanelSearchScreen
        navigation={navigationWithEmptyGeolocation}
        clinics={[firstClinic, secondClinic]}
        removeAllFilters={removeAllFilters}
        filteredClinics={[secondClinic]}
        intl={{
          formatMessage: () => {},
        }}
      />,
      {
        initialState: {
          panel: {
            selectedClinic: secondClinic,
            clinics: [firstClinic, secondClinic],
            filteredClinics: [],
            defaultLocation: someRegion,
          },
        },
      },
    );

    unmount();

    expect(removeAllFilters).toHaveBeenCalled();
  });

  it('should show PanelSearchScreen without search model when android device back button clicked and search model on', async () => {
    Platform.OS = 'android';
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    act(() => {
      navigationWithEmptyGeolocation.mockEmitState('willFocus');
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);
    const stackBackButton = panelSearchScreen.queryAllByType(StackBackButton);
    expect(stackBackButton[0]).not.toBeNull();

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();

    expect(panelSearchScreen.queryAllByType(StackBackButton).length).toBe(0);

    act(() => {
      BackHandler.mockPressBack();
    });
    await flushMicrotasksQueue();

    expect(panelSearchScreen.queryAllByType(StackBackButton).length).toBe(1);
    expect(navigationWithEmptyGeolocation.navigate).toHaveBeenCalledTimes(0);
  });

  it('should render the search bar and back button', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);
    const stackBackButton = panelSearchScreen.queryAllByType(StackBackButton);

    expect(searchBar.length).toBe(1);
    expect(stackBackButton.length).toBe(1);
  });

  it(`should pass margin 0 to inputContainerStyle of search bar so that back button
  and filter button are in the center of their space when search modal is not shown`, () => {
    const panelSearchScreen = renderPanelSearchComponent({});
    const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];

    expect(searchBar.props.inputContainerStyle).toEqual({
      marginLeft: 0,
      marginRight: 0,
    });
  });

  it(`should pass margiLeft 8 to inputContainerStyle of search bar so that expanded search
  bar will not cover cancel button when search modal is shown`, async () => {
    const panelSearchScreen = renderPanelSearchComponent({});
    const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];

    act(() => {
      searchBar.props.onFocus();
    });
    await flushMicrotasksQueue();

    expect(searchBar.props.inputContainerStyle).toEqual({
      marginLeft: 8,
    });
  });

  it('should render the filter icon', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const filterButton = panelSearchScreen.queryAllByType(FilterButton);

    expect(filterButton.length).toBe(1);
    expect(filterButton[0].children[0].props.children[0].type).toEqual(Image);
    expect(filterButton[0].children[0].props.children[0].props.source).toEqual(
      filterImage,
    );
  });

  it('should not show filter icon when in search modal', async () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();

    const filterButton = panelSearchScreen.queryAllByType(FilterButton);

    expect(filterButton.length).toBe(0);
  });

  it('should show red filter icon when there exist specialty filter', async () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelClinicFilters = new PanelClinicFilters({});
    panelClinicFilters.update({
      type: FilterTypes.SPECIALTY,
      values: ['Hospital', 'General Practioner'],
    });
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
      filters: panelClinicFilters,
    });

    const filterButton = panelSearchScreen.queryAllByType(FilterButton);

    expect(filterButton.length).toBe(1);
    expect(filterButton[0].children[0].props.children[0].type).toEqual(Image);
    expect(filterButton[0].children[0].props.children[0].props.source).toEqual(
      selectedFilterImage,
    );
  });

  it('should open filter modal when filter button is pressed', async () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const filterButton = panelSearchScreen.queryAllByType(FilterButton);

    act(() => {
      fireEvent.press(filterButton[0]);
    });
    await flushMicrotasksQueue();

    expect(navigationWithEmptyGeolocation.navigate).toHaveBeenCalledWith(
      FILTER_MODAL,
    );
  });

  it('should not show back button upon clicking search bar', async () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();
    const stackBackButton = panelSearchScreen.queryAllByType(StackBackButton);

    expect(searchBar.length).toBe(1);
    expect(stackBackButton.length).toBe(0);
  });

  it('should update the search value on typing', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      fireEvent.changeText(searchBar[0], 'Dr Who');
    });

    expect(searchBar[0].props.value).toBe('Dr Who');
  });

  it('should retain the old value on clicking cancel', () => {
    jest.useFakeTimers();
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      fireEvent.changeText(searchBar[0], 'Dr Who');
    });

    act(() => {
      searchBar[0].props.onSubmitEditing({
        nativeEvent: {
          text: 'Dr Who',
        },
      });
    });

    expect(searchBar[0].props.value).toBe('Dr Who');

    act(() => {
      fireEvent.changeText(searchBar[0], '');
    });
    expect(searchBar[0].props.value).toBe('');

    act(() => {
      searchBar[0].props.onCancel();
    });

    jest.runAllTimers();
    expect(searchBar[0].props.value).toBe('Dr Who');
  });

  describe('when search bar submit button is pressed', () => {
    let updateFilter, panelSearchScreen;
    beforeEach(async () => {
      jest.spyOn(Keyboard, 'dismiss');
      jest.spyOn(Storage, 'get').mockResolvedValue(null);
      jest.spyOn(Storage, 'save').mockResolvedValue(null);

      updateFilter = jest.fn();

      panelSearchScreen = renderPurePanelSearchComponent({
        updateFilter,
      });

      const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];
      act(() => {
        searchBar.props.onFocus();
        searchBar.props.onChangeText('clinic a');
      });
      await flushMicrotasksQueue();

      act(() => {
        searchBar.props.onSubmitEditing();
      });
      await flushMicrotasksQueue();
    });

    it('should add name filter ', async () => {
      expect(updateFilter).toHaveBeenCalledWith({
        type: FilterTypes.SEARCH_ALL,
        values: ['clinic a'],
      });
    });

    it('should hide SearchModal', () => {
      expect(getSearchModal(panelSearchScreen).length).toBe(0);
    });

    it('should dismiss keyboard', () => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    describe('save recent searches to local storage', () => {
      it('should create an array with successful search term if there are no recent search ', () => {
        const option = JSON.stringify([
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
        ]);
        expect(Storage.save).toHaveBeenCalledWith('recentSearches', option);
      });

      it('should add a successful search term to the array when there are existing searches', async () => {
        const existingSearches = JSON.stringify([
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
        ]);

        jest.spyOn(Storage, 'get').mockResolvedValue(existingSearches);
        jest.spyOn(Storage, 'save').mockResolvedValue(null);

        updateFilter = jest.fn();

        const panelSearchScreen = renderPurePanelSearchComponent({
          updateFilter,
        });

        const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];
        act(() => {
          searchBar.props.onFocus();
          searchBar.props.onChangeText('clinic d');
        });
        await flushMicrotasksQueue();

        act(() => {
          searchBar.props.onSubmitEditing();
        });
        await flushMicrotasksQueue();

        const expectedSearches = JSON.stringify([
          {
            label: 'clinic d',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic d'],
            },
          },
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
        ]);

        expect(Storage.save).toHaveBeenCalledWith(
          'recentSearches',
          expectedSearches,
        );
      });

      it('should remove last successful search term in the array if there are already four existing searches', async () => {
        const existingSearches = JSON.stringify([
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
          {
            label: 'clinic c',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic c'],
            },
          },
          {
            label: 'clinic d',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic d'],
            },
          },
        ]);

        jest.spyOn(Storage, 'get').mockResolvedValue(existingSearches);
        jest.spyOn(Storage, 'save').mockResolvedValue(null);
        updateFilter = jest.fn();

        const panelSearchScreen = renderPurePanelSearchComponent({});

        const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];
        act(() => {
          searchBar.props.onFocus();
          searchBar.props.onChangeText('clinic e');
        });
        await flushMicrotasksQueue();

        act(() => {
          searchBar.props.onSubmitEditing();
        });
        await flushMicrotasksQueue();

        const expectedSearches = JSON.stringify([
          {
            label: 'clinic e',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic e'],
            },
          },
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
          {
            label: 'clinic c',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic c'],
            },
          },
        ]);

        expect(Storage.save).toHaveBeenCalledWith(
          'recentSearches',
          expectedSearches,
        );
      });

      it('should delete duplicate search term if it exists in the array and set the search term to be latest', async () => {
        const existingSearches = JSON.stringify([
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
          {
            label: 'clinic c',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic c'],
            },
          },
          {
            label: 'clinic d',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic d'],
            },
          },
        ]);

        jest.spyOn(Storage, 'get').mockResolvedValue(existingSearches);
        jest.spyOn(Storage, 'save').mockResolvedValue(null);

        const panelSearchScreen = renderPurePanelSearchComponent({});

        const searchBar = panelSearchScreen.queryAllByType(SearchBar)[0];
        act(() => {
          searchBar.props.onFocus();
          searchBar.props.onChangeText('clinic b');
        });
        await flushMicrotasksQueue();

        act(() => {
          searchBar.props.onSubmitEditing();
        });
        await flushMicrotasksQueue();

        const expectedSearches = JSON.stringify([
          {
            label: 'clinic b',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic b'],
            },
          },
          {
            label: 'clinic a',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic a'],
            },
          },
          {
            label: 'clinic c',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic c'],
            },
          },
          {
            label: 'clinic d',
            filter: {
              type: FilterTypes.SEARCH_ALL,
              values: ['clinic d'],
            },
          },
        ]);

        expect(Storage.save).toHaveBeenCalledWith(
          'recentSearches',
          expectedSearches,
        );
      });
    });
  });

  it('should render the panel search in tab view', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [],
    });

    const mapsTabText = panelSearchScreen.queryAllByText('MAP');
    const listTabText = panelSearchScreen.queryAllByText('LIST');
    expect(mapsTabText).not.toBeNull();
    expect(listTabText).not.toBeNull();
  });

  it('should render appropriate view before and after tab switching', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [],
    });
    const mapView = panelSearchScreen.queryAllByType(MapView);
    const listViewText = panelSearchScreen.queryAllByText('LIST')[0];

    expect(mapView.length).toBe(1);
    act(() => {
      fireEvent.press(listViewText);
    });

    const listViewContent = panelSearchScreen.queryAllByType(PanelListView);
    expect(listViewContent.length).toBe(1);
  });

  it('should render the panels in list view', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: secondClinic,
      clinics: [firstClinic, secondClinic],
      filteredClinics: [firstClinic, secondClinic],
    });

    const listTabText = panelSearchScreen.queryAllByText('LIST')[0];
    act(() => {
      fireEvent.press(listTabText);
    });

    const listViewScreen = panelSearchScreen.queryAllByType(PanelListView);
    expect(listViewScreen.length).toBe(1);
    expect(listViewScreen[0].props.clinics.length).toBe(2);
  });

  describe('Clinic Card at the bottom', () => {
    const firstClinic = { id: 1, ...clinicsData[0] };
    const secondClinic = { id: 2, ...clinicsData[0] };
    const clinicCard = component => component.queryByType(ClinicCard);

    let component, navigation;
    beforeEach(() => {
      navigation = { ...mockNavigation };
      component = renderPanelSearchComponent({
        selectedClinic: secondClinic,
        clinics: [firstClinic, secondClinic],
        filteredClinics: [],
        navigation,
      });
    });

    it('should render a ClinicCard', () => {
      expect(component.queryAllByType(ClinicCard).length).toBe(1);
    });

    it('should pass navigation to ClinicCard', () => {
      expect(clinicCard(component).props.navigation).toBe(navigation);
    });
  });

  test('should show an error alert when fetching clinics fails', async () => {
    const initialState = {
      panel: {
        clinics: [],
        filteredClinics: [],
        filters: new PanelClinicFilters({}),
        defaultLocation: someRegion,
      },
    };

    const api = {
      fetchPanelClinics: jest.fn(() => Promise.reject({})),
    };
    renderForTestWithStore(
      <PanelSearchScreen navigation={navigationWithEmptyGeolocation} />,
      {
        api,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    expect(api.fetchPanelClinics).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      messages['serverErrors.fetchPanelClinics.subject'],
      messages['serverErrors.fetchPanelClinics.default'],
    );
  }, 30000);

  it('should not fetch panel clinics if already fetched', async () => {
    const initialState = {
      panel: {
        defaultLocation: {
          latitude: 22.266021,
          longitude: 114.186422,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        },
        clinics: clinicsData,
        selectedClinic: clinicsData[0],
        filteredClinics: clinicsData,
        filters: new PanelClinicFilters({}),
      },
    };
    renderForTestWithStore(
      <PanelSearchScreen navigation={navigationWithEmptyGeolocation} />,
      {
        api,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    expect(api.fetchPanelClinics).not.toHaveBeenCalled();
  }, 30000);

  it('should fetch panel clinics if not fetched', async () => {
    const initialState = {
      panel: {
        clinics: [],
        filteredClinics: [],
        filters: new PanelClinicFilters({}),
        defaultLocation: someRegion,
      },
    };
    renderForTestWithStore(
      <PanelSearchScreen navigation={navigationWithEmptyGeolocation} />,
      {
        api,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    expect(api.fetchPanelClinics).toHaveBeenCalled();
  });

  it('should show search modal when focusing on search bar', async () => {
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: undefined,
      clinics: [],
      filteredClinics: [],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();

    expect(getSearchModal(panelSearchScreen).length).toBe(1);
  });

  it('should pass update search term as a prop to SearchModal', async () => {
    const panelSearchScreen = renderPanelSearchComponent({
      selectedClinic: undefined,
      clinics: [],
      filteredClinics: [],
    });

    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();

    const searchModal = getSearchModal(panelSearchScreen);
    const newSearchTerm = 'search-term';
    act(() => {
      searchModal[0].props.updateSearchTerm(newSearchTerm);
    });
    await flushMicrotasksQueue();

    expect(panelSearchScreen.queryAllByType(SearchBar)[0].props.value).toBe(
      newSearchTerm,
    );
  });

  describe('when SearchModal update filter', () => {
    let mockUpdateFilter, panelSearchScreen, filter;
    beforeEach(async () => {
      mockUpdateFilter = jest.fn();
      jest.spyOn(Keyboard, 'dismiss');
      panelSearchScreen = renderForTest(
        <PurePanelSearchScreen
          navigation={navigationWithEmptyGeolocation}
          removeAllFilters={jest.fn()}
          clinics={[]}
          filteredClinics={[]}
          intl={{
            formatMessage: () => {},
          }}
          updateFilter={mockUpdateFilter}
        />,
        {
          initialState: {
            panel: {
              selectedClinic: undefined,
              clinics: [],
              filteredClinics: [],
              defaultLocation: someRegion,
            },
          },
        },
      );

      const searchBar = panelSearchScreen.queryAllByType(SearchBar);

      act(() => {
        searchBar[0].props.onFocus();
      });
      await flushMicrotasksQueue();

      const searchModal = getSearchModal(panelSearchScreen);
      filter = {
        type: 'somefilter',
        values: ['value 1', 'value 2'],
      };

      act(() => {
        searchModal[0].props.updateFilter(filter);
      });
      await flushMicrotasksQueue();
    });
    it('should call updateFilter action', () => {
      expect(mockUpdateFilter).toHaveBeenCalledWith(filter);
    });
    it('should hide SearchModal', () => {
      expect(getSearchModal(panelSearchScreen).length).toBe(0);
    });
    it('should dismiss keyboard', () => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
    });
  });

  const changeSearchTerm = async (panelSearchScreen, newSearchTerm) => {
    const searchBar = panelSearchScreen.queryAllByType(SearchBar);

    act(() => {
      searchBar[0].props.onFocus();
    });
    await flushMicrotasksQueue();

    const searchModal = getSearchModal(panelSearchScreen);

    act(() => {
      searchModal[0].props.updateSearchTerm(newSearchTerm);
    });
    await flushMicrotasksQueue();
  };

  describe('Panel clustered map view', () => {
    const panelClusteredMapView = component =>
      component.queryByType(PanelClusteredMapView);
    const mapViewContainer = component =>
      component.queryByType(MapViewContainer);

    const computeMapViewLayout = async (layout, component) => {
      act(() => {
        const layoutEvent = {
          nativeEvent: { layout },
        };

        mapViewContainer(component).props.onLayout(layoutEvent);
      });
      await flushMicrotasksQueue();
    };

    describe('before figuring out map view dimension', () => {
      let component;
      beforeEach(() => {
        component = renderPanelSearchComponent({});
      });
      it('should not render PanelClusteredMapView', () => {
        expect(component.queryAllByType(PanelClusteredMapView)).toHaveLength(0);
      });
    });

    describe('after computing map view dimension completes', () => {
      let component, mapViewLayout;
      beforeEach(async () => {
        component = renderPanelSearchComponent({});
        mapViewLayout = { width: 200, height: 300 };
        await computeMapViewLayout(mapViewLayout, component);
      });

      it('should render PanelClusteredMapView', async () => {
        expect(component.queryAllByType(PanelClusteredMapView)).toHaveLength(1);
      });

      it('should pass map view layout as dimension to PanelClusteredMapView', async () => {
        expect(panelClusteredMapView(component).props.dimension).toEqual(
          mapViewLayout,
        );
      });
    });
  });
});
