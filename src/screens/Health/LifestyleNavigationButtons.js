import React from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight } from 'react-native';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import { Image, Text, Box, Flex } from '@wrappers/components';
import { pencilIcon, magnifyingGlassIcon } from '@images';
import { LIFESTYLE_FORM, PANEL_SEARCH } from '@routes';
import styled from 'styled-components/native';
import { withTracking } from '@wrappers/components';
import { categories } from '@store/analytics/trackingActions';

const TouchableContainer = styled(TouchableHighlight)`
  background-color: ${props => props.theme.colors.white};
  border-radius: 4;
  display: flex;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05px;
  shadow-radius: 3;
  shadow-color: #000;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TrackedButton = withTracking(
  ({ iconPath, titleResourceKey, onPress }) => {
    const theme = useTheme();
    const intl = useIntl();

    return (
      <TouchableContainer
        accessible={true}
        accessibilityLabel={intl.formatMessage({ id: titleResourceKey })}
        accessibilityRole={'button'}
        onPress={onPress}
        underlayColor={theme.colors.touchableOverlayColor}
      >
        <Box
          flexDirection="row"
          py={20}
          px={2}
          width="90%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box pr={15}>
            <Image source={iconPath} size={24} resizeMode="contain" />
          </Box>
          <Box flex={2}>
            <Text fontSize={12} lineHeight={16} color={theme.colors.gray[0]}>
              {intl.formatMessage({ id: titleResourceKey })}
            </Text>
          </Box>
        </Box>
      </TouchableContainer>
    );
  },
);

export const LifestyleNavigationButtons = ({
  hasLifestyleResults,
  navigation,
}) => {
  return (
    <Flex flexDirection="row" justifyContent="center">
      <Box flex={1}>
        <TrackedButton
          titleResourceKey={
            hasLifestyleResults
              ? 'health.updateLifestyleData'
              : 'health.addLifestyleData'
          }
          iconPath={pencilIcon}
          onPress={() => navigation.navigate(LIFESTYLE_FORM)}
          actionParams={{
            category: categories.LIFESTYLE_OVERVIEW,
            action: hasLifestyleResults
              ? 'Update my lifestyle data'
              : 'Add my lifestyle data',
          }}
        />
      </Box>
      <Box flex={0.05} />
      <Box flex={1}>
        <TrackedButton
          titleResourceKey={'panelSearch.searchForClinics'}
          iconPath={magnifyingGlassIcon}
          onPress={() => navigation.navigate(PANEL_SEARCH)}
          actionParams={{
            category: categories.LIFESTYLE_OVERVIEW,
            action: 'Search for a panel clinic',
          }}
        />
      </Box>
    </Flex>
  );
};

const mapStateToProps = ({ health: { hasLifestyleResults } }) => ({
  hasLifestyleResults,
});

const enhance = Component => connect(mapStateToProps)(Component);

export default enhance(LifestyleNavigationButtons);
