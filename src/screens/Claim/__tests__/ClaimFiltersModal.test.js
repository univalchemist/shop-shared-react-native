import React from 'react';
import { renderForTest, renderForTestWithStore } from '@testUtils';
import { CustomMultiselectCheckBox } from '@wrappers/components/form';
import ClaimFiltersModal, {
  ClaimFiltersModal as PureClaimFiltersModal,
} from '../ClaimFiltersModal';
import messages from '@messages/en-HK.json';
import { act, flushMicrotasksQueue } from 'react-native-testing-library';
import {
  SectionListSkeletonPlaceholder,
  ErrorPanel,
} from '@wrappers/components';

describe('ClaimFiltersModal', () => {
  const api = {
    getClaimFilters: jest.fn(() => Promise.resolve({})),
    fetchMemberProfile: jest.fn(() => Promise.resolve({})),
    updateClaimFilters: jest.fn(),
  };

  const initialState = {
    initialState: {
      claim: {
        filters: {
          claimCategoryFilters: [
            {
              code: 'outpatient',
              text: 'Outpatient',
            },
            {
              code: 'wellness',
              text: 'Wellness',
            },
          ],
          claimStatusFilters: [
            {
              code: 'PENDING',
              text: 'Pending',
            },
            {
              code: 'APPROVED',
              text: 'Approved',
            },
            {
              code: 'REJECTED',
              text: 'Rejected',
            },
            {
              code: 'REQUEST FOR INFORMATION',
              text: 'More information required',
            },
          ],
        },
      },
      user: {
        membersProfileOrder: ['3', '27'],
        membersMap: {
          '3': {
            fullName: 'William Brown',
            memberId: '3',
          },
          '27': {
            fullName: 'Catherine Brown',
            memberId: '27',
          },
        },
      },
    },
  };

  it('should render skeleton loader when isLoading', async () => {
    const component = renderForTest(<ClaimFiltersModal />, {
      ...initialState,
      api,
    });

    expect(
      component.getAllByType(SectionListSkeletonPlaceholder).length,
    ).toEqual(1);
    await flushMicrotasksQueue();
    expect(component.queryByType(SectionListSkeletonPlaceholder)).toBeNull();
  });

  it('should render error panel when api call fails', async () => {
    const deadApi = {
      getClaimFilters: jest.fn(() => Promise.reject({})),
      fetchMemberProfile: jest.fn(() => Promise.reject({})),
    };
    const component = renderForTest(<ClaimFiltersModal />, {
      ...initialState,
      deadApi,
    });

    await flushMicrotasksQueue();
    expect(component.getAllByType(ErrorPanel).length).toEqual(1);
  });

  it('should render MultiSelectCheckbox', async () => {
    const component = renderForTest(<ClaimFiltersModal />, {
      ...initialState,
      api,
    });
    await flushMicrotasksQueue();

    expect(component.queryAllByType(CustomMultiselectCheckBox).length).toBe(1);
  });

  it('should render MultiSelectCheckbox with a list of claim filters', async () => {
    const expected = [
      {
        title: messages['claim.claimFilters.claimCategoryFilters'],
        titleValue: 'claimCategoryFilters',
        label: 'Outpatient',
        value: 'outpatient',
      },
      {
        title: messages['claim.claimFilters.claimCategoryFilters'],
        titleValue: 'claimCategoryFilters',
        label: 'Wellness',
        value: 'wellness',
      },
      {
        title: messages['claim.claimFilters.claimStatusFilters'],
        titleValue: 'claimStatusFilters',
        label: 'Pending',
        value: 'PENDING',
      },
      {
        title: messages['claim.claimFilters.claimStatusFilters'],
        titleValue: 'claimStatusFilters',
        label: 'Approved',
        value: 'APPROVED',
      },
      {
        title: messages['claim.claimFilters.claimStatusFilters'],
        titleValue: 'claimStatusFilters',
        label: 'Rejected',
        value: 'REJECTED',
      },
      {
        title: messages['claim.claimFilters.patient'],
        titleValue: 'patient',
        label: 'William Brown',
        value: '3',
      },
      {
        title: messages['claim.claimFilters.patient'],
        titleValue: 'patient',
        label: 'Catherine Brown',
        value: '27',
      },
    ];

    const component = renderForTest(<ClaimFiltersModal />, {
      ...initialState,
      api,
    });
    await flushMicrotasksQueue();

    const customMultiCheckbox = component.queryAllByType(
      CustomMultiselectCheckBox,
    )[0];

    const customMultiCheckboxData = customMultiCheckbox.props.data;
    expect(customMultiCheckboxData).toEqual(expected);
  });

  it('should contain correct button labels', async () => {
    const component = renderForTest(<ClaimFiltersModal />, {
      ...initialState,
      api,
    });
    await flushMicrotasksQueue();

    const customMultiCheckbox = component.queryAllByType(
      CustomMultiselectCheckBox,
    )[0];

    expect(customMultiCheckbox.props.buttonLabel).toEqual(messages.showResults);

    expect(customMultiCheckbox.props.clearAllButtonLabel).toEqual(
      messages.clearAll,
    );
  });

  it('should trigger getClaimFilters', async () => {
    renderForTestWithStore(<ClaimFiltersModal />, {
      ...initialState,
      api,
    });

    await flushMicrotasksQueue();

    expect(api.getClaimFilters).toHaveBeenCalled();
  });

  it('should trigger navigation go back, updateClaimFilters, and getClaims when submit button is pressed', async () => {
    const navigation = {
      goBack: jest.fn(),
    };

    const updateClaimFilters = jest.fn();
    const getClaims = jest.fn();

    const component = renderForTest(
      <PureClaimFiltersModal
        navigation={navigation}
        membersMap={initialState.initialState.user.membersMap}
        membersProfileOrder={initialState.initialState.user.membersProfileOrder}
        updateClaimFilters={updateClaimFilters}
        getClaims={getClaims}
        getClaimFilters={jest.fn(() => Promise.resolve({}))}
        fetchMemberProfile={jest.fn(() => Promise.resolve({}))}
        typeAndStatusFilters={initialState.initialState.claim.filters}
      />,
    );

    await flushMicrotasksQueue();

    const customMultiSelectCheckBox = component.queryAllByType(
      CustomMultiselectCheckBox,
    )[0];

    const values = [
      { type: 'a', value: 'valueA' },
      { type: 'b', value: 'valueB' },
    ];
    act(() => {
      customMultiSelectCheckBox.props.onSubmit(values);
    });

    await flushMicrotasksQueue();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(updateClaimFilters).toHaveBeenCalledTimes(1);
    expect(updateClaimFilters).toHaveBeenCalledWith(values);
    expect(getClaims).toHaveBeenCalledTimes(1);

    act(() => {
      customMultiSelectCheckBox.props.onSubmit([]);
    });
    expect(updateClaimFilters).toHaveBeenCalledWith([]);
  });
});
