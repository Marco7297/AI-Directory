export interface ReportedAppError {
  id: number;
  context: string;
  message: string;
}

let nextErrorId = 0;
const subscribers = new Set<(error: ReportedAppError) => void>();
const pendingErrors: ReportedAppError[] = [];

export const reportAppError = (context: string, error: unknown): void => {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
        ? error.message
        : String(error);
  const reportedError = {
    id: ++nextErrorId,
    context,
    message: message || 'An unknown error occurred.',
  };

  console.error(`[${context}]`, error);
  if (subscribers.size === 0) {
    pendingErrors.push(reportedError);
    return;
  }
  subscribers.forEach((subscriber) => subscriber(reportedError));
};

export const subscribeToAppErrors = (subscriber: (error: ReportedAppError) => void): (() => void) => {
  subscribers.add(subscriber);
  pendingErrors.splice(0).forEach(subscriber);
  return () => subscribers.delete(subscriber);
};
