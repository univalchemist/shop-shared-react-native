import React from 'react';
import { SectionList, TextInput, TouchableOpacity } from 'react-native';
import { render } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import UnifySearchScreen, {
  ListItem,
  NearMeButton,
} from '../UnifySearchScreen';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { search, clearSearch } from './../../store/actions';
import en_messages from '@heal/messages/en-HK.json';
import { ClinicSearchType } from '@heal/src/store/types';
import * as types from '@heal/src/store/types';
import AsyncStorage from '@react-native-community/async-storage';
import {
  CLINIC_DETAILS,
  DOCTOR_DETAIL,
  DOCTOR_LISTING,
  PANEL_SEARCH,
} from '@routes';

const clinics = [
  {
    id: 506,
    name: 'Testing Clinic 1',
    latitude: 1.303007,
    longitude: 103.796334,
    qrCode: '304',
    district: 'CAUSEWAY BAY',
    address:
      'Kuala Lumpur City Centre, 50088 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia',
    clinicProviderId: 1,
    isActive: true,
  },
  {
    id: 491,
    name: 'CXA (SG) Testing Clinic 2',
    latitude: 1.303633,
    longitude: 103.798221,
    qrCode: '305',
    district: 'CAUSEWAY BAY',
    address:
      'Kuala Lumpur City Centre, 50088 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia',
    clinicProviderId: 1,
    isActive: true,
  },
  {
    id: 491,
    name: 'CXA (SG) Clinic 3',
    latitude: 1.303633,
    longitude: 103.798221,
    qrCode: '305',
    district: 'CXA Headquarter',
    address:
      'Kuala Lumpur City Centre, 50088 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia',
    clinicProviderId: 1,
    isActive: true,
  },
];
const doctors = [
  {
    id: 463,
    locale: 'en-HK',
    name: 'CXA2',
    specialityCode: 'generalpractitio',
    gender: 'Female',
    isActive: true,
    clinics: [],
    clinicProviderId: 1,
  },
  {
    id: 463,
    locale: 'en-HK',
    name: 'CXA2',
    specialityCode: 'cxaspeciality',
    gender: 'Female',
    isActive: true,
    clinics: [],
    clinicProviderId: 1,
  },
];

const initialState = {
  heal: {
    specialitiesByCode: {
      generalsurgery: { name: 'generalsurgery', code: 'generalsurgery' },
      generalpractitio: { name: 'generalpractitio', code: 'generalpractitio' },
      dentist: { name: 'dentist', code: 'dentist' },
      cxaSpeciality: { name: 'cxaSpeciality', code: 'cxaSpeciality' },
    },
    specialities: [
      { name: 'generalsurgery', code: 'generalsurgery' },
      { name: 'generalpractitio', code: 'generalpractitio' },
      { name: 'dentist', code: 'dentist' },
      { name: 'cxaSpeciality', code: 'cxaSpeciality' },
    ],
    clinicData: { clinics },
    doctorData: { doctors },
  },
};

const getClinics_hasResult = jest
  .fn()
  .mockImplementation(
    async ({
      clientId,
      lat,
      lng,
      page,
      itemPerPage,
      nearBy,
      searchBy,
      searchTerm,
    }) => {
      const clis = clinics.filter(c => {
        let condition = false;
        if (searchBy === ClinicSearchType.Name)
          condition = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        else if (searchBy === ClinicSearchType.Location)
          condition = c.district
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return condition;
      });
      return { data: { items: clis, totalCount: clis.length } };
    },
  );
const getDoctors_hasResult = jest
  .fn()
  .mockImplementation(async ({ searchTerm, specialityCode }) => {
    const docs = doctors.filter(d => {
      let condition = false;
      if (searchTerm && searchTerm.length > 0)
        condition = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (specialityCode && specialityCode.length > 0)
        condition = d.specialityCode
          .toLowerCase()
          .includes(specialityCode.toLowerCase());
      return condition;
    });
    return { data: { items: docs, totalCount: docs.length } };
  });
const getDoctors_noResult = jest
  .fn()
  .mockResolvedValue({ data: { items: [] } });
const getClinics_noResult = jest
  .fn()
  .mockResolvedValue({ data: { items: [] } });

