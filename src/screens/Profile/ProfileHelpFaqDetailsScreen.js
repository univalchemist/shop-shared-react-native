import React from 'react';
import { Box, Container, PlainText, ErrorPanel } from '@wrappers/components';
import { ScrollView } from 'react-native';

const ProfileHelpFaqDetailsScreen = ({ route }) => {
  const faq = route?.params?.faq;
  if (!faq || !faq.name || !faq.content) return <ErrorPanel />;

  return (
    <Box bg="gray.7" flex={1}>
      <ScrollView>
        <Container>
          <PlainText>{faq.content}</PlainText>
        </Container>
      </ScrollView>
    </Box>
  );
};

export default ProfileHelpFaqDetailsScreen;
