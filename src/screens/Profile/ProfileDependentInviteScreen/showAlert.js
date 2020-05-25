import { Alert } from 'react-native';
import { localizeServerError } from '@utils';

export const showSuccessAlert = ({ formatMessage, handlePress }) => {
  Alert.alert(
    formatMessage({ id: 'profile.dependentInvite.alertHeader' }),
    formatMessage({ id: 'profile.dependentInvite.alertInstructions' }),
    [
      {
        text: formatMessage({
          id: 'profile.dependentInvite.alertBtn',
        }),
        onPress: handlePress,
      },
    ],
    { cancelable: false },
  );
};

export const showServerError = async ({ formatMessage, error }) => {
  const { subject, message } = localizeServerError(
    error,
    {
      subjectId: 'serverErrors.inviteDependentUser.subject',
      prefix: 'serverErrors.inviteDependentUser',
    },
    { formatMessage },
  );
  await setTimeout(() => {
    Alert.alert(subject, message);
  }, 500);
};
