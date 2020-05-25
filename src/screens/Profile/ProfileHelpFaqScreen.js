import {
  Box,
  Text,
  TrackedListItem,
  Image,
  ErrorPanel,
} from '@wrappers/components';
import React from 'react';
import { ScrollView } from 'react-native';
import { chevronRightArrow } from '@images';
import { PROFILE_HELP_FAQ_DETAILS } from '@routes';
import { categories } from '@store/analytics/trackingActions';

const ProfileHelpFaqScreen = ({ navigation, route }) => {
  const faqs = route?.params?.faqs;
  if (!faqs || !faqs.length) return <ErrorPanel />;

  return (
    <Box bg="gray.7" flex={1}>
      <ScrollView>
        <Box flex={1}>
          {faqs.map(faq => (
            <TrackedListItem
              key={faq.name}
              rightIcon={<Image source={chevronRightArrow} />}
              onPress={() =>
                navigation.navigate(PROFILE_HELP_FAQ_DETAILS, { faq })
              }
              accessible={true}
              accessibilityLabel={faq.name}
              actionParams={{
                category: categories.PROFILE_HELP,
                action: `Select FAQ question`,
                question_name: faq.name,
              }}
            >
              <Text>{faq.name}</Text>
            </TrackedListItem>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ProfileHelpFaqScreen;
