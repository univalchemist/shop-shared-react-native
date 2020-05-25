import { Box, Text, ListItem, Image } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import React from 'react';
import { ScrollView, Linking } from 'react-native';
import {
  phoneIcon,
  directionIcon,
  chevronRightArrow,
  warningIcon,
} from '@images';
import showDirection from './utils/ShowDirection';
import { categories, logAction } from '@store/analytics/trackingActions';
import styled from 'styled-components/native';
import FeatureToggle from '@config/FeatureToggle';

const TerminatedContainer = styled(Box)`
  ${({ theme }) => `
  font-size: ${theme.fontSizes[2]}
  background-color: ${theme.terminatedLabel.backgroundColor}
  padding: 16px
  border-radius: 4px
  `}
`;

const TerminatedText = styled(Text)`
  ${({ theme }) => `
  color: ${theme.colors.gray[0]}
  padding: 0 16px 0 11px
  `}
`;

const ImageBox = styled(Box)`
  padding-top: 3px;
`;

const PanelClinicDetails = ({ route }) => {
  const params = route?.params || {};
  const selectedClinic = params?.selectedClinic;
  const intl = useIntl();
  const theme = useTheme();

  const headerTextStyle = {
    color: theme.colors.gray[3],
  };

  const tryOpeningLink = url => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        alert(`Link: ${url} Could not be opened`);
      });
    }
  };

  const isValueDefined = value => {
    return value?.length > 0;
  };

  const addBreakLine = (consultationIndex, selectedClinic) => {
    return consultationIndex !==
      selectedClinic.consultationTimings.length - 1 ||
      isValueDefined(selectedClinic.peakHour) ? (
      <Text />
    ) : null;
  };

  const logCallAction = () => {
    logAction({
      category: categories.PANEL_CLINIC_DETAILS,
      action: 'Call clinic from clinic details',
    });
  };

  return (
    <Box bg="gray.7" flex={1}>
      <ScrollView>
        <Box flex={1}>
          {FeatureToggle.TERMINATED_LABEL_FOR_CLINIC.on &&
            !!selectedClinic.terminationDate && (
              <Box px={32} py={24} flex={1}>
                <TerminatedContainer flexDirection={'row'}>
                  <ImageBox>
                    <Image source={warningIcon} />
                  </ImageBox>
                  <TerminatedText>
                    {intl.formatMessage({ id: 'panelSearch.terminationText' })}
                  </TerminatedText>
                </TerminatedContainer>
              </Box>
            )}
          {isValueDefined(selectedClinic.contactNumber1) && (
            <ListItem
              leftIcon={
                <Image source={phoneIcon} accessibilityLabel="Phone Icon" />
              }
              rightIcon={
                <Image
                  source={chevronRightArrow}
                  accessibilityLabel="Right Arrow Icon"
                />
              }
              onPress={() => {
                logCallAction();
                tryOpeningLink(`tel:${selectedClinic.contactNumber1}`);
              }}
            >
              <Text>{selectedClinic.contactNumber1}</Text>
            </ListItem>
          )}

          {isValueDefined(selectedClinic.contactNumber2) && (
            <ListItem
              leftIcon={
                <Image source={phoneIcon} accessibilityLabel="Phone Icon" />
              }
              rightIcon={
                <Image
                  source={chevronRightArrow}
                  accessibilityLabel="Right Arrow Icon"
                />
              }
              onPress={() => {
                logCallAction();
                tryOpeningLink(`tel:${selectedClinic.contactNumber2}`);
              }}
            >
              <Text>{selectedClinic.contactNumber2}</Text>
            </ListItem>
          )}

          {isValueDefined(selectedClinic.contactNumber3) && (
            <ListItem
              leftIcon={
                <Image source={phoneIcon} accessibilityLabel="Phone Icon" />
              }
              rightIcon={
                <Image
                  source={chevronRightArrow}
                  accessibilityLabel="Right Arrow Icon"
                />
              }
              onPress={() => {
                logCallAction();
                tryOpeningLink(`tel:${selectedClinic.contactNumber3}`);
              }}
            >
              <Text>{selectedClinic.contactNumber3}</Text>
            </ListItem>
          )}

          {isValueDefined(selectedClinic.address) && (
            <ListItem
              leftIcon={
                <Image
                  source={directionIcon}
                  accessibilityLabel="Direction Icon"
                />
              }
              rightIcon={
                <Image
                  source={chevronRightArrow}
                  accessibilityLabel="Right Arrow Icon"
                />
              }
              onPress={() => {
                logAction({
                  category: categories.PANEL_CLINIC_DETAILS,
                  action: 'Directions from clinic details',
                });

                showDirection(selectedClinic);
              }}
            >
              <Text>{selectedClinic.address}</Text>
            </ListItem>
          )}

          {isValueDefined(selectedClinic.specialty) && (
            <ListItem>
              <Text style={headerTextStyle}>
                {intl.formatMessage({ id: `panelSearch.clinicType` })}
              </Text>
              <Text style={{ textTransform: 'capitalize' }}>
                {selectedClinic.specialty}
              </Text>
            </ListItem>
          )}

          {isValueDefined(selectedClinic.consultationTimings) && (
            <ListItem>
              {selectedClinic.consultationTimings.map(
                (consultation, consultationIndex) =>
                  Object.keys(consultation).map((header, headerIndex) => (
                    <Box key={`${consultationIndex}_${headerIndex}`}>
                      <Text style={headerTextStyle}>{header}</Text>
                      {consultation[header].map((consultationTime, index) => (
                        <Text key={index}>{consultationTime}</Text>
                      ))}
                      {addBreakLine(consultationIndex, selectedClinic)}
                    </Box>
                  )),
              )}
              {isValueDefined(selectedClinic.peakHour) && (
                <Box>
                  <Text style={headerTextStyle}>
                    {intl.formatMessage({ id: `panelSearch.peakHours` })}
                  </Text>
                  <Text>{selectedClinic.peakHour}</Text>
                </Box>
              )}
            </ListItem>
          )}

          {isValueDefined(selectedClinic.language) && (
            <ListItem>
              <Text style={headerTextStyle}>
                {intl.formatMessage({ id: `panelSearch.languagesSpoken` })}
              </Text>
              <Text>{selectedClinic.language}</Text>
            </ListItem>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default PanelClinicDetails;
