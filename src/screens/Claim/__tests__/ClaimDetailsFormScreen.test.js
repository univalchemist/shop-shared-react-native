import {
  CLAIM_TYPE_MODAL,
  CLAIM_REASON_MODAL,
  CLAIM_UPLOAD_DOCUMENTS,
} from '@routes';
import { renderForTest, renderForTestWithStore } from '@testUtils';
import React from 'react';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import messages from '@messages/en-HK.json';
import WalletBalancePanel, {
  WalletBalancePanelError,
  WalletBalanceSkeletonPlaceholder,
} from '@components/WalletBalancePanel';
import ClaimDetailsFormScreen from '../ClaimDetailsFormScreen';

jest.mock('react-native-modal-datetime-picker', () => {
  const { View } = require('react-native');
  return View;
});
const navigation = {
  navigate: jest.fn(),
};

const claimType = {
  categories: {
    all: [10, 20],
    byId: {
      1: {
        id: 1,
        code: 'Outpatient',
        claimCategory: 'Outpatient',
        claimTypeIds: [1],
        claimCategoryId: 1,
      },
      2: {
        id: 2,
        code: 'Wellness',
        claimCategory: 'Wellness',
        claimTypeIds: [2],
        claimCategoryId: 2,
      },
      10: {
        id: 10,
        code: 'Outpatient',
        claimCategory: 'Outpatient',
        claimTypeIds: [1],
        claimCategoryId: 1,
      },
      20: {
        id: 20,
        code: 'Wellness',
        claimCategory: 'Wellness',
        claimTypeIds: [2],
        claimCategoryId: 2,
      },
    },
  },
  types: {
    byId: {
      1: {
        id: 1,
        code: 'MO-GP',
        maxAmountPerClaim: 100,
        claimType: 'General practitioner',
        claimCategoryId: 1,
        claimReasonIds: [100],
        isInsuranceClaim: true,
        referralRequired: true,
      },
      2: {
        id: 2,
        code: 'PHYSIO',
        maxAmountPerClaim: 80,
        claimType: 'Physiotherapy',
        claimCategoryId: 2,
        claimReasonIds: [200],
        isInsuranceClaim: false,
        referralRequired: true,
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
      200: {
        id: 200,
        code: 'PHYSIO',
        claimReason: 'Physiotherapy',
      },
    },
  },
};

const initialState = {
  form: {
    claimDetailsForm: {
      values: {
        isMultiInsurer: true,
        claimTypeId: 2,
        selectedPatientId: 3,
        claimCategoryId: 2,
      },
    },
  },
  claimType,
  claimTypeId: 1,
  wallet: { balanceMap: {} },
  user: {
    membersMap: {
      3: {
        terminationDate: '2020-02-29T16:00:00',
      },
    },
  },
};

describe('ClaimDetailsFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all inputs on claim detail screen', () => {
    renderForTest(<ClaimDetailsFormScreen navigation={navigation} />, {
      initialState: {
        form: {
          claimDetailsForm: {
            values: {
              isMultiInsurer: true,
              claimTypeId: 2,
              selectedPatientId: 3,
            },
          },
        },
        claimType,
        wallet: { balanceMap: {} },
        user: {
          membersMap: {
            3: {
              terminationDate: '2020-02-29T16:00:00',
            },
          },
        },
      },
    });
  });

  it("should display wallet balance panel and wellness balance warning when the selected claimType' claimCategoryId is 2 (WELLNESS) and balance is zero", async () => {
    const initialState = {
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
            claimCategoryId: 2,
          },
        },
      },
      claimType,
      claimTypeId: 1,
      wallet: { balanceMap: {} },
    };

    const [screen] = renderForTestWithStore(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
        api: {
          fetchWallet: jest.fn(() =>
            Promise.resolve({
              data: {
                member: {
                  memberId: 3,
                  balance: 0,
                },
                dependents: [],
              },
            }),
          ),
        },
      },
    );
    await flushMicrotasksQueue();
    expect(screen.queryByType(WalletBalancePanel)).not.toBeNull();
    expect(
      screen.getByText(messages['claim.wellness.balance.warning']),
    ).toBeDefined();
  });

  it("should display wallet balance panel and not display wellness balance warning when the selected claimType's isInsuranceClaim is false and balance higher than zero", async () => {
    const initialState = {
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
          },
        },
      },
      claimType,
      wallet: { balanceMap: {} },
    };
    const [screen] = renderForTestWithStore(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
        api: {
          fetchWallet: jest.fn(() =>
            Promise.resolve({
              data: {
                member: {
                  memberId: 3,
                  balance: 10,
                },
                dependents: [],
              },
            }),
          ),
        },
      },
    );
    expect(screen.queryByType(WalletBalanceSkeletonPlaceholder)).not.toBeNull();

    await flushMicrotasksQueue();
    expect(screen.queryByType(WalletBalancePanel)).not.toBeNull();

    expect(
      screen.queryByText(messages['claim.wellness.balance.warning']),
    ).toBeNull();
  });

  it('should display error message when failing to retrieve wallet balance', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
          },
        },
      },
      claimType,
      wallet: { balanceMap: {} },
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
    };
    const [screen] = renderForTestWithStore(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
        api: {
          fetchWallet: jest.fn(() => Promise.reject()),
        },
      },
    );
    expect(screen.queryByType(WalletBalanceSkeletonPlaceholder)).not.toBeNull();

    await flushMicrotasksQueue();
    expect(screen.queryByType(WalletBalancePanelError)).not.toBeNull();

    expect(
      screen.queryByText(messages['claim.wellness.balance.warning']),
    ).toBeNull();
  });

  it('should display error message when wallet balance is undefined', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
          },
        },
      },
      claimType,
      wallet: { balanceMap: {} },
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
    };
    const [screen] = renderForTestWithStore(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
        api: {
          fetchWallet: jest.fn(() =>
            Promise.resolve({
              data: {
                member: {
                  memberId: 3,
                  balance: undefined,
                },
                dependents: [],
              },
            }),
          ),
        },
      },
    );
    expect(screen.queryByType(WalletBalanceSkeletonPlaceholder)).not.toBeNull();

    await flushMicrotasksQueue();
    expect(screen.queryByType(WalletBalancePanelError)).not.toBeNull();

    expect(
      screen.queryByText(messages['claim.wellness.balance.warning']),
    ).toBeNull();
  });

  it("should display claim amount instead of receipt amount when the selected claimType's isInsuranceClaim is false", () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
          },
        },
      },
      claimType,
      wallet: { balanceMap: { 3: 0 } },
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
    };
    const screen = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      { initialState },
    );

    const field = screen.getByProps({ name: 'receiptAmount' });

    expect(field).toBeDefined();
    expect(field.props.label).toEqual('Claim amount');
  });

  it('should not display checkbox and other insurer text input when the selected category name is wellness', () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 2,
            selectedPatientId: 3,
          },
        },
      },
      claimType,
      wallet: { balanceMap: { 3: 0 } },
      user: {
        membersMap: {
          3: {
            terminationDate: '2020-02-29T16:00:00',
          },
        },
      },
    };
    const screen = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      { initialState },
    );

    expect(screen.queryByProps({ name: 'isMultiInsurer' })).toBeNull();
    expect(screen.queryByProps({ name: 'otherInsurerAmount' })).toBeNull();
  });

  test('should navigate to claim CLAIM_UPLOAD_DOCUMENTS screen when click on "Upload document" button', async done => {
    const screen = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      { initialState },
    );
    const button = screen.getByProps({
      title: messages['claim.uploadDocuments'],
    });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_UPLOAD_DOCUMENTS);
    done();
  }, 30000);

  it('should navigate to claim consultation modal on pressing Consultation Type input', async () => {
    const { getByProps } = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    const input = getByProps({ name: 'claimType' });

    act(() => {
      fireEvent.press(input);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_TYPE_MODAL);
  });

  it('should navigate to claim reason modal on pressing ClaimReason input', async () => {
    const { getByProps } = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    const selectField = getByProps({ name: 'claimReason' });
    act(() => {
      fireEvent.press(selectField);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_REASON_MODAL);
  });

  it('should display a hint for the receipt amount', () => {
    const state = {
      ...initialState,
      form: {
        claimDetailsForm: {
          values: {
            isMultiInsurer: true,
            claimTypeId: 1,
            selectedPatientId: 3,
          },
        },
      },
    };
    const { getByProps } = renderForTest(
      <ClaimDetailsFormScreen navigation={navigation} />,
      {
        initialState: state,
      },
    );
    const receiptAmountField = getByProps({ hint: 'Maximum of HK$100.00' });

    expect(receiptAmountField).toBeDefined();
  });

  describe('field validations', () => {
    it('should validate the receiptAmount field for outpatient claims', () => {
      const state = {
        ...initialState,
        form: {
          claimDetailsForm: {
            values: {
              isMultiInsurer: true,
              claimTypeId: 1,
              selectedPatientId: 3,
            },
          },
        },
      };

      const { getByProps } = renderForTest(
        <ClaimDetailsFormScreen navigation={navigation} />,
        {
          initialState: state,
        },
      );

      const field = getByProps({ name: 'receiptAmount' });

      expect(field.props.validate[0]('abc')).toEqual(
        messages.moneyAmountInvalid,
      );
      expect(field.props.validate[0]('1')).toEqual('');

      expect(field.props.validate[0]('')).toEqual(
        messages.receiptAmountRequired,
      );
      expect(field.props.validate[0]('1')).toEqual('');

      expect(field.props.validate[1](101)).toEqual(
        'For amounts above HK$100.00 submit a physical claim form',
      );
      expect(field.props.validate[1](100)).toEqual('');
    });

    describe('wellness type claims', () => {
      const renderClaimFormForWellnessBalance = wellnessBalance => {
        const initialState = {
          form: {
            claimDetailsForm: {
              values: {
                isMultiInsurer: true,
                claimTypeId: 2,
                selectedPatientId: 3,
              },
            },
          },
          claimType,
          wallet: { balanceMap: { 3: wellnessBalance } },
          user: {
            membersMap: {
              3: {
                terminationDate: '2020-02-29T16:00:00',
              },
            },
          },
        };

        return renderForTest(
          <ClaimDetailsFormScreen navigation={navigation} />,
          {
            initialState,
          },
        );
      };
      it('should not show any validation messages when receiptAmount field is a valid amount', () => {
        const component = renderClaimFormForWellnessBalance(100);
        const field = component.getByProps({ name: 'receiptAmount' });

        expect(field.props.validate[0]('1')).toEqual('');
        expect(field.props.validate[1]('1')).toEqual('');
        expect(field.props.validate[1](1)).toEqual('');
      });

      it('should show a message when receiptAmount field is not a valid number', () => {
        const component = renderClaimFormForWellnessBalance(100);
        const field = component.getByProps({ name: 'receiptAmount' });

        expect(field.props.validate[0]('abc')).toEqual(
          messages.moneyAmountInvalid,
        );
      });

      it('should show a message that receiptAmount is required if no amount is entered', () => {
        const component = renderClaimFormForWellnessBalance(100);
        const field = component.getByProps({ name: 'receiptAmount' });

        expect(field.props.validate[0]('')).toEqual(
          messages.receiptAmountRequired,
        );
      });

      it('should show a message that a physical claim form is to be submitted when receiptAmount field is more than max amount', () => {
        const component = renderClaimFormForWellnessBalance(100);
        const field = component.getByProps({ name: 'receiptAmount' });

        expect(field.props.validate[1](81)).toEqual(
          'For amounts above HK$80.00 submit a physical claim form',
        );
        expect(field.props.validate[1](101)).toEqual(
          'For amounts above HK$80.00 submit a physical claim form',
        );
      });

      it('should not show a message when receiptAmount field is less than max amount but more than wellness balance amount', () => {
        const component = renderClaimFormForWellnessBalance(70);
        const field = component.getByProps({ name: 'receiptAmount' });

        expect(field.props.validate[1](75)).toEqual('');
      });
    });

    it('should validate the claimType field', () => {
      const { getByProps } = renderForTest(
        <ClaimDetailsFormScreen navigation={navigation} />,
        {
          initialState,
        },
      );

      const field = getByProps({ name: 'claimType' });
      expect(field.props.validate('')).toEqual('claimTypeRequired');
    });

    it('should validate the claimReason field', () => {
      const { getByProps } = renderForTest(
        <ClaimDetailsFormScreen navigation={navigation} />,
        {
          initialState,
        },
      );

      const field = getByProps({ name: 'claimReason' });
      expect(field.props.validate('')).toEqual('claimReasonRequired');
    });

    it.skip('should validate the otherInsurerAmount field', () => {
      const { getByProps } = renderForTest(
        <ClaimDetailsFormScreen navigation={navigation} />,
        {
          initialState,
        },
      );

      const field = getByProps({ name: 'otherInsurerAmount' });
      expect(field.props.validate[0]('abc')).toEqual(
        messages.moneyAmountInvalid,
      );
      expect(field.props.validate[1]('', { isMultiInsurer: true })).toEqual(
        messages.otherInsurerAmountRequired,
      );
      expect(
        field.props.validate[1](100, {
          isMultiInsurer: true,
          receiptAmount: 10,
        }),
      ).toEqual(messages.otherInsurerAmountMustBeLower);
    });
  });
});
