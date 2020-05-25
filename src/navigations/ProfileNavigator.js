import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { connect } from 'react-redux';
import {
  PROFILE,
  PROFILE_DOCUMENTS,
  PROFILE_DOCUMENT_VIEWER_MODAL,
  PROFILE_MEMBER_MODAL,
  PROFILE_EHEALTH_CARD,
  PROFILE_HELP,
  PROFILE_HELP_FAQ,
  PROFILE_HELP_FAQ_DETAILS,
  PROFILE_MY_BENEFITS,
  PROFILE_BENEFIT_DETAILS,
  PROFILE_MY_DETAILS,
  PROFILE_DEPENDENT_INVITE,
  PROFILE_SETTINGS,
  PROFILE_LANGUAGE_SETTINGS,
  PROFILE_TERMS_CONDITIONS_SCREEN,
  PROFILE_COMMUNICATION_SCREEN,
  PROFILE_PRIVACY_POLICY_SCREEN,
  MYWELLNESS_NEWSLETTER_SCREEN,
  BIOMETRIC_SETTING_SCREEN,
} from '@routes';
import { DocumentViewerModal } from '@components';
import { StackBackButton, ModalBackButton } from '@wrappers/components';
import { TermsConditionsScreen } from '@screens/TermsConditions';
import {
  ProfileScreen,
  ProfileDocumentsScreen,
  ProfileMemberModal,
  ProfileMyBenefitsScreen,
  ProfileEHealthCardScreen,
  ProfileHelpScreen,
  ProfileHelpFaqScreen,
  ProfileHelpFaqDetailsScreen,
  ProfileBenefitDetailsScreen,
  ProfileMyDetailsScreen,
  ProfileDependentInviteScreen,
  ProfileSettingsScreen,
  ProfileLanguageSettingsScreen,
  ProfileCommunicationSettingsScreen,
  PrivacyPolicyScreen,
  BiometricSettingScreen,
} from '@screens/Profile';
import { MyWellnessNewsletterScreen } from '@screens/TermsConditions';
import { useIntl } from '@wrappers/core/hooks';
import { IsEmployee } from '@utils';
import { getDocumentViewerModalOptions } from './utils';

const Stack = createStackNavigator();

const ProfileNavigator = ({ role }) => {
  const intl = useIntl();

  return (
    <Stack.Navigator
      initialRouteName={PROFILE}
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      headerMode="float"
    >
      <Stack.Screen
        name={PROFILE}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={PROFILE_DOCUMENTS}
        component={ProfileDocumentsScreen}
        options={{
          title: intl.formatMessage({
            id: 'profileDocumentsScreenTitle',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_EHEALTH_CARD}
        component={ProfileEHealthCardScreen}
        options={{
          title: intl.formatMessage({
            id: 'screen.title.profileEHealthCard',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_HELP}
        component={ProfileHelpScreen}
        options={{
          title: intl.formatMessage({
            id: 'screen.title.profileHelp',
          }),
          headerBackImage: StackBackButton,
        }}
      />

      <Stack.Screen
        name={PROFILE_MY_BENEFITS}
        component={ProfileMyBenefitsScreen}
        options={{
          title: intl.formatMessage({
            id: 'screen.title.profileMyBenefits',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_DOCUMENT_VIEWER_MODAL}
        component={DocumentViewerModal}
        options={({ route, navigation }) => ({
          ...getDocumentViewerModalOptions(route, navigation, intl),
          headerTitle: () => null,
        })}
      />
      <Stack.Screen
        name={PROFILE_MEMBER_MODAL}
        component={ProfileMemberModal}
        options={{
          title: intl.formatMessage({
            id: 'profile.myBenefits.select.member',
          }),
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen
        name={PROFILE_BENEFIT_DETAILS}
        component={ProfileBenefitDetailsScreen}
        options={({ route }) => ({
          title: route.params?.product?.name,
          headerBackImage: StackBackButton,
        })}
      />
      <Stack.Screen
        name={PROFILE_MY_DETAILS}
        component={ProfileMyDetailsScreen}
        options={{
          title: intl.formatMessage({
            id: 'profile.details.myDetailsTitle',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_DEPENDENT_INVITE}
        component={ProfileDependentInviteScreen}
        options={({ route }) => ({
          title: intl.formatMessage(
            {
              id: 'profile.dependentInvite.headerTitle',
            },
            {
              dependentName: route.params?.dependent?.fullName,
            },
          ),
          headerBackImage: StackBackButton,
        })}
      />
      <Stack.Screen
        name={PROFILE_SETTINGS}
        component={ProfileSettingsScreen}
        options={{
          title: intl.formatMessage({
            id: 'profile.settings',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_LANGUAGE_SETTINGS}
        component={ProfileLanguageSettingsScreen}
        options={{
          title: intl.formatMessage({
            id: 'profile.settings.language',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={BIOMETRIC_SETTING_SCREEN}
        component={BiometricSettingScreen}
        options={({ route }) => ({
          title: route.params?.biometricName,
          headerBackImage: StackBackButton,
        })}
      />
      <Stack.Screen
        name={PROFILE_TERMS_CONDITIONS_SCREEN}
        component={TermsConditionsScreen}
        options={{
          title: intl.formatMessage({
            id: 'termsConditionsModalTitle',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={PROFILE_PRIVACY_POLICY_SCREEN}
        component={PrivacyPolicyScreen}
        options={{
          title: intl.formatMessage({
            id: 'profile.settings.privacyPolicy',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      {IsEmployee(role) && (
        <>
          <Stack.Screen
            name={PROFILE_HELP_FAQ}
            component={ProfileHelpFaqScreen}
            options={{
              title: intl.formatMessage({
                id: 'screen.title.profileHelp.faq',
              }),
              headerBackImage: StackBackButton,
            }}
          />
          <Stack.Screen
            name={PROFILE_HELP_FAQ_DETAILS}
            component={ProfileHelpFaqDetailsScreen}
            options={({ route }) => ({
              title: route.params?.faq?.name,
              headerBackImage: StackBackButton,
            })}
          />
          <Stack.Screen
            name={PROFILE_COMMUNICATION_SCREEN}
            component={ProfileCommunicationSettingsScreen}
            options={{
              title: intl.formatMessage({
                id: 'profile.settings.communication',
              }),
              headerBackImage: StackBackButton,
            }}
          />
          <Stack.Screen
            name={MYWELLNESS_NEWSLETTER_SCREEN}
            component={MyWellnessNewsletterScreen}
            options={({ route }) => ({
              title: route.params?.myWellnessNewsletterTitle,
              headerBackImage: StackBackButton,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = state => {
  const { role } = state.user;

  return { role };
};

export default connect(mapStateToProps)(ProfileNavigator);
