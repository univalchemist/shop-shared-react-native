import React from 'react';
import {
  flushMicrotasksQueue,
  act,
  fireEvent,
} from 'react-native-testing-library';
import { renderForTestWithStore } from '@testUtils';
import { ErrorPanel } from '@wrappers/components';
import ProfileMyBenefitsScreen, {
  ProfileMyBenefitsSkeletonPlaceholder,
} from '../ProfileMyBenefitsScreen';
import { PROFILE_MEMBER_MODAL, PROFILE_BENEFIT_DETAILS } from '@routes';

const initialState = {
  user: {
    clientId: 'devclient',
    userId: '3',
    membersMap: {
      '3': {
        clientId: 'devclient',
        memberId: '3',
        identificationNumber: 'S1234567A',
        fullName: 'testfullname 1',
        externalId: '300',
        role: 'Employee',
        relationshipToEmployee: 'Self',
        relationshipCategory: 'Self',
        relationships: [],
      },
    },
  },
};

const benefits = {
  member: {
    memberId: '3',
    membershipNumber: '0000123',
    certificateNumber: '0000123',
    planId: 1,
    checkpointVisits: [
      {
        serviceId: 'SP',
        usedCount: 5,
      },
      {
        serviceId: 'GP',
        usedCount: 3,
      },
      {
        serviceId: 'MIED',
        usedCount: 1,
      },
    ],
  },
  relationships: [],
};

const wallet = {
  member: {
    memberId: '3',
    balance: 1000.0,
    balanceText: '$HK1,000',
  },
  dependents: [
    {
      memberId: '27',
      balance: 2000.0,
      balanceText: '$HK2,000',
    },
    {
      memberId: '28',
      balance: 3000.0,
      balanceText: '$HK3,000',
    },
    {
      memberId: '29',
      balance: 4000.0,
      balanceText: '$HK4,000',
    },
    {
      memberId: '30',
      balance: 5000.0,
      balanceText: '$HK5,000',
    },
    {
      memberId: '68',
      balance: 6000.0,
      balanceText: '$HK6,000',
    },
  ],
};

