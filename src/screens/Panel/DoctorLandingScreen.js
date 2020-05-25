import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Box, Text, ScrollView, Button } from '@wrappers/components';
import { Image } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import styled from 'styled-components/native';
import ServiceItem from './widgets/ServiceItem';
import SpecialistItem from './widgets/SpecialistItem';
import {
  DOCTOR_LISTING,
  PANEL_SEARCH,
  SCAN_QR_CODE,
  SPECIALITY_LISTING,
  UNIFY_SEARCH,
} from '@routes';
import { creditCardScanIcon } from '@images';
import {
  generalSurgeonImg,
  dermatologyImg,
  pediatricianImg,
  dentistImg,
  cardiologyImg,
  orthopedicsImg,
  urologyImg,
  counselingImg,
} from '@images/specialist';
import {
  axaPanelClinicImg,
  generalPractitionerImg,
  specialistImg,
} from '@images/doctor_landing';
import NonTouchableSearchBar from '@heal/src/components/NonTouchableSearchBar';
import { getSpecialities } from '@heal/src/store/actions';

const HeadingText = styled(Text)`
  font-size: 21px;
  line-height: 25px;
  ${({ theme }) => `
    color: ${theme.colors.gray[0]}
  `};
`;

const services = [
  {
    image: generalPractitionerImg,
    titleId: 'doctorLanding.service.generalPractitioner.title',
    descId: 'doctorLanding.service.generalPractitioner.desc',
    routeName: PANEL_SEARCH,
  },
  {
    image: specialistImg,
    titleId: 'doctorLanding.service.specialist.title',
    descId: 'doctorLanding.service.specialist.desc',
    routeName: DOCTOR_LISTING,
  },
];

const specialists = [
  {
    image: generalSurgeonImg,
    code: 'generalsurgery',
  },
  {
    image: dermatologyImg,
    code: 'dermatologyvener',
  },
  {
    image: pediatricianImg,
    code: 'paediatrics',
  },
  {
    image: dentistImg,
    code: 'dentist',
  },
  {
    image: cardiologyImg,
    code: 'cardiology',
  },
  {
    image: orthopedicsImg,
    code: 'orthopaedicstrau',
  },
  {
    image: urologyImg,
    code: 'urogynaecology',
  },
  {
    image: counselingImg,
    code: 'counsellingpsych',
  },
];

const DoctorLandingScreen = ({ navigation, firstName, getSpecialities }) => {
  const intl = useIntl();
  useEffect(() => {
    const fetchSpecialities = async () => {
      await getSpecialities();
    };
    fetchSpecialities();
  }, []);
  return (
    <Box flex={1} mt={24}>
      <ScrollView>
        <Box px={32} pb={24}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <NonTouchableSearchBar
              onPress={() => navigation.navigate(UNIFY_SEARCH)}
              placeholder={intl.formatMessage({
                id: 'doctorSearch.placeholder',
              })}
            />
            <Box flex={0.2} alignItems="center">
              <TouchableOpacity
                onPress={() => navigation.navigate(SCAN_QR_CODE)}
              >
                <Image source={creditCardScanIcon} />
              </TouchableOpacity>
            </Box>
          </Box>
          <Box my={24}>
            <HeadingText>
              {intl.formatMessage(
                {
                  id: 'doctorLanding.panelSearchQuestion',
                },
                {
                  firstName: firstName,
                },
              )}
            </HeadingText>
          </Box>
          <Box py={12}>
            {services.map((service, index) => (
              <ServiceItem {...service} navigation={navigation} key={index} />
            ))}
          </Box>
          <Box my={24}>
            <HeadingText>
              {intl.formatMessage({
                id: 'doctorLanding.findASpecialist',
              })}
            </HeadingText>
          </Box>
          <Box
            flexWrap="wrap"
            flexDirection="row"
            justifyContent="space-between"
          >
            {specialists &&
              specialists.map((specialist, index) => (
                <Box flexBasis={0.47} key={index}>
                  <SpecialistItem
                    {...specialist}
                    onPress={() => {
                      navigation.navigate(DOCTOR_LISTING, {
                        code: specialist.code,
                      });
                    }}
                  />
                </Box>
              ))}
          </Box>
          <Box pt={16} pb={24}>
            <Button
              secondary
              title={intl.formatMessage({
                id: 'doctorLanding.viewAllSpecialities',
              })}
              onPress={() => navigation.navigate(SPECIALITY_LISTING)}
            />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

DoctorLandingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const mapStateToProps = ({ user: { firstName } }) => ({
  firstName,
});

export default connect(mapStateToProps, { getSpecialities })(
  DoctorLandingScreen,
);
