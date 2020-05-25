import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { ListItem, Text, Icon } from '@wrappers/components';
import { updateMemberProfile } from '@store/user/actions';
import { SUPPORTED_LANGUAGES } from '@config/locale';

const GreenTick = () => <Icon name="check" color="#00847F" size={30} />;

const ProfileLanguageSettingsScreen = ({
  preferredLocale,
  updateMemberProfile,
  navigation,
}) => {
  const [selectedLocale, setSelectedLocale] = useState(preferredLocale);
  const onPressItem = async locale => {
    setSelectedLocale(locale);

    await updateMemberProfile(locale);

    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <>
      <FlatList
        data={[...SUPPORTED_LANGUAGES]}
        keyExtractor={({ locale }) => locale}
        renderItem={({ item: { label, locale } }) => (
          <ListItem
            rightIcon={selectedLocale === locale && <GreenTick />}
            onPress={() => onPressItem(locale)}
            selected={locale === selectedLocale}
            accessible={true}
            accessibilityLabel={label}
          >
            <Text>{label}</Text>
          </ListItem>
        )}
      />
    </>
  );
};

ProfileLanguageSettingsScreen.propTypes = {
  preferredLocale: PropTypes.string,
  updateMemberProfile: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user: { preferredLocale } }) => ({
  preferredLocale,
});

const mapDispatchToProps = { updateMemberProfile };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileLanguageSettingsScreen);
export { GreenTick };
