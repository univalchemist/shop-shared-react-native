import localizeServerError from '../localizeServerError';

const intl = {
  formatMessage: jest.fn(({ id, defaultMessage }) => {
    if (id === 'noexist') {
      return defaultMessage;
    }
    return id;
  }),
};

describe('localizeServerError', () => {
  it('should handle non http errors gracefully', () => {
    const error = {
      message: "I don't have response",
    };

    const { subject, message } = localizeServerError(
      error,
      { prefix: 'test' },
      intl,
    );
    expect(subject).toBe('error');
    expect(message).toEqual('test.default');
  });

  it('should handle a root level messageKey', () => {
    const error = {
      response: {
        data: {
          messageKey: 'Unauthorized',
        },
      },
    };

    const { subject, message } = localizeServerError(
      error,
      { prefix: 'test' },
      intl,
    );
    expect(subject).toBe('error');
    expect(message).toEqual('test.Unauthorized');
  });

  it('should use the first error when given an errors', () => {
    const error = {
      response: {
        data: {
          errors: [
            {
              messageKey: 'Unauthorized',
              message: 'Wrong email or password',
            },
          ],
        },
      },
    };

    const { subject, message } = localizeServerError(
      error,
      { prefix: 'test' },
      intl,
    );
    expect(subject).toBe('error');
    expect(message).toEqual('test.Unauthorized');
  });
});
