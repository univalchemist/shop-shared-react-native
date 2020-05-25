import React from 'react';
import { renderForTestWithStore } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ContactScreen from '../ContactScreen';
import {
  ListSkeletonPlaceholder,
  ErrorPanel,
  ListItem,
  Image,
} from '@wrappers/components';
import { phoneIcon, emailIcon } from '@images';
import { Linking } from 'react-native';

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
    note:
      'Please provide your staff ID or policy number with certificate number or membership on your physical card while submitting any inquires for faster process',
  },
};

const contactEmptyContent = {
  clientId: 'cxadevclient1',
  details: {
    email: null,
    phones: [],
    customerSupportHours: [],
    note: null,
  },
};

const api = {
  fetchContactContent: jest.fn(() =>
    Promise.resolve({ data: { ...contactContent } }),
  ),
};

describe('ContactScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render skeleton loader when isLoading', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );

    expect(Component.getAllByType(ListSkeletonPlaceholder).length).toEqual(1);
    await flushMicrotasksQueue();
    expect(Component.queryByType(ListSkeletonPlaceholder)).toBeNull();
  });

  it('should render null item when email is null', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api: {
          fetchContactContent: jest.fn(() =>
            Promise.resolve({ data: contactEmptyContent }),
          ),
        },
      },
    );

    expect(Component.getAllByType(ListSkeletonPlaceholder).length).toEqual(1);
    await flushMicrotasksQueue();
    expect(Component.queryByType(ListSkeletonPlaceholder)).toBeNull();
  });

  it('should display error panel when unable to fetch data', async () => {
    const api = {
      fetchContactContent: jest.fn(() => Promise.reject({})),
    };
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchContactContent).toHaveBeenCalled();
    expect(Component.getAllByType(ErrorPanel).length).toBe(1);
  });

  it('should display correctly when data successfully loads', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should display correct sections for help when data successfully loads', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );

    await flushMicrotasksQueue();
    expect(api.fetchContactContent).toHaveBeenCalled();
    expect(Component.getByText('+852 3070 5005 (Hongkong)')).toBeDefined();
    expect(Component.getByText('+853 0800 284 (Macau)')).toBeDefined();
    expect(Component.getByText('medicalservice@axa.com.hk')).toBeDefined();
  });

  it('should render phone icon for phone number', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const callListItem = Component.queryAllByType(ListItem);
    expect(callListItem[1].props.leftIcon.type).toEqual(Image);
    expect(callListItem[0].props.leftIcon.props.source).toEqual(phoneIcon);
  });

  it('should render email icon for email id', async () => {
    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const callListItem = Component.queryAllByType(ListItem);
    expect(callListItem[0].props.leftIcon.type).toEqual(Image);
    expect(callListItem[0].props.leftIcon.props.source).toEqual(phoneIcon);
    expect(callListItem[1].props.leftIcon.type).toEqual(Image);
    expect(callListItem[1].props.leftIcon.props.source).toEqual(phoneIcon);
    expect(callListItem[2].props.leftIcon.type).toEqual(Image);
    expect(callListItem[2].props.leftIcon.props.source).toEqual(emailIcon);
  });

  it('should attempt opening native call dialer when clicking on mobile number', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());

    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const phoneNumber = Component.queryAllByType(ListItem)[0];
    await fireEvent.press(phoneNumber);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith(`tel:+852 3070 5005`);
  });

  it('should attempt opening native email client when clicking email id', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());

    const [Component] = renderForTestWithStore(
      <ContactScreen navigation={{}} />,
      { api },
    );
    await flushMicrotasksQueue();

    const phoneItem1 = Component.queryAllByType(ListItem)[0];
    await fireEvent.press(phoneItem1);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith('tel:+852 3070 5005');

    const phoneItem2 = Component.queryAllByType(ListItem)[1];
    await fireEvent.press(phoneItem2);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith('tel:+853 0800 284');

    const emailId = Component.queryAllByType(ListItem)[2];
    await fireEvent.press(emailId);
    await flushMicrotasksQueue();

    expect(Linking.openURL).toHaveBeenCalledWith(
      `mailto:medicalservice@axa.com.hk`,
    );
  });
});
