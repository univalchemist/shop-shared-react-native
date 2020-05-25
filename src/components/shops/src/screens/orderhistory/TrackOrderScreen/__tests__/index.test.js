import React from 'react';
import { renderForTest } from '@testUtils';
import TrackOrderScreen from '../index';
import { GET_TRACK_ORDER } from '@shops/__mocks__/data';
import { flushMicrotasksQueue } from 'react-native-testing-library';

const api = {
  getTrackOrder: jest.fn(() => Promise.resolve({ data: GET_TRACK_ORDER })),
};

describe('TrackOrderScreen', () => {
  it('should render properly', async () => {
    const Comp = renderForTest(
      <TrackOrderScreen route={{ params: { orderId: '1' } }} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    expect(Comp.queryByText('Tracking details')).toBeTruthy();
    expect(Comp.queryByText('Shipping details')).toBeTruthy();
    expect(Comp.queryByText('Status')).toBeTruthy();
    expect(Comp.queryByText(GET_TRACK_ORDER[0].status)).toBeTruthy();
    expect(Comp.queryByText('Delivery partner')).toBeTruthy();
    expect(
      Comp.queryByText(GET_TRACK_ORDER[0].shipments[0].deliveryPartner),
    ).toBeTruthy();
    expect(Comp.queryByText('Tracking number')).toBeTruthy();
    expect(
      Comp.queryByText(GET_TRACK_ORDER[0].shipments[0].trackingNumber),
    ).toBeTruthy();
    expect(Comp.queryByText('Provider name')).toBeTruthy();
    expect(Comp.queryByText('Receiver')).toBeTruthy();
    expect(Comp.queryByText('Thuong Hoang')).toBeTruthy();
    expect(Comp.queryByText('Delivery address')).toBeTruthy();
    expect(
      Comp.queryByText(GET_TRACK_ORDER[0].shipments[0].address.customerAddress),
    ).toBeTruthy();
    expect(Comp.queryByText('Phone number')).toBeTruthy();
    expect(
      Comp.queryByText(GET_TRACK_ORDER[0].shipments[0].address.telephone),
    ).toBeTruthy();
  });
});
