import { Alert, Platform, ActionSheetIOS } from 'react-native';
import { showConfirmation, debounceAlert } from '../alerts';

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.mock('react-native/Libraries/ActionSheetIOS/ActionSheetIOS', () => ({
  showActionSheetWithOptions: jest.fn(),
}));

describe('showConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should show ios specific actionsheet', () => {
    Platform.OS = 'ios';

    showConfirmation({
      title: undefined,
      message: undefined,
      destructive: true,
      actionTitle: 'test action',
      cancelTitle: 'cancel',
    });

    expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalled();
  });
  it('should call onAction on ios specific actionsheet action', () => {
    Platform.OS = 'ios';
    const onActionSpy = jest.fn();

    showConfirmation({
      title: undefined,
      message: undefined,
      destructive: true,
      actionTitle: 'test action',
      cancelTitle: 'cancel',
      onAction: onActionSpy,
    });
    ActionSheetIOS.showActionSheetWithOptions.mock.calls[0][1](1);

    expect(onActionSpy).toHaveBeenCalled();
    expect(
      ActionSheetIOS.showActionSheetWithOptions.mock.calls[0],
    ).toMatchSnapshot();
  });
  it('should call onAction on ios specific actionsheet action with destructive false', () => {
    Platform.OS = 'ios';
    const onActionSpy = jest.fn();

    showConfirmation({
      title: undefined,
      message: undefined,
      destructive: false,
      actionTitle: 'test action',
      cancelTitle: 'cancel',
      onAction: onActionSpy,
    });
    ActionSheetIOS.showActionSheetWithOptions.mock.calls[0][1](1);

    expect(onActionSpy).toHaveBeenCalled();
    expect(
      ActionSheetIOS.showActionSheetWithOptions.mock.calls[0],
    ).toMatchSnapshot();
  });

  it('should show android specific alert', () => {
    Platform.OS = 'android';

    showConfirmation({
      title: 'testing',
      message: 'test message',
      destructive: true,
      actionTitle: 'test action',
      cancelTitle: 'cancel',
    });

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('should call onAction on android specific Alert action', () => {
    Platform.OS = 'android';
    const onActionSpy = jest.fn();

    showConfirmation({
      title: 'testing',
      message: 'test message',
      actionTitle: 'test action',
      cancelTitle: 'cancel',
      onAction: onActionSpy,
    });
    Alert.alert.mock.calls[0][2][1].onPress();

    expect(onActionSpy).toHaveBeenCalled();
  });
});

describe('debounceAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should show ios specific actionsheet after default 500ms', () => {
    debounceAlert({
      title: 'testing',
      message: 'test message',
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalled();
    }, 500);
  });

  it('should show ios specific actionsheet after delay', () => {
    const delay = 1000;
    debounceAlert({
      title: 'testing',
      message: 'test message',
      delay,
    });

    setTimeout(() => {
      expect(Alert.alert).toHaveBeenCalled();
    }, delay);
  });
});
