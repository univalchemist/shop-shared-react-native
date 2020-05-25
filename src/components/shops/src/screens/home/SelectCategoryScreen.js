import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Divider, CustomMultiselectCheckBox } from '@shops/wrappers/components';
import { updateSelectedCategories } from '@shops/store/actions';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { useNavigation } from '@react-navigation/native';

const SelectCategoryScreen = ({
  categories,
  selectedCategories,
  updateSelectedCategories,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  const { goBack } = useNavigation();

  const onSubmit = selected => {
    updateSelectedCategories(selected);
    goBack();
  };

  const renderSectionFooter = () => {
    return <Divider />;
  };

  return (
    <CustomMultiselectCheckBox
      data={categories}
      buttonLabel={intl.formatMessage({ id: 'shop.common.apply' })}
      isSectionList
      onChange={() => {}}
      onSubmit={onSubmit}
      selectedValues={selectedCategories}
      bodyBackgroundColor={theme.colors.background}
      showItemDivider={false}
      renderSectionFooter={renderSectionFooter}
      footerStyle={[
        styles.footerStyle,
        { backgroundColor: theme.colors.white },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  footerStyle: {
    paddingBottom: 16,
  },
});

const mapStateToProps = ({ shop: { config, filters } }) => {
  return {
    categories: config.categories,
    selectedCategories: filters.selectedCategories,
  };
};

export default connect(mapStateToProps, {
  updateSelectedCategories,
})(SelectCategoryScreen);
