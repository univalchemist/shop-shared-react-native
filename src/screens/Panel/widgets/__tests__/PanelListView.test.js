import React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { renderForTest } from '@testUtils';
import { Image, ErrorPanel } from '@wrappers/components';
import { fireEvent } from 'react-native-testing-library';
import { PANEL_CLINIC_DETAILS } from '@routes';
import { TerminatedLabel, PanelListView } from '@screens/Panel';

describe('PanelListView', () => {
  const clinics = [
    {
      id: 1,
      name: 'Dr abc',
      address: 'CommonWealth MRT',
      contactNumber1: '2223 2231',
      specialty: 'General Practice',
    },
    {
      id: 2,
      name: 'Dr xyz',
      address: 'City Hall MRT',
      contactNumber1: '2223 2232',
      contactNumber2: '2223 2233',
      contactNumber3: '2223 2234',
      specialty: 'General Surgery',
    },
  ];
  it('should match snapshot', () => {
    const panelListView = renderForTest(
      <PanelListView clinics={clinics} />,
    ).toJSON();
    expect(panelListView).toMatchSnapshot();
  });

  it('should show the list view', () => {
    const panelListView = renderForTest(<PanelListView clinics={clinics} />);

    expect(panelListView.queryAllByType(FlatList).length).toBe(1);
    expect(panelListView.queryAllByType(Image).length).not.toBeNull();
    expect(panelListView.queryByText(clinics[0].name)).not.toBeNull();
    expect(panelListView.queryByText(clinics[0].address)).not.toBeNull();
    expect(panelListView.queryByText(clinics[0].specialty)).not.toBeNull();
    expect(panelListView.queryByText(clinics[0].contactNumber1)).not.toBeNull();
    expect(panelListView.queryByText(clinics[1].name)).not.toBeNull();
    expect(panelListView.queryByText(clinics[1].address)).not.toBeNull();
    expect(panelListView.queryByText(clinics[1].specialty)).not.toBeNull();
    expect(
      panelListView.queryByText(
        `${clinics[1].contactNumber1}, ${clinics[1].contactNumber2}, ${clinics[1].contactNumber3}`,
      ),
    ).not.toBeNull();
  });

  it('should show the number of clinics listed', () => {
    const panelListView = renderForTest(<PanelListView clinics={clinics} />);
    const clinicsNumber = clinics.length;
    const clinicsNumberText = `${clinicsNumber} Clinics / Doctors found`;

    expect(panelListView.queryByText(clinicsNumberText)).not.toBeNull();
  });

  it('should show the detailed clinic panel when the clinic is clicked on', async () => {
    const navigation = { navigate: jest.fn() };
    const { queryAllByType } = renderForTest(
      <PanelListView clinics={clinics} navigation={navigation} />,
    );

    fireEvent.press(queryAllByType(TouchableHighlight)[1]);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(PANEL_CLINIC_DETAILS, {
      selectedClinic: clinics[1],
    });
  });

  it('should show error panel with appropriate message if zero clinic found', () => {
    const panelListView = renderForTest(<PanelListView clinics={[]} />);

    expect(panelListView.queryAllByType(ErrorPanel).length).toBe(1);
  });

  it('should show error panel with appropriate message if fetching clinic failed', () => {
    const panelListView = renderForTest(<PanelListView clinics={null} />);

    expect(panelListView.queryAllByType(ErrorPanel).length).toBe(1);
  });
  it('should show - text if value is empty or unavailable', () => {
    const clinics = [
      {
        name: 'Dr abc',
        address: '',
        specialty: 'General Practice',
      },
      {
        name: 'Dr xyz',
        address: 'City Hall MRT',
        contactNumber1: '',
      },
      {
        name: 'Dr xyz',
        contactNumber1: '2223 2233',
        specialty: 'General Surgery',
      },
      {
        name: 'Dr xyza',
        contactNumber1: '',
        contactNumber2: '',
        contactNumber3: '',
        specialty: 'General Surgery',
        address: 'City Hall MRT',
      },
      {
        name: 'Dr xyza',
        contactNumber1: ' ',
        contactNumber2: ' ',
        contactNumber3: ' ',
        specialty: 'General Surgery',
        address: 'City Hall MRT',
      },
    ];
    const panelListView = renderForTest(<PanelListView clinics={clinics} />);

    expect(panelListView.queryAllByText('-').length).toBe(7);
  });

  describe('terminated label', () => {
    beforeEach(() => {
      const FeatureToggle = require('@config/FeatureToggle').default;
      FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.turnOn();
    });
    it('should show clinic with termination text when terminationDate is not null', () => {
      const clinics = [
        {
          name: 'Dr abc',
          address: '',
          specialty: 'General Practice',
          terminationDate: '30Sep2019',
        },
      ];
      const panelListView = renderForTest(<PanelListView clinics={clinics} />);

      expect(panelListView.queryAllByType(TerminatedLabel).length).toBe(1);
    });

    it('should not show clinic with termination text when terminationDate is null', () => {
      const clinics = [
        {
          name: 'Dr abc',
          address: '',
          specialty: 'General Practice',
          terminationDate: null,
        },
      ];
      const panelListView = renderForTest(<PanelListView clinics={clinics} />);

      expect(panelListView.queryAllByType(TerminatedLabel).length).toBe(0);
    });
  });
});
