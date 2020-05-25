import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { renderForTestWithStore } from '@testUtils';
import ProfileBenefitDetailScreen from '../ProfileBenefitDetailsScreen';
import messages from '@messages/en-HK.json';

const outpatientProduct = {
  name: 'Outpatient',
  panelLabel: '100% coverage',
  nonPanelLabel: '80% reimbursement',
  services: [
    {
      name: 'General medical practitioner',
      id: 'GP',
      metaText: 'Consultation inclusive of medications',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $750 per visit',
          checkpointVisits: { used: 30, limit: 30 },
        },
      ],
    },
    {
      name: 'Specialist',
      id: 'SP',
      metaText: 'Consultation inclusive of medications, referral required¹',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $1,200 per visit',
          checkpointVisits: { used: 40, limit: 40 },
        },
      ],
    },
    {
      name: 'Physiotherapy',
      id: 'PHY',
      metaText: 'Includes occupational therapy, referral required¹',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit, referral by panel doctor',
          nonPanelVisit: 'Up to $750 per visit',
          checkpointVisits: { used: 25, limit: 25 },
        },
      ],
    },
    {
      name: 'Mental illness & emotional disorder',
      id: 'MIED',
      metaText: '',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $2,000 per visit',
          checkpointVisits: { used: 25, limit: 30 },
        },
      ],
    },
    {
      name: 'Diagnostic x-ray, laboratory tests & imaging',
      id: 'DXRAY',
      metaText: 'Referral required¹',
      details: [
        {
          description: '',
          panelVisit: 'Referral by panel doctor',
          nonPanelVisit: 'Up to $5,000 per year',
        },
      ],
    },
    {
      name: "Medication purchased outside doctor's clinic",
      id: 'MED',
      metaText: 'Prescription required¹',
      details: [
        {
          description: '',
          panelVisit: 'Max 2 month’s supply for per visit to panel doctor',
          nonPanelVisit: 'Up to $4,000 per year',
        },
      ],
    },
  ],
  footnote:
    '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
};

const outpatientProductWithUnlimitedCheckpoint = {
  name: 'Outpatient',
  panelLabel: '100% coverage',
  nonPanelLabel: '80% reimbursement',
  unlimitedCheckpoint: true,
  services: [
    {
      name: 'General medical practitioner',
      id: 'GP',
      metaText: 'Consultation inclusive of medications',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $750 per visit',
          checkpointVisits: { used: 30, limit: 30 },
        },
      ],
    },
    {
      name: 'Specialist',
      id: 'SP',
      metaText: 'Consultation inclusive of medications, referral required¹',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $1,200 per visit',
          checkpointVisits: { used: 40, limit: 40 },
        },
      ],
    },
    {
      name: 'Physiotherapy',
      id: 'PHY',
      metaText: 'Includes occupational therapy, referral required¹',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit, referral by panel doctor',
          nonPanelVisit: 'Up to $750 per visit',
          checkpointVisits: { used: 25, limit: 25 },
        },
      ],
    },
    {
      name: 'Mental illness & emotional disorder',
      id: 'MIED',
      metaText: '',
      details: [
        {
          description: '',
          panelVisit: '$20 co-payment per visit',
          nonPanelVisit: 'Up to $2,000 per visit',
          checkpointVisits: { used: 25, limit: 30 },
        },
      ],
    },
    {
      name: 'Diagnostic x-ray, laboratory tests & imaging',
      id: 'DXRAY',
      metaText: 'Referral required¹',
      details: [
        {
          description: '',
          panelVisit: 'Referral by panel doctor',
          nonPanelVisit: 'Up to $5,000 per year',
        },
      ],
    },
    {
      name: "Medication purchased outside doctor's clinic",
      id: 'MED',
      metaText: 'Prescription required¹',
      details: [
        {
          description: '',
          panelVisit: 'Max 2 month’s supply for per visit to panel doctor',
          nonPanelVisit: 'Up to $4,000 per year',
        },
      ],
    },
  ],
  footnote:
    '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
};

const wellnessProduct = {
  name: 'Wellness claim amount',
  productType: 'WellnessFlexibleSpending',
  panelLabel: null,
  nonPanelLabel: null,
  freeChoiceLabel: '100% reimbursement',
  ehealthcard: false,
  services: [
    {
      name: 'Max Limit FOR WELLNESS',
      id: 'MAX',
      metaText: '',
      details: [
        {
          coPayment: null,
          description: null,
          panelVisit: null,
          nonPanelVisit: '$4,000 per year per member',
          annualLimit: 4000.0,
          annualLimitText: '$HK4,000',
          forRelationship: 'Employee',
          checkpointVisits: null,
        },
        {
          coPayment: null,
          description: null,
          panelVisit: null,
          nonPanelVisit: '$3,000 per year per member',
          annualLimit: 3000.0,
          annualLimitText: '$HK3,000',
          forRelationship: 'Spouse',
          checkpointVisits: null,
        },
      ],
    },
  ],
  footnote: null,
};

