import React from 'react';
import { FlatList } from 'react-native';
import { Box, Image } from '@cxa-rn/components';
import { ListItemWithRightChevron, Text } from '@wrappers/components';
import { CLINIC_DETAILS } from '@routes';
import { panelDoctor } from '@heal/images';
import { useTheme } from '@wrappers/core/hooks';
import { connect } from 'react-redux';
import { setDetailsClinic } from '@heal/src/store/actions';

const getDoctororDoctors = length => {
  return `${length} ${length > 1 ? 'Doctors' : 'Doctor'}`;
};

const PanelListItem = React.memo(function PanelListItem(props) {
  const { setDetailsClinic, navigation, ...clinic } = props;
  const theme = useTheme();
  return (
    <ListItemWithRightChevron
      accessibilityLabel={clinic.name}
      onPress={() => {
        setDetailsClinic(clinic);
        navigation.navigate(CLINIC_DETAILS, {
          clinic: clinic,
        });
      }}
    >
      <Box>
        <Text color={theme.colors.fonts.blackLink} fontSize={21}>
          {clinic.name}
        </Text>
        <Text fontSize={theme.fontSizes[2]}>{clinic.address}</Text>
        <Box alignItems={'center'} pt={16} flexDirection={'row'}>
          <Image source={panelDoctor} />
          <Text fontSize={theme.fontSizes[1]} marginLeft={8}>
            {getDoctororDoctors(clinic.doctors.length)}
          </Text>
        </Box>
      </Box>
    </ListItemWithRightChevron>
  );
});

const MultipleClinicsListView = ({ navigation, route, setDetailsClinic }) => {
  const clinics = route?.params?.clinics || [];
  const theme = useTheme();
  return (
    <Box backgroundColor={theme.colors.white} flex={1}>
      <FlatList
        data={clinics}
        initialNumToRender={100}
        onEndReachedThreshold={0.5}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => {
          return (
            <PanelListItem
              setDetailsClinic={setDetailsClinic}
              navigation={navigation}
              {...item}
            />
          );
        }}
      />
    </Box>
  );
};

export default connect(null, { setDetailsClinic })(MultipleClinicsListView);
