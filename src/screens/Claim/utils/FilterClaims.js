import { CLAIM_STATUS } from '@store/claim/constants';

export const filterClaims = ({
  approved,
  rejected,
  processing,
  request_for_information,
  selectedClaimFilters,
  claimsMap,
}) => {
  let returnObject = {
    approved: [],
    rejected: [],
    processing: [],
  };
  const groupedFilters = selectedClaimFilters.reduce(
    (acc, filter) => {
      if (filter.type === 'claimCategoryFilters') {
        acc.categoryCode.push(filter.value);
      }
      if (filter.type === 'claimStatusFilters') {
        acc.claimStatus.push(filter.value);
      }
      if (filter.type === 'patient') {
        acc.claimantId.push(filter.value);
      }
      return acc;
    },
    { categoryCode: [], claimStatus: [], claimantId: [] },
  );

  const filterByClaimStatus = selectedClaimStatus => {
    if (selectedClaimStatus === CLAIM_STATUS.APPROVED) {
      returnObject.approved = approved;
    }

    if (selectedClaimStatus === CLAIM_STATUS.REJECTED) {
      returnObject.rejected = rejected;
    }

    if (selectedClaimStatus === CLAIM_STATUS.PROCESSING) {
      returnObject.processing = returnObject.processing.concat(processing);
    }

    if (selectedClaimStatus === CLAIM_STATUS.REQUEST_FOR_INFORMATION) {
      returnObject.processing = returnObject.processing.concat(
        request_for_information,
      );
    }
  };

  const filterBy = criteria => {
    for (let claimStatus in returnObject) {
      returnObject[claimStatus] = returnObject[claimStatus].filter(claimId =>
        groupedFilters[criteria].includes(claimsMap[claimId][criteria]),
      );
    }
  };

  if (groupedFilters.claimStatus.length === 0) {
    returnObject = {
      approved,
      rejected,
      processing: processing.concat(request_for_information),
    };
  } else {
    groupedFilters.claimStatus.forEach(status => {
      filterByClaimStatus(status);
    });
  }

  if (groupedFilters.categoryCode.length > 0) {
    filterBy('categoryCode');
  }
  if (groupedFilters.claimantId.length > 0) {
    filterBy('claimantId');
  }
  return returnObject;
};
