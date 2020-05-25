import { Box, Text, Card } from '@wrappers/components';
import { Image } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { logoHSBC } from '@images';
import { isTier3 } from './utils/memberCategories';
import { useIntl } from '@wrappers/core/hooks';
import { IsDependent } from '@utils';

const CardText = props => <Text fontSize={12} lineHeight={16} {...props} />;
const BodyText = props => <CardText color="white" {...props} />;
const BodyEmText = props => (
  <BodyText fontSize={14} lineHeight={20} fontWeight="bold" {...props} />
);
const UnderlinedBodyText = styled(BodyText)`
  text-decoration-line: underline;
`;

const PRIMARY = 'PRIMARY';

const EHealthCard = ({
  name,
  category,
  membershipNumber,
  cardType,
  coPayments,
  expiryDate,
  planId,
  ...props
}) => {
  const cardColor = cardType === PRIMARY ? 'primary.0' : 'blue.2';
  const { GP, SP, PHY } = coPayments || {};
  const showCoPaymentInfo = !isTier3(category) || !IsDependent(props.role);
  const intl = useIntl();
  return (
    <Card bg="white" flex={1} overflow="hidden" {...props}>
      <Box bg="white" p={3}>
        <Box alignItems="center" justifyContent="center">
          <Box>
            <Image source={logoHSBC} />
          </Box>
          <Box position="absolute" right={0}>
            <CardText color="gray.0" fontWeight="bold">
              {moment().format('DD-MM-YYYY')}
            </CardText>
          </Box>
        </Box>
      </Box>
      <Box
        bg={cardColor}
        flex={1}
        px={3}
        pt={2}
        pb={3}
        justifyContent="space-between"
      >
        <Box>
          <BodyText textAlign="center">
            {intl.formatMessage({
              id: 'profile.eHealthCard.title.hsbc',
              defaultMessage: 'HSBC HealthPlus',
            })}
          </BodyText>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Box>
            <Box>
              <BodyText>Name:</BodyText>
              <Box>
                <BodyEmText>{name}</BodyEmText>
              </Box>
            </Box>
            <Box mt={2}>
              <BodyText>Membership No:</BodyText>
              <Box>
                <BodyEmText>{membershipNumber}</BodyEmText>
              </Box>
            </Box>
          </Box>
          {showCoPaymentInfo && (
            <Box>
              <UnderlinedBodyText>Copayment</UnderlinedBodyText>
              {!!GP && (
                <Box mt={1}>
                  <BodyText>GP: ${GP}</BodyText>
                </Box>
              )}
              {!!SP && (
                <Box mt={1}>
                  <BodyText>SP: ${SP}</BodyText>
                </Box>
              )}
              {!!PHY && (
                <Box mt={1}>
                  <BodyText>PHY: ${PHY}</BodyText>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default EHealthCard;
