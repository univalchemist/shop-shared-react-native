import React from 'react';
import { Text } from '@wrappers/components';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import styled from 'styled-components/native';
import { CallToActionLink } from './CallToActionLink';
import { TouchableHighlight, Linking, View } from 'react-native';
import { externalLinkBlack } from '@images';
import { categories, logAction } from '@store/analytics/trackingActions';

export const TouchableContainer = styled(TouchableHighlight)`
  background-color: ${props => props.theme.colors.white};
  border-radius: 4;
  padding-top: 32;
  margin-bottom: 8;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05px;
  shadow-radius: 3;
  shadow-color: #000;
  flex-grow: 1;
`;

const Topic = styled(Text)`
  color: ${props => props.theme.colors.gray[0]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 22;
  font-weight: ${props => props.theme.fontWeights.bold};
  letter-spacing: 0.3;
  padding-left: 24;
  padding-right: 24;
`;

const Source = styled(Text)`
  color: ${props => props.theme.colors.gray[0]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 22;
  letter-spacing: 0.3;
  padding-left: 24;
  padding-right: 24;
`;

const Description = styled(Text)`
  padding-top: 32;
  color: ${props => props.theme.colors.gray[8]};
  font-size: ${props => props.theme.fontSizes[2]};
  line-height: 22;
  letter-spacing: 0.3;
  padding-left: 24;
  padding-right: 24;
  padding-bottom: 32;
`;

export const TipCard = ({ topic, source, text, link }) => {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <TouchableContainer
      accessible={true}
      accessibilityRole={'link'}
      underlayColor={theme.colors.touchableOverlayColor}
      onPress={() => {
        if (link) {
          Linking.openURL(link);
        }

        logAction({
          category: categories.LIFESTYLE_OVERVIEW,
          action: `Learn more ${topic}`,
        });
      }}
      theme={theme}
    >
      <>
        <View flexGrow={1}>
          <Topic accessible={true} accessibilityLabel={topic} flexGrow={1}>
            {topic}
          </Topic>
          <Source accessible={true} accessibilityLabel={source} flexGrow={1}>
            {`${intl.formatMessage({
              id: 'health.LifestyleTips.By',
            })} ${source}`.trim()}
          </Source>
          <Description accessible={true} accessibilityLabel={text} flexGrow={1}>
            {text}
          </Description>
        </View>
        <CallToActionLink
          text={intl.formatMessage({ id: 'health.learnMore' })}
          icon={externalLinkBlack}
        />
      </>
    </TouchableContainer>
  );
};
