import { render } from '@testUtils';
import React from 'react';
import ClaimsListScreen, {
  ClaimListSkeletonPlaceholder,
} from '../ClaimsListScreen';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { CLAIM_PATIENT_DETAILS } from '@routes';
import { SectionList } from 'react-native';
import messages from '@messages/en-HK.json';
import navigation from '@testUtils/__mocks__/navigation';

const claim = {
  processing: {
    orderAll: [],
  },
  approved: {
    orderAll: [],
  },
  rejected: {
    orderAll: [],
  },
  lastSubmittedClaim: { message: null, id: null },
  benefitPlanYear: null,
  claimsMap: {},
  selectedClaimFilters: [],
};

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

describe('ClaimsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to claim patient detail screen when click on "Make a Claim" button', async () => {
    const [Component] = render(<ClaimsListScreen navigation={navigation} />, {
      initialState: {
        claim: {
          ...claim,
          processing: { ...claim.processing },
          approved: { ...claim.approved },
          rejected: { ...claim.rejected },
          completed: { ...claim.approved, ...claim.rejected },
        },
        user: initialState.user,
      },
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [],
          }),
      },
    });
    const floatingActionButton = Component.getByProps({
      testID: 'iconIcon',
    });
    await fireEvent.press(floatingActionButton);
    await flushMicrotasksQueue();
    expect(navigation.navigate).toBeCalledWith(CLAIM_PATIENT_DETAILS);
  });

  it('should render a loader when claims data is loading', () => {
    const [Component] = render(<ClaimsListScreen />, {
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [],
          }),
      },
    });
    expect(Component.getByType(ClaimListSkeletonPlaceholder)).toBeDefined();
  });

  it('should render no claims text and image when there are no claims data available', async () => {
    const [Component] = render(<ClaimsListScreen />, {
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [],
          }),
      },
      initialState,
    });
    await flushMicrotasksQueue();

    const noClaimsText = Component.getByText('No claims made');
    const noClaimsImage = Component.getByType('Image');
    expect(noClaimsText).toBeDefined();
    expect(noClaimsImage).toBeDefined();
  });

  it('should render history claims section list when there are approved claims data available', async () => {
    const [Component] = render(<ClaimsListScreen />, {
      initialState,
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [
              {
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

    const approved = Component.getByText(
      messages['claim.claimsListSection.history'],
    );
    expect(approved).toBeDefined();

    const claimItemName = Component.getByText('General Medical Practitioner');
    expect(claimItemName).toBeDefined();
    //expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should render request-for-information claims section list when there are request-for-information claims data available', async () => {
    const [Component] = render(<ClaimsListScreen />, {
      initialState,
      api: {
        getClaims: () =>
          Promise.resolve({
            data: [
              {
                claimId: '1',
                categoryCode: 'General Medical Practitioner',
                createdOn: '2019-04-23T06:20:30.61Z',
                status: 'REQUEST FOR INFORMATION',
                statusCode: 'REQUEST FOR INFORMATION',
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

    const pendingTitle = Component.getByText(
      messages['claim.claimsListSection.processing'],
    );
    expect(pendingTitle).toBeDefined();
    const claimItemName = Component.queryAllByText(
      'General Medical Practitioner',
    );
    const moreInformationPrompt = Component.queryAllByText(
      messages['claim.moreInformation'],
    );
    expect(claimItemName.length).toBe(1);
    expect(moreInformationPrompt.length).toBe(1);
  });

  it('should render pendings claims section list when there are pending claims data available', async () => {
    const [Component] = render(<ClaimsListScreen />, {
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

    const pendingTitle = Component.getByText(
      messages['claim.claimsListSection.processing'],
    );
    expect(pendingTitle).toBeDefined();
    const claimItemName = Component.queryAllByText(
      'General Medical Practitioner',
    );
    expect(claimItemName.length).toBe(1);
  });

  it('should render approved, rejected and processing claims section list when both data available', async () => {
    const [Component] = render(<ClaimsListScreen />, {
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
    const pendingTitle = Component.getByText(
      messages['claim.claimsListSection.processing'],
    );
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

  describe('implement pull to refresh', () => {
    it('should fetch claims when pull to refresh has been triggered', async () => {
      const getClaims = jest.fn(() =>
        Promise.resolve({
          data: [
            {
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
      );
      const [Component] = render(<ClaimsListScreen />, {
        initialState,
        api: {
          getClaims,
        },
      });
      await flushMicrotasksQueue();

      const sectionList = Component.getByType(SectionList);

      sectionList.props.onRefresh();
      await flushMicrotasksQueue();

      expect(getClaims).toHaveBeenCalledTimes(2);
    });
  });
});
