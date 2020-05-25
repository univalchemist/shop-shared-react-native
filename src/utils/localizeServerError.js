export const getMessageKey = error => {
  const data = error?.response?.data;
  if (!data) return null;

  if (data.errors && data.errors.length > 0) {
    return data.errors[0].messageKey;
  }

  return data.messageKey;
};

const localizeServerError = (
  error,
  { prefix, subjectId = 'error' },
  { formatMessage },
  params,
) => {
  const subject = formatMessage({ id: subjectId });

  const defaultMessage = formatMessage({
    id: `${prefix}.default`,
  });

  const messageKey = getMessageKey(error);
  const id = messageKey ? `${prefix}.${messageKey}` : 'noexist';
  const message = formatMessage({ id, defaultMessage }, params);

  return { subject, message };
};

export const getLocalizeServerError = (
  error,
  { prefix, subjectPrefix = 'error' },
  { formatMessage },
  params,
) => {
  const messageKey = getMessageKey(error);

  const defaultSubject = formatMessage({
    id: `${subjectPrefix}`,
  });
  const subjectId = messageKey ? `${subjectPrefix}.${messageKey}` : 'noexist';
  const subject = formatMessage({
    id: subjectId,
    defaultMessage: defaultSubject,
  });

  const defaultMessage = formatMessage({
    id: `${prefix}.default`,
  });
  const id = messageKey ? `${prefix}.${messageKey}` : 'noexist';
  const message = formatMessage({ id, defaultMessage }, params);

  return { subject, message };
};

export default localizeServerError;
