import React, { useState } from 'react';
import { BarChart } from 'react-native-svg-charts';
import { G, Rect, Polygon, Line, Svg } from 'react-native-svg';
import theme from '@theme';
import PropTypes from 'prop-types';
import { Box, Text, TextSkeletonPlaceholder } from '@wrappers/components';
import { SvgText } from '@components';
import { useIntl } from '@wrappers/core/hooks';
import { connect } from 'react-redux';
import { getFormattedDateWithMonthAndDay } from '@utils';

function HealthScoreHistoryLoading() {
  return (
    <Box>
      <Box alignItems="center">
        <TextSkeletonPlaceholder width={136} />
      </Box>
      <Box mt={3} flexDirection="row" justifyContent="center">
        <Box height={GRAPH_HEIGHT} width={'10%'}>
          {VERTICAL_LABEL_VALUES.map((_, index, values) => (
            <Box
              key={index}
              position="absolute"
              top={
                GRAPH_PADDING_TOP +
                index * (GRAPH_HEIGHT_WITHOUT_PADDINGS / (values.length - 1)) -
                6
              }
            >
              <TextSkeletonPlaceholder
                width={20}
                fontSize={12}
                lineHeight={12}
              />
            </Box>
          ))}
        </Box>
        <Svg
          accessible={true}
          accessibilityLabel="Bars"
          style={{ height: GRAPH_HEIGHT, width: '90%' }}
        >
          <HorizontalGrids />
        </Svg>
      </Box>
    </Box>
  );
}

const GRAPH_HEIGHT = 240;
const GRAPH_PADDING_TOP = 40;
const GRAPH_PADDING_RIGHT = 20;
const GRAPH_PADDING_BOTTOM = 30;
const GRAPH_PADDING_LEFT = 24;
const VERTICAL_LABEL_WIDTH = 22;
const MIN_Y_VALUE = 0;
const MAX_Y_VALUE = 100;
const BORDER_ROUNDING = 4;
const BAR_BORDER_ROUNDING = 2;
const DATA_POINTS = 6;
const VERTICAL_LABEL_VALUES = [MAX_Y_VALUE, 75, 50, 25, MIN_Y_VALUE];
const GRAPH_HEIGHT_WITHOUT_PADDINGS =
  GRAPH_HEIGHT - GRAPH_PADDING_BOTTOM - GRAPH_PADDING_TOP;

const constructDataObjectForBarChart = (
  data,
  barColors,
  setBarColors,
  setActiveLabelIndex,
  momentLocale,
) => {
  return data.map((point, index) => ({
    value: point.score,
    createdOn: getFormattedDateWithMonthAndDay(point.createdOn, momentLocale),
    svg: {
      onPress: () => {
        setActiveLabelIndex(index);
        setBarColors(
          barColors.map((_, colorIndex) =>
            index === colorIndex ? theme.colors.black : theme.colors.gray[3],
          ),
        );
      },
      fill: barColors[index],
      stroke: theme.colors.transparent,
      strokeWidth: '10',
    },
  }));
};

const adjustDataForInsufficientDataPoints = data => {
  if (data.length < DATA_POINTS) {
    const additionalDataPoints = DATA_POINTS - data.length;
    for (let i = 0; i < additionalDataPoints; i++) {
      data.push({ score: 0, createdOn: '' });
    }
  }
};

const adjustDataForExcessDataPoints = data => {
  if (data.length > DATA_POINTS) {
    const excessDataPoints = data.length - DATA_POINTS;
    data.splice(0, excessDataPoints);
  }
};

const VerticalLabels = () =>
  VERTICAL_LABEL_VALUES.map((value, index, values) => (
    <SvgText
      key={`vertical_label_${index}`}
      testId={'vertical_labels'}
      accessibilityLabel={`Vertical Label ${index}`}
      x={VERTICAL_LABEL_WIDTH}
      y={
        GRAPH_PADDING_TOP +
        index * (GRAPH_HEIGHT_WITHOUT_PADDINGS / (values.length - 1)) +
        4
      }
      fontSize={11}
      fill={theme.colors.gray[8]}
      textAnchor={'end'}
    >
      {value}
    </SvgText>
  ));

const HorizontalGrids = ({ x, _, bandwidth }) => (
  <G>
    {VERTICAL_LABEL_VALUES.map((_, index, values) => {
      return (
        <Line
          key={`horizontal_grid_${index}`}
          accessibilityLabel={`Horizontal Grids`}
          x1="2.5%"
          x2="97.5%"
          y={
            GRAPH_PADDING_TOP +
            index * (GRAPH_HEIGHT_WITHOUT_PADDINGS / (values.length - 1))
          }
          strokeWidth={0.7}
          stroke={theme.colors.gray[5]}
        />
      );
    })}
  </G>
);

