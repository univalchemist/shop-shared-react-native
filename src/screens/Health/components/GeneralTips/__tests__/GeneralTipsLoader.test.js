import React from 'react';
import { renderForTest } from '@testUtils';
import { GeneralTipsLoader } from '../GeneralTipsLoader';
import { CardLoader } from '@screens/Health/components/widgets/CardLoader';

describe('General Tips Loader', () => {
  const generalTipsLoader = renderForTest(
    <GeneralTipsLoader
      cardWidthWithSpacing={0}
      cardHeight={252.5}
      horizontalMarginBetweenCard={3}
    />,
  );

  it('should match snapshot', () => {
    expect(generalTipsLoader.toJSON()).toMatchSnapshot();
  });

  it('should render card loader', () => {
    const cardLoader = generalTipsLoader.queryAllByType(CardLoader);

    expect(cardLoader.length).toEqual(1);
  });
});
