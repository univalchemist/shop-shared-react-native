import withTracking from './withTracking';
import {
  Button,
  FloatingActionButton,
  ListItem,
  ListItemPicker,
} from '@cxa-rn/components';

export const TrackedButton = withTracking(Button);
export const TrackedFloatingActionButton = withTracking(FloatingActionButton);
export const TrackedListItem = withTracking(ListItem);
export const TrackedListItemPicker = withTracking(ListItemPicker);

export { withTracking };
export { TrackedCarousel, TrackedCarouselWithScrollBar } from './Carousel';
