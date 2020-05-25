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
  PANEL_CLINIC_DETAILS,
  FILTER_MODAL,
  MULTIPLE_CLINICS_LIST_VIEW,
} from '@routes';
import { DocumentViewerModal } from '@components';
import { StackBackButton, ModalBackButton } from '@wrappers/components';
import {
  DoctorLandingScreen,
  PanelSearchScreen,
  PanelClinicDetails,
  FilterModalScreen,
  MultipleClinicsListView,
  DoctorLandingHeader,
} from '@screens/Panel';
import { SingleSelectModal, MultiSelectModal } from '@wrappers/components/form';
import {
  HealthScreen,
  LifestyleForm,
  LifestyleEthnicityModal,
} from '@screens/Health';
import { LifestyleTipsModal } from '@screens/Health/components';
import { useIntl } from '@wrappers/core/hooks';
import { truncate, getDocumentViewerModalOptions } from './utils';

const Stack = createStackNavigator();

const HealthNavigator = () => {
  const intl = useIntl();

  return (
    <Stack.Navigator
      initialRouteName={HEALTH}
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      headerMode="float"
    >
      <Stack.Screen
        name={HEALTH}
        component={HealthScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={LIFESTYLE_FORM}
        component={LifestyleForm}
        options={{
          title: intl.formatMessage({
            id: 'healthFormScreenTitle',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={LIFESTYLE_ETHNICITY_MODAL}
        component={LifestyleEthnicityModal}
        options={{
          title: intl.formatMessage({ id: 'ethnicity' }),
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen
        name={MULTI_SELECT_MODAL}
        component={MultiSelectModal}
        options={({ route }) => ({
          title: route.params?.title,
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        })}
      />
      <Stack.Screen
        name={SINGLE_SELECT_MODAL}
        component={SingleSelectModal}
        options={({ route }) => ({
          title: route.params?.title,
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        })}
      />
      <Stack.Screen
        name={HEALTH_PHOTO_VIEWER_MODAL}
        component={DocumentViewerModal}
        options={({ route, navigation }) => ({
          ...getDocumentViewerModalOptions(route, navigation, intl),
          headerTitle: () => null,
        })}
      />
      <Stack.Screen
        name={DOCTOR_LANDING}
        component={DoctorLandingScreen}
        options={{
          headerBackImage: StackBackButton,
          title: intl.formatMessage({ id: 'health' }),
          ...TransitionPresets.SlideFromRightIOS,
          headerRight: () => <DoctorLandingHeader />,
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
        name={PANEL_CLINIC_DETAILS}
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
        name={FILTER_MODAL}
        component={FilterModalScreen}
        options={{
          title: intl.formatMessage({ id: 'filterModalScreenTitle' }),
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen
        name={LIFESTYLE_TIPS_MODAL}
        component={LifestyleTipsModal}
        options={{
          title: intl.formatMessage({
            id: 'health.LifestyleTips.ModalTitle',
          }),
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen
        name={MULTIPLE_CLINICS_LIST_VIEW}
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
    </Stack.Navigator>
  );
};

export default HealthNavigator;
