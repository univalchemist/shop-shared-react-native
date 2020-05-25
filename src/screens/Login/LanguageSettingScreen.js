import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Image } from 'react-native';
import { ListItem, Text, Icon } from '@wrappers/components';
import { SUPPORTED_LANGUAGES, localeIconMap } from '@config/locale';
import { setLocale } from '@store/intl/actions';

const GreenTick = () => <Icon name="check" color="#00847F" size={30} />;

const LanguageSettingScreen = ({ locale: currentLocale, setLocale }) => {
  const onPressItem = async locale => {
    setLocale(locale);
  };

  return (
    <>
      <FlatList
        data={[...SUPPORTED_LANGUAGES]}
        keyExtractor={({ locale }) => locale}
        renderItem={({ item: { label, locale } }) => (
          <ListItem
            leftIcon={
              <Image
                style={{ width: 24, height: 24 }}
                width={24}
                height={24}
                source={localeIconMap[locale]}
              />
            }
            rightIcon={currentLocale === locale && <GreenTick />}
            onPress={() => onPressItem(locale)}
            selected={locale === currentLocale}
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

LanguageSettingScreen.propTypes = {
  preferredLocale: PropTypes.string,
  setLocale: PropTypes.func,
};

const mapStateToProps = ({ intl: { locale } }) => ({
  locale,
});

const mapDispatchToProps = { setLocale };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageSettingScreen);
export { GreenTick };
