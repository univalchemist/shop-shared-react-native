import React from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import {
  Box,
  ErrorPanel,
  ListSkeletonPlaceholder,
  Text,
  TrackedListItem,
  Image,
} from '@wrappers/components';
import { useIntl, useTheme, useFetchActions } from '@wrappers/core/hooks';
import { fetchContactContent } from '@store/contact/actions';
import { chevronRightArrow } from '@images';
import { generateContactMenus } from './utils/generateContactMenus';
import Config from 'react-native-config';

const renderContactItem = ({ item }, intl, theme) => {
  const {
    textId,
    data,
    icon,
    subhead,
    isCustomerSupportHour,
    isNote,
    onPress = () => {},
  } = item;

  if (isCustomerSupportHour) {
    return (
      <Box px={4} py={8}>
        <Text color={theme.colors.black}>{subhead}</Text>
        <Text>{data}</Text>
      </Box>
    );
  }

  if (isNote) {
    return (
      <Box px={4} py={8}>
        <Text color={theme.colors.black} fontSize={14}>
          {intl.formatMessage({
            id: textId,
          })}
        </Text>
        <Text fontSize={14}>{data}</Text>
      </Box>
    );
  }

  if (textId || data) {
    return (
      <TrackedListItem
        leftIcon={<Image source={icon} />}
        rightIcon={<Image source={chevronRightArrow} />}
        onPress={onPress}
      >
        <Text>
          {!textId
            ? data
            : intl.formatMessage({
                id: textId,
              })}
        </Text>
      </TrackedListItem>
    );
  }

  return null;
};

export const ContactScreen = ({ contact, fetchContactContent, navigation }) => {
  const intl = useIntl();
  const theme = useTheme();

  const [isLoading, isError] = useFetchActions(
    [fetchContactContent],
    true,
    [],
    [Config.DEFAULT_CLIENT_NAME],
  );

  const profileContactMenus = generateContactMenus(contact, navigation);

  const renderSectionHeader = ({ section: { titleId } }) =>
    titleId && (
      <Text
        marginTop={32}
        marginLeft={32}
        fontSize={20}
        color={theme.colors.black}
      >
        {intl.formatMessage({
          id: titleId,
        })}
      </Text>
    );

  return (
    <Box bg="gray.7" flex={1}>
      {isLoading ? (
        <ListSkeletonPlaceholder count={3} />
      ) : isError ? (
        <ErrorPanel />
      ) : (
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={profileContactMenus}
          keyExtractor={(item, index) => index}
          renderSectionHeader={renderSectionHeader}
          renderItem={props => renderContactItem(props, intl, theme)}
        />
      )}
    </Box>
  );
};

const phoneRe = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const mapStateToProps = ({ contact }) => {
  const { details } = contact;
  const oriPhone = details.phone;
  const oriEmail = details.email;

  details.phone = phoneRe.test(oriPhone) ? oriPhone : '';
  details.email = emailRe.test(oriEmail) ? oriEmail : '';

  return { contact };
};

const mapDispatchToProps = { fetchContactContent };

export default connect(mapStateToProps, mapDispatchToProps)(ContactScreen);
