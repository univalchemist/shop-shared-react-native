import { Linking } from 'react-native';
import { phoneIcon, emailIcon } from '@images';
import { categories } from '@store/analytics/trackingActions';
import { PROFILE_HELP_FAQ_DETAILS } from '@routes';
export const tryOpeningLink = url => {
  if (url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
      alert(`Link: ${url} Could not be opened`);
    });
  }
};

export const generateProfileHelpMenus = (help, navigation) => {
  const {
    faqs,
    details: { email, customerSupportHours, technicalEmail, note, phones },
  } = help;

  const medicalEnquiries = phones?.map(phone => {
    return {
      data: `${phone.number} (${phone.location})`,
      icon: phoneIcon,
      onPress: () => tryOpeningLink(`tel:${phone.number}`),
      actionParams: {
        category: categories.PROFILE_HELP,
        action: `Call help ${phone.location}`,
      },
    };
  });

  medicalEnquiries?.push({
    data: email,
    icon: emailIcon,
    onPress: () => tryOpeningLink(`mailto:${email}`),
  });

  const technicalEmailData = {
    titleId: 'profile.help.technicalEmail.title',
    data: [
      {
        data: technicalEmail,
        icon: emailIcon,
        onPress: () => tryOpeningLink(`mailto:${technicalEmail}`),
        actionParams: {
          category: categories.PROFILE_HELP,
          action: 'Email help',
        },
      },
    ],
  };

  const customerSupportHourList = customerSupportHours?.map(item => {
    return {
      textId: null,
      subhead: item.location,
      data: item.hour,
      icon: null,
      onPress: null,
      isCustomerSupportHour: true,
    };
  });

  const noteData = {
    textId: null,
    data: note,
    icon: null,
    onPress: null,
    isNote: true,
  };

  if (note) {
    customerSupportHourList.push(noteData);
  }

  const customerSupportHoursData = {
    titleId: 'profile.help.customerSupportHours.title',
    data: customerSupportHourList,
  };

  const faqData = faqs?.map(item => {
    return {
      data: item?.name,
      icon: null,
      onPress: () =>
        navigation.navigate(PROFILE_HELP_FAQ_DETAILS, { faq: item }),
      isListItem: true,
    };
  });

  const result = [
    {
      titleId: 'profile.help.medicalEnquiries',
      data: medicalEnquiries,
    },
  ];

  if (technicalEmail) result.push(technicalEmailData);
  if (customerSupportHours) result.push(customerSupportHoursData);
  if (faqs)
    result.push({
      titleId: 'profile.help.faq.title',
      data: faqData,
    });
  return result;
};
