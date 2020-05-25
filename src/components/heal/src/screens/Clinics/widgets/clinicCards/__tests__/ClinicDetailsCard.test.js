import React from 'react';
import { Linking, TouchableHighlight } from 'react-native';
import { renderForTest } from '@testUtils';
import ClinicDetailsCard from '../ClinicDetailsCard';
import { CardContainer } from '../CardContainer';
import { Image } from '@wrappers/components';
import theme from '@theme';
import messages from '@messages/en-HK.json';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { phoneIcon, directionIcon } from '@images';
import { CLINIC_DETAILS } from '@routes';
import { TerminatedLabel } from '@screens/Panel';

const renderDetailsCard = ({ clinic = {}, navigation }) =>
  renderForTest(<ClinicDetailsCard clinic={clinic} navigation={navigation} />);

describe('ClinicDetailsCard', () => {
  beforeEach(() => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => {});
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.spyOn(Linking, 'openURL').mockRestore();
  });

  it('should render a CardContainer for consistent card style', () => {
    const detailsCard = renderDetailsCard({});

    expect(detailsCard.queryAllByType(CardContainer)).toBeDefined();
  });

  it('should render clinic name', () => {
    const clinic = {
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
    };
    const detailsCard = renderDetailsCard({ clinic });

    expect(detailsCard.getByText(clinic.name)).toBeDefined();
  });

  it('should display ellipsis at the end when there is more than 1 line for clinic name', () => {
    const clinic = {
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
      name: 'Clinic 1',
      qrCode: 'somecode',
    };
    const detailsCard = renderDetailsCard({ clinic });

    expect(detailsCard.queryByText('Clinic 1').props.numberOfLines).toBe(1);
    expect(detailsCard.queryByText('Clinic 1').props.ellipsizeMode).toBe(
      'tail',
    );
  });

  describe('terminated label', () => {
    beforeEach(() => {
      const FeatureToggle = require('@config/FeatureToggle').default;
      FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.turnOn();
    });
    it('should render a terminated label if terminated date is not null', () => {
      const clinic = {
        terminationDate: '28Sep2019',
      };

      const detailsCard = renderDetailsCard({ clinic });

      expect(detailsCard.queryAllByType(TerminatedLabel).length).toEqual(1);
    });

    it('should not render a terminated label if terminated date is null', () => {
      const clinic = {
        terminationDate: null,
      };

      const detailsCard = renderDetailsCard({ clinic });

      expect(detailsCard.queryAllByType(TerminatedLabel).length).toEqual(0);
    });
  });

  it('should render a call button with appropriate text', () => {
    const detailsCard = renderDetailsCard({});

    expect(
      detailsCard.queryAllByType(TouchableHighlight).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      detailsCard.getByText(messages['panelSearch.callButton']),
    ).toBeDefined();
  });

  it('should render call button with appropriate underlay color', () => {
    const detailsCard = renderDetailsCard({});

    expect(
      detailsCard.queryAllByType(TouchableHighlight)[1].props.underlayColor,
    ).toEqual(theme.colors.touchableOverlayColor);
  });

  it('should render call icon for call button', () => {
    const detailsCard = renderDetailsCard({});
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    expect(callButton.props.children.props.children[0].type).toEqual(Image);
    expect(callButton.props.children.props.children[0].props.source).toEqual(
      phoneIcon,
    );
  });

  it('should show prompt dialog when click call button', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      contactNumber1: '65 99991111',
      contactNumber2: '65 99991111',
      contactNumber3: '65 99991111',
    };
    const detailsCard = renderDetailsCard({ clinic });
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    await fireEvent.press(callButton);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith(
      `tel:${clinic.contactNumber1}`,
    );
  });

  it('should show prompt dialog when click call button when there is only one phone number', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      phoneNumber: '65 99991111',
    };
    const detailsCard = renderDetailsCard({ clinic });
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    await fireEvent.press(callButton);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith(`tel:${clinic.phoneNumber}`);
  });

  it('should show clinic details when the clinic is selected', async () => {
    const navigation = { navigate: jest.fn() };
    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      contactNumber1: '',
      contactNumber2: undefined,
      contactNumber3: '65 446668999',
    };

    const clinicDetailsCard = renderDetailsCard({ clinic, navigation });

    const clinicDetailsTouchArea = clinicDetailsCard.queryAllByType(
      TouchableHighlight,
    )[0];

    await fireEvent.press(clinicDetailsTouchArea);
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLINIC_DETAILS, {
      clinic,
    });
  });

  it('should use the first available contact number when clicking call button', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);

    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      contactNumber1: '',
      contactNumber2: undefined,
      contactNumber3: '65 446668999',
    };
    const detailsCard = renderDetailsCard({ clinic });
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    await fireEvent.press(callButton);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith(
      `tel:${clinic.contactNumber3}`,
    );
  });

  it('should not make call when there is no valid contact number and call button is clicked', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      contactNumber1: '',
      contactNumber2: undefined,
      contactNumber3: null,
    };
    const detailsCard = renderDetailsCard({ clinic });
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    await fireEvent.press(callButton);
    await flushMicrotasksQueue();

    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('should not make call when contact number is whitespace and call button is clicked', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const clinic = {
      name: 'Clinic Test',
      specialty: 'Type Test',
      contactNumber1: '   ',
    };
    const detailsCard = renderDetailsCard({ clinic });
    const callButton = detailsCard.queryAllByType(TouchableHighlight)[1];

    await fireEvent.press(callButton);
    await flushMicrotasksQueue();

    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('should render a direction button', () => {
    const detailsCard = renderDetailsCard({});

    expect(
      detailsCard.queryAllByType(TouchableHighlight).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      detailsCard.getByText(messages['panelSearch.directionButton']),
    ).toBeDefined();
  });

  it('should render a direction icon for direction button', () => {
    const detailsCard = renderDetailsCard({});
    const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

    expect(directionButton.props.children.props.children[0].type).toBe(Image);
    expect(directionButton.props.children.props.children[0].props.source).toBe(
      directionIcon,
    );
  });

  describe('upon pressing direction button,', () => {
    it('should first check if google map is installed', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
      const detailsCard = renderDetailsCard({});
      const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

      fireEvent.press(directionButton);
      await flushMicrotasksQueue();

      expect(Linking.canOpenURL).toHaveBeenCalledWith('comgooglemaps://');
    });

    it('should open google map app when google map is installed', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
      const clinic = {
        latitude: 1.4185901,
        longitude: 103.837701317,
      };

      const detailsCard = renderDetailsCard({ clinic });
      const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

      fireEvent.press(directionButton);
      await flushMicrotasksQueue();

      expect(Linking.openURL).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledWith(
        `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
      );
    });

    it('should check if apple map is installed when there is no google map', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(false);

      const detailsCard = renderDetailsCard({});
      const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

      fireEvent.press(directionButton);
      await flushMicrotasksQueue();

      expect(Linking.canOpenURL).toHaveBeenCalledTimes(2);
      expect(Linking.canOpenURL).toHaveBeenCalledWith('maps://');
    });

    it('should open apple map if google map is not installed and apple map is installed', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(false);
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValueOnce(true);
      const clinic = {
        latitude: 1.4185901,
        longitude: 103.837701317,
      };

      const detailsCard = renderDetailsCard({ clinic });
      const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

      fireEvent.press(directionButton);
      await flushMicrotasksQueue();

      expect(Linking.openURL).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledWith(
        `http://maps.apple.com/?daddr=${clinic.latitude},${clinic.longitude}`,
      );
    });

    it('should open google map link in browser if neither google map nor apple map is installed', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
      const clinic = {
        longitude: 2.5454,
        latitude: 56.2333,
      };

      const detailsCard = renderDetailsCard({ clinic });
      const directionButton = detailsCard.queryAllByType(TouchableHighlight)[2];

      fireEvent.press(directionButton);
      await flushMicrotasksQueue();

      expect(Linking.openURL).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).toHaveBeenCalledWith(
        `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
      );
    });
  });
});
