import styled from 'styled-components/native';
import { TouchableHighlight } from 'react-native';
import { Box } from '@wrappers/components';

let applyStyle = comp => {
  return styled(comp)`
    background-color: ${props => props.theme.colors.white};
    height: ${props => (props.height ? props.height : 252.5)};
    border-top-color: ${props => props.color};
    border-top-width: 4;
    border-radius: 4;
    padding-top: 28;
    padding-bottom: 40;
    padding-left: 24;
    padding-right: 24;
    display: flex;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.05px;
    shadow-radius: 3;
    shadow-color: #000;
  `;
};

export const CardContainer = applyStyle(Box);

export const TouchableCardContainer = applyStyle(TouchableHighlight);
