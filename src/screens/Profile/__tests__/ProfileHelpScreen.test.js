import React from 'react';
import { renderForTestWithStore } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ProfileHelpScreen from '../ProfileHelpScreen';
import {
  ListSkeletonPlaceholder,
  ErrorPanel,
  ListItem,
  Image,
} from '@wrappers/components';
import { phoneIcon, emailIcon } from '@images';
import { Linking } from 'react-native';

const helpContent = {
  details: {
    email: 'medicalservice@axa.com.hk',
    phones: [
      {
        number: '+852 3070 5005',
        location: 'Hongkong',
      },
      {
        number: '+853 0800 284',
        location: 'Macau',
      },
    ],
    customerSupportHours: [
      {
        hour:
          '09:00 AM - 05:30 PM \nMonday to Friday (except Hong Kong Public Holidays)',
        location: 'Hongkong',
      },
      {
        hour:
          '09:00 AM - 05:30 \nPM Monday to Friday (except Ma Cau Banking holidays)',
        location: 'Macau',
      },
    ],
    technicalEmail: 'employee.benefit@hsbc.com.hk',
    note:
      'For faster processing when submitting enquiries, please provide your staff ID or policy number with certificate number, or membership number from your Health card',
  },
  faqs: [
    {
      name: 'Coverage',
      content:
        'WHERE CAN I FIND THE PANEL DOCTOR LIST?\n\nYou can find the panel doctor list under the “Employee Benefits” section on the home screen. WHERE CAN I FIND AN OVERVIEW OF MY COVERAGE?\n\nYou may refer to “Documents” on the homepage of this app for an overview of your coverage. If the schedule of benefits is not available. Please call us by clicking on the “Call AXA hotline” button below.\n\nAXA Hotline: +852 2519 1166\n\nEmail: employee.benefits@axa.com.hk',
    },
    {
      name: 'Policy/Membership Servicing',
      content:
        'HOW CAN I INCREASE THE COVERAGE TO ENJOY MORE MEDICAL BENEFITS?\n\nSome of our plans have voluntary options for upgrade. If the upgrade option is not available, we may have supplementary products to meet your needs. Please reach out to using the options below to learn more about the option available to you.\n\nAXA Hotline: +852 2519 1166\n\nEmail: employee.benefits@axa.com.hk\n\nHOW LONG DOES IT TAKE TO RECEIVE MY MEDICAL CARD?\n\nAfter AXA has received the request the medical card will be issues within 10 working days.\n\nHOW DO I UPDATE MY CONTACTS DETAILS?\n\nPlease reach out to us, using the options below for update.\n\nAXA Hotline: +852 2519 1166\n\nEmail: employee.benefits@axa.com.hk',
    },
    {
      name: 'Claims – Statement/Receipts',
      content:
        'HOW CAN I REQUEST MY CLAIM SETTLEMENT STATEMENT?\n\nIf you have not received your claims settlement statement by email or by post, please call us by clicking on the “Call AXA hotline” button below\nDid you know that you can also find your claim status under the “Employee Benefits” section on the home page of this application. Click on your group medical plan under “My Policy List” and there you will find “My Claims”, which will provide you more details.\n\nHOW CAN I RECEIVE BACK THE CLAIM DOCUMENT(S) AFTER MY CLAIM SUBMISSION?\n\nBefore you submit your claim form, you can select the option to receive back your documents on the first page of the claim form ( section 3).\nIf you have already submitted the claim form, please call us by clicking on the “Call AXA hotline” button below.\n\nAXA Hotline: +852 2519 1166\n\nEmail: employee.benefits@axa.com.hk',
    },
    {
      name: 'Claims Status',
      content:
        'WHAT IS THE CLAIM TURNAROUND TIME?\n\nOnce we have received the completed claim information and assessed eligibility the claim shall be settled within:\n\nOutpatient 14 working days\n\nInpatient 21 working days\n\nIf we require more information to assess your claim we will contact you.\n\nHOW CAN I CHECK THE STATUS OF MY CLAIM?\n\nYou can find your claim status under the “Employee Benefits” section on the home page of this application. Click on your group medical plan under “My Policy List” and there you will find my “My Claims”.\nIf you can not see your submitted claims status, please contact us using the options below.\n\nAXA Hotline: +852 2519 1166\n\nEmail: employee.benefits@axa.com.hk',
    },
    {
      name: 'Claims – Outpatient',
      content:
        "WHAT IS A VALID REFERRAL LETTER?\n\n A Valid referral letter must be issued by a registered Western Medical Practitioner and it is required for:\n\n- Specialist's visit ( must state the speciality )\n\n- X-Ray / Laboratory ( must state the type of X-Ray / Test )\n\n- Physiotherapy\n\nIn all cases, the referral letter must state the exact diagnosis and will be valid for 90 days unless otherwise stated in your plan ( please refer to your policy for the validity period ). Every claim for visit a new speciality, an X-ray and laboratory test shall be supported by a new referral letter.\n\nCAN I MAKE A CLAIM FOR MULTIPLE OUTPATIENT CONSOLATIONS ON THE SAME DAY?\n\nGenerally speaking, we allow one general consultation and one specialist / Chinese herbalist / physiotherapy visit consultation on the same day for group policy. Please refer to your policy for details.\n\nDO YOU COVER PRESCRIPTION MEDICINES?\n\nPlease check your policy for the coverage of the outpatient prescribed medicine.\nThe prescribed medicine should be purchased from a pharmacy or dispensary, which is not within the attending doctors clinic or private hospital outpatient department.\nWhen you make the claim, please submit the prescription which includes the diagnosis, the name of the medicine, dosage and the name of attending doctor.\n\nDOES MY DENTIST NEED TO FILL OUT THE CLAIM FORM?\n\nWe require the diagnosis and treatment details from your dentist to process your claim. These can be submitted separately from the claim form but, your dentist may make an additional charge for this. Therefore, we recommend you to ask your dentist to fill out Section B of the Dental Claim form.\n\nWILL AXA ALSO COVER THE MEDICAL EXPENSES INCURRED AT NON REGISTERED PRACTITIONERS?\n\nNo. We only cover the costs incurred at registered practitioners.",
    },
    {
      name: 'Claims – Inpatient',
      content:
        'HOW LONG DOES IT TAKE TO PROCESS MY CLAIM?\n\nOnce we have received the completed claim information and assessed eligibility the claim shall be settled within:\n\n Outpatient 14 working days\n\n Inpatient 21 working days\n\nIf we require more information to assess your claim we will contact you.\n\nWHAT DOCUMENT(S) DO I NEED TO SUBMIT TO GET REIMBURSEMENT FOR A PUBLIC HOSPITAL MEDICAL EXPENSE?\n\nFor the reimbursement of a medical expense incurred at a public hospital, please send the discharge summary containing the specific diagnosis and name of operation (if any), as well as the original receipt to us for processing.\n\nIS THERE ANY MINIMUM NUMBER OF HOURS OF HOSPITAL CONFINEMENT IN ORDER TO BE ELIGIBLE FOR A CLAIM?\n\nFor non-surgical treatment which is medically required a minimum number of hours of hospital confinement is required.\n\nFor surgical treatment, no minimum no. of hour of confinement is required. Please refer to your policy details for more information.',
    },
    {
      name: 'Claims - General',
      content:
        'WHAT DOCUMENTS DO I NEED TO SUBMIT TOGETHER WITH MY CLAIM FORM?\n\nIn order to process your claim, please provide the following documents:\n\n- Original receipt(s) with the certified diagnosis by the attending doctor(s); and\n- Doctors referral letter; and\n- Doctor`s prescription with drug name(s) and dosage; and\n- Settlement advice from other insurer (If any)\n- The exact requirements will be listed on your claim form.\n\nWHEN SHOULD I SUBMIT MY CLAIM FORM?\n\n We recommend you to submit your claim within 60 days of treatment. For some of our planswe offer different submission period. Please refer to your policy details for more information.\n\nHOW DO I MAKE A CLAIM?\n\n To submit a claim go to the “Documents“ section on the home page of this application and download the claims form. The claim form has easy to follow steps.',
    },
  ],
};

