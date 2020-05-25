import React from 'react';
import { Text, ListItemContainer } from '@wrappers/components';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled(ListItemContainer)`
  display: flex;
  flex-direction: column;
  border-bottom-width: 1;
  border-style: solid;
  ${({ theme }) => `
      border-color: ${theme.colors.gray[5]}
  `}
`;

const FormLabel = styled(Text)`
  font-size: 16;
  line-height: 22;
  ${({ theme }) => `
    color: ${theme.colors.gray[3]}
  `}
`;

const FormValue = styled(Text)`
  font-size: 16;
  line-height: 22;
  ${({ theme }) => `
    color: ${theme.colors.gray[0]}
  `}
`;

const ClaimReviewListItem = ({ field, value }) => (
  <Container>
    <FormLabel>{field}</FormLabel>
    <FormValue>{value || '-'}</FormValue>
  </Container>
);

ClaimReviewListItem.propTypes = {
  field: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default ClaimReviewListItem;
