import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDoctors } from '@heal/src/store/actions';
import {
  Flex,
  Image,
  Box,
  Text,
  SectionHeadingText,
  ErrorPanel,
} from '@heal/src/wrappers/components';
import { FlatList, TouchableOpacity } from 'react-native';
import { useTheme, useIntl } from '@heal/src/wrappers/core/hooks';
import { panelDoctor } from '@heal/images';
import { chevronRightArrow } from '@images';
import { DOCTOR_DETAIL, UNIFY_SEARCH } from '@routes';
import { StackBackButton } from '@heal/src/components';
import NonTouchableSearchBar from '@heal/src/components/NonTouchableSearchBar';
import Spinner from 'react-native-spinkit';

const Header = ({ navigation }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.colors.white}
      py={12}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        px={2}
      >
        <StackBackButton onPress={() => navigation.goBack()} />
      </Box>
      <NonTouchableSearchBar
        onPress={() => navigation.navigate(UNIFY_SEARCH)}
        mr={34}
        placeholder={intl.formatMessage({
          id: 'doctorSearch.placeholder',
        })}
      />
    </Flex>
  );
};

export const ListItem = ({ item, onPress }) => {
  const intl = useIntl();
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        py={24}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <SectionHeadingText mb={1} color={theme.colors.gray[8]}>
            {item.name}
          </SectionHeadingText>
          <Text mb={8}>
            {intl.formatMessage({
              id: `speciality.name.${item.specialityCode}`,
            })}
          </Text>
          <Box flexDirection="row">
            <Image source={panelDoctor} width={18} height={18} mr={8} />
            <Text fontSize={14} lineHeight={18}>
              {intl.formatMessage(
                { id: 'doctor.workIn' },
                { number: item.clinics.length },
              )}
            </Text>
          </Box>
        </Box>
        <Image source={chevronRightArrow} />
      </Box>
    </TouchableOpacity>
  );
};
ListItem.propTypes = {
  onPress: PropTypes.func,
  item: PropTypes.object,
};

const DoctorListingScreen = ({
  getDoctors,
  navigation,
  route,
  doctors,
  total,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const func = async () => {
      try {
        setIsLoading(true);
        await getDoctors(route.params?.code);
      } finally {
        setIsLoading(false);
      }
    };
    func();
  }, [getDoctors, route]);

  const renderContent = () => {
    if (!isLoading) {
      if (doctors && doctors.length > 0)
        return (
          <FlatList
            scrollIndicatorInsets={{ right: 1 }}
            style={styles.list(theme)}
            data={doctors}
            ListHeaderComponent={() => (
              <SectionHeadingText mt={24} mb={1}>
                {intl.formatMessage({ id: 'doctor.found' }, { total: total })}
              </SectionHeadingText>
            )}
            ItemSeparatorComponent={() => (
              <Box backgroundColor={theme.colors.gray[10]} height={1} />
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ListItem
                key={index}
                item={item}
                onPress={() =>
                  navigation.navigate(DOCTOR_DETAIL, { doctor: item })
                }
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => getDoctors(route.params?.code)}
          />
        );
      else
        return (
          <ErrorPanel
            heading={'No doctor available'}
            description={'There are no Doctors matching your search criteria.'}
          />
        );
    } else {
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          {Platform.OS === 'ios' ? (
            <Spinner
              isVisible={true}
              color={theme.heal.colors.crimson}
              size={36}
              type={'Arc'}
            />
          ) : (
            <ActivityIndicator size="large" color={theme.heal.colors.crimson} />
          )}
        </Box>
      );
    }
  };

  return (
    <Box flex={1} backgroundColor={theme.colors.white} as={SafeAreaView}>
      <Header navigation={navigation} />
      {renderContent()}
    </Box>
  );
};

const styles = StyleSheet.create({
  list: theme => ({
    paddingHorizontal: 32,
    backgroundColor: theme.heal.colors.backgroundColor,
  }),
});

const mapStateToProps = ({
  intl: { locale },
  heal: {
    doctorData: { doctors, page, total },
  },
}) => ({
  locale,
  doctors,
  page,
  total,
});

export default connect(mapStateToProps, { getDoctors })(DoctorListingScreen);
