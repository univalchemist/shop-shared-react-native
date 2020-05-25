import React from 'react';
import { render } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ClaimTypeModal from '../ClaimTypeModal';

const navigation = {
  addListener: jest.fn(),
  navigate: jest.fn(),
};

describe('ClaimTypeModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should indicate the selected claim item', async () => {
    const [Component] = render(<ClaimTypeModal navigation={navigation} />, {
      initialState: {
        form: {
          claimDetailsForm: {
            values: { claimTypeId: 1 },
          },
        },
        claimType: {
          categories: {
            all: [1],
            byId: {
              1: {
                claimCategory: 'Outpatient',
                claimTypeIds: [1],
                code: 'outpatient',
                displayOrder: 1,
                id: 1,
                isInsuranceClaim: true,
              },
            },
          },
          reasons: {
            byId: {
              1: { claimReason: 'Abdominal Colic', code: 'COLIC', id: 1 },
            },
          },
          types: {
            byId: {
              1: {
                claimCategoryId: 1,
                claimReasonIds: [1],
                claimType: 'General practitioner',
                code: 'MO-GP',
                id: 1,
                isInsuranceClaim: true,
                maxAmountPerClaim: 800,
                referralRequired: false,
              },
            },
          },
        },
      },
    });
    await flushMicrotasksQueue();

    const selection = Component.getByText('General practitioner');
    await fireEvent.press(selection);
    await flushMicrotasksQueue();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});
