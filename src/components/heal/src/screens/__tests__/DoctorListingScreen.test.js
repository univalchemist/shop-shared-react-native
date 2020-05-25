import React from 'react';
import { FlatList, Platform } from 'react-native';
import { render } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import DoctorListingScreen, { ListItem } from '../DoctorListingScreen';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { DOCTOR_DETAIL, UNIFY_SEARCH } from '@routes';
import { StackBackButton, NonTouchableSearchBar } from '@heal/src/components';
import { ErrorPanel } from '@heal/src/wrappers/components';

const doctors = [
  {
    id: 240,
    locale: 'en-HK',
    name: 'Anna Tan',
    specialityCode: 'generalpractitio',
    gender: 'Female',
    clinics: [{}],
  },
  {
    id: 240,
    locale: 'en-HK',
    name: 'Anna Tan',
    specialityCode: 'generalpractitio',
    gender: 'Female',
    clinics: [{}],
  },
  {
    id: 240,
    locale: 'en-HK',
    name: 'Anna Tan',
    specialityCode: 'generalpractitio',
    gender: 'Female',
    clinics: [{}, {}],
  },
];

const getDoctors = jest
  .fn()
  .mockResolvedValue({ data: { items: doctors, totalCount: 3, page: 1 } });

const getDoctorsNoData = jest.fn().mockResolvedValue({
  data: { items: [], totalCount: 0, page: 1 },
});

describe('DoctorListingScreen', () => {
  beforeAll(async () => {
    Platform.OS = 'android';
  });

  test('render list item and able to navigate', async () => {
    const [screen] = render(
      <DoctorListingScreen
        navigation={navigation}
        route={{
          params: { code: '' },
        }}
      />,
      {
        initialState: {
          heal: {
            doctorData: { doctors: [], page: 0, total: 0, specialityCode: '' },
          },
        },
        api: { getDoctors },
      },
    );
    await flushMicrotasksQueue();
    const items = screen.queryAllByType(ListItem);
    expect(items).toHaveLength(3);
    fireEvent(items[0], 'press');
    expect(navigation.navigate).toBeCalledWith(DOCTOR_DETAIL, {
      doctor: {
        id: 240,
        locale: 'en-HK',
        name: 'Anna Tan',
        specialityCode: 'generalpractitio',
        gender: 'Female',
        clinics: [{}],
      },
    });
  });

  test('get new doctor list based on specialityCode in route', async () => {
    const [screen, store] = render(
      <DoctorListingScreen
        navigation={navigation}
        route={{
          params: { code: 'generalpractitio' },
        }}
      />,
      {
        initialState: {
          heal: {
            doctorData: {
              doctors: doctors,
              page: 2,
              total: 3,
              specialityCode: 'surgery',
            },
          },
        },
        api: { getDoctors: getDoctors },
      },
    );
    await flushMicrotasksQueue();
    const items = screen.queryAllByType(ListItem);
    expect(items).toHaveLength(3);
    expect(getDoctors).toHaveBeenCalledWith({
      clientId: undefined,
      page: 1,
      specialityCode: 'generalpractitio',
    });
    expect(store.getState().heal.doctorData.page).toEqual(1);
  });

  test('get more doctors when scrolling to bottom of list', async () => {
    const getDocs = jest
      .fn()
      .mockImplementation(({ clientId, page, specialityCode }) => {
        return { data: { items: doctors, totalCount: 10, page } };
      });
    const [screen, store] = render(
      <DoctorListingScreen
        navigation={navigation}
        route={{
          params: { code: 'generalpractitio' },
        }}
      />,
      {
        initialState: {
          heal: {
            doctorData: {
              doctors: doctors,
              page: 0,
              total: 30,
              specialityCode: '',
            },
          },
        },
        api: { getDoctors: getDocs },
      },
    );
    await flushMicrotasksQueue();
    const list = screen.getByType(FlatList);
    expect(list).toBeDefined();
    list.props.onEndReached();
    await flushMicrotasksQueue();
    expect(store.getState().heal.doctorData.page).toEqual(2);
  });

  test('able to navigate to other screens', async () => {
    const [screen, store] = render(
      <DoctorListingScreen
        navigation={navigation}
        route={{
          params: { code: 'generalpractitio' },
        }}
      />,
      {
        initialState: {
          heal: {
            doctorData: {
              doctors: [],
              page: 0,
              total: 0,
              specialityCode: '',
            },
          },
        },
        api: { getDoctors },
      },
    );
    await flushMicrotasksQueue();
    const backBtn = screen.getByType(StackBackButton);
    fireEvent.press(backBtn);
    expect(navigation.goBack).toBeCalled();
    const searchbar = screen.getByType(NonTouchableSearchBar);
    fireEvent.press(searchbar);
    expect(navigation.navigate).toBeCalledWith(UNIFY_SEARCH);
  });

  test('render Error Panel when there is no doctos', async () => {
    const [screen, store] = render(
      <DoctorListingScreen
        navigation={navigation}
        route={{
          params: { code: 'generalpractitio' },
        }}
      />,
      {
        initialState: {
          heal: {
            doctorData: {
              doctors: [],
              page: 0,
              total: 0,
              specialityCode: '',
            },
          },
        },
        api: { getDoctors: getDoctorsNoData },
      },
    );
    await flushMicrotasksQueue();
    const errPanel = screen.getByType(ErrorPanel);
    expect(errPanel).toBeDefined();
  });
});