const ScoreLabels = ({ x, y, bandwidth, data, activeLabelIndex }) =>
  data.map(({ value }, index) => {
    return (
      activeLabelIndex === index && (
        <G
          key={`label_group_${index}`}
          accessibilityLabel={`Label Group ${index}`}
          x={x(index) + bandwidth / 2 - 16}
          y={y(value) - 38}
        >
          <Rect
            key={`label_rect_${index}`}
            width="32"
            height="28"
            rx={BORDER_ROUNDING}
            ry={BORDER_ROUNDING}
            fill={theme.colors.black}
          />
          <Polygon
            key={`label_triangle_${index}`}
            points={`13,28 16,33 19,28`}
            fill={theme.colors.black}
          />
          <SvgText
            key={`label_text_${index}`}
            fontSize={14}
            lineHeight={16}
            fill={theme.colors.white}
            dominantBaseline={'middle'}
            textAnchor={'middle'}
            x="16"
            y="19"
            fontWeight="600"
          >
            {value}
          </SvgText>
        </G>
      )
    );
  });

const HorizontalLabels = ({ x, _, bandwidth, data }) =>
  data.map(({ createdOn }, index) => {
    return (
      <SvgText
        key={index}
        accessibilityLabel={`Horizontal Label ${index}`}
        x={x(index) + bandwidth / 2}
        y={GRAPH_HEIGHT - GRAPH_PADDING_BOTTOM + 20}
        fontSize={9}
        dominantBaseline="central"
        textAnchor="middle"
        fill={theme.colors.gray[8]}
        transform={`rotate(-30, ${x(index) + bandwidth / 2}, ${GRAPH_HEIGHT -
          GRAPH_PADDING_BOTTOM +
          20})`}
      >
        {createdOn}
      </SvgText>
    );
  });

const RoundedAddendum = ({ x, y, bandwidth, data, barColors }) =>
  data.map(({ value }, index) => (
    <G key={index}>
      {value > 4 && (
        <Rect
          accessibilityLabel="Rounded Tops"
          x={x(index)}
          y={y(value)}
          rx={BAR_BORDER_ROUNDING}
          ry={BAR_BORDER_ROUNDING}
          width={bandwidth}
          height={8}
          fill={barColors[index]}
        />
      )}
      {value > 0 && (
        <Rect
          accessibilityLabel="Rounded Bottoms"
          x={x(index)}
          y={GRAPH_HEIGHT - GRAPH_PADDING_BOTTOM}
          rx={BAR_BORDER_ROUNDING}
          ry={BAR_BORDER_ROUNDING}
          width={bandwidth}
          height={1}
          fill={barColors[index]}
        />
      )}
    </G>
  ));

const getBarColors = noOfDataPoints => {
  let barColorArray = [];
  for (let bar = 0; bar < 6; bar++) {
    bar === noOfDataPoints - 1
      ? barColorArray.push(theme.colors.black)
      : barColorArray.push(theme.colors.gray[3]);
  }
  return barColorArray;
};

export const HealthScoreHistoryGraph = ({ data, momentLocale }) => {
  const intl = useIntl();
  const noOfDataPoints = data.length;

  adjustDataForInsufficientDataPoints(data);
  adjustDataForExcessDataPoints(data);

  const [barColors, setBarColors] = useState(getBarColors(noOfDataPoints));
  const [activeLabelIndex, setActiveLabelIndex] = useState(noOfDataPoints - 1);

  return (
    <Box>
      <Text
        accessible={true}
        accessibilityLabel={intl.formatMessage({
          id: 'health.healthScoreHistory.heading',
        })}
        color={theme.colors.gray[0]}
        textAlign="center"
      >
        {intl.formatMessage({
          id: 'health.healthScoreHistory.heading',
        })}
      </Text>
      <Box
        mt={3}
        flexDirection="row"
        justifyContent="center"
        accessible={true}
        accessibilityLabel={intl.formatMessage({
          id: `health.healthScoreHistory.barChart`,
        })}
      >
        <Box width={VERTICAL_LABEL_WIDTH}>
          <Svg height={GRAPH_HEIGHT}>
            <VerticalLabels />
          </Svg>
        </Box>
        <Box flexGrow={1}>
          <BarChart
            accessible={true}
            accessibilityLabel="Bars"
            style={{ height: GRAPH_HEIGHT, width: '100%' }}
            data={constructDataObjectForBarChart(
              data,
              barColors,
              setBarColors,
              setActiveLabelIndex,
              momentLocale,
            )}
            yAccessor={({ item }) => Math.max(item.value - 3, 0)}
            spacingInner={0.88}
            yMin={MIN_Y_VALUE}
            yMax={MAX_Y_VALUE}
            contentInset={{
              left: GRAPH_PADDING_LEFT,
              bottom: GRAPH_PADDING_BOTTOM,
              top: GRAPH_PADDING_TOP,
              right: GRAPH_PADDING_RIGHT,
            }}
          >
            <ScoreLabels activeLabelIndex={activeLabelIndex} />
            <HorizontalGrids belowChart={true} />
            <RoundedAddendum barColors={barColors} belowChart={true} />
            <HorizontalLabels />
          </BarChart>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ intl: { momentLocale } }) => ({
  momentLocale,
});

HealthScoreHistoryGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number.isRequired,
      createdOn: PropTypes.string.isRequired,
    }),
  ),
};

export { HealthScoreHistoryLoading };
export default connect(mapStateToProps)(HealthScoreHistoryGraph);
