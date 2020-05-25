import React from 'react';
import {
  flushMicrotasksQueue,
  fireEvent,
  act,
} from 'react-native-testing-library';
import QRCode from 'react-native-qrcode-svg';
import Carousel from 'react-native-snap-carousel';
import { renderForTestWithStore } from '@testUtils';
import { ImageSkeletonPlaceholder, ErrorPanel } from '@wrappers/components';
import ProfileEHealthCardScreen from '../ProfileEHealthCardScreen';
import EHealthCard from '../widgets/EHealthCard.hsbc';

const user = {
  data: {
    clientId: 'cxadevclient1',
    userId: '3',
  },
  membersMap: {
    '3': {
      firstName: 'testuser',
      lastName: '03',
      fullName: 'testuser01',
      memberId: '3',
    },
    '1': {
      firstName: 'testuser',
      lastName: '01',
      fullName: 'testOtherUser01',
      memberId: '1',
    },
    '2': {
      firstName: 'testuser',
      lastName: '02',
      fullName: 'testOtherUser02',
      memberId: '2',
    },
  },
  membersProfileOrder: ['3', '1', '2'],
  unterminatedMembersMap: {
    '3': {
      firstName: 'testuser',
      lastName: '03',
      fullName: 'testuser01',
      memberId: '3',
    },
    '1': {
      firstName: 'testuser',
      lastName: '01',
      fullName: 'testOtherUser01',
      memberId: '1',
    },
  },
};
const policyDetails = {
  policyNumber: '10288801GH',
  insurer: {
    code: 2251,
    name: 'HSBC Insurance',
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

const healthcards = [
  {
    memberId: '3',
    type: 'PRIMARY',
  },
  {
    memberId: '1',
    type: 'PRIMARY',
  },
  {
    memberId: '2',
    type: 'SECONDARY',
  },
];

const benefits = {
  member: {
    memberId: '3',
    membershipNumber: '0000123',
    certificateNumber: '0000123',
    planId: 2,
    checkpointVisits: [
      {
        serviceId: 'MIED',
        usedCount: 1,
      },
    ],
  },
  relationships: [
    {
      memberId: '1',
      membershipNumber: '0000124',
      certificateNumber: '0000124',
      planId: 2,
    },
    {
      memberId: '2',
      membershipNumber: '0000125',
      certificateNumber: '0000125',
      planId: 1,
    },
  ],
};

describe('ProfileEHealthCardScreen integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initialState = {
    user,
    benefit: {
      ...benefits,
      policy: {},
      healthcards: [],
      coPayments: {},
    },
  };

  describe('Fetch is success', () => {
    const api = {
      fetchBenefits: jest.fn(() => Promise.resolve({ data: benefits })),
      fetchPolicyDetails: jest.fn(() =>
        Promise.resolve({ data: policyDetails }),
      ),
      fetchHealthCards: jest.fn(() => Promise.resolve({ data: healthcards })),
    };

    it('should render skeleton loader when isLoading', async () => {
      const [Component] = renderForTestWithStore(<ProfileEHealthCardScreen />, {
        initialState,
        api,
      });

      expect(Component.getAllByType(ImageSkeletonPlaceholder).length).toEqual(
        1,
      );
      await flushMicrotasksQueue();
      expect(Component.queryByType(ImageSkeletonPlaceholder)).toBeNull();
    });

    it('should display card and QR code for members', async () => {
      const [Component] = renderForTestWithStore(<ProfileEHealthCardScreen />, {
        initialState,
        api,
      });

      await flushMicrotasksQueue();
      expect(api.fetchPolicyDetails).toHaveBeenCalled();
      expect(api.fetchHealthCards).toHaveBeenCalled();
      expect(api.fetchBenefits).toHaveBeenCalled();
      expect(Component.queryAllByType(EHealthCard).length).toBe(2);
      expect(Component.queryAllByType(QRCode).length).toBe(1);
      expect(Component.getByText('03 testuser')).toBeDefined();
      expect(Component.getByText('0000123')).toBeDefined();
      expect(Component.getByText('01 testuser')).toBeDefined();
      expect(Component.getByText('0000124')).toBeDefined();
    });

    it('should display a different QR code for selected member card', async () => {
      const [Component] = renderForTestWithStore(<ProfileEHealthCardScreen />, {
        initialState,
        api,
      });

      await flushMicrotasksQueue();
      const loginMemberQRCode = Component.getByType(QRCode);
      const loginMemberXML = loginMemberQRCode.props.value;

      act(() => {
        fireEvent(Component.getByType(Carousel), 'snapToItem', 1);
      });

      act(() => {});

      const associatedMemberQRCode = Component.getByType(QRCode);
      const associatedMemberXML = associatedMemberQRCode.props.value;
      expect(associatedMemberXML).not.toEqual(loginMemberXML);
    });
  });

  describe('Fetch is failure', () => {
    const api = {
      fetchPolicyDetails: jest.fn(() =>
        Promise.resolve({ data: policyDetails }),
      ),
      fetchBenefits: jest.fn(() => Promise.reject({})),
    };

    it('should display error panel when unable to fetch data', async () => {
      const [Component] = renderForTestWithStore(<ProfileEHealthCardScreen />, {
        initialState,
        api,
      });

      await flushMicrotasksQueue();
      expect(api.fetchBenefits).toHaveBeenCalled();
      expect(Component.getAllByType(ErrorPanel).length).toBe(1);
    });
  });
});
