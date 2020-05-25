import reducer from '../reducer';
import * as types from '../types';

const initialState = reducer(undefined, {});

describe('Document reducer', () => {
  it('should return the initialState', () => {
    const expectedState = {
      documents: [],
    };
    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle FETCH_DOCUMENTS_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      documents: [
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
    };

    const action = {
      type: types.FETCH_DOCUMENTS_SUCCESS,
      payload: [
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
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