const api = {
  fetchHelpContent: jest.fn(() =>
    Promise.resolve({ data: { ...helpContent } }),
  ),
};
let Component;
describe('ProfileHelpScreen', () => {
  beforeEach(async () => {
    [Component] = renderForTestWithStore(
      <ProfileHelpScreen navigation={{}} />,
      {
        api,
        initialState: helpContent,
      },
    );
    await jest.clearAllMocks();
    await flushMicrotasksQueue();
  });

  test('should render skeleton loader when isLoading', async () => {
    [Component] = renderForTestWithStore(
      <ProfileHelpScreen navigation={{}} />,
      {
        api,
      },
    );

    expect(Component.getAllByType(ListSkeletonPlaceholder).length).toEqual(1);
    await flushMicrotasksQueue();
    expect(Component.queryByType(ListSkeletonPlaceholder)).toBeNull();
  });

  it('should display error panel when unable to fetch data', async () => {
    const api = {
      fetchHelpContent: jest.fn(() => Promise.reject({})),
    };
    const [Component] = renderForTestWithStore(
      <ProfileHelpScreen navigation={{}} />,
      {
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchHelpContent).toHaveBeenCalled();
    expect(Component.getAllByType(ErrorPanel).length).toBe(1);
  });

  it('should display correctly when data successfully loads', async () => {
    expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should display correct sections for help when data successfully loads', async () => {
    expect(Component.getByText('+852 3070 5005 (Hongkong)')).toBeDefined();
    expect(Component.getByText('+853 0800 284 (Macau)')).toBeDefined();
    expect(Component.getByText('medicalservice@axa.com.hk')).toBeDefined();
    expect(Component.getByText('employee.benefit@hsbc.com.hk')).toBeDefined();
  });

  it('should render phone icon for phone number', async () => {
    const callListItem = Component.queryAllByType(ListItem);
    expect(callListItem[0].props.leftIcon.type).toEqual(Image);
    expect(callListItem[0].props.leftIcon.props.source).toEqual(phoneIcon);
  });

  it('should render email icon for email id', async () => {
    const callListItem = Component.queryAllByType(ListItem);
    expect(callListItem[1].props.leftIcon.type).toEqual(Image);
    expect(callListItem[0].props.leftIcon.props.source).toEqual(phoneIcon);
    expect(callListItem[1].props.leftIcon.props.source).toEqual(phoneIcon);
    expect(callListItem[2].props.leftIcon.props.source).toEqual(emailIcon);
    expect(callListItem[3].props.leftIcon.props.source).toEqual(emailIcon);
  });

  it('should attempt opening native call dialer when clicking on mobile number', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    await flushMicrotasksQueue();
    const phoneNumber = Component.queryAllByType(ListItem)[0];
    await fireEvent.press(phoneNumber);

    expect(Linking.openURL).toHaveBeenCalledWith(`tel:+852 3070 5005`);
  });

  it('should attempt opening native email client when clicking email id', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const emailId = Component.queryAllByType(ListItem)[2];
    await fireEvent.press(emailId);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith(
      `mailto:medicalservice@axa.com.hk`,
    );
    const emailIdTechnical = Component.queryAllByType(ListItem)[3];
    await fireEvent.press(emailIdTechnical);
    await flushMicrotasksQueue();
    expect(Linking.openURL).toHaveBeenCalledWith(
      `mailto:employee.benefit@hsbc.com.hk`,
    );
  });

  it('should display Customer support hours details for help when data successfully loads', async () => {
    expect(Component.getByText('Customer support hours')).toBeDefined();
    expect(
      Component.getByText(
        '09:00 AM - 05:30 PM \nMonday to Friday (except Hong Kong Public Holidays)',
      ),
    ).toBeDefined();
  });

  // it('should navigate to FAQ screen on tapping of Frequently Asked Questions', async () => {
  //   // const navigation = { navigate: jest.fn() };
  //   const [Component] = renderForTestWithStore(
  //     <ProfileHelpScreen /* navigation={navigation} */ />,
  //     { api },
  //   );
  //   await flushMicrotasksQueue();
  //   const tappable = Component.getByText(messages['profile.help.faq.title']);

  //   await fireEvent.press(tappable);
  //   await flushMicrotasksQueue();

  //   expect(navigationService.navigate).toHaveBeenCalledWith(
  //     routes.PROFILE_HELP_FAQ,
  //     {
  //       faqs: [],
  //     },
  //   );
  // });
});
