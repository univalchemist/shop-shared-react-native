import EHealthCard from '../EHealthCard.hsbc';
import { renderForTest } from '@testUtils';
import React from 'react';

jest.mock('moment', () =>
  jest.fn(() => ({
    format: () => '01-04-2019',
  })),
);

const coPayments = { GP: 20, SP: 30, PHY: 40 };

describe('EHealthCard test', () => {
  it('should match the snapshot', () => {
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        coPayments={coPayments}
        cardType={'PRIMARY'}
        membershipNumber={'T1234567'}
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.getByText('GP: $20')).toBeDefined();
    expect(Component.getByText('SP: $30')).toBeDefined();
    expect(Component.getByText('PHY: $40')).toBeDefined();
    //expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should render blue card for Tier III Dependant', () => {
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        cardType={'SECONDARY'}
        coPayments={coPayments}
        membershipNumber={'T1234567'}
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.getByText('GP: $20')).toBeDefined();
    expect(Component.getByText('SP: $30')).toBeDefined();
    expect(Component.getByText('PHY: $40')).toBeDefined();
    expect(Component.queryByProps({ bg: 'blue.2' })).toBeDefined();
    expect(Component.queryByProps({ bg: 'primary.0' })).toBeNull();
    //expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should render red card for non Tier III Dependant', () => {
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        cardType={'PRIMARY'}
        coPayments={coPayments}
        membershipNumber={'T1234567'}
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.getByText('GP: $20')).toBeDefined();
    expect(Component.getByText('SP: $30')).toBeDefined();
    expect(Component.getByText('PHY: $40')).toBeDefined();
    expect(Component.queryByProps({ bg: 'primary.0' })).toBeDefined();
    expect(Component.queryByProps({ bg: 'blue.2' })).toBeNull();
    //expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should hide co-payment info when co-payment info is not exist', () => {
    const coPayments = { GP: '', SP: null, PHY: undefined };
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        cardType={'PRIMARY'}
        coPayments={coPayments}
        membershipNumber={'T1234567'}
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.queryByText('GP')).toBeNull();
    expect(Component.queryByProps({ bg: 'primary.0' })).toBeDefined();
    expect(Component.queryByProps({ bg: 'blue.2' })).toBeNull();
  });

  it('should hide co-payment info when member is Tier 3 dependant', () => {
    const coPayments = { GP: 20, SP: null, PHY: undefined };
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        cardType={'PRIMARY'}
        coPayments={coPayments}
        membershipNumber={'T1234567'}
        category="Tier 3"
        role="Dependent"
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.queryByText('GP')).toBeNull();
    expect(Component.queryByProps({ bg: 'primary.0' })).toBeDefined();
    expect(Component.queryByProps({ bg: 'blue.2' })).toBeNull();
  });

  it('should show co-payment info when member is Tier 3 employee', () => {
    const coPayments = { GP: 20, SP: null, PHY: undefined };
    const Component = renderForTest(
      <EHealthCard
        name={'testuser01'}
        cardType={'PRIMARY'}
        coPayments={coPayments}
        membershipNumber={'T1234567'}
        category="Tier 3"
        role="Employee"
      />,
    );
    expect(Component.getByText('testuser01')).toBeDefined();
    expect(Component.getByText('T1234567')).toBeDefined();
    expect(Component.getByText('GP: $20')).toBeDefined();
    expect(Component.queryByProps({ bg: 'primary.0' })).toBeDefined();
    expect(Component.queryByProps({ bg: 'blue.2' })).toBeNull();
  });
});