describe('UnifySearchScreen', () => {
  test('found data for all 4 sections', async () => {
    const nav = { ...navigation, navigate: jest.fn() };
    const [screen] = render(
      <UnifySearchScreen
        navigation={nav}
        search={search}
        clearSearch={clearSearch}
      />,
      {
        initialState,
        api: {
          getClinicsWithObject: getClinics_hasResult,
          getDoctors: getDoctors_hasResult,
        },
      },
    );
    await flushMicrotasksQueue();
    const searchInput = screen.getByType(TextInput);
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'cxa');
    await flushMicrotasksQueue();
    searchInput.props.onSubmitEditing();
    await flushMicrotasksQueue();
    const resultItems = screen.queryAllByType(ListItem);
    expect(resultItems.length).toEqual(6);
    expect(
      screen.getByText(en_messages['heal.UnifySearch.DoctorName']),
    ).toBeDefined();
    expect(
      screen.getByText(en_messages['heal.UnifySearch.ClinicName']),
    ).toBeDefined();
    expect(
      screen.getByText(en_messages['heal.UnifySearch.Speciality']),
    ).toBeDefined();
    expect(
      screen.getByText(en_messages['heal.UnifySearch.Location']),
    ).toBeDefined();

    const getItemByType = type =>
      resultItems.filter(i => i.props.item.data.type === type);
    const locationItem = getItemByType(types.SearchItemType.Location)[0];
    const specialityItem = getItemByType(types.SearchItemType.Speciality)[0];
    const clinicItem = getItemByType(types.SearchItemType.Clinic)[0];
    const doctorItem = getItemByType(types.SearchItemType.Doctor)[0];
    fireEvent(locationItem, 'press', locationItem.props.item);
    expect(nav.navigate).toBeCalledWith(PANEL_SEARCH, {
      searchTerm: locationItem.props.item.title,
      searchBy: types.ClinicSearchType.Location,
    });
    fireEvent(specialityItem, 'press', specialityItem.props.item);
    expect(nav.navigate).toBeCalledWith(DOCTOR_LISTING, {
      code: specialityItem.props.item.data.specialityCode,
    });
    fireEvent(clinicItem, 'press', clinicItem.props.item);
    expect(nav.navigate).toBeCalledWith(CLINIC_DETAILS, {
      clinic: clinicItem.props.item.data,
    });
    fireEvent(doctorItem, 'press', doctorItem.props.item);
    expect(nav.navigate).toBeCalledWith(DOCTOR_DETAIL, {
      doctor: doctorItem.props.item.data,
    });
  });

  test('show message indicate that no results', async () => {
    const [screen] = render(
      <UnifySearchScreen
        navigation={navigation}
        search={search}
        clearSearch={clearSearch}
      />,
      {
        initialState,
        api: {
          getClinicsWithObject: getClinics_noResult,
          getDoctors: getDoctors_noResult,
        },
      },
    );
    await flushMicrotasksQueue();
    const searchInput = screen.getByType(TextInput);
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'cxa');
    await flushMicrotasksQueue();
    searchInput.props.onSubmitEditing();
    await flushMicrotasksQueue();
    const errorMsg = screen.getByText(en_messages['heal.UnifySearch.NotFound']);
    expect(errorMsg).toBeDefined();
  });

  test('test near me button', async () => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn().mockImplementation(successCallback => {
          successCallback({
            coords: {
              latitude: 2,
              longitude: 3,
            },
          });
        }),
        requestAuthorization: jest.fn(),
      },
    };
    const [screen] = render(
      <UnifySearchScreen
        navigation={navigation}
        search={search}
        clearSearch={clearSearch}
      />,
      {
        initialState,
        api: {
          getClinicsWithObject: getClinics_hasResult,
          getDoctors: getDoctors_hasResult,
        },
      },
    );
    await flushMicrotasksQueue();
    const nearmeBtn = screen.getByType(NearMeButton);
    const btn = nearmeBtn.findByType(TouchableOpacity);
    fireEvent.press(btn);
    await flushMicrotasksQueue();
    expect(getClinics_hasResult).toBeCalledWith({
      clientId: undefined,
      lat: 2,
      lng: 3,
      page: 1,
      itemPerPage: types.GET_ALL,
      nearBy: types.UNIFY_SEARCH_DISTANCE,
      searchBy: undefined,
      searchTerm: undefined,
    });
  });

  test('render only clinics', async () => {
    const [screen] = render(
      <UnifySearchScreen
        navigation={navigation}
        search={search}
        clearSearch={clearSearch}
      />,
      {
        initialState,
        api: {
          getClinicsWithObject: getClinics_hasResult,
          getDoctors: getDoctors_hasResult,
        },
      },
    );
    await flushMicrotasksQueue();
    const searchInput = screen.getByType(TextInput);
    expect(searchInput).toBeDefined();
    fireEvent.changeText(searchInput, 'testing');
    await flushMicrotasksQueue();
    searchInput.props.onSubmitEditing();
    await flushMicrotasksQueue();
    const resultItems = screen.queryAllByType(ListItem);
    expect(resultItems.length).toEqual(2);
    expect(
      screen.getByText(en_messages['heal.UnifySearch.ClinicName']),
    ).toBeDefined();
    expect(
      screen.queryAllByText(en_messages['heal.UnifySearch.DoctorName']).length,
    ).toEqual(0);
    expect(
      screen.queryAllByText(en_messages['heal.UnifySearch.Speciality']).length,
    ).toEqual(0);
    expect(
      screen.queryAllByText(en_messages['heal.UnifySearch.Location']).length,
    ).toEqual(0);
  });

  test('render Recent search', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('["test", "cxa"]');
    const [screen] = render(
      <UnifySearchScreen
        navigation={navigation}
        search={search}
        clearSearch={clearSearch}
      />,
      {
        initialState,
        api: {
          getClinicsWithObject: getClinics_hasResult,
          getDoctors: getDoctors_hasResult,
        },
      },
    );
    await flushMicrotasksQueue();
    await flushMicrotasksQueue();
    const items = screen.getAllByType(ListItem);
    expect(items.length).toEqual(2);
    expect(
      screen.getByText(en_messages['heal.UnifySearch.Recent']),
    ).toBeDefined();
  });
});
