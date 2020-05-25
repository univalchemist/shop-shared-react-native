import React from 'react';
import { Flex, Box, SvgSkeletonPlaceholder } from '@wrappers/components';
import { useTheme } from '@wrappers/core/hooks';
import { Path, Svg } from 'react-native-svg';

const HealthScoreLayout = ({
  isLoading,
  score,
  maxScore,
  heading,
  description,
  leftFill,
  rightFill,
  topFill,
}) => {
  const theme = useTheme();
  const SvgComponent = isLoading ? SvgSkeletonPlaceholder : Svg;
  const defaultFill = theme.healthScoreGraphicColors.default;
  const _leftFill = leftFill || defaultFill;
  const _rightFill = rightFill || defaultFill;
  const _topFill = topFill || defaultFill;

  return (
    <Flex justifyContent="center">
      <Box alignItems="center" width="100%">
        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Box width="100%" style={{ aspectRatio: 1.448 }}>
            <SvgComponent
              width="100%"
              height="100%"
              viewBox="0 0 252 174"
              fill="none"
            >
              <Path
                d="M19.7813 169.286C24.7224 167.045 26.8608 161.233 25.1112 156.098C21.556 145.662 19.7106 134.618 19.7106 123.281C19.7106 95.6942 30.6992 69.7297 50.7055 50.158C52.6273 48.2402 54.6476 46.4699 56.7172 44.6996L43.9546 29.7012C17.0497 52.3217 0 85.8591 0 123.281C0 137.626 2.52779 151.428 7.14504 164.25C8.9824 169.352 14.8428 171.526 19.7813 169.286Z"
                fill={_leftFill}
              />
              <Path
                d="M59.7724 42.2414C67.3117 36.3896 75.5901 31.5704 84.5092 27.8823C97.6167 22.473 111.562 19.7192 126 19.7192C140.438 19.7192 154.334 22.473 167.491 27.8823C176.41 31.5704 184.688 36.3896 192.228 42.2414L204.99 27.243C183.259 10.1792 155.812 0 125.951 0C96.0891 0 68.5929 10.1792 47.0098 27.1938L59.7724 42.2414Z"
                fill={_topFill}
              />
              <Path
                d="M207.947 29.7012L195.233 44.6996C197.303 46.4207 199.274 48.2402 201.245 50.158C221.202 69.7297 232.24 95.6942 232.24 123.281C232.24 134.571 230.398 145.626 226.848 156.066C225.096 161.218 227.245 167.047 232.203 169.29C237.152 171.529 243.019 169.348 244.86 164.239C249.474 151.432 252 137.66 252 123.281C251.901 85.8591 234.852 52.3217 207.947 29.7012Z"
                fill={_rightFill}
              />
            </SvgComponent>
          </Box>
          <Box position="absolute" alignItems="center" bottom="15%">
            {score}
            {maxScore}
          </Box>
        </Box>
        <Box mt={3}>{heading}</Box>
        <Box mt={2}>{description}</Box>
      </Box>
    </Flex>
  );
};

export default HealthScoreLayout;
