import { render } from '@testUtils';
import React from 'react';
import ClaimsListScreenDependent from '../ClaimsListScreenDependent';
import { ClaimListSkeletonPlaceholder } from '../ClaimsListScreen';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import messages from '@messages/en-HK.json';
import { ContainerText } from '@screens/Claim/ClaimsListScreenDependent';
import { Box } from '@cxa-rn/components';

const initialState = {
  user: {
    clientId: 'testclient',
    userId: '3',
    membersMap: {
      '3': {
        fullName: 'Employee 3',
      },
      '4': {
        fullName: 'Dependent 4',
      },
    },
  },
};

describe('ClaimsListScreenDependent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a loader when claims data is loading', () => {
    const [Component] = render(<ClaimsListScreenDependent />, {
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [],
          }),
      },
    });
    expect(Component.getByType(ClaimListSkeletonPlaceholder)).toBeDefined();
  });

  it('should render no claims text, image and floating action button when there are no claims data available for dependent', async () => {
    const [Component] = render(<ClaimsListScreenDependent />, {
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [],
          }),
      },
      initialState: {
        user: {
          role: 'dependent',
        },
      },
    });
    await flushMicrotasksQueue();

    const floatingActionButton = Component.queryByProps({
      testID: 'iconIcon',
    });
    const noClaimsText = Component.queryByText(
      'Online claims submission is not available for you. Please ask your spouse/parent to make an online claim on your behalf',
    );
    const noClaimsTextExtra = Component.queryByText(
      'You are able to make a claim yourself by submitting a',
    );
    const noClaimsTextExtraPhysicalForm = Component.queryByText(
      'physical claims form',
    );
    const noClaimsImage = Component.getByType('Image');
    expect(floatingActionButton).toBeNull();
    expect(noClaimsText).toBeDefined();
    expect(noClaimsTextExtra).toBeDefined();
    expect(noClaimsTextExtraPhysicalForm).toBeDefined();
    expect(noClaimsImage).toBeDefined();
  });

  it('should render History claims section list when there are approved claims data available', async () => {
    const [Component] = render(<ClaimsListScreenDependent />, {
      initialState,
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [
              {
                receiptDate: '2019-12-04T06:20:30.61Z',
                claimId: '1',
                categoryCode: 'General Medical Practitioner',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'Approved',
                statusCode: 'APPROVED',
                approvedAmount: 5,
                amount: 5,
                memberId: '3',
                claimantId: '3',
                documents: {
                  receipts: [],
                  referrals: [],
                },
              },
            ],
          }),
      },
    });
    await flushMicrotasksQueue();
    const historyTitle = Component.getByText(
      messages['claim.claimsListSection.history'],
    );
    expect(historyTitle).toBeDefined();
    // const approvedTitle = Component.getByText('Approved');
    // expect(approvedTitle).toBeDefined();

    const claimItemName = Component.getByText('General Medical Practitioner');
    expect(claimItemName).toBeDefined();
    expect(Component.toJSON()).toMatchSnapshot();
  });

  // it('should render rejected claims section list when there are rejected claims data available', async () => {
  //   const [Component] = render(<ClaimsListScreenDependent />, {
  //     initialState,
  //     api: {
  //       getClaims: () =>
  //         Promise.resolve({
  //           data: [
  //             {
  //               receiptDate: '2019-12-04T06:20:30.61Z',
  //               claimId: '1',
  //               categoryCode: 'General Medical Practitioner',
  //               createdOn: '2019-04-23T06:20:30.61Z',
  //               status: 'Rejected',
  //               statusCode: 'REJECTED',
  //               approvedAmount: 5,
  //               amount: 5,
  //               memberId: '3',
  //               claimantId: '3',
  //               documents: {
  //                 receipts: [],
  //                 referrals: [],
  //               },
  //             },
  //           ],
  //         }),
  //     },
  //   });
  //   await flushMicrotasksQueue();
  //
  //   const rejectedTitle = Component.getByText('Rejected');
  //   expect(rejectedTitle).toBeDefined();
  //
  //   const claimItemName = Component.getByText('General Medical Practitioner');
  //   expect(claimItemName).toBeDefined();
  //   expect(Component.toJSON()).toMatchSnapshot();
  // });

  it('should render processing claims section list when there are processing claims data available', async () => {
    const [Component] = render(<ClaimsListScreenDependent />, {
      initialState,
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [
              {
                claimId: '1',
                categoryCode: 'General Medical Practitioner',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'Processing',
                statusCode: 'PROCESSING',
                amount: 5,
                memberId: '3',
                claimantId: '3',
                documents: {
                  receipts: [],
                  referrals: [],
                },
              },
            ],
          }),
      },
    });
    await flushMicrotasksQueue();

    const pendingTitle = Component.getByText('Processing');
    expect(pendingTitle).toBeDefined();
    const claimItemName = Component.getByText('General Medical Practitioner');
    expect(claimItemName).toBeDefined();
  });

  it('should render approved, rejected and processing claims section list when both data available', async () => {
    const [Component] = render(<ClaimsListScreenDependent />, {
      initialState,
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [
              {
                claimId: '1',
                categoryCode: 'General Medical Practitioner',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'Processing',
                statusCode: 'PROCESSING',
                amount: 5,
                memberId: '3',
                claimantId: '3',
                documents: {
                  receipts: [],
                  referrals: [],
                },
              },
              {
                claimId: '2',
                categoryCode: 'Specialist Consultation',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'Approved',
                statusCode: 'APPROVED',
                amount: 50,
                memberId: '3',
                claimantId: '3',
                documents: {
                  receipts: [],
                  referrals: [],
                },
              },
              {
                claimId: '3',
                categoryCode: 'Dental',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'Rejected',
                statusCode: 'REJECTED',
                amount: 50,
                memberId: '3',
                claimantId: '4',
                documents: {
                  receipts: [],
                  referrals: [],
                },
              },
            ],
          }),
      },
    });
    await flushMicrotasksQueue();
    const historyTitle = Component.getByText(
      messages['claim.claimsListSection.history'],
    );
    expect(historyTitle).toBeDefined();

    const pendingTitle = Component.getByText('Processing');
    expect(pendingTitle).toBeDefined();
    const claimItemName = Component.getByText('General Medical Practitioner');
    expect(claimItemName).toBeDefined();
    const claimItemNameApproved = Component.getByText(
      'Specialist Consultation',
    );
    expect(claimItemNameApproved).toBeDefined();

    const pendingIcon = Component.getByProps({ name: 'access-time' });
    expect(pendingIcon).toBeDefined();
    const approvedIcon = Component.getByProps({ name: 'check-circle-outline' });
    expect(approvedIcon).toBeDefined();
    const rejectedIcon = Component.getByProps({ name: 'highlight-off' });
    expect(rejectedIcon).toBeDefined();

    const claimantName = Component.getByText('(Dependent 4)');
    expect(claimantName).toBeDefined();
  });

  it('ContainerText should render properly when no  props top pass', () => {
    const [Component] = render(<ContainerText />);
    const box = Component.getByType(Box);
    expect(box.props.marginTop).toEqual(undefined);
    expect(box.props.marginBottom).toEqual(undefined);
  });
});
