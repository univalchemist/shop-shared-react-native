import React from 'react';
import { renderForTest } from '@testUtils';
import { FlatList } from 'react-native';
import MultipleClinicsListView from '../MultipleClinicsListView';
import { ListItemWithRightChevron } from '@wrappers/components';
import { fireEvent } from 'react-native-testing-library';
import { Image } from '@cxa-rn/components';
describe('MultipleClinicsListView', () => {
  const clinics = [
    {
      address: '2149 JALAN BUKIT RIMAU',
      district: 'some district',
      doctors: [],
      id: 212,
      location: [
        {
          latitude: 22.001232,
          longitude: 114.186422,
          id: 434,
        },
      ],
      name: 'name',
      qrCode: 'somecode',
    },
    {
      address: '2149 JALAN BUKIT RIMAU',
      district: 'some district',
      doctors: [],
      id: 212,
      location: [
        {
          latitude: 22.001232,
          longitude: 114.186422,
          id: 434,
        },
      ],
      name: 'name',
      qrCode: 'somecode',
    },
  ];

  const navigation = {
    navigate: jest.fn(),
  };

  const route = {
    params: {
      clinics,
    },
  };

  it('should render snapshot', () => {
    const component = renderForTest(
      <MultipleClinicsListView navigation={navigation} route={route} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it.only('should render flatlist that renders list of clinics passed', () => {
    const component = renderForTest(
      <MultipleClinicsListView navigation={navigation} route={route} />,
    );

    const flatList = component.queryAllByType(FlatList);

    expect(flatList.length).toBe(1);
    expect(flatList[0].props.data).toEqual(clinics);
  });

  it('should render the same number of list item as the number of clinics', () => {
    const component = renderForTest(
      <MultipleClinicsListView navigation={navigation} route={route} />,
    );

    expect(component.queryAllByType(ListItemWithRightChevron).length).toBe(
      clinics.length,
    );
  });

  it('should render the clinic name and consultation type', () => {
    const component = renderForTest(
      <MultipleClinicsListView navigation={navigation} route={route} />,
    );

    expect(component.queryAllByText(clinics[0].name).length).toBe(1);
    expect(component.queryAllByText(clinics[1].name).length).toBe(1);

    expect(component.queryAllByType(clinics[0].address).length).toBe(1);
    expect(component.queryAllByType(clinics[1].address).length).toBe(1);
    expect(component.getAllByType(Image)).toBeDefined();
  });

  it('should navigate to clinic details on pressed', () => {
    const component = renderForTest(
      <MultipleClinicsListView navigation={navigation} route={route} />,
    );

    const clinicListItem = component.queryAllByType(
      ListItemWithRightChevron,
    )[0];

    fireEvent.press(clinicListItem);

    expect(navigation.navigate).toHaveBeenCalledWith('PanelClinicDetails', {
      selectedClinic: clinics[0],
    });
  });
});
