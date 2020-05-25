import { renderForTest } from '@testUtils';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
jest.useFakeTimers();
import ClaimReasonModal from '../ClaimReasonModal';

const claimType = {
  categories: {
    all: [],
    byId: {},
  },
  types: {
    byId: {
      1: {
        id: 1,
        code: 'MO-GP',
        claimType: 'General practitioner',
        claimReasonIds: [100],
      },
    },
  },
  reasons: {
    byId: {
      100: {
        id: 100,
        code: 'COLIC',
        claimReason: 'Abdominal Colic',
      },
    },
  },
};
const claimTypeOther = {
  categories: {
    all: [],
    byId: {},
  },
  types: {
    byId: {
      1: {
        id: 1,
        code: 'MO-GP',
        claimType: 'General practitioner',
        claimReasonIds: [100, 101],
      },
      2: {
        id: 2,
        code: 'MO-GP',
        claimType: 'General practitioner',
        claimReasonIds: [101],
      },
    },
  },
  reasons: {
    byId: {
      100: {
        id: 100,
        code: 'OTHERS',
        claimReason: 'Abdominal Colic',
      },
      101: {
        id: 101,
        code: 'MO-GP',
        claimReason: 'Abdominal Colic',
      },
    },
  },
};

const navigation = {
  navigate: jest.fn(),
  addListener: jest.fn(),
  goBack: jest.fn(),
};

describe('ClaimReasonModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    const form = {
      claimDetailsForm: {
        values: {
          claimTypeId: 1,
          claimReason: null,
        },
      },
    };
    const component = renderForTest(
      <ClaimReasonModal navigation={navigation} />,
      {
        initialState: { claimType, form },
      },
    );
    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should indicate the selected claim field', async () => {
    const form = {
      claimDetailsForm: {
        values: {
          claimTypeId: 1,
          claimReason: 100,
        },
      },
    };
    const component = renderForTest(
      <ClaimReasonModal navigation={navigation} />,
      {
        initialState: {
          claimType: claimTypeOther,
          form,
          claimTypeId: 1,
        },
      },
    );
    const firstItem = component.getAllByType(TouchableHighlight)[0];
    act(() => {
      fireEvent.press(firstItem);
    });
    await flushMicrotasksQueue();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(component).toMatchSnapshot();
  });

  it('should navigate back', async () => {
    const form = {
      claimDetailsForm: {
        values: {
          claimTypeId: 1,
          claimReason: 100,
        },
      },
    };
    const patientDetailScreen = renderForTest(
      <ClaimReasonModal navigation={navigation} />,
      {
        initialState: {
          claimType,
          form,
        },
      },
    );
    const firstItem = patientDetailScreen.getAllByType(TouchableHighlight)[0];
    act(() => {
      fireEvent.press(firstItem);
    });
    await flushMicrotasksQueue();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});
