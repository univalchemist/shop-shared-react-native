import React from 'react';
import { FlatList } from 'react-native';
import { ListItemWithRightChevron, Text } from '@wrappers/components';
import { PANEL_CLINIC_DETAILS } from '@routes';

const PanelListItem = React.memo(function PanelListItem(props) {
  const { navigation, ...clinic } = props;
  return (
    <ListItemWithRightChevron
      accessibilityLabel={clinic.name}
      onPress={() => {
        navigation.navigate(PANEL_CLINIC_DETAILS, { selectedClinic: clinic });
      }}
    >
      <Text fontWeight="bold">{clinic.name}</Text>
      <Text style={{ textTransform: 'capitalize' }}>{clinic.specialty}</Text>
    </ListItemWithRightChevron>
  );
});

const MultipleClinicsListView = ({ navigation, route }) => {
  const clinics = route?.params?.clinics || [];

  return (
    <FlatList
      data={clinics}
      initialNumToRender={100}
      onEndReachedThreshold={0.5}
      keyExtractor={item => `${item.id}`}
      renderItem={({ item }) => {
        return <PanelListItem navigation={navigation} {...item} />;
      }}
    />
  );
};

export default MultipleClinicsListView;
