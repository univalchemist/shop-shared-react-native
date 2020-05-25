import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  HEALTH,
  HEALTH_PHOTO_VIEWER_MODAL,
  DOCTOR_LANDING,
  PANEL_SEARCH,
  LIFESTYLE_FORM,
  LIFESTYLE_ETHNICITY_MODAL,
  MULTI_SELECT_MODAL,
  SINGLE_SELECT_MODAL,
  LIFESTYLE_TIPS_MODAL,
  FILTER_MODAL,
  MULTIPLE_CLINICS_LIST_VIEW,
  DOCTOR_LISTING,
  DOCTOR_DETAIL,
  SPECIALITY_LISTING,
  HEAL_MULTIPLE_CLINICS_LIST_VIEW,
  CLINIC_DETAILS,
  HEAL_PANEL_CLINIC_DETAILS,
  HEAL_SELECT_FAMILY_MEMBER,
  UNIFY_SEARCH,
  HEAL_SELECT_CLINIC,
  SCAN_QR_CODE,
  CHECK_IN_SELECT_MEMBER,
  CHECK_IN_FORM,
  HEAL_APPOINTMENT_REQUESTED,
  WALK_IN_SELECT_DOCTOR,
  WALK_IN_CHECK_IN,
  CHECK_IN_CONFIRMATION,
  CHECK_IN_SCREEN,
} from '@routes';
import { DocumentViewerModal } from '@components';
import { StackBackButton, ModalBackButton } from '@wrappers/components';
import PanelSearchScreen from '@heal/src/screens/Clinics/ClinicPanel';
import { DoctorLandingScreen, DoctorLandingHeader } from '@screens/Panel';
import { SingleSelectModal, MultiSelectModal } from '@wrappers/components/form';
import {
  HealthScreen,
  LifestyleForm,
  LifestyleEthnicityModal,
} from '@screens/Health';
import { LifestyleTipsModal } from '@screens/Health/components';
import { useIntl } from '@wrappers/core/hooks';
import { truncate, getDocumentViewerModalOptions } from './utils';
import {
  ClinicDetails,
  DoctorDetailScreen,
  DoctorListingScreen,
  ScanQRCodeScreen,
  CheckInSelectMemberScreen,
  CheckInFormScreen,
  SelectDoctor,
  CheckIn,
  ConfirmCheckInScreen,
  CheckInScreen,
} from '@heal/src/screens';
import SpecialistScreen from '@heal/src/screens/SpecialistScreen';
import { healNavigationOptions } from '@heal/src/components';
import MultipleClinicsListView from '@heal/src/screens/Clinics/widgets/MultipleClinicsListView';
import PanelClinicDetails from '@heal/src/screens/Clinics/widgets/PanelClinicDetails';
import SelectFamilyMember from '@heal/src/screens/BookAppointment/SelectFamilyMember';
import SelectClinic from '@heal/src/screens/BookAppointment/SelectClinic';
import UnifySearchScreen from '@heal/src/screens/UnifySearchScreen';
import { Animated } from 'react-native';
import HealTabNavigator from '@heal/src/navigations/HealTabNavigator';
import {
  APPOINTMENT_CONFIRMATION,
  APPOINTMENT_DETAIL,
  APPOINTMENT_LIST,
  THANK_YOU,
  MEDICATION,
  CONFIRM_NEXT,
} from '@heal/routes';
import AppointmentListingScreen from '@heal/src/screens/Appointment/AppointmentListingScreen';
import AppointmentDetailScreen from '@heal/src/screens/Appointment/AppointmentDetailScreen';
import AppointmentConfirmation from '@heal/src/screens/Appointment/AppointmentConfirmation';
import ThankYouScreen from '@heal/src/screens/Appointment/ThankYouScreen';
import MedicationScreen from '@heal/src/screens/Medication/MedicationScreen';
import AppointmentRequested from '@heal/src/screens/BookAppointment/AppointmentRequested';
import ConfirmNextScreen from '@heal/src/screens/WalkIn/ConfirmNextScreen';
const Stack = createStackNavigator();

