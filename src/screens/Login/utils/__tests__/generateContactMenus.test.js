import { generateContactMenus, tryOpeningLink } from '../generateContactMenus';
import { phoneIcon, emailIcon } from '@images';
import { Linking } from 'react-native';
import { flushMicrotasksQueue } from 'react-native-testing-library';

describe('generateContactMenus', () => {
  it('should return correct data', () => {
    const contactContent = {
      clientId: 'cxadevclient1',
      details: {
        email: 'medicalservice@axa.com.hk',
        phones: [
          {
            location: 'Hongkong',
            number: '+852 3070 5005',
          },
          {
            location: 'Macau',
            number: '+853 0800 284',
          },
        ],
        customerSupportHours: [
          {
            location: 'Hongkong',
            hour:
              '09:00 AM - 05:30 PM \nMonday to Friday (except Hong Kong Public Holidays)',
          },
          {
            location: 'Macau',
            hour:
              '09:00 AM - 05:30 PM \nMonday to Friday (except Ma Cau Banking holidays)',
          },
        ],
        technicalEmail: 'employee.benefit@hsbc.com.hk',
      },
    };

    const expectedResult = [
      {
        titleId: 'profile.help.medicalEnquiries',
        data: [
          {
            textId: null,
            data: '+852 3070 5005 (Hongkong)',
            icon: phoneIcon,
            onPress: () => tryOpeningLink(`tel:+852 3070 5005`),
          },
          {
            textId: null,
            data: '+853 0800 284 (Macau)',
            icon: phoneIcon,
            onPress: () => tryOpeningLink(`tel:+853 0800 284`),
          },
          {
            textId: null,
            data: 'medicalservice@axa.com.hk',
            icon: emailIcon,
            onPress: () => tryOpeningLink(`mailto:medicalservice@axa.com.hk`),
          },
        ],
      },
      {
        titleId: 'profile.help.medicalEnquiries',
        data: [
          {
            textId: null,
            data: 'employee.benefit@hsbc.com.hk',
            icon: emailIcon,
            onPress: () =>
              tryOpeningLink(`mailto:employee.benefit@hsbc.com.hk`),
          },
        ],
      },
      {
        titleId: 'profile.help.customerSupportHours.title',
        data: [
          {
            textId: null,
            subhead: 'Hongkong',
            data:
              '09:00 AM - 05:30 PM \nMonday to Friday (except Hong Kong Public Holidays)',
            icon: null,
            onPress: null,
          },
          {
            textId: null,
            subhead: 'Macau',
            data:
              '09:00 AM - 05:30 PM \nMonday to Friday (except Ma Cau Banking holidays)',
            icon: null,
            onPress: null,
          },
        ],
      },
    ];

    expect(generateContactMenus(contactContent).toString()).toEqual(
      expectedResult.toString(),
    );
  });
});

describe('tryOpeningLink', () => {
  it('should open link when link is existing', async () => {
    const url = 'mailto:contact@cxagroup.com';

    tryOpeningLink(url);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalled();
  });
});
