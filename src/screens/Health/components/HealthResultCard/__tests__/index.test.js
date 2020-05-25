import { renderForTest } from '@testUtils';
import React from 'react';
import { HealthResultCard } from '@screens/Health/components';

describe('Health Result Card', () => {
  it('renders the overweight result card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="BMI"
        healthClass="Overweight"
        healthScore={27.4}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the healthy result card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="BMI"
        healthClass="Healthy"
        healthScore={27.4}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the Obese result card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="BMI"
        healthClass="Obese"
        healthScore={31.4}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the ExtremelyObese result card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="BMI"
        healthClass="ExtremelyObese"
        healthScore={41.4}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the low risk prediabetes card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="DIABETES"
        healthClass="LowRisk"
        healthScore={0}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the high risk prediabetes card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="DIABETES"
        healthClass="HighRisk"
        healthScore={4}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });

  it('renders the very high risk prediabetes card correctly', () => {
    const healthResultCard = renderForTest(
      <HealthResultCard
        healthLabel="DIABETES"
        healthClass="VeryHighRisk"
        healthScore={5}
      />,
    ).toJSON();

    expect(healthResultCard).toMatchSnapshot();
  });
});
