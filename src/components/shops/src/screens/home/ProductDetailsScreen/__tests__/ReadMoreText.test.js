import React from 'react';
import ReadMoreText from '../ReadMoreText';
import { renderForTest } from '@testUtils';
import { Text } from '@shops/wrappers/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

const linesLongTextNumLine3 = {
  nativeEvent: { lines: [{ text: '123456' }, { text: '1234567' },{ text: '1234568' }] },
};

const shortText = 'this is short Text';
describe('ReadMoreText', () => {
  it('should render properly', () => {
    const Comp = renderForTest(
      <ReadMoreText>
        <Text>{shortText}</Text>
      </ReadMoreText>,
    );
    const text = Comp.getByText(shortText);
    expect(text).toBeDefined();
  });

  it('should showMore when click showMore text', async () => {
    const Comp = renderForTest(
      <ReadMoreText numberOfLines={3}>
        <Text>{shortText}</Text>
      </ReadMoreText>,
    );
    const textComp = Comp.getByText(shortText);
    fireEvent(textComp, 'textLayout', linesLongTextNumLine3);
    await flushMicrotasksQueue();
    const showMoreComp = Comp.queryByText('Show more');
    const showLessComp = Comp.queryByText('Show less');

    expect(showMoreComp).toBeTruthy();
    expect(showLessComp).toBeNull();

    fireEvent.press(showMoreComp);
    await flushMicrotasksQueue();
    const showMoreComp1 = Comp.queryByText('Show more');
    const showLessComp1 = Comp.queryByText('Show less');
    expect(showLessComp1).toBeTruthy();
    expect(showMoreComp1).toBeNull();
  });

  it('should not showMore when click numberOfLine large than lines length', async () => {
    const Comp = renderForTest(
      <ReadMoreText numberOfLines={4}>
        <Text>{shortText}</Text>
      </ReadMoreText>,
    );
    const textComp = Comp.getByText(shortText);
    fireEvent(textComp, 'textLayout', linesLongTextNumLine3);
    await flushMicrotasksQueue();
    const showMoreComp = Comp.queryByText('Show more');
    const showLessComp = Comp.queryByText('Show less');
    expect(showMoreComp).toBeNull();
    expect(showLessComp).toBeNull();
  });

  it('should not showMore when click numberOfLine smaller than lines length', async () => {
    const Comp = renderForTest(
      <ReadMoreText numberOfLines={2}>
        <Text>{shortText}</Text>
      </ReadMoreText>,
    );
    const textComp = Comp.getByText(shortText);
    fireEvent(textComp, 'textLayout', linesLongTextNumLine3);
    await flushMicrotasksQueue();
    const showMoreComp = Comp.queryByText('Show more');
    expect(showMoreComp).toBeTruthy();
  });
});
