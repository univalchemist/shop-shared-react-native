import React, { useCallback, useState } from 'react';
import { Text } from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';

const ReadMoreText = ({ numberOfLines, children, ...props }) => {
  const intl = useIntl();
  const [showMore, setShowMore] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const onTextLayout = useCallback(e => {
    setShowMore(shouldSetShowMore(e.nativeEvent.lines, numberOfLines));
  }, []);
  const handlePress = () => {
    setIsShowMore(!isShowMore);
  };
  const shouldSetShowMore = (lines, numberOfLines) => {
    if (lines.length < numberOfLines) return false;
    if (lines.length > numberOfLines) return true;
    return lines[lines.length - 1].text.length > lines[0].text.length;
  };
  return (
    <>
      <Text
        numberOfLines={isShowMore ? undefined : numberOfLines}
        onTextLayout={onTextLayout}
      >
        {children}
      </Text>
      {showMore ? (
        <Text onPress={handlePress} fontWeight={'bold'}>
          {intl.formatMessage({
            id: isShowMore ? 'shop.product.showLess' : 'shop.product.showMore',
            defaultMessage: isShowMore ? 'Show less' : 'Show more',
          })}
        </Text>
      ) : null}
    </>
  );
};

export default ReadMoreText;
