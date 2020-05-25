import React, { useState, useEffect } from 'react';
import { ScrollView, SectionList, View } from 'react-native';
import { connect } from 'react-redux';
import {
  Box,
  ErrorPanel,
  ListSkeletonPlaceholder,
  Text,
  TrackedListItem,
  Image,
  SectionHeadingText,
} from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { fetchHelpContent } from '@store/help/actions';
import { chevronRightArrow } from '@images';
import { generateProfileHelpMenus } from './utils/generateProfileHelpMenus';
import { categories } from '@store/analytics/trackingActions';

const renderHelpItem = ({ item }, intl, theme) => {
  const {
    textId,
    data,
    icon,
    actionParams,
    isText,
    isListItem,
    isCustomerSupportHour,
    subhead,
    isNote,
    onPress = () => {},
  } = item;
  if (isNote) {
    return (
      <Box px={4} py={15}>
        <Text color={theme.colors.black} fontSize={14}>
          {intl.formatMessage({
            id: 'profile.help.note.title',
            defaultMessage: 'Notes',
          }) + ':'}
        </Text>
        <Text fontSize={14}>{data}</Text>
        <Box height={1} width={'100%'} mt={4} bg={theme.colors.gray[5]} />
      </Box>
    );
  }
  if (isCustomerSupportHour) {
    return (
      <Box px={4} py={8}>
        <Text color={theme.colors.black}>{subhead}</Text>
        <Text>{data}</Text>
      </Box>
    );
  }
  if (isText) {
    return (
      <Text paddingTop={16} marginLeft={32} marginRight={32}>
        {data}
      </Text>
    );
  }

  if (isListItem) {
    return (
      <TrackedListItem
        onPress={onPress}
        rightIcon={<Image source={chevronRightArrow} />}
        accessible={true}
        accessibilityLabel={data}
        actionParams={{
          category: categories.PROFILE_HELP,
          action: `Select FAQ question`,
          question_name: data,
        }}
      >
        <Text>{data}</Text>
      </TrackedListItem>
    );
  }

  if (textId || data) {
    return (
      <TrackedListItem
        leftIcon={<Image source={icon} />}
        rightIcon={<Image source={chevronRightArrow} />}
        onPress={onPress}
        actionParams={actionParams}
      >
        <Text>
          {!textId
            ? data
            : // : textId
              intl.formatMessage({
                id: textId,
              })}
        </Text>
      </TrackedListItem>
    );
  }

  return null;
};

const ProfileHelpScreen = ({ help, fetchHelpContent, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const intl = useIntl();
  const theme = useTheme();
  useEffect(() => {
    let mounted = true;
    const doFetch = async () => {
      try {
        if (mounted) {
          setIsLoading(true);
        }
        await fetchHelpContent();
      } catch {
        if (mounted) {
          setIsError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    doFetch();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHelpContent]);

  if (!help) {
    return;
  }

  const profileHelpMenus = generateProfileHelpMenus(help, navigation);
  return (
    <Box bg="gray.7" flex={1}>
      {isLoading ? (
        <ListSkeletonPlaceholder count={3} />
      ) : isError ? (
        <ErrorPanel />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <SectionList
            sections={profileHelpMenus}
            keyExtractor={(item, index) => index}
            renderSectionHeader={({ section: { titleId } }) =>
              titleId && (
                <SectionHeadingText
                  marginTop={32}
                  marginLeft={32}
                  fontSize={18}
                  fontWeight={'light'}
                >
                  {intl.formatMessage({
                    id: titleId,
                  })}
                </SectionHeadingText>
              )
            }
            renderItem={props => renderHelpItem(props, intl, theme)}
          />
        </ScrollView>
      )}
    </Box>
  );
};

const mapStateToProps = ({ help }) => {
  return { help };
};

const mapDispatchToProps = { fetchHelpContent };

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHelpScreen);