const policyDetails = {
  policyNumber: '10288801GH',
  insurer: {
    code: 2251,
    name: 'HSBC Insurance',
    myBenefitsName: 'HSBC Life (International) Limited',
  },
  expiryDate: '2019-12-31T00:00:00',
  initialDate: '2019-01-01T00:00:00',
  plans: [
    {
      id: 2,
      name: 'I A',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$8,000 per year per member',
                  annualLimit: 8000.0,
                  forRelationship: 'Employee',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$8,000 per year per member',
                  annualLimit: 8000.0,
                  forRelationship: 'Spouse',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$4,000 per year per member',
                  annualLimit: 4000.0,
                  forRelationship: 'Child',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
    {
      id: 3,
      name: 'II',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$6,000 per year per member',
                  annualLimit: 6000.0,
                  forRelationship: 'Employee',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$6,000 per year per member',
                  annualLimit: 6000.0,
                  forRelationship: 'Spouse',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$3,000 per year per member',
                  annualLimit: 3000.0,
                  forRelationship: 'Child',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
    {
      id: 4,
      name: 'II A',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$6,000 per year per member',
                  annualLimit: 6000.0,
                  forRelationship: 'Employee',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$6,000 per year per member',
                  annualLimit: 6000.0,
                  forRelationship: 'Spouse',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$3,000 per year per member',
                  annualLimit: 3000.0,
                  forRelationship: 'Child',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
    {
      id: 5,
      name: 'III(Employee)',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit per year',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$4,000 per year per member',
                  annualLimit: 4000.0,
                  forRelationship: 'Employee',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
    {
      id: 6,
      name: 'III(Dependent)',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit per year',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$4,000 per year per member',
                  annualLimit: 4000.0,
                  forRelationship: 'Spouse',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$2,000 per year per member',
                  annualLimit: 2000.0,
                  forRelationship: 'Child',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
    {
      id: 1,
      name: 'I',
      products: [
        {
          name: 'Outpatient',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: true,
          services: [
            {
              name: 'General medical practitioner',
              id: 'GP',
              metaText: 'Consultation inclusive of medications',
              details: [
                {
                  coPayment: 50,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 30,
                    limit: 30,
                  },
                },
              ],
            },
            {
              name: 'Specialist',
              id: 'SP',
              metaText:
                'Consultation inclusive of medications, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 20,
                    limit: 20,
                  },
                },
              ],
            },
            {
              name: 'Physiotherapy',
              id: 'PHY',
              metaText: 'Includes occupational therapy, referral required¹',
              details: [
                {
                  coPayment: 20,
                  description: '',
                  panelVisit:
                    '$20 co-payment per visit, referral by panel doctor',
                  nonPanelVisit: 'Up to $750 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Mental illness & emotional disorder',
              id: 'MIED',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: '$20 co-payment per visit',
                  nonPanelVisit: 'Up to $2,000 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: {
                    active: 25,
                    limit: 25,
                  },
                },
              ],
            },
            {
              name: 'Diagnostic x-ray, laboratory tests & imaging',
              id: 'DXRAY',
              metaText: 'Referral required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'Referral by panel doctor',
                  nonPanelVisit: 'Up to $5,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Medication purchased outside doctor's clinic",
              id: 'MED',
              metaText: 'Prescription required¹',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit:
                    'Max 2 month’s supply for per visit to panel doctor',
                  nonPanelVisit: 'Up to $4,000 per year',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '¹ Written referral (except for those waived under “Specialist consultation” of Section 5) / prescription is required from a registered medical practitioner in western medicine.',
          productType: 'Outpatient',
        },
        {
          name: 'Hospital and Surgical',
          panelLabel: '100% coverage',
          nonPanelLabel: '80% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Room, board & general nursing care',
              id: 'RB',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'Basic private ward',
                  nonPanelVisit: '$3200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max days per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Intensive care',
              id: 'IC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$62,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Meal subsidy',
              id: 'MS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit:
                    '$200 (if meal is not included in the room & board charge)',
                  nonPanelVisit: 'Under room & board benefit limit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Hospital services',
              id: 'HS',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$65,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Physician services³',
              id: 'PS',
              metaText: 'Non-surgical case only',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per day',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$3,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '100',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'In-hospital specialist fees',
              id: 'IHSF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability²',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$13,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Surgeon fees',
              id: 'SF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$240,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$96,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$48,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$19,200',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: "Anaesthetist's fees",
              id: 'AF',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Operating theatre charge',
              id: 'OTC',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability - Complex',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$72,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Major',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$28,800',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Inter',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$14,400',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max limit per disability - Minor',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$5,760',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Annual overall limit⁴',
              id: 'AOL',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$1,500,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote:
            '² Disability means injury, sickness, disease or illness and shall include all disabilities rising from the same cause including any and all complications arising therefrom, except that where after 90 days following the latest medical treatment or consultation no further treatment for that disability is required, any subsequent disability from the same cause shall be considered a separate disability.\n\n³ Visit(s) by Registered Medical Practitioner other than Surgeon(s) who perform(s) the operation(s). No payment shall be made for visits or treatment related to the Disability which required such operation or during convalescence.\n\n⁴ An annual overall limit means the aggregate sum of benefits during the twelve months period measured from the commencement date of each plan year.',
          productType: 'HospitalSurgical',
        },
        {
          name: 'Supplemental major medical',
          panelLabel: '100% coverage',
          nonPanelLabel: '70% reimbursement',
          freeChoiceLabel: null,
          ehealthcard: false,
          services: [
            {
              name: 'Supplmentary major medical',
              id: 'SMM',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Max limit per disability',
                  panelVisit: 'N/A',
                  nonPanelVisit: '$400,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'SupplementalMajorMedical',
        },
        {
          name: 'Maternity subsidy',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '80% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Antenatal / post-natal check up',
              id: 'ANT',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: 'Consultation inclusive of medicine',
                  panelVisit: null,
                  nonPanelVisit: 'Up to $1,200 per visit',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: 'Max number of visits per pregnancy',
                  panelVisit: null,
                  nonPanelVisit: '20',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
            {
              name: 'Lump sum benefit max limit per pregnancy',
              id: 'LUMP',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: '',
                  panelVisit: null,
                  nonPanelVisit: '$75,000',
                  annualLimit: null,
                  forRelationship: null,
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'MaternitySubsidy',
        },
        {
          name: 'Wellness claim amount',
          panelLabel: null,
          nonPanelLabel: null,
          freeChoiceLabel: '100% reimbursement',
          ehealthcard: false,
          services: [
            {
              name: 'Max limit',
              id: 'MAX',
              metaText: '',
              details: [
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$8,0000 per year per member',
                  annualLimit: 80000.0,
                  forRelationship: 'Employee',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$80000 per year per member',
                  annualLimit: 80000.0,
                  forRelationship: 'Spouse',
                  checkpointVisits: null,
                },
                {
                  coPayment: null,
                  description: null,
                  panelVisit: null,
                  nonPanelVisit: '$40000 per year per member',
                  annualLimit: 40000.0,
                  forRelationship: 'Child',
                  checkpointVisits: null,
                },
              ],
            },
          ],
          footnote: null,
          productType: 'WellnessFlexibleSpending',
        },
      ],
    },
  ],
};

const api = {
  fetchBenefits: jest.fn(() => Promise.resolve({ data: benefits })),
  fetchWallet: jest.fn(() => Promise.resolve({ data: wallet })),
  fetchPolicyDetails: jest.fn(() => Promise.resolve({ data: policyDetails })),
};

describe('ProfileMyBenefitsScreen integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render skeleton loader when isLoading', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    expect(
      Component.getAllByType(ProfileMyBenefitsSkeletonPlaceholder).length,
    ).toEqual(1);
    await flushMicrotasksQueue();
    expect(
      Component.queryByType(ProfileMyBenefitsSkeletonPlaceholder),
    ).toBeNull();
  });

  it('should display error panel when unable to fetch data', async () => {
    const api = {
      fetchBenefits: jest.fn(() => Promise.reject({})),
      fetchPolicyDetails: jest.fn(() => Promise.reject({})),
    };
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchBenefits).toHaveBeenCalled();
    expect(Component.getAllByType(ErrorPanel).length).toBe(1);
  });

  it('should display employee benefit tier when data sucessfully loads', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchBenefits).toHaveBeenCalled();
    expect(api.fetchWallet).toHaveBeenCalled();
    expect(api.fetchPolicyDetails).toHaveBeenCalled();
    expect(Component.getByText('Outpatient')).toBeDefined();
    expect(
      Component.getByText('Tier I - Employee and dependent'),
    ).toBeDefined();
  });

  it('should display employee benefit with policy details', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchBenefits).toHaveBeenCalled();
    expect(Component.getByText('Policy number')).toBeDefined();
    expect(Component.getByText('10288801GH')).toBeDefined();
    expect(Component.getByText('Insurer')).toBeDefined();
    expect(
      Component.getByText('HSBC Life (International) Limited'),
    ).toBeDefined();
    expect(Component.getByText('Effective period')).toBeDefined();
    expect(Component.getByText('1 Jan 2019 - 31 Dec 2019')).toBeDefined();
  });

  it('should navigate to PROFILE_MEMBER_MODAL when select field is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={navigation} />,
      {
        initialState,
        api,
      },
    );
    await flushMicrotasksQueue();
    const input = Component.getByProps({ name: 'memberName' });
    act(() => {
      fireEvent.press(input);
    });
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(PROFILE_MEMBER_MODAL);
  });

  it('should navigate to PROFILE_BENEFIT_DETAILS when product field is pressed', async () => {
    const navigation = { navigate: jest.fn() };
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={navigation} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    const input = Component.getByText('Outpatient');
    act(() => {
      fireEvent.press(input);
    });

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(PROFILE_BENEFIT_DETAILS, {
      product: policyDetails.plans[0].products[0],
      memberBenefit: benefits.member,
      memberName: 'testfullname 1',
      relationshipCategory: 'Employee',
      externalWalletBalanceText: '$HK1,000',
    });
  });

  it('should display error panel when there are no matching plans coming from the benefit plan tier', async () => {
    const benefits = {
      memberId: '3',
      membershipNumber: '0000123',
      certificateNumber: '0000123',
      package: {
        policyNumber: '10288801GH',
        insurer: {
          code: 2251,
          name: 'HSBC Insurance',
        },
        expiryDate: '2019-12-31T00:00:00',
        initialDate: '2019-01-01T00:00:00',
        plans: [
          {
            name: 'II',
            products: [
              {
                name: 'Outpatient benefits',
                consultationTypes: [
                  { name: 'General Medical Practitioner', coPayment: 20 },
                  { name: 'Specialist consultation', coPayment: 20 },
                  { name: 'Physiotherapy', coPayment: 20 },
                  {
                    name: 'Mental illness & emotional disorder',
                    coPayment: 20,
                  },
                ],
              },
            ],
          },
        ],
      },
      dependants: [],
      plan: 'I',
    };
    const api = {
      fetchBenefits: jest.fn(() => Promise.resolve({ data: benefits })),
    };
    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchBenefits).toHaveBeenCalled();
    expect(Component.getAllByType(ErrorPanel).length).toBe(1);
  });

  it('should display error panel when benefits is not defined', async () => {
    const api = {
      fetchBenefits: jest.fn(() => Promise.resolve({ data: {} })),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyBenefitsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchBenefits).toHaveBeenCalled();
    expect(Component.getAllByType(ErrorPanel).length).toBe(1);
  });
});
