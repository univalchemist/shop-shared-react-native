import { filterClaims } from '../FilterClaims';

describe('FilterClaims', () => {
  it('should return an expected object when there are no processing, approved and rejected claims', () => {
    const expected = {
      processing: [],
      approved: [],
      rejected: [],
    };
    expect(
      filterClaims({
        processing: [],
        approved: [],
        rejected: [],
        request_for_information: [],
        selectedClaimFilters: [],
      }),
    ).toEqual(expected);
  });

  it('should return all claims with request_for_information parked under processing when there are no selectedClaimFilters', () => {
    const expected = {
      processing: ['p', 'rfi'],
      approved: ['a'],
      rejected: ['r'],
    };
    expect(
      filterClaims({
        processing: ['p'],
        approved: ['a'],
        rejected: ['r'],
        request_for_information: ['rfi'],
        selectedClaimFilters: [],
      }),
    ).toEqual(expected);
  });

  describe('filter by Claim status', () => {
    it('should return only processing when selectedClaimFilters has PROCESSING', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'PROCESSING' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['hello'],
        approved: [],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return only approved filtered when selectedClaimFilters has APPROVED', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'APPROVED' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: [],
        approved: ['foo'],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return only rejected filtered when selectedClaimFilters has REJECTED', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'REJECTED' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: [],
        approved: [],
        rejected: ['bar'],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return only request for information filtered when selectedClaimFilters has REQUEST FOR INFORMATION', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'REQUEST FOR INFORMATION' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['rfi'],
        approved: [],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should filter hello, foo and bye when filtering by Claim status is approved and processing', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'APPROVED' },
        { type: 'claimStatusFilters', value: 'PROCESSING' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return all processing claims when PROCESSING is selected first, then REQUEST FOR INFORMATION is selected', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'PROCESSING' },
        { type: 'claimStatusFilters', value: 'REQUEST FOR INFORMATION' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['hello', 'rfi'],
        approved: [],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return all processing claims when REQUEST FOR INFORMATION is selected first, then PROCESSING is selected', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'REQUEST FOR INFORMATION' },
        { type: 'claimStatusFilters', value: 'PROCESSING' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['rfi', 'hello'],
        approved: [],
        rejected: [],
      };

      const claimsMap = {};

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Claim type', () => {
    it('should return only specified categoryCode when filtering by Claim type', () => {
      const selectedClaimFilters = [
        { type: 'claimCategoryFilters', value: 'outpatient' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['hello'],
        approved: ['foo'],
        rejected: [],
      };

      const claimsMap = {
        hello: {
          categoryCode: 'outpatient',
        },
        foo: {
          categoryCode: 'outpatient',
        },
        bye: {
          categoryCode: 'wellness',
        },
        bar: {
          categoryCode: 'wellness',
        },
        rfi: {
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });

    it('should return all claims when all Claim type filters are checked', () => {
      const selectedClaimFilters = [
        { type: 'claimCategoryFilters', value: 'wellness' },
        { type: 'claimCategoryFilters', value: 'outpatient' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: ['hello', 'rfi'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        foo: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        rfi: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Patient Name', () => {
    it('should filter out 2 when filtering by patient name', () => {
      const selectedClaimFilters = [{ type: 'patient', value: '2' }];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: [],
        approved: ['foo'],
        rejected: ['bar'],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        foo: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '2',
          categoryCode: 'wellness',
        },
        rfi: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Claim status and Patient', () => {
    it('should filter out foo when filtering by patient name is 2 and Claim status is APPROVED', () => {
      const selectedClaimFilters = [
        { type: 'patient', value: '2' },
        { type: 'claimStatusFilters', value: 'APPROVED' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
      };

      const expected = {
        processing: [],
        approved: ['foo'],
        rejected: [],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        foo: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '2',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Claim status and Claim type', () => {
    it('should filter out foo when filtering by Claim type is wellness and Claim status is APPROVED', () => {
      const selectedClaimFilters = [
        { type: 'claimStatusFilters', value: 'APPROVED' },
        { type: 'claimCategoryFilters', value: 'wellness' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
      };

      const expected = {
        processing: [],
        approved: ['bye'],
        rejected: [],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        foo: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '2',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Patient and Claim type', () => {
    it('should filter out foo when filtering by Claim type is wellness and Patient is 1', () => {
      const selectedClaimFilters = [
        { type: 'patient', value: '1' },
        { type: 'claimCategoryFilters', value: 'wellness' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: [],
        approved: ['bye'],
        rejected: [],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        rfi: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '2',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });

  describe('filter by Patient, Claim type and Claim status', () => {
    it('should filter out foo when filtering by Claim type is wellness, Claim status is rejected and Patient is 1', () => {
      const selectedClaimFilters = [
        { type: 'patient', value: '1' },
        { type: 'claimCategoryFilters', value: 'wellness' },
        { type: 'claimStatusFilters', value: 'REJECTED' },
      ];

      const data = {
        processing: ['hello'],
        approved: ['foo', 'bye'],
        rejected: ['bar'],
        request_for_information: ['rfi'],
      };

      const expected = {
        processing: [],
        approved: [],
        rejected: ['bar'],
      };

      const claimsMap = {
        hello: {
          claimantId: '1',
          categoryCode: 'outpatient',
        },
        foo: {
          claimantId: '2',
          categoryCode: 'outpatient',
        },
        bye: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        bar: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
        rfi: {
          claimantId: '1',
          categoryCode: 'wellness',
        },
      };

      expect(
        filterClaims({ ...data, selectedClaimFilters, claimsMap }),
      ).toEqual(expected);
    });
  });
});
