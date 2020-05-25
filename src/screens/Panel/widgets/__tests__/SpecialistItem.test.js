import React from 'react';
import SpecialistItem from '../SpecialistItem';
import { renderForTest } from '@testUtils';
import messages from '@heal/messages/en-HK';
import { Image } from '@wrappers/components';
import { generalSurgeonImg } from '@images/specialist';
import { flushMicrotasksQueue } from 'react-native-testing-library';

describe('SpecialistItem', () => {
  it('should render correctly', async () => {
    const props = {
      image: generalSurgeonImg,
      code: 'generalsurgery',
    };
    const specialistItem = renderForTest(
      <SpecialistItem {...props} onPress={jest.fn} />,
    );
    await flushMicrotasksQueue();
    const image = specialistItem.getByType(Image);
    const text = specialistItem.getByText(
      messages['speciality.name.' + props.code],
    );

    expect(image).toBeDefined();
    expect(text).toBeDefined();
  });
});
