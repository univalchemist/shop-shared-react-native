import * as types from './types';

const initialState = {
  byMemberId: {},
  policy: {},
  coPayments: {},
  coPaymentsText: {},
  healthcards: [],
  plansById: {},
  documents: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_BENEFITS_SUCCESS: {
      return reduceBenefits(state, action.payload);
    }
    case types.FETCH_BENEFIT_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        documents: action.payload,
      };
    }
    case types.FETCH_POLICY_DETAILS_SUCCESS: {
      return {
        ...state,
        policy: modifyPolicyPayload(action.payload),
      };
    }
    case types.FETCH_HEALTHCARDS_SUCCESS: {
      return {
        ...state,
        healthcards: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

const modifyPolicyPayload = policy => {
  const { plans } = policy;
  const updatedPlans = plans.reduce((acc, plan) => {
    const { id, ...rest } = plan;
    acc[plan.id] = rest;
    return acc;
  }, {});
  return {
    ...policy,
    plans: updatedPlans,
  };
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const getCoPayment = (outPatientServices, serviceId) =>
  outPatientServices.find(service => service.id === serviceId).details[0]
    .coPayment;

const getCoPaymentText = (outPatientServices, serviceId) =>
  outPatientServices.find(service => service.id === serviceId).details[0]
    .coPaymentText;

const getCoPaymentDetailsByPlanId = (plans, planId) => {
  const outPatientServices = plans[planId].products.find(
    product => product.ehealthcard === true,
  ).services;
  return {
    GP: getCoPayment(outPatientServices, 'GP'),
    SP: getCoPayment(outPatientServices, 'SP'),
    PHY: getCoPayment(outPatientServices, 'PHY'),
  };
};

const getCoPaymentTextByPlanId = (plans, planId) => {
  const outPatientServices = plans[planId].products.find(
    product => product.ehealthcard === true,
  ).services;
  return {
    GP: getCoPaymentText(outPatientServices, 'GP'),
    SP: getCoPaymentText(outPatientServices, 'SP'),
    PHY: getCoPaymentText(outPatientServices, 'PHY'),
  };
};

const reduceBenefits = (state, payload) => {
  let coPayments, coPaymentsText;
  const allBenefits = [payload.member, ...payload.relationships];
  const byMemberId = {};
  allBenefits.forEach(benefit => {
    byMemberId[benefit.memberId] = benefit;
  });

  if (Object.keys(state.policy).length !== 0) {
    const { plans } = state.policy;
    let uniquePlanIdList = [];
    if (payload.relationships.length !== 0) {
      const relationshipPlanId = payload.relationships.map(r => r.planId);
      uniquePlanIdList = relationshipPlanId.filter(onlyUnique);
    }
    const allPlanIds = [payload.member.planId, ...uniquePlanIdList];
    const uniquePlanIds = allPlanIds.filter(onlyUnique);

    coPayments = uniquePlanIds.reduce((acc, id) => {
      const result = getCoPaymentDetailsByPlanId(plans, id);
      acc[id] = result;
      return acc;
    }, {});

    coPaymentsText = uniquePlanIds.reduce((acc, id) => {
      const result = getCoPaymentTextByPlanId(plans, id);
      acc[id] = result;
      return acc;
    }, {});
  }

  return {
    ...state,
    byMemberId,
    coPayments,
    coPaymentsText,
  };
};
