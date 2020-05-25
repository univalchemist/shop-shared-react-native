import React from 'react';
import ClaimsListScreenHeader from '../ClaimsListScreenHeader';
import { renderForTest } from '@testUtils';
import { Image } from '@wrappers/components';
import { TouchableOpacity } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { filterImage, selectedFilterImage } from '@images';
import messages from '@messages/en-HK';

describe('ClaimsListScreenHeader', () => {
  const navigation = { navigate: jest.fn() };
  const FeatureToggle = require('@config/FeatureToggle').default;

  const screenProps = {
    intl: {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    },
  };

  beforeEach(async () => {
    FeatureToggle.ENABLE_CLAIMS_FILTER.turnOn();
  });

  it('should render filter button on header title', async () => {
    FeatureToggle.ENABLE_CLAIMS_FILTER.turnOff();
    const headerComponent = renderForTest(
      <ClaimsListScreenHeader
        screenProps={screenProps}
        navigation={navigation}
      />,
      {
        initialState: {
          claim: {
            selectedClaimFilters: [],
            claimsMap: {},
          },
        },
      },
    );
    expect(headerComponent.queryAllByType(TouchableOpacity).length).toBe(0);
  });

  it('should render the FilterImage when filter is not selected', () => {
    const headerComponent = renderForTest(
      <ClaimsListScreenHeader
        screenProps={screenProps}
        navigation={navigation}
      />,
      {
        initialState: {
          claim: {
            selectedClaimFilters: [],
            claimsMap: {},
          },
        },
      },
    );
    expect(headerComponent.queryAllByType(Image).length).toBe(1);
    expect(headerComponent.queryAllByType(Image)[0].props.source).toBe(
      filterImage,
    );
  });

  it('should render the selectedFilterImage when filter is selected', () => {
    const headerComponent = renderForTest(
      <ClaimsListScreenHeader
        screenProps={screenProps}
        navigation={navigation}
      />,
      {
        initialState: {
          claim: {
            selectedClaimFilters: ['approved'],
            claimsMap: {},
          },
        },
      },
    );
    expect(headerComponent.queryAllByType(Image).length).toBe(1);

    expect(headerComponent.queryAllByType(Image)[0].props.source).toBe(
      selectedFilterImage,
    );
  });

  it('should navigate to ClaimFiltersModal when button is pressed', async () => {
    const headerComponent = renderForTest(
      <ClaimsListScreenHeader
        screenProps={screenProps}
        navigation={navigation}
      />,
      {
        initialState: {
          claim: {
            selectedClaimFilters: [],
            claimsMap: {},
          },
        },
      },
    );
    const button = headerComponent.queryAllByType(TouchableOpacity)[0];

    fireEvent.press(button);

    await flushMicrotasksQueue();

    expect(navigation.navigate).toBeCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('ClaimFiltersModal');
  });
});
