import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

const api = {
  getDocuments: () => ({
    data: [
      {
        id: 1,
        code: 'OP',
        title:
          'HSBC HealthPlus – Outpatient Benefit / Wellness Claims Claim Form',
        displayOrder: 1,
        url:
          'cxadevclient1/documents/healthplusopwellnessclaimform_eng_20190626.pdf',
      },
      {
        id: 3,
        code: 'HS',
        title: 'HSBC HealthPlus - Hospitalisation & Surgical Claim Form',
        displayOrder: 2,
        url:
          'cxadevclient1/documents/healthplushospitalisationandsurgicalclaimform_eng_20190626.pdf',
      },
      {
        id: 5,
        code: 'MA',
        title: 'HSBC HealthPlus - Maternity Subsidy Claim Form',
        displayOrder: 3,
        url:
          'cxadevclient1/documents/healthplusmaternityclaimform_eng_20190626.pdf',
      },
    ],
  }),
};

describe('Document actions', () => {
  it('should create an action to get documents', () => {
    const initialState = {
      user: {
        clientId: 'testClient',
        userId: '3',
      },
    };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_DOCUMENTS_START },
      {
        type: types.FETCH_DOCUMENTS_SUCCESS,
        payload: [
          {
            id: 1,
            code: 'OP',
            title:
              'HSBC HealthPlus – Outpatient Benefit / Wellness Claims Claim Form',
            displayOrder: 1,
            url:
              'https://microservices.localhost/claim/api/v1/clients/testClient/documents/1',
          },
          {
            id: 3,
            code: 'HS',
            title: 'HSBC HealthPlus - Hospitalisation & Surgical Claim Form',
            displayOrder: 2,
            url:
              'https://microservices.localhost/claim/api/v1/clients/testClient/documents/3',
          },
          {
            id: 5,
            code: 'MA',
            title: 'HSBC HealthPlus - Maternity Subsidy Claim Form',
            displayOrder: 3,
            url:
              'https://microservices.localhost/claim/api/v1/clients/testClient/documents/5',
          },
        ],
      },
    ];

    return store.dispatch(actions.getDocuments()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
