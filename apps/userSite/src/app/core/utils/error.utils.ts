export function extractErrorMessage(err: unknown, fallback = 'An error occurred'): string {
  if (!err) return fallback;

  const rawMessage = err.error?.message ?? err.message ?? err.error;

  if (typeof rawMessage === 'string') {
    return rawMessage;
  }

  if (Array.isArray(rawMessage)) {
    return rawMessage.filter((item) => typeof item === 'string').join(', ') || fallback;
  }

  if (typeof rawMessage === 'object' && rawMessage !== null) {
    if (typeof rawMessage.message === 'string') {
      return rawMessage.message;
    }
    try {
      return JSON.stringify(rawMessage);
    } catch {
      return fallback;
    }
  }

  return fallback;
}
