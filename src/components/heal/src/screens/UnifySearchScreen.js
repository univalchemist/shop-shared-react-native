import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Box,
  Flex,
  PlainText,
  SectionHeadingText,
  Image,
} from '@heal/src/wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { StackBackButton } from '@heal/src/components';
import { connect } from 'react-redux';
import { search, clearSearch, setDetailsClinic } from '@heal/src/store/actions';
import * as types from '../store/types';
import styled from 'styled-components/native';
import { location } from '@heal/images';
import { getCurrentPosition } from '@heal/src/utils/location';
import {
  CLINIC_DETAILS,
  DOCTOR_DETAIL,
  DOCTOR_LISTING,
  PANEL_SEARCH,
} from '@routes';
import { useDebouncedCallback } from 'use-debounce';

const MAX_RECENT_SAVED = 4;

const SearchPlainText = styled(PlainText)`
  ${({ theme }) => `color: ${theme.heal.colors.gray[4]}`};
`;

const Header = forwardRef(
  (
    { navigation, onSubmitEditing, onChangeText, clearSearch, searchTerm },
    ref,
  ) => {
    const theme = useTheme();
    const intl = useIntl();
    return (
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor={theme.colors.white}
        py={12}
      >
        <Box
          pl={15}
          pr={10}
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
        >
          <StackBackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Box>
        <Box flex={1} height={44} justifyContent={'center'}>
          <TextInput
            style={styles.searchInput(theme)}
            ref={ref}
            value={searchTerm}
            placeholder={intl.formatMessage({
              id: 'heal.UnifySearch.placeholder',
            })}
            placeholderTextColor={theme.heal.colors.gray[0]}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />
        </Box>
      </Flex>
    );
  },
);

