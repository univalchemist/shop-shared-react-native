import React from 'react';
import { renderForTest } from '@testUtils';
import HealthScoreHistoryGraph from '../HealthScoreHistoryGraph';
import { BarChart } from 'react-native-svg-charts';
import {
  data,
  dataIncomplete,
  dataWithExcessDataPoints,
  dataConsumedWithExcessDataPoints,
  dataConsumedIncomplete,
  dataConsumed,
} from '../testData';
import theme from '@theme';

const removeOnPressFunction = data => {
  return data.map(point => ({
    value: point.value,
    createdOn: point.createdOn,
  }));
};

describe('HealthScoreHistoryGraph', () => {
  it('should match snapshot', () => {
    const healthScoreHistory = renderForTest(
      <HealthScoreHistoryGraph data={data} />,
    ).toJSON();

    expect(healthScoreHistory).toMatchSnapshot();
  });

  it('should pass data to BarChart canvas', () => {
    const component = renderForTest(<HealthScoreHistoryGraph data={data} />);
    const passedData = removeOnPressFunction(dataConsumed);

    expect(
      removeOnPressFunction(component.queryAllByType(BarChart)[0].props.data),
    ).toMatchObject(passedData);
  });

  describe('rendering incomplete or invalid data', () => {
    it('should render 6 points data when less than 6 points data is passed ', () => {
      const component = renderForTest(
        <HealthScoreHistoryGraph data={dataIncomplete} />,
      );
      const passedData = removeOnPressFunction(dataConsumedIncomplete);

      expect(
        removeOnPressFunction(component.queryAllByType(BarChart)[0].props.data),
      ).toEqual(passedData);
    });

    it('should render last 6 points of data when more than 6 points data is passed ', () => {
      const component = renderForTest(
        <HealthScoreHistoryGraph data={dataWithExcessDataPoints} />,
      );

      const passedData = removeOnPressFunction(
        dataConsumedWithExcessDataPoints,
      );

      expect(
        removeOnPressFunction(component.queryAllByType(BarChart)[0].props.data),
      ).toEqual(passedData);
    });

    it('should render no date when createdOn date passed is invalid', () => {
      const component = renderForTest(
        <HealthScoreHistoryGraph
          data={[{ score: 10, createdOn: 'invalid-date' }]}
        />,
      );
      const dataRendered = [
        { value: 10, createdOn: '' },
        { value: 0, createdOn: '' },
        { value: 0, createdOn: '' },
        { value: 0, createdOn: '' },
        { value: 0, createdOn: '' },
        { value: 0, createdOn: '' },
      ];
      expect(
        removeOnPressFunction(component.queryAllByType(BarChart)[0].props.data),
      ).toEqual(dataRendered);
    });
  });

  it('should render Vertical Labels', () => {
    const component = renderForTest(<HealthScoreHistoryGraph data={data} />);

    expect(
      component.queryAllByProps({ accessibilityLabel: 'Vertical Label 0' })[0]
        .props.children,
    ).toBe(100);
    expect(
      component.queryAllByProps({ accessibilityLabel: 'Vertical Label 1' })[0]
        .props.children,
    ).toBe(75);
    expect(
      component.queryAllByProps({ accessibilityLabel: 'Vertical Label 2' })[0]
        .props.children,
    ).toBe(50);
    expect(
      component.queryAllByProps({ accessibilityLabel: 'Vertical Label 3' })[0]
        .props.children,
    ).toBe(25);
    expect(
      component.queryAllByProps({ accessibilityLabel: 'Vertical Label 4' })[0]
        .props.children,
    ).toBe(0);
  });

  it('should highlight correct latest bar and render latest score label', () => {
    const testData = [
      {
        score: 100,
        createdOn: '2019-01-12T00:00:00',
      },
      {
        score: 25,
        createdOn: '2019-01-31T00:00:00',
      },
      {
        score: 1,
        createdOn: '2019-02-28T00:00:00',
      },
    ];
    const noOfTestData = testData.length;
    const component = renderForTest(
      <HealthScoreHistoryGraph data={testData} />,
    );

    // Bar color
    expect(
      component.queryAllByType(BarChart)[0].props.data[0].svg.fill,
    ).toEqual(theme.colors.gray[3]);
    expect(
      component.queryAllByType(BarChart)[0].props.data[1].svg.fill,
    ).toEqual(theme.colors.gray[3]);
    expect(
      component.queryAllByType(BarChart)[0].props.data[2].svg.fill,
    ).toEqual(theme.colors.black);
    expect(
      component.queryAllByType(BarChart)[0].props.data[3].svg.fill,
    ).toEqual(theme.colors.gray[3]);
    expect(
      component.queryAllByType(BarChart)[0].props.data[4].svg.fill,
    ).toEqual(theme.colors.gray[3]);
    expect(
      component.queryAllByType(BarChart)[0].props.data[5].svg.fill,
    ).toEqual(theme.colors.gray[3]);

    // Rounded Addendum
    expect(
      component.queryAllByType(BarChart)[0].props.children[2].props.barColors,
    ).toEqual([
      theme.colors.gray[3],
      theme.colors.gray[3],
      theme.colors.black,
      theme.colors.gray[3],
      theme.colors.gray[3],
      theme.colors.gray[3],
    ]);

    //Score Label
    expect(
      component.queryAllByType(BarChart)[0].props.children[0].props
        .activeLabelIndex,
    ).toBe(noOfTestData - 1);
  });

  describe('onPressing bars', () => {
    it('should render correct color for bars on click', () => {
      const component = renderForTest(<HealthScoreHistoryGraph data={data} />);

      for (let onPressedIndex = 0; onPressedIndex < 6; onPressedIndex++) {
        component
          .queryAllByType(BarChart)[0]
          .props.data[onPressedIndex].svg.onPress();
        component
          .queryAllByType(BarChart)[0]
          .props.data.forEach((bar, barIndex) => {
            onPressedIndex === barIndex
              ? expect(bar.svg.fill).toEqual(theme.colors.black)
              : expect(bar.svg.fill).toEqual(theme.colors.gray[3]);
          });
      }
    });

    it('should render correct color on rounded addendum on bar pressed', () => {
      const component = renderForTest(<HealthScoreHistoryGraph data={data} />);
      const colorArray = [
        theme.colors.gray[3],
        theme.colors.gray[3],
        theme.colors.gray[3],
        theme.colors.gray[3],
        theme.colors.gray[3],
        theme.colors.gray[3],
      ];

      for (let i = 0; i < 6; i++) {
        component.queryAllByType(BarChart)[0].props.data[i].svg.onPress();
        const newColorArray = colorArray.map((color, index) =>
          index !== i ? color : theme.colors.black,
        );
        expect(
          component.queryAllByType(BarChart)[0].props.children[2].props
            .barColors,
        ).toEqual(newColorArray);
      }
    });

    it('should activate the correct score label', () => {
      const component = renderForTest(<HealthScoreHistoryGraph data={data} />);

      for (let i = 0; i < 6; i++) {
        component.queryAllByType(BarChart)[0].props.data[i].svg.onPress();
        expect(
          component.queryAllByType(BarChart)[0].props.children[0].props
            .activeLabelIndex,
        ).toBe(i);
      }
    });
  });
});
