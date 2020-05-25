import { Text } from 'react-native-svg';
import styled from 'styled-components/native';
import theme from '@theme';
import { fontFamily } from 'styled-system';
const SvgText = styled(Text)`
  ${fontFamily}
`;

SvgText.defaultProps = {
  fontFamily: theme.fonts.default,
};

export default SvgText;
