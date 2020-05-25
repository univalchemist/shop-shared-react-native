import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Box, Text } from '@heal/src/wrappers/components';
import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import { chevronRight, iconTime, doctorBanner } from '@heal/images';
import theme from '@theme';

const styles = StyleSheet.create({
  chevron: { alignSelf: 'center' },
  image: {
    width: 188,
    height: 117,
  },
  card: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowColor: theme.colors.black,
    backgroundColor: theme.colors.white,
  },
  selectedCard: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowColor: theme.colors.black,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.green,
    borderWidth: 1,
  },
});

const DoctorCard = ({
  doctor,
  width,
  height,
  selected,
  icon,
  showIcon,
  onPress,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        width={width}
        height={height}
        style={selected ? styles.selectedCard : styles.card}
      >
        <Image
          source={doctorBanner}
          style={styles.image}
          backgroundColor={theme.colors.gray[4]}
        />
        <Box flex={1} mx={16} my={16} flexDirection="row">
          <Box marginRight={16}>
            <Text numberOfLines={2} color="gray.0">
              {doctor.name}
            </Text>
            <Text numberOfLines={2} fontSize={14} lineHeight={20} mt={8}>
              {doctor.specialityCode
                ? intl.formatMessage({
                    id: `speciality.name.${doctor.specialityCode}`,
                  })
                : ''}
            </Text>
            <Box marginTop="auto" flexDirection="row">
              <Image source={iconTime} />
              <Text
                marginLeft={10}
                fontSize={12}
                lineHeight={20}
                color={theme.colors.gray[3]}
              >
                {`${doctor.estimatedConsultationTime} ${intl.formatMessage({
                  id: 'clinic.estimatedTime',
                })}`}
              </Text>
            </Box>
          </Box>
          {showIcon ? (
            <Image
              marginLeft="auto"
              source={icon ? icon : chevronRight}
              style={styles.chevron}
            />
          ) : null}
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default DoctorCard;
