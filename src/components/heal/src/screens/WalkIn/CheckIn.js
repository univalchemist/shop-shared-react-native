import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import { Box, PlainText } from '@heal/src/wrappers/components';
import { checkInWalkIn } from '@heal/src/store/actions';

import theme from '@theme';
import { location, iconDoctor } from '@heal/images';
import { DOCTOR_LANDING } from '@routes';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    fontStyle: 'normal',
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -1.5,
    fontWeight: '300',
    textAlign: 'center',
    color: theme.colors.gray[0],
  },
  contentBox: {
    marginHorizontal: 32,
    marginTop: 34,
    aspectRatio: 1,
    width: screenWidth - 32 * 2,
    backgroundColor: theme.colors.white,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowColor: theme.colors.black,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: theme.colors.gray[2],
  },
  backButton: {
    width: screenWidth - 32 * 2,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray[0],
    marginHorizontal: 32,
    position: 'absolute',
    bottom: 88,
  },
});

const CheckIn = ({
  route,
  navigation,
  detailsClinic,
  checkedInData,
  checkInWalkIn,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  useEffect(() => {
    const func = async () => {
      await checkInWalkIn({
        clinicId: detailsClinic.id,
        clinicProviderId: detailsClinic.clinicProviderId,
        doctorId: detailsClinic.doctors[1].id,
      });
    };
    func();
  }, []);

  return (
    <Box flex={1} as={SafeAreaView}>
      <PlainText fontSize={32} style={styles.title}>
        {intl.formatMessage({ id: 'heal.walkInCheckIn.title' })}
      </PlainText>
      <Box style={styles.contentBox}>
        <Box mx={24} my={44} alignItems="center" justifyContent="center">
          <PlainText color={theme.colors.black} fontWeight="bold">
            {intl.formatMessage({
              id: 'heal.walkInCheckIn.estimatedConsultation',
            })}
          </PlainText>
          <PlainText style={styles.title}>10:30 AM</PlainText>
          <PlainText color={theme.colors.gray[2]} mt={8}>
            28 Mar 2020
          </PlainText>
          <Box flexDirection="row" mt={24} mr="auto" alignItems="center">
            <Image source={iconDoctor} />
            <Box ml={18}>
              <PlainText style={styles.text}>Dr. A Kwok Yee Francis</PlainText>
              <PlainText style={styles.text}>General Pratitioner</PlainText>
            </Box>
          </Box>
          <Box flexDirection="row" mt={24} mr="auto" alignItems="center">
            <Image source={location} />
            <PlainText ml={18} style={styles.text} numberOfLines={2}>
              Cheong Hing Street, Building 709, Singapore 00000
            </PlainText>
          </Box>
        </Box>
      </Box>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.navigate(DOCTOR_LANDING);
        }}
      >
        <PlainText color={theme.colors.gray[0]}>
          {intl.formatMessage({ id: 'heal.walkInCheckIn.back' })}
        </PlainText>
      </TouchableOpacity>
    </Box>
  );
};

const mapStateToProps = ({
  heal: {
    walkIn: { checkedInData },
    detailsClinic,
  },
}) => ({
  checkedInData,
  detailsClinic,
});

export default connect(mapStateToProps, { checkInWalkIn })(CheckIn);
