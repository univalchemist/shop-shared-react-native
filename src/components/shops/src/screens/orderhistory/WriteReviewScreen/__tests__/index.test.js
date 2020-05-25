import * as React from 'react';
import { renderForTest } from '@testUtils';
import WriteReviewScreen from '../index';
import { BackButton, RatingStars } from '@shops/components';
import {
  InputField,
  TextAreaField,
  CheckBox,
  TrackedButton,
} from '@shops/wrappers/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { REVIEW_SUBMITTED_SCREEN } from '@shops/navigation/routes';

const route = {
  params: {
    boughtProduct: {
      name: 'Product name',
      vendor: 'Product vendor',
    },
  },
};

describe('WriteReviewScreen', () => {
  it('should render properly', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const Comp = renderForTest(
      <WriteReviewScreen route={route} navigation={navigation} />,
    );
    expect(Comp.queryByType(BackButton)).toBeTruthy();
    expect(Comp.queryAllByType(RatingStars)).toHaveLength(4);
    expect(Comp.queryByText('Write a review')).toBeTruthy();
    expect(Comp.queryByText('Product vendor')).toBeTruthy();
    expect(Comp.queryByText('Ratings')).toBeTruthy();
    const inputFields = Comp.queryAllByType(InputField);
    expect(inputFields[0].props.label).toEqual('Name');
    expect(inputFields[0].props.hint).toEqual('Optional');
    expect(inputFields[1].props.label).toEqual('Headline');
    expect(inputFields[1].props.hint).toEqual('Optional');
    const textAreaField = Comp.queryByType(TextAreaField);
    expect(textAreaField.props.label).toEqual('Write your review');
    expect(textAreaField.props.hint).toEqual('Optional');
    expect(
      Comp.queryByText(
        'I understand that accept to be contacted by respective vendor in case further clarification regarding your commented/review is needed.',
      ),
    ).toBeTruthy();
    expect(Comp.queryByType(CheckBox)).toBeTruthy();

    const button = Comp.queryByType(TrackedButton);
    expect(button.props.title).toBe('Submit');
    fireEvent.press(button);
    expect(navigation.navigate).toBeCalledWith(REVIEW_SUBMITTED_SCREEN);
  });

  // it('RatingStars should work properly', async () => {
  //   const initSection = [
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.overallRating',
  //     },
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.prodServiceQuality',
  //     },
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.purchaseExperience',
  //     },
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.redemptionExperience',
  //     },
  //   ];
  //   const navigation = {
  //     navigate: jest.fn(),
  //   };
  //   const rerender = jest.fn();
  //   const setState =  func => {
  //     const newState = func?.(initSection);
  //     rerender(newState);
  //     //re-render UI code with newState
  //   };
  //
  //   jest
  //     .spyOn(React, 'useState')
  //     .mockImplementation(initState => [initState, setState]);
  //
  //   const Comp = renderForTest(
  //     <WriteReviewScreen route={route} navigation={navigation} />,
  //   );
  //   await flushMicrotasksQueue();
  //   const ratingStars = Comp.queryAllByType(RatingStars);
  //   fireEvent(ratingStars[2], 'press', 60, 2);
  //   await flushMicrotasksQueue();
  //   expect(rerender).toBeCalledWith([
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.overallRating',
  //     },
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.prodServiceQuality',
  //     },
  //     {
  //       value: 60,
  //       titleId: 'shop.writeReview.purchaseExperience',
  //     },
  //     {
  //       value: null,
  //       titleId: 'shop.writeReview.redemptionExperience',
  //     },
  //   ]);
  // });
});
