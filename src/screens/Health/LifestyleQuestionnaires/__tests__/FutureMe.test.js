import React from 'react';
import { renderForTest } from '@testUtils';
import FutureMe from '../FutureMe';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { Image, Text, UploadBox } from '@wrappers/components';
import { getImageFromImagePicker } from '@utils/nativeImageHelpers';
import { FormattedMessage } from 'react-intl';
import { healthFutureMeImg } from '@images';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';

jest.mock('@utils/nativeImageHelpers', () => ({
  getImageFromImagePicker: jest.fn(),
}));

describe('Future Me', () => {
  // Must render FutureMe component with redux form
  // as it is using RadioButtonGroup, which in turn use Field from redux-form
  const FutureMeWithReduxForm = compose(
    reduxForm({
      form: 'healthForm',
    }),
  )(FutureMe);

  const renderFutureMeWithReduxForm = () =>
    renderForTest(<FutureMeWithReduxForm />, {
      initialState: { health: { faceAging: { isError: false } } },
    });

  describe('Rendering', () => {
    let futureMe, futureMeTexts;
    beforeEach(() => {
      futureMe = renderFutureMeWithReduxForm({});
      futureMeTexts = futureMe.queryAllByType(Text);
    });

    it('should render an Image with health future me image as source', () => {
      const healthImage = futureMe.queryAllByType(Image);
      expect(healthImage).toHaveLength(1);
      expect(healthImage[0].props.source).toEqual(healthFutureMeImg);
    });

    it('should render FutureMe first text as section title', () => {
      const title = futureMeTexts[0].children[0].props.children;
      expect(title.type).toEqual(FormattedMessage);
      expect(title.props.id).toEqual('futureMeTitle');
    });
  });

  describe('Upload box', () => {
    it('should navigate to the image view when trigger view on Upload box', async () => {
      const navigation = { navigate: jest.fn() };
      const initialValues = {
        image: {
          uri: 'http://www.test.com/123.jpg',
        },
      };
      const change = jest.fn();
      const Component = renderForTest(
        <FutureMe
          change={change}
          navigation={navigation}
          initialValues={initialValues}
        />,
        { initialState: { health: { faceAging: { isError: false } } } },
      );

      const uploadBox = Component.queryAllByType(UploadBox);
      expect(uploadBox[0].props.data.uri).toEqual(
        'http://www.test.com/123.jpg',
      );
      expect(uploadBox[0].props.accessibilityDocumentType).toEqual('photo');

      await flushMicrotasksQueue();
      act(() => {
        fireEvent(Component.getAllByType(UploadBox)[0], 'view');
      });
      expect(navigation.navigate).toHaveBeenCalled();
    });

    it('should open image picker when trigger add photo on Upload box', async () => {
      const navigation = { navigate: jest.fn() };
      const initialValues = {};
      const Component = renderForTest(
        <FutureMe navigation={navigation} initialValues={initialValues} />,
        { initialState: { health: { faceAging: { isError: false } } } },
      );

      await flushMicrotasksQueue();
      act(() => {
        fireEvent(Component.getAllByType(UploadBox)[0], 'add');
      });
      expect(getImageFromImagePicker).toHaveBeenCalled();
    });
  });
});
