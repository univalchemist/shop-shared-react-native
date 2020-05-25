import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Box, PlainText } from '@heal/src/wrappers/components';
import { getDoctors } from '@heal/src/store/actions';
import { useIntl, useTheme } from '@heal/src/wrappers/core/hooks';
import styled from 'styled-components/native';
import { DOCTOR_LISTING, UNIFY_SEARCH } from '@routes';
import NonTouchableSearchBar from '@heal/src/components/NonTouchableSearchBar';

const { width: ww } = Dimensions.get('window');
const cardWidth = (ww - 32 * 2 - 18) / 2;

const Card = styled(Box)`
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05px;
  shadow-color: #000;
`;

export const SpecialistItem = ({ name, code, navigation }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate(DOCTOR_LISTING, { code: code })}
    >
      <Card
        width={cardWidth}
        minHeight={56}
        backgroundColor={theme.colors.white}
        justifyContent="center"
        alignItems="center"
        px={12}
        py={12}
      >
        <PlainText
          textAlign="center"
          color={theme.colors.black}
          numberOfLines={3}
          fontSize={12}
          lineHeight={16}
          letterSpacing={0.4}
        >
          {name}
        </PlainText>
      </Card>
    </TouchableOpacity>
  );
};

const SpecialistScreen = ({ specialities, navigation }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box flex={1} backgroundColor={theme.colors.gray[7]}>
      <FlatList
        contentContainerStyle={styles.listContainer(theme)}
        numColumns={2}
        columnWrapperStyle={styles.listColumn}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={specialities}
        keyExtractor={item => item.code.toString()}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Box>
            <NonTouchableSearchBar
              onPress={() => navigation.navigate(UNIFY_SEARCH)}
              placeholder={intl.formatMessage({
                id: 'doctorSearch.placeholder',
              })}
              mt={24}
            />
            <PlainText
              py={24}
              mb={1}
              fontSize={21}
              color={theme.colors.gray[0]}
            >
              {intl.formatMessage({ id: 'findSpecialist' })}
            </PlainText>
          </Box>
        )}
        renderItem={({ item }) => (
          <SpecialistItem
            navigation={navigation}
            code={item.code}
            name={item.name}
          />
        )}
      />
    </Box>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  listContainer: theme => ({
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: theme.colors.gray[7],
  }),
  listColumn: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 16,
  },
});

const mapStateToProps = ({ heal: { specialities } }) => ({
  specialities,
});
export default connect(mapStateToProps, { getDoctors })(SpecialistScreen);
