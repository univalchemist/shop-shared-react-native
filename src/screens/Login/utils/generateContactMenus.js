import { Linking } from 'react-native';
// import { isEmpty } from 'ramda';
import { phoneIcon, emailIcon } from '@images';

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

export const generateContactMenus = (contact, navigation) => {
  const {
    details: { phones, email, customerSupportHours, technicalEmail, note },
  } = contact;

  const medicalEnquiries = (phones || []).map(phone => {
    return {
      data: `${phone.number} (${phone.location})`,
      icon: phoneIcon,
      onPress: () => tryOpeningLink(`tel:${phone.number}`),
    };
  });

  medicalEnquiries.push({
    data: email,
    icon: emailIcon,
    onPress: () => tryOpeningLink(`mailto:${email}`),
  });

  let customerSupportHourList = (customerSupportHours || []).map(item => {
    return {
      textId: null,
      subhead: item.location,
      data: item.hour,
      icon: null,
      onPress: null,
      isCustomerSupportHour: true,
    };
  });

  if (note)
    customerSupportHourList.push({
      textId: 'profile.help.note.title',
      subhead: null,
      data: note,
      icon: null,
      onPress: null,
      isNote: true,
    });

  const customerSupportHoursData = {
    titleId: 'profile.help.customerSupportHours.title',
    data: customerSupportHourList,
  };

  const result = [
    {
      titleId: 'profile.help.medicalEnquiries',
      data: medicalEnquiries,
    },
  ];

  if (technicalEmail) {
    const otherEnqueries = {
      titleId: 'profile.help.technicalEmail.title',
      data: [
        {
          data: technicalEmail,
          icon: emailIcon,
          onPress: () => tryOpeningLink(`mailto:${technicalEmail}`),
        },
      ],
    };
    result.push(otherEnqueries);
  }
  if (customerSupportHours) result.push(customerSupportHoursData);

  return result;
};