const HealthNavigator = () => {
  const intl = useIntl();

  return (
    <Stack.Navigator
      initialRouteName={DOCTOR_LANDING}
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      headerMode="screen"
      keyboardHandlingEnabled={false}
    >
      <Stack.Screen
        name={DOCTOR_LANDING}
        component={HealTabNavigator}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'health' }),
          ...TransitionPresets.SlideFromRightIOS,
          headerRight: () => <DoctorLandingHeader />,
        }}
      />
      <Stack.Screen
        name={SCAN_QR_CODE}
        component={ScanQRCodeScreen}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'heal.checkin.title' }),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name={CHECK_IN_SELECT_MEMBER}
        component={CheckInSelectMemberScreen}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'heal.checkin.title' }),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={CHECK_IN_FORM}
        component={CheckInFormScreen}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'heal.checkin.title' }),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={UNIFY_SEARCH}
        component={UnifySearchScreen}
        options={{
          cardStyleInterpolator,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SPECIALITY_LISTING}
        component={SpecialistScreen}
        options={{
          ...healNavigationOptions,
          title: intl.formatMessage({ id: 'specialist' }),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={DOCTOR_LISTING}
        component={DoctorListingScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={DOCTOR_DETAIL}
        component={DoctorDetailScreen}
        options={{
          ...healNavigationOptions,
          title: intl.formatMessage({ id: 'doctor' }),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={PANEL_SEARCH}
        component={PanelSearchScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={CLINIC_DETAILS}
        component={ClinicDetails}
        options={({ route }) => {
          return {
            title: intl.formatMessage({ id: 'heal.clinic' }),
            headerBackImage: StackBackButton,
            ...TransitionPresets.SlideFromRightIOS,
          };
        }}
      />
      <Stack.Screen
        name={HEAL_PANEL_CLINIC_DETAILS}
        component={PanelClinicDetails}
        options={({ route }) => {
          const clinicName = route.params?.selectedClinic?.name;
          const title = truncate(clinicName, 20);
          return {
            title,
            headerBackImage: StackBackButton,
          };
        }}
      />
      <Stack.Screen
        name={WALK_IN_SELECT_DOCTOR}
        component={SelectDoctor}
        options={{
          title: intl.formatMessage({
            id: 'heal.walkInSelectDoctor.title',
          }),
          // headerShown: false,

          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={WALK_IN_CHECK_IN}
        component={CheckIn}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name={HEAL_MULTIPLE_CLINICS_LIST_VIEW}
        component={MultipleClinicsListView}
        options={({ route }) => ({
          title: intl.formatMessage(
            {
              id: 'panelSearch.multipleClinicsListViewTitle',
            },
            { noOfClinics: route.params?.clinics?.length },
          ),
          headerBackImage: StackBackButton,
        })}
      />
      <Stack.Screen
        name={HEAL_SELECT_FAMILY_MEMBER}
        component={SelectFamilyMember}
        options={({ route }) => ({
          title: intl.formatMessage({
            id: 'doctor.scheduleAppointment',
          }),
          headerBackImage: StackBackButton,
          ...TransitionPresets.SlideFromRightIOS,
        })}
      />
      <Stack.Screen
        name={HEAL_SELECT_CLINIC}
        component={SelectClinic}
        options={({ route }) => ({
          title: intl.formatMessage({
            id: 'doctor.scheduleAppointment',
          }),
          headerBackImage: StackBackButton,
          ...TransitionPresets.SlideFromRightIOS,
        })}
      />
      <Stack.Screen
        name={APPOINTMENT_LIST}
        component={AppointmentListingScreen}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'health' }),
          ...TransitionPresets.SlideFromRightIOS,
          headerRight: () => <DoctorLandingHeader />,
        }}
      />
      <Stack.Screen
        name={APPOINTMENT_DETAIL}
        component={AppointmentDetailScreen}
        options={{
          headerBackImage: StackBackButton,
          title: 'Clinic',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={CONFIRM_NEXT}
        component={ConfirmNextScreen}
        options={{
          headerBackImage: StackBackButton,
          title: 'Appointment schedule',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={APPOINTMENT_CONFIRMATION}
        component={AppointmentConfirmation}
        options={{
          cardStyleInterpolator,
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={THANK_YOU}
        component={ThankYouScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={MEDICATION}
        component={MedicationScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={HEAL_APPOINTMENT_REQUESTED}
        component={AppointmentRequested}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name={CHECK_IN_SCREEN}
        component={CheckInScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'heal.checkin.title' }),
        }}
      />
      <Stack.Screen
        name={CHECK_IN_CONFIRMATION}
        component={ConfirmCheckInScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const cardStyleInterpolator = ({ current: { progress } }) => ({
  cardStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    }),
  },
  overlayStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.85],
      extrapolate: 'clamp',
    }),
  },
});

export default HealthNavigator;
