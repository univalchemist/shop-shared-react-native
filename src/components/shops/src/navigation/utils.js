export const getDefaultHeader = theme => {
  return {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTitleStyle: {
      ...theme.typography.titleTextSemiBold,
      alignSelf: 'center',
    },
    headerBackTitle: null,
    headerTintColor: theme.colors.appbarTint,
  };
};
