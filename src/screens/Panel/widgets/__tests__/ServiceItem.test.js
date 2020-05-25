import React from 'react';
import { TouchableOpacity } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import ServiceItem from '../ServiceItem';
import { renderForTest } from '@testUtils';
import { Image, Text } from '@wrappers/components';
import { axaPanelClinicImg } from '@images/doctor_landing';

describe('ServiceItem', () => {
  it('should render correctly', () => {
    const props = {
      image: axaPanelClinicImg,
      titleId: 'doctorLanding.service.panelClinic.title',
      descId: 'doctorLanding.service.panelClinic.desc',
      routeName: 'PANEL_SEARCH',
    };

    const serviceItem = renderForTest(<ServiceItem {...props} />);

    const image = serviceItem.getByType(Image);
    const texts = serviceItem.getAllByType(Text);

    expect(image).toBeDefined();
    expect(texts.length).toEqual(2);
  });

  it('should navigate to routeName when routeName is exist', () => {
    const props = {
      image: axaPanelClinicImg,
      titleId: 'doctorLanding.service.panelClinic.title',
      descId: 'doctorLanding.service.panelClinic.desc',
      routeName: 'PANEL_SEARCH',
    };
    const navigation = {
      navigate: jest.fn(),
    };

    const serviceItem = renderForTest(
      <ServiceItem {...props} navigation={navigation} />,
    );
    const clikableItem = serviceItem.getByType(TouchableOpacity);

    fireEvent(clikableItem, 'press');

    expect(navigation.navigate).toHaveBeenCalledWith(props.routeName);
  });

  it('should not navigate to routeName when routeName is not exist', () => {
    const props = {
      image: axaPanelClinicImg,
      titleId: 'doctorLanding.service.panelClinic.title',
      descId: 'doctorLanding.service.panelClinic.desc',
    };
    const navigation = {
      navigate: jest.fn(),
    };

    const serviceItem = renderForTest(
      <ServiceItem {...props} navigation={navigation} />,
    );

    const clikableItem = serviceItem.getByType(TouchableOpacity);

    fireEvent(clikableItem, 'press');

    expect(serviceItem).toMatchSnapshot();
  });
});
