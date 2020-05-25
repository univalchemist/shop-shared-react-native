import { Platform, ActionSheetIOS, Alert } from 'react-native';

function showConfirmation({
  title,
  message,
  actionTitle,
  cancelTitle,
  destructive,
  onAction,
}) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: [cancelTitle, actionTitle],
        destructiveButtonIndex: destructive ? 1 : null,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          onAction();
        }
      },
    );
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: cancelTitle, style: 'negative', onPress: () => {} },
        {
          text: actionTitle,
          onPress: onAction,
          style: 'positive',
        },
      ],
      { cancelable: false },
    );
  }
}

function debounceAlert({ subject, message, buttons, options, delay = 500 }) {
  setTimeout(() => {
    Alert.alert(subject, message, buttons, options);
  }, delay);
}

export { showConfirmation, debounceAlert };
