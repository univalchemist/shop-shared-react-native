import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { Box, Text, ErrorPanel } from '@heal/src/wrappers/components';
import ClinicListingItem from './ClinicListingItem';
import { setDetailsClinic } from '@heal/src/store/actions';
import { CLINIC_DETAILS } from '@routes';
import { SpinningLoader } from '@heal/src/components';

const screenSize = Dimensions.get('window');

const styles = StyleSheet.create({
  clinicGroups: {
    flex: 1,
  },
});

const Header = ({ total }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box
      marginTop={24}
      width={screenSize.width}
      height={38}
      justifyContent="center"
    >
      <Text
        color={theme.colors.gray[0]}
        paddingLeft={32}
        paddingRight={32}
        fontWeight="bold"
      >
        {total === 1
          ? intl.formatMessage(
              { id: 'clinic.singularFound' },
              { number: total },
            )
          : intl.formatMessage({ id: 'clinic.pluralFound' }, { number: total })}
      </Text>
    </Box>
  );
};

const ClinicListing = ({
  getClinics,
  setDetailsClinic,
  navigation,
  clinics,
  page,
  total,
  isLoading,
}) => {
  const intl = useIntl();
  const theme = useTheme();

  if (isLoading && clinics.length === 0) return <SpinningLoader />;

  if (clinics && clinics.length > 0) {
    return (
      <FlatList
        scrollIndicatorInsets={{ right: 1 }}
        style={styles.clinicGroups}
        data={clinics}
        ListHeaderComponent={() => {
          return <Header total={total} />;
        }}
        renderItem={({ item, index }) => {
          return (
            <ClinicListingItem
              clinic={item}
              onPress={() => {
                setDetailsClinic(item);
                navigation.navigate(CLINIC_DETAILS, {
                  clinic: item,
                });
              }}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => getClinics()}
      />
    );
  }

  return (
    <Box flex={1}>
      <ErrorPanel
        heading={intl.formatMessage({ id: 'clinic.noClinics' })}
        description={intl.formatMessage({ id: 'clinic.noClinicsDescription' })}
      />
    </Box>
  );
};

ClinicListing.propTypes = {
  clinics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      doctors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          locale: PropTypes.string,
          name: PropTypes.string,
          gender: PropTypes.string,
          isActive: PropTypes.bool,
        }),
      ),
      address: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      distanceToClient: PropTypes.number,
      clinicProviderId: PropTypes.number,
    }),
  ).isRequired,
};

const mapStateToProps = ({
  heal: {
    clinicData: { clinics, page, total },
  },
}) => ({
  clinics,
  page,
  total,
});

export default connect(mapStateToProps, { setDetailsClinic })(ClinicListing);
