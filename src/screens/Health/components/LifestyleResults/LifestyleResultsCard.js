import React from 'react';
import { Box, Flex, Image, Text } from '@wrappers/components';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { LIFESTYLE_TIPS_MODAL } from '@routes';
import { TouchableHighlight } from 'react-native';
import { CallToActionLink } from '@screens/Health/components/widgets/CallToActionLink';
import { categories, logAction } from '@store/analytics/trackingActions';

export const Container = styled(TouchableHighlight)`
  background-color: ${props => props.theme.colors.white};
  border-top-color: ${props => props.color};
  flex-grow: 1;
  border-top-width: 4;
  border-radius: 4;
  padding-top: 28;
  display: flex;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05px;
  shadow-radius: 3;
  shadow-color: #000;
`;

export const Score = styled(Text)`
  color: ${props => props.color};
  font-size: ${props => props.theme.fontSizes[5]};
  font-weight: ${props => props.theme.fontWeights.bolder};
  line-height: ${props => props.theme.lineHeights[5]};
  letter-spacing: -1.5;
  margin-top: 6;
  margin-right: 30;
`;

const Title = styled(Text)`
  color: ${props => props.theme.colors.gray[0]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 22;
  letter-spacing: 0.3;
`;

const Status = styled(Text)`
  color: ${props => props.theme.colors.gray[0]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 22;
  font-weight: ${props => props.theme.fontWeights.bold};
  letter-spacing: 0.3;
`;

const Description = styled(Text)`
  padding-top: 32;
  color: ${props => props.theme.colors.gray[8]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 24;
  letter-spacing: 0.3;
  padding-bottom: 32;
`;

const LifestyleResultsCard = ({
  color,
  score,
  title,
  description,
  status,
  iconImage,
  tips,
  textColor,
  navigation,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <Container
      accessible={true}
      accessibilityRole="button"
      underlayColor={theme.colors.touchableOverlayColor}
      theme={theme}
      color={color}
      onPress={() => {
        logAction({
          category: categories.LIFESTYLE_OVERVIEW,
          action: `View result ${tips.category}`,
        });
        navigation.navigate(LIFESTYLE_TIPS_MODAL, { tips });
      }}
    >
      <>
        <Flex flexGrow={1} flexDirection={'row'} px={24}>
          <Box alignSelf={'center'} marginRight={30}>
            {iconImage ? (
              <Image
                accessible={true}
                accessibilityLabel={intl.formatMessage({
                  id: 'health.accessibilityLabel.icon',
                })}
                source={iconImage}
              />
            ) : (
              <Score
                accessible={true}
                accessibilityLabel={score.toFixed(1)}
                color={textColor}
              >
                {score.toFixed(1)}
              </Score>
            )}
          </Box>
          <Flex flexGrow={1} flexDirection={'column'}>
            <Title accessible={true} accessibilityLabel={title} flexGrow={1}>
              {title}
            </Title>
            <Status accessible={true} accessibilityLabel={status} flexGrow={1}>
              {status}
            </Status>
          </Flex>
          <Description
            accessible={true}
            accessibilityLabel={description}
            flexGrow={1}
          >
            {description}
          </Description>
        </Flex>
        <CallToActionLink
          text={intl.formatMessage({
            id: 'health.LifestyleTips.ViewLifestyleTips',
          })}
        />
      </>
    </Container>
  );
};

LifestyleResultsCard.propTypes = {
  color: PropTypes.string.isRequired,
  score: PropTypes.number,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tips: PropTypes.shape({
    category: PropTypes.string,
    result: PropTypes.string,
    tipDescription: PropTypes.string,
  }),
};

export default LifestyleResultsCard;
