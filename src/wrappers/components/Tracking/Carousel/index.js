import React, { useState } from 'react';
import { Carousel, withScrollBar } from '@cxa-rn/components';
import { useDebouncedCallback } from 'use-debounce';
import { logAction } from '@store/analytics/trackingActions';

export const TrackedCarousel = props => {
  const { actionParams, onSnapToItem, data } = props;
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);

  const [debounceLogAction] = useDebouncedCallback(percent => {
    logAction({
      ...actionParams,
      percent,
    });
  }, 1000 * 30);

  return (
    <Carousel
      {...props}
      onSnapToItem={snapIndex => {
        if (onSnapToItem) {
          onSnapToItem(snapIndex);
        }

        if (actionParams && snapIndex > maxReachedIndex) {
          setMaxReachedIndex(snapIndex);

          debounceLogAction((snapIndex + 1) / data.length);
        }
      }}
    />
  );
};

export const TrackedCarouselWithScrollBar = withScrollBar(TrackedCarousel);

export default Carousel;
