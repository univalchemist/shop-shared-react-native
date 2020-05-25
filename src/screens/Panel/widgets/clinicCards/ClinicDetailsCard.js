import React, { useContext } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme, IntlContext } from '@wrappers/core/hooks';
import {
  Box,
  Flex,
  Image,
  Text,
  Divider,
  TouchableContainer,
} from '@wrappers/components';
import { angleRight, phoneIcon, directionIcon } from '@images';
import { compose } from 'redux';
import { connect } from 'react-redux';
import showDirection from '../../utils/ShowDirection';
import { PANEL_CLINIC_DETAILS } from '@routes';
import { CardContainer } from './CardContainer';
import { categories, logAction } from '@store/analytics/trackingActions';
import { TerminatedLabel } from '@screens/Panel';
import FeatureToggle from '@config/FeatureToggle';

const mapStateToProps = ({ panel: { selectedClinic } }) => ({
  clinic: selectedClinic,
});

const enhance = compose(connect(mapStateToProps, null));

const ClinicCardButton = ({ buttonLabel, icon, onPress, actionParams }) => {
  return (
    <Box flex={1} height="100%">
      <TouchableContainer
        onPress={() => {
          onPress();

          if (actionParams) {
            logAction(actionParams);
          }
        }}
      >
        <Box flexDirection="row" px={4} py={3}>
          <Image source={icon} size={24} />
          <Box ml={3}>
            <Text color={'gray.2'} fontSize={2}>
              {buttonLabel}
            </Text>
          </Box>
        </Box>
      </TouchableContainer>
    </Box>
  );
};

const isNotEmpty = value =>
  value != null && value !== undefined && value.trim().length > 0;

const callClinic = clinic => () => {
  let phoneNumbers = [
    clinic.contactNumber1,
    clinic.contactNumber2,
    clinic.contactNumber3,
  ];

  const contactNumber = phoneNumbers.find(isNotEmpty);
  if (contactNumber) {
    Linking.openURL(`tel:${contactNumber}`);
  }
};

export const ClinicDetailsCard = ({ clinic, navigation }) => {
  const theme = useTheme();
  const intl = useContext(IntlContext);

  return (
    <CardContainer>
      <Box height="100%">
        <TouchableContainer
          onPress={() => {
            logAction({
              category: categories.PANEL_CLINICS,
              action: 'View clinic details from map',
            });
            navigation.navigate(PANEL_CLINIC_DETAILS, {
              selectedClinic: clinic,
            });
          }}
          accessibilityLabel={clinic.name}
          flex={3}
          display="flex"
        >
          <>
            <Box px={4} py={3} flex={1} justifyContent="center">
              {FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.on &&
                !!clinic.terminationDate && <TerminatedLabel />}
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flex={6}>
                  <Text
                    fontWeight="bold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {clinic.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.fontSizes[2],
                      color: theme.colors.gray[8],
                      textTransform: 'capitalize',
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {clinic.specialty}
                  </Text>
                </Box>
                <Flex flex={1} justifyContent="flex-end" flexDirection="row">
                  <Image source={angleRight} size={30} />
                </Flex>
              </Box>
            </Box>
            <Divider full />
          </>
        </TouchableContainer>
        <Flex flexDirection="row" alignItems="center" flex={1.2}>
          <ClinicCardButton
            buttonLabel={intl.formatMessage({ id: 'panelSearch.callButton' })}
            icon={phoneIcon}
            onPress={callClinic(clinic)}
            actionParams={{
              category: categories.PANEL_CLINICS,
              action: 'Click on call button',
            }}
          />
          <ClinicCardButton
            buttonLabel={intl.formatMessage({
              id: 'panelSearch.directionButton',
            })}
            icon={directionIcon}
            onPress={() => showDirection(clinic)}
            actionParams={{
              category: categories.PANEL_CLINICS,
              action: 'Click on directions button',
            }}
          />
        </Flex>
        <Flex flex={0.8} />
      </Box>
    </CardContainer>
  );
};

ClinicDetailsCard.propTypes = {
  clinic: PropTypes.shape({
    name: PropTypes.string,
    specialty: PropTypes.string,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
  }),
};

export default enhance(ClinicDetailsCard);
