import reducer from '../reducer';
import * as types from '../types';

jest.mock('@services/secureStore', () => ({
  save: jest.fn(),
  fetch: jest.fn(),
}));

describe('Reducer Users', () => {
  it('should handle LOGIN_SUCCESS action for employee', () => {
    expect(
      reducer(undefined, {
        type: types.LOGIN_SUCCESS,
        payload: {
          clientId: 'testclient',
          userId: '3',
          username: 'test@email.com',
        },
      }),
    ).toMatchObject({
      clientId: 'testclient',
      userId: '3',
      username: 'test@email.com',
    });
  });

  it('should handle LOGIN_SUCCESS action for dependent spouse', () => {
    expect(
      reducer(undefined, {
        type: types.LOGIN_SUCCESS,
        payload: {
          clientId: 'testclient',
          userId: '3',
          username: 'test@email.com',
        },
      }),
    ).toMatchObject({
      clientId: 'testclient',
      userId: '3',
      username: 'test@email.com',
    });
  });

  it('should handle LOGIN_SUCCESS action for dependent child', () => {
    expect(
      reducer(undefined, {
        type: types.LOGIN_SUCCESS,
        payload: {
          clientId: 'testclient',
          userId: '3',
          username: 'test@email.com',
        },
      }),
    ).toMatchObject({
      clientId: 'testclient',
      userId: '3',
      username: 'test@email.com',
    });
  });

  it('should update the preferred locale state', () => {
    const action = {
      type: types.UPDATE_MEMBER_PROFILE_SUCCESS,
      payload: {
        preferredLocale: 'zh-HK',
      },
    };

    expect(reducer(undefined, action)).toMatchObject({
      preferredLocale: 'zh-HK',
    });
  });

  it('should handle GET_MEMBER_PROFILE_SUCCESS action for employee', () => {
    expect(
      reducer(undefined, {
        type: types.GET_MEMBER_PROFILE_SUCCESS,
        payload: {
          clientId: 'testclient',
          preferredLocale: 'en-HK',
          relationships: [
            {
              memberId: '2',
              role: 'Dependent',
              relationshipToEmployee: 'Spouse',
              relationshipCategory: 'Spouse',
            },
          ],
          relationshipToEmployee: 'Self',
          role: 'Employee',
          memberId: '3',
        },
      }),
    ).toMatchObject({
      preferredLocale: 'en-HK',
      membersMap: {
        '2': {
          memberId: '2',
          role: 'Dependent',
          relationshipToEmployee: 'Spouse',
          relationshipCategory: 'Spouse',
        },
        '3': {
          memberId: '3',
          role: 'Employee',
          relationshipToEmployee: 'Self',
        },
      },
      membersProfileOrder: ['3', '2'],
    });
  });

  it('should handle GET_MEMBER_PROFILE_SUCCESS action for dependent spouse', () => {
    expect(
      reducer(undefined, {
        type: types.GET_MEMBER_PROFILE_SUCCESS,
        payload: {
          clientId: 'testclient',
          preferredLocale: 'en-HK',
          relationships: [
            {
              memberId: '2',
              username: 'test@mail.com',
              role: 'Employee',
              relationshipToEmployee: 'Self',
              relationshipCategory: 'Self',
            },
          ],
          relationshipToEmployee: 'Spouse',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          memberId: '3',
        },
      }),
    ).toMatchObject({
      preferredLocale: 'en-HK',
      membersMap: {
        '3': {
          memberId: '3',
          role: 'Dependent',
          relationshipToEmployee: 'Spouse',
          relationshipCategory: 'Spouse',
        },
        '2': {
          memberId: '2',
          role: 'Employee',
          relationshipToEmployee: 'Self',
          relationshipCategory: 'Self',
        },
      },
      membersProfileOrder: ['2', '3'],
    });
  });

  it('should handle GET_MEMBER_PROFILE_SUCCESS action for dependent child', () => {
    expect(
      reducer(undefined, {
        type: types.GET_MEMBER_PROFILE_SUCCESS,
        payload: {
          clientId: 'testclient',
          preferredLocale: 'en-HK',
          relationships: [
            {
              memberId: '2',
              role: 'Employee',
              relationshipToEmployee: 'Self',
              relationshipCategory: 'Self',
            },
          ],
          relationshipToEmployee: 'Child',
          relationshipCategory: 'Child',
          role: 'Dependent',
          memberId: '3',
        },
      }),
    ).toMatchObject({
      preferredLocale: 'en-HK',
      membersMap: {
        '3': {
          memberId: '3',
          role: 'Dependent',
          relationshipToEmployee: 'Child',
          relationshipCategory: 'Child',
        },
        '2': {
          memberId: '2',
          role: 'Employee',
          relationshipToEmployee: 'Self',
          relationshipCategory: 'Self',
        },
      },
      membersProfileOrder: ['2', '3'],
    });
  });

  it('should handle UPDATE_EDM_OPTED_OUT_START', () => {
    expect(
      reducer(undefined, {
        type: types.UPDATE_EDM_OPTED_OUT_START,
      }),
    ).toMatchObject({
      isEdmOptedOut: true,
    });
  });

  it('should handle UPDATE_EDM_OPTED_OUT_ERROR', () => {
    expect(
      reducer(undefined, {
        type: types.UPDATE_EDM_OPTED_OUT_ERROR,
      }),
    ).toMatchObject({
      isEdmOptedOut: true,
    });
  });

  it('should handle UPDATE_EDM_OPTED_OUT_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: types.UPDATE_EDM_OPTED_OUT_SUCCESS,
        payload: {
          isEdmOptedOut: false,
        },
      }),
    ).toMatchObject({
      isEdmOptedOut: false,
    });
  });

  it('should handle UPDATE_AGREEMENT_TERMS_CONDITIONS_SUCCESS', () => {
    expect(
      reducer(undefined, {
        type: types.UPDATE_AGREEMENT_TERMS_CONDITIONS_SUCCESS,
        payload: {
          isTermsAccepted: true,
          isEdmOptedOut: false,
        },
      }),
    ).toMatchObject({
      isTermsAccepted: true,
      isEdmOptedOut: false,
    });
  });
});
