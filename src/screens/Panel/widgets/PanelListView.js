import React from 'react';
import {
  Box,
  ErrorPanel,
  SectionHeadingText,
  ListItemWithRightChevron,
  Text,
  Image,
} from '@wrappers/components';
import { FlatList } from 'react-native';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import { PANEL_CLINIC_DETAILS } from '@routes';
import { categories, logAction } from '@store/analytics/trackingActions';
import { TerminatedLabel } from '@screens/Panel';
import FeatureToggle from '@config/FeatureToggle';

const getPhoneNumbersString = props => {
  var phoneNumbers = [
    props.contactNumber1,
    props.contactNumber2,
    props.contactNumber3,
  ];
  return phoneNumbers
    .filter(Boolean)
    .filter(phoneNumber => /\S/.test([phoneNumber]))
    .join(', ');
};

const getTextOrDash = text => {
  return text?.trim() || '-';
};

const PanelListItem = React.memo(function PanelListItem(props) {
  const { navigation, ...clinic } = props;

  return (
    <ListItemWithRightChevron
      accessibilityLabel={clinic.name}
      onPress={() => {
        logAction({
          category: categories.PANEL_CLINICS,
          action: 'View clinic details from list',
        });
        navigation.navigate(PANEL_CLINIC_DETAILS, { selectedClinic: clinic });
      }}
    >
      {FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.on &&
        !!clinic.terminationDate && <TerminatedLabel />}
      <Text fontWeight="bold" numberOfLines={1}>
        {getTextOrDash(clinic.name)}
      </Text>
      <Text style={{ textTransform: 'capitalize' }} numberOfLines={1}>
        {getTextOrDash(clinic.specialty)}
      </Text>
      <Text numberOfLines={1}>
        {getTextOrDash(getPhoneNumbersString(clinic))}
      </Text>
      <Text numberOfLines={2}>{getTextOrDash(clinic.address)}</Text>
    </ListItemWithRightChevron>
  );
});

export const PanelListView = ({ clinics, navigation }) => {
  const theme = useTheme();
  const intl = useIntl();

  return clinics && clinics.length > 0 ? (
    <Box style={{ backgroundColor: theme.backgroundColor.default }}>
      <FlatList
        data={clinics}
        stickyHeaderIndices={[0]}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        keyExtractor={item => `${item.id}`}
        ListHeaderComponent={
          <Box backgroundColor="gray.7" px={4} pt={3} pb={2}>
            <SectionHeadingText accessibilityLabel="Number of Clinics Found">
              {intl.formatMessage(
                { id: 'panelSearch.clinicFound' },
                { noOfClinics: clinics.length },
              )}
            </SectionHeadingText>
          </Box>
        }
        renderItem={({ item }) => {
          return <PanelListItem navigation={navigation} {...item} />;
        }}
      />
    </Box>
  ) : (
    <ErrorPanel
      heading={intl.formatMessage({
        id: 'panelSearch.clinicMap.noClinicAvailable.title',
      })}
      description={intl.formatMessage({
        id: 'panelSearch.clinicMap.noClinicAvailable.description',
      })}
    />
  );
};

export default PanelListView;
