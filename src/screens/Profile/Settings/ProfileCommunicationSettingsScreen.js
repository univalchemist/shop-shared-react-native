import React from 'react';
import { Container, Box, Text } from '@wrappers/components';
import { connect } from 'react-redux';
import { updateEdmOptedOut } from '@store/user/actions';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { Switch } from 'react-native';
import { MYWELLNESS_NEWSLETTER_SCREEN } from '@routes';
import { FormattedMessage } from 'react-intl';

const ProfileCommunicationSettingsScreen = ({
  isEdmOptedOut,
  updateEdmOptedOut,
  navigation,
}) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box bg="backgroundColor" flex={1}>
      <Container>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text color={theme.colors.black} fontWeight={theme.fontWeights.bold}>
            {intl.formatMessage({
              id: 'profile.settings.communication.wellnessNewsletterLabel',
            })}
          </Text>
          <Switch value={isEdmOptedOut} onValueChange={updateEdmOptedOut} />
        </Box>

        <Box maxWidth="85%">
          <Text>
            <FormattedMessage
              id="profile.settings.communication.edmOptOut"
              values={{
                promotional: (
                  <Text
                    color="fonts.blackLink"
                    onPress={() => {
                      navigation.navigate(MYWELLNESS_NEWSLETTER_SCREEN, {
                        myWellnessNewsletterTitle: intl.formatMessage({
                          id: 'wn.title',
                        }),
                      });
                    }}
                  >
                    {intl.formatMessage({
                      id: 'edmPromotional',
                    })}
                  </Text>
                ),
              }}
            />
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

const enhance = connect(
  state => ({
    isEdmOptedOut: state.user.isEdmOptedOut,
  }),
  {
    updateEdmOptedOut,
  },
);

export default enhance(ProfileCommunicationSettingsScreen);
