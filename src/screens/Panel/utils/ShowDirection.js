import { Linking } from 'react-native';

const showDirection = async coordinates => {
  const mapOptions = [
    {
      isInstalled: async () => await Linking.canOpenURL('comgooglemaps://'),
      openDirections: coordinates => openInGoogleMap(coordinates),
    },
    {
      isInstalled: async () => await Linking.canOpenURL('maps://'),
      openDirections: coordinates => openInAppleMap(coordinates),
    },
    {
      isInstalled: async () => Promise.resolve(true),
      openDirections: coordinates => openInGoogleMap(coordinates),
    },
  ];

  for (let mapOption of mapOptions) {
    if (await mapOption.isInstalled()) {
      mapOption.openDirections(coordinates);
      break;
    }
  }
};

const openInGoogleMap = ({ longitude, latitude }) =>
  Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  );

const openInAppleMap = ({ longitude, latitude }) =>
  Linking.openURL(`http://maps.apple.com/?daddr=${latitude},${longitude}`);

module.exports = showDirection;