const memberBenefit = {
  memberId: '3',
  membershipNumber: '0000123',
  certificateNumber: '0000123',
  plan: 'I',
  checkpointVisits: [
    {
      serviceId: 'GP',
      usedCount: 30,
    },
    {
      serviceId: 'SP',
      usedCount: 3,
    },
    {
      serviceId: 'PHY',
      usedCount: 2,
    },
    {
      serviceId: 'MIED',
      usedCount: 1,
    },
  ],
};

const route = {
  params: {
    product: outpatientProduct,
    memberBenefit: memberBenefit,
    memberName: 'testmember1',
    externalWalletBalance: 1000,
    relationshipCategory: 'Spouse',
  },
};

describe('ProfileBenefitDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all services provided in product', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileBenefitDetailScreen route={route} />,
    );

    await flushMicrotasksQueue();

    expect(Component.getByText('General medical practitioner')).toBeDefined();
    expect(Component.getByText('Panel doctor')).toBeDefined();
    expect(Component.getByText('100% coverage')).toBeDefined();
    expect(Component.getByText('Non panel doctor')).toBeDefined();
    expect(Component.getByText('80% reimbursement')).toBeDefined();
    expect(
      Component.getByText('Consultation inclusive of medications'),
    ).toBeDefined();
    expect(Component.getAllByText('$20 co-payment per visit').length).toBe(3);
    expect(Component.getAllByText('Up to $750 per visit').length).toBe(2);
    expect(Component.getAllByText('Checkpoint visits per year').length).toBe(4);
    expect(Component.getByText('0 out of 30 left')).toBeDefined();
    expect(Component.getByText(outpatientProduct.footnote)).toBeDefined();
  });

  it('should show services checkpoint visits when available ', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileBenefitDetailScreen route={route} />,
    );
    await flushMicrotasksQueue();
    expect(Component.getByText('23 out of 25 left')).toBeDefined();
    expect(Component.getByText('29 out of 30 left')).toBeDefined();
    expect(Component.getByText('37 out of 40 left')).toBeDefined();
  });

  it('should show Wellness product and services', async () => {
    const newRoute = {
      params: {
        product: wellnessProduct,
        memberName: 'spousename',
        externalWalletBalanceText: '$HK1,000',
        relationshipCategory: 'Spouse',
      },
    };

    const [Component] = renderForTestWithStore(
      <ProfileBenefitDetailScreen route={newRoute} />,
    );

    await flushMicrotasksQueue();

    expect(
      Component.getByText('Free choice doctor 100% reimbursement'),
    ).toBeDefined();
    expect(Component.getByText('Max Limit FOR WELLNESS')).toBeDefined();
    expect(Component.getByText('spousename')).toBeDefined();
    expect(Component.getByText('$HK1,000 out of $HK3,000 left')).toBeDefined();
  });

  it('should show a dash "-" if external wallet balance is unavailable', async () => {
    const newRoute = {
      params: {
        product: wellnessProduct,
        memberName: 'spousename',
        externalWalletBalanceText: undefined,
        relationshipCategory: 'Spouse',
      },
    };

    const [Component] = renderForTestWithStore(
      <ProfileBenefitDetailScreen route={newRoute} />,
    );

    await flushMicrotasksQueue();

    expect(Component.getByText('Max Limit FOR WELLNESS')).toBeDefined();
    expect(Component.getByText('spousename')).toBeDefined();
    expect(Component.getByText('- out of $HK3,000 left')).toBeDefined();
  });

  it('should display unlimited when checkpointLimit value is true', async () => {
    const newRoute = {
      params: {
        product: outpatientProductWithUnlimitedCheckpoint,
        memberBenefit: memberBenefit,
        externalWalletBalance: undefined,
        relationshipCategory: 'Spouse',
      },
    };

    const [Component] = renderForTestWithStore(
      <ProfileBenefitDetailScreen route={newRoute} />,
    );

    await flushMicrotasksQueue();
    expect(Component.getAllByText('Unlimited').length).toBe(4);
  });
});
