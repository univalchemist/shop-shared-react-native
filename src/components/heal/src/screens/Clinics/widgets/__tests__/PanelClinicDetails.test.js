import React from 'react';
import { renderForTest } from '@testUtils';
import { ListItem, Text, Image } from '@wrappers/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { Linking } from 'react-native';
import { warningIcon } from '@images';
import PanelClinicDetails from '../PanelClinicDetails';
import messages from '@messages/en-HK.json';
import showDirection from '../../utils/ShowDirection';

jest.mock('../../utils/ShowDirection', () => jest.fn());

const testClinic = {
  id: 23,
  name: 'Dr WhoDat',
  address: 'Somewhere Over There',
  specialty: 'Will help your back',
  consultationTimings: [
    {
      'Mon-Fri': ['10:00AM - 12:30PM', '3:00PM - 5:30PM'],
    },
    {
      'Sat-Sun': ['10:00AM - 12:00NN'],
    },
  ],
};

describe('PanelClinicDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PanelClinicDetails', async () => {
    const clinic = {
      ...testClinic,
      contactNumber1: '234 234',
      contactNumber2: '456 456',
      contactNumber3: '8989 8989',
      peakHour: 'never',
      language: 'English',
    };
    const route = {
      params: {
        selectedClinic: clinic,
      },
    };
    const panelClinicDetails = renderForTest(
      <PanelClinicDetails route={route} />,
    );

    expect(panelClinicDetails.toJSON()).toMatchSnapshot();
  });

  it('should call fetchSelectedClinicDetails and render the clinic details for all fields', async () => {
    const clinic = {
      ...testClinic,
      contactNumber1: '234 234',
      contactNumber2: '456 456',
      contactNumber3: '8989 8989',
      peakHour: 'never',
      language: 'English',
    };
    const route = {
      params: {
        selectedClinic: clinic,
      },
    };
    const { getAllByType } = renderForTest(
      <PanelClinicDetails route={route} />,
    );

    const listItems = getAllByType(ListItem);
    const textItems = getAllByType(Text);
    const textValues = textItems
      .map(item => item.props.children)
      .filter(item => item != undefined);

    expect(listItems.length).toBe(7);
    expect(textValues[0]).toBe(clinic.contactNumber1);
    expect(textValues[1]).toBe(clinic.contactNumber2);
    expect(textValues[2]).toBe(clinic.contactNumber3);
    expect(textValues[3]).toBe(clinic.address);
    expect(textValues[4]).toBe(messages['panelSearch.clinicType']);
    expect(textValues[5]).toBe(clinic.specialty);
    expect(textValues[6]).toBe('Mon-Fri');
    expect(textValues[7]).toBe(clinic.consultationTimings[0]['Mon-Fri'][0]);
    expect(textValues[8]).toBe(clinic.consultationTimings[0]['Mon-Fri'][1]);
    expect(textValues[9]).toBe('Sat-Sun');
    expect(textValues[10]).toBe(clinic.consultationTimings[1]['Sat-Sun'][0]);
    expect(textValues[11]).toBe(messages['panelSearch.peakHours']);
    expect(textValues[12]).toBe(clinic.peakHour);
    expect(textValues[13]).toBe(messages['panelSearch.languagesSpoken']);
    expect(textValues[14]).toBe(clinic.language);
  });

  it('should call fetchSelectedClinicDetails and render the clinic details for fields that are defined', async () => {
    const clinic = testClinic;
    const route = {
      params: {
        selectedClinic: clinic,
      },
    };
    const { getAllByType } = renderForTest(
      <PanelClinicDetails route={route} />,
    );

    const listItems = getAllByType(ListItem);
    const textItems = getAllByType(Text);
    const textValues = textItems
      .map(item => item.props.children)
      .filter(item => item != undefined);

    expect(listItems.length).toBe(3);
    expect(textValues[0]).toBe(clinic.address);
    expect(textValues[1]).toBe(messages['panelSearch.clinicType']);
    expect(textValues[2]).toBe(clinic.specialty);
    expect(textValues[3]).toBe('Mon-Fri');
    expect(textValues[4]).toBe(clinic.consultationTimings[0]['Mon-Fri'][0]);
    expect(textValues[5]).toBe(clinic.consultationTimings[0]['Mon-Fri'][1]);
    expect(textValues[6]).toBe('Sat-Sun');
    expect(textValues[7]).toBe(clinic.consultationTimings[1]['Sat-Sun'][0]);
  });

  it('should call fetchSelectedClinicDetails and render the clinic details when consultationtimings is empty', async () => {
    const clinic = {
      id: 23,
      name: 'Dr WhoDat',
      address: 'Somewhere Over There',
      specialty: 'Will help your back',
      consultationTimings: [],
    };
    const route = {
      params: {
        selectedClinic: clinic,
      },
    };
    const { getAllByType } = renderForTest(
      <PanelClinicDetails route={route} />,
    );

    const listItems = getAllByType(ListItem);
    const textItems = getAllByType(Text);
    const textValues = textItems
      .map(item => item.props.children)
      .filter(item => item != undefined);

    expect(listItems.length).toBe(2);
    expect(textValues[0]).toBe(clinic.address);
    expect(textValues[1]).toBe(messages['panelSearch.clinicType']);
    expect(textValues[2]).toBe(clinic.specialty);
    expect(textValues[3]).toBe(undefined);
  });

  it('should call tryOpeningLink when call is clicked', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());

    const clinic = {
      ...testClinic,
      contactNumber1: '234 234',
    };
    const route = {
      params: {
        selectedClinic: clinic,
      },
    };
    const Component = renderForTest(<PanelClinicDetails route={route} />);

    await flushMicrotasksQueue();
    const phoneNumber = Component.queryAllByType(ListItem)[0];
    await fireEvent.press(phoneNumber);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith(`tel:234 234`);
  });

  it('should call showDirection when show direction is clicked', async () => {
    const route = {
      params: {
        selectedClinic: testClinic,
      },
    };
    const Component = renderForTest(<PanelClinicDetails route={route} />);

    await flushMicrotasksQueue();
    const showDirectionButton = Component.queryAllByType(ListItem)[0];
    await fireEvent.press(showDirectionButton);
    await flushMicrotasksQueue();

    expect(showDirection).toHaveBeenCalledTimes(1);
  });

  describe('terminated label', () => {
    beforeEach(() => {
      const FeatureToggle = require('@config/FeatureToggle').default;
      FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.turnOn();
    });

    it('should show terminated text if terminationDate is not null', async () => {
      const clinic = {
        ...testClinic,
        terminationDate: '30Sep2019',
      };
      const route = {
        params: {
          selectedClinic: clinic,
        },
      };
      const panelClinicDetails = renderForTest(
        <PanelClinicDetails route={route} />,
      );

      expect(
        panelClinicDetails.queryAllByText(
          messages['panelSearch.terminationText'],
        ).length,
      ).toBe(1);
    });

    it('should show terminated text if terminationDate is not null', async () => {
      const clinic = {
        ...testClinic,
        terminationDate: '30Sep2019',
      };
      const route = {
        params: {
          selectedClinic: clinic,
        },
      };
      const panelClinicDetails = renderForTest(
        <PanelClinicDetails route={route} />,
      );

      expect(
        panelClinicDetails.queryAllByText(
          messages['panelSearch.terminationText'],
        ).length,
      ).toBe(1);
    });

    it('should show warning icon if terminationDate is not null', async () => {
      const clinic = {
        ...testClinic,
        terminationDate: '30Sep2019',
      };
      const route = {
        params: {
          selectedClinic: clinic,
        },
      };
      const panelClinicDetails = renderForTest(
        <PanelClinicDetails route={route} />,
      );

      const icon = panelClinicDetails.queryAllByType(Image);

      expect(icon[0].props.source).toBe(warningIcon);
    });

    it('should not show terminated text if terminationDate is null', async () => {
      const clinic = {
        ...testClinic,
        terminationDate: null,
      };
      const route = {
        params: {
          selectedClinic: clinic,
        },
      };
      const panelClinicDetails = renderForTest(
        <PanelClinicDetails route={route} />,
      );

      expect(
        panelClinicDetails.queryAllByText(
          messages['panelSearch.terminationText'],
        ).length,
      ).toBe(0);
    });
  });
});