export const ListItem = ({ item, onPress }) => {
  const renderSubtitle = () => {
    switch (item.data.type) {
      case types.SearchItemType.Location:
        return `${item.subtitle} Clinics`;
      case types.SearchItemType.Speciality:
        return `${item.subtitle} Doctors`;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Box
        flexDirection={'row'}
        py={24}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <SearchPlainText>{item.title}</SearchPlainText>
        <SearchPlainText>{renderSubtitle()}</SearchPlainText>
      </Box>
    </TouchableOpacity>
  );
};

export const NearMeButton = ({ setSearchTerm, letSearch }) => {
  const theme = useTheme();
  const intl = useIntl();
  const nearMeTxt = intl.formatMessage({ id: 'heal.NearMe' });
  return (
    <TouchableOpacity
      onPress={() => {
        getCurrentPosition(({ latitude, longitude }) => {
          setSearchTerm(nearMeTxt);
          letSearch(types.SearchItemType.NearMe, latitude, longitude);
        });
      }}
    >
      <Box
        flexDirection={'row'}
        py={24}
        mb={16}
        borderBottomWidth={1}
        borderBottomColor={theme.heal.colors.gray[1]}
      >
        <Image source={location} width={24} height={24} />
        <SearchPlainText ml={18}>{nearMeTxt}</SearchPlainText>
      </Box>
    </TouchableOpacity>
  );
};

const UnifySearchScreen = ({
  navigation,
  searchResult: searchData,
  search,
  clearSearch,
  setDetailsClinic,
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const inputRef = useRef();
  const [recentSearch, setRecentSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const getRecentSearch = async () => {
      const recents = await AsyncStorage.getItem(types.RECENT_SEARCH);
      if (recents && recents.length > 0) {
        const r = JSON.parse(recents);
        if (r) setRecentSearch(r);
      }
    };
    getRecentSearch();
    return () => {
      clearSearch();
    };
  }, [clearSearch]);

  const saveRecent = useCallback((text, history) => {
    const idx = history.findIndex(r => r === text);
    if (idx >= 0) history.splice(idx, 1);
    history.unshift(text);
    history = history.slice(0, 4);
    if (text !== types.SearchItemType.NearMe)
      AsyncStorage.setItem(types.RECENT_SEARCH, JSON.stringify(history));
  }, []);

  const [debounceSearch] = useDebouncedCallback(text => {
    if (text && text.length > 1) letSearch(text);
  }, 800);

  const letSearch = useCallback(
    (text, latitude, longitude) => {
      search({ searchTerm: text, latitude, longitude });
    },
    [search],
  );

  useEffect(() => {
    if (searchData?.length > 0) {
      setNotFound(false);
      saveRecent(searchTerm, recentSearch);
      setSearchResult(searchData);
    } else if (searchTerm?.length > 0) {
      setSearchResult([]);
      setNotFound(true);
    } else if (recentSearch && recentSearch.length > 0)
      setSearchResult([
        {
          title: 'heal.UnifySearch.Recent',
          data: recentSearch.map(r => ({
            title: r,
            subtitle: null,
            data: { type: types.SearchItemType.Recent },
          })),
        },
      ]);
  }, [searchData, recentSearch, saveRecent]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      inputRef.current.focus();
    });
  }, [navigation, inputRef]);

  return (
    <Box flex={1} backgroundColor={theme.colors.white} as={SafeAreaView}>
      <Header
        ref={inputRef}
        searchTerm={searchTerm}
        navigation={navigation}
        onChangeText={text => {
          setSearchTerm(text);
          debounceSearch(text);
        }}
        onSubmitEditing={() => letSearch(searchTerm)}
        clearSearch={clearSearch}
      />
      {!notFound ? (
        <SectionList
          initialNumToRender={100}
          keyboardShouldPersistTaps={'always'}
          style={styles.container(theme)}
          sections={searchResult}
          ItemSeparatorComponent={() => (
            <Box
              height={1}
              width={'100%'}
              backgroundColor={theme.heal.colors.gray[1]}
            />
          )}
          keyExtractor={(item, index) => item + index}
          ListHeaderComponent={() => (
            <NearMeButton letSearch={letSearch} setSearchTerm={setSearchTerm} />
          )}
          renderItem={({ item, index, section }) => (
            <ListItem
              item={item}
              onPress={({ title, subtitle, data }) => {
                switch (data.type) {
                  case types.SearchItemType.Recent:
                    setSearchTerm(title);
                    letSearch(title);
                    break;
                  case types.SearchItemType.Doctor:
                    navigation.navigate(DOCTOR_DETAIL, { doctor: data });
                    break;
                  case types.SearchItemType.Clinic:
                    setDetailsClinic(data);
                    navigation.navigate(CLINIC_DETAILS, { clinic: data });
                    break;
                  case types.SearchItemType.Location:
                    navigation.navigate(PANEL_SEARCH, {
                      searchTerm: title,
                      searchBy: types.ClinicSearchType.Location,
                    });
                    break;
                  case types.SearchItemType.Speciality:
                    navigation.navigate(DOCTOR_LISTING, {
                      code: data.specialityCode,
                    });
                    break;
                }
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => {
            return (
              <SectionHeadingText
                backgroundColor={theme.heal.colors.backgroundColor}
                fontWeight={'bold'}
                lineHeight={22}
                py={8}
                color={theme.colors.gray[0]}
              >
                {intl.formatMessage({ id: title })}
              </SectionHeadingText>
            );
          }}
        />
      ) : (
        <Box
          px={32}
          flex={1}
          backgroundColor={theme.heal.colors.backgroundColor}
        >
          <NearMeButton letSearch={letSearch} setSearchTerm={setSearchTerm} />
          <PlainText textAlign={'center'} mt={'30%'}>
            {intl.formatMessage({ id: 'heal.UnifySearch.NotFound' })}
          </PlainText>
        </Box>
      )}
    </Box>
  );
};
const mapStateToProps = ({ heal: { searchResult } }) => ({
  searchResult,
});
export default connect(mapStateToProps, {
  search,
  clearSearch,
  setDetailsClinic,
})(UnifySearchScreen);

const styles = StyleSheet.create({
  container: theme => ({
    paddingHorizontal: 32,
    backgroundColor: theme.heal.colors.backgroundColor,
  }),
  searchInput: theme => ({
    height: 40,
    fontFamily: theme.fonts.default,
    fontSize: 16,
    color: theme.heal.colors.gray[3],
  }),
});
