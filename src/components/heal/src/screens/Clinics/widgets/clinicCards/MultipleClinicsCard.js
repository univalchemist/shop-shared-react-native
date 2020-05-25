import React from 'react';
import { useIntl } from '@wrappers/core/hooks';
import {
  Box,
  Image,
  Text,
  Flex,
  TouchableContainer,
} from '@wrappers/components';
import { angleRight } from '@images';
import { CardContainer } from './CardContainer';
import { HEAL_MULTIPLE_CLINICS_LIST_VIEW } from '@routes';
import styled from 'styled-components/native';

export const Title = styled(Text)`
  ${({ theme }) => `
    color: ${theme.colors.gray[8]}
    font-size: ${theme.fontSizes[2]}
    font-weight: ${theme.fontWeights.bold}
    margin-bottom: 4px
  `};
  line-height: 22;
`;

const MultipleClinicsCard = ({ clinics, navigation }) => {
  const intl = useIntl();

  const clinicNames = clinics.map(clinics => clinics.name.trim()).join(', ');
  return (
    <CardContainer>
      <Box height="100%">
        <TouchableContainer
          px={32}
          py={24}
          onPress={() => {
            navigation.navigate(HEAL_MULTIPLE_CLINICS_LIST_VIEW, {
              clinics: clinics,
            });
          }}
        >
          <Box flexDirection="row" justifyContent="space-between">
            <Box flex={6}>
              <Title>{`${intl.formatMessage(
                {
                  id: 'panelSearch.clinicsFoundAtLocation',
                },
                { noOfClinics: clinics.length },
              )}`}</Title>
              <Text numberOfLines={3} ellipsizeMode="tail">
                {clinicNames}
              </Text>
            </Box>
            <Flex flex={1} justifyContent="center" alignItems="center">
              <Image source={angleRight} size={30} />
            </Flex>
          </Box>
        </TouchableContainer>
      </Box>
    </CardContainer>
  );
};

export default MultipleClinicsCard;
