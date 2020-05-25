import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, TouchableOpacity } from 'react-native';
import {
  Box,
  Text,
  PlainText,
  ListItemWithRightChevron,
  Image,
} from '@heal/src/wrappers/components';
import { connect } from 'react-redux';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';

import { iconLocation, panelDoctor } from '@components/heal/images';

const screenSize = Dimensions.get('window');

const ClinicListingItem = ({ clinic, latitude, longitude, onPress }) => {
  const intl = useIntl();
  const theme = useTheme();

  const shortenDistance = distance => {
    if (distance > 1000) {
      return intl.formatMessage(
        { id: 'heal.clinic.kmdistance' },
        {
          number: distance && (distance / 1000).toFixed(2),
        },
      );
    }

    return intl.formatMessage(
      { id: 'heal.clinic.mdistance' },
      {
        number: distance && distance.toFixed(2),
      },
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ListItemWithRightChevron
        width={screenSize.width}
        height={134}
        justifyContent="center"
        paddingLeft={32}
        paddingRight={30}
      >
        <Text
          fontSize={21}
          color={theme.colors.defaultText}
          lineHeight={26}
          letterSpacing={0.3}
        >
          {clinic.name}
        </Text>
        <PlainText numberOfLines={1}>{clinic.address}</PlainText>
        <Box flexDirection="row" marginTop={16}>
          <Box flexDirection="row">
            <Image source={panelDoctor} />
            <Text
              fontSize={14}
              lineHeight={18}
              letterSpacing={0.3}
              marginLeft={8}
            >
              {clinic.doctors.length === 1
                ? intl.formatMessage(
                    { id: 'clinic.singularDoctor' },
                    { number: clinic.doctors.length },
                  )
                : intl.formatMessage(
                    { id: 'clinic.pluralDoctor' },
                    { number: clinic.doctors.length },
                  )}
            </Text>
          </Box>
          {latitude === 0 ||
          longitude === 0 ||
          clinic.distanceToClient === undefined ? null : (
            <Box flexDirection="row" marginLeft={32} marginRight={32}>
              <Image source={iconLocation} />
              <Text
                fontSize={14}
                lineHeight={18}
                letterSpacing={0.3}
                marginLeft={8}
              >
                {shortenDistance(clinic.distanceToClient)}
              </Text>
            </Box>
          )}
        </Box>
      </ListItemWithRightChevron>
    </TouchableOpacity>
  );
};

ClinicListingItem.propTypes = {
  clinic: PropTypes.shape({
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
  }).isRequired,
};

const mapStateToProps = ({
  heal: {
    location: { latitude, longitude },
  },
}) => ({
  latitude,
  longitude,
});

export default connect(mapStateToProps, {})(ClinicListingItem);
