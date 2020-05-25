import React from 'react';
import { renderForTest } from '@testUtils';
import { ListItem, Text, Image } from '@wrappers/components';
import { NearMeButton } from '../NearMeButton';
import messages from '@messages/en-HK.json';
import { FilterTypes } from '../../utils/filter';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import * as GrantLocationPermission from '../../utils/GrantLocationPermission';
import { nonSelectedMapMarkerIcon } from '@images';

describe('Near me button', () => {
  const updateSearchTerm = jest.fn();
  const updateButtonPressCount = jest.fn();
  const updateSuccessfulSearchTerm = jest.fn();
  const buttonPressCount = 0;
  const updateFilter = jest.fn();
  let nearMeButton;

  beforeAll(() => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        requestAuthorization: jest.fn(),
      },
    };

    nearMeButton = renderForTest(
      <NearMeButton
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        buttonPressCount={buttonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
      />,
    );
  });

  it('should render a list item', () => {
    const listItem = nearMeButton.queryAllByType(ListItem);

    expect(listItem.length).toBe(1);
  });

  it('should render show near me text', () => {
    const text = nearMeButton.queryAllByType(Text)[0];

    expect(text.props.children).toBe(messages['panelSearch.nearMe']);
  });

  it('should render near me icon', () => {
    const listItem = nearMeButton.queryAllByType(ListItem)[0];

    expect(listItem.props.leftIcon.type).toBe(Image);
    expect(listItem.props.leftIcon.props.source).toBe(nonSelectedMapMarkerIcon);
  });

  describe('on press', () => {
    beforeAll(async () => {
      const listItem = nearMeButton.queryAllByType(ListItem)[0];
      act(() => {
        fireEvent.press(listItem);
      });
      await flushMicrotasksQueue();
    });

    it('should call update search term to near me', async () => {
      expect(updateSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSearchTerm).toHaveBeenCalledWith(
        messages['panelSearch.nearMe'],
      );
    });

    it('should update successful search term to near me', () => {
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledWith(
        messages['panelSearch.nearMe'],
      );
    });

    it('should increment button count to force rerender upon multiple press', () => {
      expect(updateButtonPressCount).toHaveBeenCalledTimes(1);
    });

    it('should get user current location', () => {
      expect(
        global.navigator.geolocation.getCurrentPosition,
      ).toHaveBeenCalled();
    });

    it('should call add near me filter upon getting current location', async () => {
      const mockDeviceLocation = {
        coords: {
          latitude: 10.2,
          longitude: 9.11,
        },
      };
      act(() => {
        navigator.geolocation.getCurrentPosition.mock.calls[0][0](
          mockDeviceLocation,
        );
      });
      await flushMicrotasksQueue();

      expect(updateFilter).toHaveBeenCalledWith({
        type: FilterTypes.NEAR_ME,
        values: [
          mockDeviceLocation.coords.longitude,
          mockDeviceLocation.coords.latitude,
        ],
      });
    });

    it('should request for location permission when unable to get user position', async () => {
      jest
        .spyOn(GrantLocationPermission, 'requestPermission')
        .mockReturnValue(false);
      act(() => {
        global.navigator.geolocation.getCurrentPosition.mock.calls[0][1]();
      });
      await flushMicrotasksQueue();

      expect(GrantLocationPermission.requestPermission).toHaveBeenCalled();
    });
  });
});
